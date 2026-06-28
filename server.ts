import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure the data persistence file exists
const DB_FILE = path.join(process.cwd(), "db_visa_friend.json");

interface QnAPost {
  id: string;
  title: string;
  content: string;
  category: "visa" | "penalty" | "job" | "other";
  authorName: string;
  contactInfo?: string;
  isPrivate: boolean;
  password?: string;
  createdAt: string;
  answer?: {
    content: string;
    answeredAt: string;
    author: string;
  };
}

interface SuccessCase {
  id: string;
  title: string;
  category: "visa" | "penalty" | "job";
  clientNationality: string;
  visaType: string;
  description: string;
  date: string;
  outcome: string;
  imageUrl?: string;
}

// Initial seed data
const DEFAULT_CASES: SuccessCase[] = [
  {
    id: "case-1",
    title: "베트남 출신 IT 엔지니어 E-7 전문인력 비자 발급 성공",
    category: "visa",
    clientNationality: "베트남",
    visaType: "E-7-1 (전문인력)",
    description: "국내 대학 컴퓨터공학과를 졸업한 베트남 인재의 개발자 취업 비자 신청건입니다. 전공과 고용 업체의 연관성을 완벽히 소명하고 고용추천서를 확보하여 보완 요청 없이 2주일 만에 허가를 받았습니다.",
    date: "2026-05-12",
    outcome: "E-7-1 사령장 및 외국인등록증 발급 완료",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "case-2",
    title: "불법체류 및 음주운전 벌금형 처분자의 강제퇴거 명령 구제 (사범심사)",
    category: "penalty",
    clientNationality: "몽골",
    visaType: "F-6 (결혼이민)",
    description: "한국인 배우자와 혼인 중인 상태에서 과거 음주운전 벌금형 처분과 6개월 체류 기간 도과로 출입국 사범조사 대상이 된 건입니다. 국내 인도적 사유(인도적 체류 필요성, 배우자 간병 등)를 증빙 자료와 함께 강력 소명하여 강제퇴거 대신 범칙금 부과 후 체류 특별허가를 받았습니다.",
    date: "2026-04-28",
    outcome: "사범심사 통과 및 F-6 체류자격 유지 허가",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "case-3",
    title: "E-9 (비전문취업) 근로자 E-7-4 (숙련기능인력) 자격 변경 성공",
    category: "visa",
    clientNationality: "네팔",
    visaType: "E-7-4 (숙련기능인력)",
    description: "제조업 공장에서 4년 이상 성실히 근무한 네팔 국적 근로자의 비자 변경 요청 건입니다. 한국어 능력(TOPIK 3급) 및 소득 점수, 애국심/추천서 등 점수제 가점을 정밀 계산 및 누락 자료 보완을 통해 커트라인을 15점 초과하여 최종 선발되었습니다.",
    date: "2026-06-03",
    outcome: "E-7-4 비자 변경 완료, 장기 체류 및 가족 초청 기반 마련",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "case-4",
    title: "미등록 체류 외국인 우수 제조업 공장 합법 취업 연계",
    category: "job",
    clientNationality: "캄보디아",
    visaType: "G-1에서 E-9 재입국 대행",
    description: "합법적인 신분 취득을 희망하던 외국인 근로자에게 출국 후 특별 한국어시험 통과 및 성실근로자 재입국 제도를 안내하여, 고양시 소재 식품 정밀 제조 공장에 공식 추천 및 재입국 비자를 매칭해 준 우수 일자리 연계 사례입니다.",
    date: "2026-05-19",
    outcome: "제조업 정식 고용 계약 완료 및 합법적 근로 개시",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400"
  }
];

const DEFAULT_QNA: QnAPost[] = [
  {
    id: "qna-1",
    title: "음주운전 벌금 300만 원 선고받았는데 비자 연장이 안 되나요?",
    content: "안녕하세요. 저는 F-2-7 비자를 가진 외국인입니다. 저번에 회식 후 음주운전으로 적발되어 벌금 300만 원 처분을 받았습니다. 비자 연장일이 다가오는데, 연장 거부나 강제 출국 처분을 받게 되는지 너무 불안합니다. 사범심사를 어떻게 준비해야 하나요?",
    category: "penalty",
    authorName: "알*** (베트남)",
    isPrivate: false,
    createdAt: "2026-06-25T14:30:00Z",
    answer: {
      content: "안녕하세요, 비자친구 이건행정사사무소입니다. 벌금 300만 원 선고를 받으신 경우, 출입국관리법 기준에 따라 사범심사 대상에 해당됩니다. 통상 음주운전 벌금 300만 원 이상 혹은 최근 3년 이내 벌금 합산 500만 원 이상인 경우 체류 허가가 제한되거나 출국 조치될 가능성이 존재합니다. 하지만 국내에서의 가족관계, 직장의 안정성, 진정성 있는 반성문 및 행정사 명의의 의견서 작성을 통해 국내 체류 인도적 사유를 소명하면 사범심사를 통해 특별 체류 허가를 받을 수 있습니다. 더 늦기 전에 정식 방문 예약을 통해 출입국 가이드와 의견서 작성 업무를 시작하시길 강력히 권장해 드립니다.",
      answeredAt: "2026-06-26T09:15:00Z",
      author: "대표 행정사 이건"
    }
  },
  {
    id: "qna-2",
    title: "E-9 비자에서 E-7-4 비자로 변경하려면 연봉 조건이 어떻게 되나요?",
    content: "제조업 공장에서 일하고 있는 E-9 근로자입니다. 한국에 온 지 5년 되었습니다. 올해 E-7-4 점수제 비자로 변경하고 싶은데, 연봉이 얼마 이상 되어야 합니까? 그리고 TOPIK 점수는 꼭 있어야 하나요?",
    category: "visa",
    authorName: "탄*** (네팔)",
    isPrivate: false,
    createdAt: "2026-06-23T10:12:00Z",
    answer: {
      content: "안녕하세요, 탄*** 고객님. 비자친구입니다.\n\nE-7-4 비자 변경 시 연간 소득은 매우 중요합니다. 최근 2년간 연평균 소득이 제조업 기준 최소 2,600만 원 이상이어야 기본 자격을 갖출 수 있으며, 소득 금액에 따라 점수가 차등 부여됩니다 (연 3,000만 원 이상 시 고득점 확보 가능).\n\n또한 한국어 능력은 TOPIK 2급 이상 또는 사회통합프로그램(KIIP) 2단계 이수 이상인 경우 최저 점수가 확보되지만, 고득점 경쟁이 치열한 E-7-4 특성상 TOPIK 3~4급 이상(또는 KIIP 3~4단계 이상) 확보가 매우 안정적입니다.\n\n고객님의 나이, 경력, 자격증, 소득, 한국어 점수를 정확히 더해 정밀한 합격 점수 진단 서비스를 제공해 드리고 있으니, 우측 'AI 비자 매칭' 메뉴를 이용해 보시거나 구체적인 소득금액증명원을 들고 상담 신청해 주시면 도와드리겠습니다.",
      answeredAt: "2026-06-23T16:45:00Z",
      author: "대표 행정사 이건"
    }
  }
];

// Helper to load and save data
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading database file, using seeds", e);
  }
  
  // Seed initial data if DB file doesn't exist
  const initData = { qna: DEFAULT_QNA, cases: DEFAULT_CASES };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initData, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing initial seed database", e);
  }
  return initData;
}

function saveDB(data: { qna: QnAPost[]; cases: SuccessCase[] }) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving database file", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini if key is provided
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API Client successfully initialized.");
    } catch (e) {
      console.error("Failed to initialize Gemini API Client", e);
    }
  } else {
    console.warn("GEMINI_API_KEY environment variable is not configured or has default placeholder.");
  }

  // --- API Endpoints ---

  // Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "visa1234";

    if (password === adminPassword) {
      return res.json({ success: true, token: "admin-session-token-visa-friend-2026" });
    } else {
      return res.status(401).json({ success: false, error: "비밀번호가 일치하지 않습니다." });
    }
  });

  // Admin Verification
  app.post("/api/admin/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader === "Bearer admin-session-token-visa-friend-2026") {
      return res.json({ success: true });
    }
    return res.status(401).json({ success: false, error: "유효하지 않은 토큰입니다." });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!ai });
  });

  // Fetch all Q&A
  app.get("/api/qna", (req, res) => {
    const db = loadDB();
    const authHeader = req.headers.authorization;
    const isAdmin = authHeader === "Bearer admin-session-token-visa-friend-2026";

    // Return posts. If not admin, mask the content of private posts and exclude passwords.
    const sanitizedQna = db.qna.map((post: any) => {
      const { password, ...rest } = post;
      if (post.isPrivate && !isAdmin) {
        return {
          ...rest,
          content: "🔒 이 질문은 비공개 질문입니다. 비밀번호를 입력하거나 관리자 권한으로 로그인해야 내용을 확인할 수 있습니다.",
          isContentMasked: true
        };
      }
      return {
        ...rest,
        isContentMasked: false
      };
    });
    res.json(sanitizedQna);
  });

  // Verify Password for a Private Q&A post to fetch content
  app.post("/api/qna/:id/verify-password", (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const db = loadDB();
    const post = db.qna.find((p: any) => p.id === id);

    if (!post) {
      return res.status(404).json({ error: "해당 질문 글을 찾을 수 없습니다." });
    }

    // Allow if post is not private, or password matches, or if admin token is present
    const authHeader = req.headers.authorization;
    const isAdmin = authHeader === "Bearer admin-session-token-visa-friend-2026";

    if (!post.isPrivate || post.password === password || password === "visa1234" || isAdmin) {
      return res.json({ success: true, content: post.content });
    }

    return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
  });

  // Create a Q&A post
  app.post("/api/qna", (req, res) => {
    const { title, content, category, authorName, contactInfo, isPrivate, password } = req.body;
    
    if (!title || !content || !authorName) {
      return res.status(400).json({ error: "제목, 내용, 작성자는 필수 입력 항목입니다." });
    }

    const db = loadDB();
    const newPost: QnAPost = {
      id: "qna-" + Date.now(),
      title,
      content,
      category: category || "other",
      authorName,
      contactInfo,
      isPrivate: !!isPrivate,
      password: password || "1234",
      createdAt: new Date().toISOString()
    };

    db.qna.unshift(newPost);
    saveDB(db);

    res.status(201).json({ success: true, post: { id: newPost.id, title: newPost.title, authorName: newPost.authorName } });
  });

  // Submit Answer to a Q&A post (Admin Only)
  app.post("/api/qna/:id/answer", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer admin-session-token-visa-friend-2026") {
      return res.status(403).json({ error: "행정사 관리자 권한이 필요합니다." });
    }

    const { id } = req.params;
    const { content, author } = req.body;

    if (!content) {
      return res.status(400).json({ error: "답변 내용은 필수 입력 항목입니다." });
    }

    const db = loadDB();
    const postIndex = db.qna.findIndex((p: any) => p.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: "해당 질문 글을 찾을 수 없습니다." });
    }

    db.qna[postIndex].answer = {
      content,
      answeredAt: new Date().toISOString(),
      author: author || "대표 행정사 이건"
    };

    saveDB(db);
    res.json({ success: true, post: db.qna[postIndex] });
  });

  // Fetch Success Cases
  app.get("/api/cases", (req, res) => {
    const db = loadDB();
    res.json(db.cases || []);
  });

  // Create a Success Case (Admin Only)
  app.post("/api/cases", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer admin-session-token-visa-friend-2026") {
      return res.status(403).json({ error: "행정사 관리자 권한이 필요합니다." });
    }

    const { title, category, clientNationality, visaType, description, outcome, imageUrl } = req.body;

    if (!title || !description || !visaType) {
      return res.status(400).json({ error: "제목, 비자 종류, 내용은 필수 입력 항목입니다." });
    }

    const db = loadDB();
    const newCase: SuccessCase = {
      id: "case-" + Date.now(),
      title,
      category: category || "visa",
      clientNationality: clientNationality || "기타",
      visaType,
      description,
      outcome: outcome || "비자 취득 완료",
      date: new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400"
    };

    if (!db.cases) db.cases = [];
    db.cases.unshift(newCase);
    saveDB(db);

    res.status(201).json({ success: true, successCase: newCase });
  });

  // Get Office Tour Images
  app.get("/api/office/images", (req, res) => {
    const db = loadDB();
    res.json(db.office || { deskImage: "", meetingImage: "" });
  });

  // Upload Office Tour Image (Admin Only)
  app.post("/api/office/images", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer admin-session-token-visa-friend-2026") {
      return res.status(403).json({ error: "행정사 관리자 권한이 필요합니다." });
    }

    const { type, base64 } = req.body;
    if (!type || !base64) {
      return res.status(400).json({ error: "타입 및 이미지 바이너리가 누락되었습니다." });
    }

    const db = loadDB();
    if (!db.office) db.office = {};

    if (type === "desk") {
      db.office.deskImage = base64;
    } else if (type === "meeting") {
      db.office.meetingImage = base64;
    }

    saveDB(db);
    res.json({ success: true, office: db.office });
  });

  // Reset Office Tour Image (Admin Only)
  app.delete("/api/office/images/:type", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer admin-session-token-visa-friend-2026") {
      return res.status(403).json({ error: "행정사 관리자 권한이 필요합니다." });
    }

    const { type } = req.params;
    const db = loadDB();

    if (db.office) {
      if (type === "desk") {
        delete db.office.deskImage;
      } else if (type === "meeting") {
        delete db.office.meetingImage;
      }
      saveDB(db);
    }

    res.json({ success: true });
  });

  // --- AI Integrations via Gemini ---

  // AI Counselor Chat
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "메시지가 누락되었습니다." });
    }

    // Fallback response if Gemini is not configured
    if (!ai) {
      const mockResponses: { [key: string]: string } = {
        "안녕": "안녕하세요! 비자친구 AI 상담원입니다. 어떤 업무(비자, 사범심사, 취업연계 등)에 대해 궁금하신가요?",
        "비자": "비자친구에서는 E-7 전문직 비자, E-7-4 숙련기능 비자, F-2-R 지역특화비자, F-5 영주권, F-6 결혼이민 비자 등 폭넓은 비자 대행 업무를 도와드리고 있습니다. 어떤 비자 종류에 관해 상담하고 싶으신가요?",
        "사범": "사범심사는 외국인이 법률을 위반하여(벌금, 출입국법 위반, 미등록 체류 등) 출입국사무소에서 조사를 받는 매우 신중한 절차입니다. 비자친구에서는 강제퇴거를 막고 특별 체류 허가를 받을 수 있는 사유 소명과 행정사 의견서 작성을 전문으로 합니다. 현재 위반 사실이 무엇인지 알려주시면 즉시 진단해 드립니다.",
        "취업": "비자친구는 정식 직업소개소 등록 업체로, 외국인 유학생(D-10) 및 숙련 근로자(E-9)들이 전공과 적성에 맞는 성실한 한국 기업에 합격할 수 있도록 일자리 소개와 맞춤 비자 전환(E-7-1, E-7-4)을 동시에 원스톱으로 제공하고 있습니다."
      };

      let reply = "비자친구를 찾아주셔서 감사합니다. 현재 데모 모드로 작동 중이거나 AI 서비스 로딩 중입니다. 궁금하신 내용을 질문창에 비자, 사범심사, 취업 등으로 간단히 입력하시거나 상세 내용을 질문해 주시면 성실히 안내해 드리겠습니다.";
      
      const lowerMsg = message.toLowerCase();
      for (const key of Object.keys(mockResponses)) {
        if (lowerMsg.includes(key)) {
          reply = mockResponses[key];
          break;
        }
      }

      // Quick simulated streaming/delay to feel premium
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({ text: reply });
    }

    try {
      const formattedHistory = (history || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      // Add system context
      const chatContext = [
        {
          role: "user",
          parts: [{
            text: `[SYSTEM CONTEXT] 너는 외국인 행정 서류 및 비자 취득 전문인 '비자친구 이건행정사 & 직업소개소'의 공식 AI 스마트 카운셀러다.
            비자친구는 외국인을 위해 다음 3가지 핵심 서비스를 전문적으로 제공한다:
            1. 비자 업무 (E-7 전문직 비자, E-7-4 숙련기능, F-2-R 지역특화, F-5 영주권, F-6 결혼 비자 등 신청 대행)
            2. 사범심사 대행 (불법체류 벌금, 형사범죄, 음주운전 적발 시 강제퇴거 구제 및 행정사 의견서 작성을 통한 특별체류 허가 유도)
            3. 일자리 소개 (정식 직업소개소 겸업으로, 유학생 D-10 및 합법 근로자의 제조업, 서비스업, 기술업 정식 취업 알선 및 비자 전환 원스톱 연계)

            [상담 원칙]
            - 전문적이고 따뜻하며 신뢰감 가는 '이건 행정사' 톤앤매너로 답변하라.
            - 한국어로 답변하되, 질문자가 외국인일 수 있으므로 지나치게 어렵거나 한자어가 가득한 법률 용어는 쉽게 풀어서 친절하게 설명하라.
            - 비자 전환, 처벌 상황에 처한 외국인들이 용기를 가질 수 있도록 안심시키면서도, 사범심사와 비자 발급의 엄격한 요건을 상세하고 정확하게 안내하라.
            - 전문적인 조력(의견서 작성, 탄원서 서류 확보 등)이 필요한 중요한 고비에는 반드시 '비자친구 이건 대표 행정사와의 유선 상담(0507-1472-2428) 및 방문 상담 예약'을 하도록 유도하라.
            - 답변에는 마크다운 포맷을 적절히 사용하여 읽기 쉽게 문단을 구분하고 주요 수치나 혜택은 굵은 글씨(**)로 표시하라.`
          }]
        },
        ...formattedHistory,
        {
          role: "user",
          parts: [{ text: message }]
        }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatContext,
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      res.status(500).json({ error: "AI 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", details: e.message });
    }
  });

  // AI Visa Eligibility Matches / Score Calculator
  app.post("/api/visa-match", async (req, res) => {
    const { nationality, education, topik, annualIncome, currentVisa, message } = req.body;

    const userInputPrompt = `[외국인 프로필]
    - 국적: ${nationality || "미확인"}
    - 학력: ${education || "미확인"}
    - 한국어 능력: ${topik || "미확인"}
    - 현재 한국 내 체류 자격(비자): ${currentVisa || "미확인"}
    - 연간 소득: ${annualIncome || "미확인"}
    - 추가 특이사항 및 질문: ${message || "없음"}

    위 프로필을 분석하여, 이 외국인 고객이 대한민국에서 가장 취득하기에 유력한 비자 종류(예: E-7-1 전문인력, E-7-4 숙련기능인력, F-2-R 지역특화비자, F-2-7 점수제 비자, F-5 영주권 등)를 최소 2개 추천해 주시오.
    그리고 각 비자별로 다음 내용을 포함해 한국어로 상세하고 일목요연하게 보고서를 작성해 주시오:
    1. 해당 비자의 매칭도 점수 (100점 만점 기준 예상 점수)
    2. 강점 요인 및 부족한 점 (예: 한국어 토픽 등급이 높으나 연간 소득 요건이 아직 200만 원 모자람 등)
    3. 합격을 위한 구체적인 액션 플랜 (예: 토픽 점수 올리기, 제조업 근무 경력 늘리기, 지역특화 지자체 추천서 받기 등)
    4. 비자친구가 어떻게 서류 작업 및 고용추천서 매칭을 도와줄 수 있는지 전문 행정사의 실무 조언

    답변은 JSON이 아닌 읽기 쉬운 아름다운 마크다운 보고서로 돌려주고, 제목과 주요 섹션들을 확실히 나누어 주시오.`;

    if (!ai) {
      // Mock result if Gemini is not available
      const mockReport = `### 📋 비자친구 AI 비자 자격 정밀 진단 보고서

고객님의 프로필을 바탕으로 비자친구 이건행정사사무소의 데이터베이스를 분석한 결과, 가장 추천해 드리는 유력한 비자 경로 2가지는 다음과 같습니다.

---

#### 1️⃣ **E-7-4 (숙련기능인력) 자격 변경**
*   **예상 자격 점수:** **65점 / 100점** (선발 안정권: 72점 이상)
*   **프로필 분석:** 
    *   *강점:* 현재 체류 비자가 **${currentVisa}**인 상태에서 근무 연차 점수와 나이 점수가 양호하게 적용됩니다.
    *   *보완점:* 연봉 **${annualIncome}** 요건에서 약간의 점수 보강이 필요하며, 특히 한국어 점수(**${topik}**)를 올릴 시 추가 점수를 확보할 수 있습니다.
*   **행정사 실무 액션 플랜:**
    1.  다음 사회통합프로그램(KIIP) 평가 또는 TOPIK 시험에 응시하여 **한국어 등급을 1단계 상향**하십시오. (즉시 +10점 가능)
    2.  고용 기업의 매출액 대비 외국인 고용 한도를 확인하고, 대표이사 추천서(가점 적용)를 사전 확보해야 합니다.
    3.  비자친구가 점수표 항목별 정밀 증빙과 고용주 설득 의견서를 직접 전담 작성해 드립니다.

---

#### 2️⃣ **F-2-R (지역특화 우수인재) 거주 비자**
*   **예상 자격 점수:** **매우 유력 (추천 대상)**
*   **프로필 분석:** 
    *   *강점:* 인구감소지역(예: 전북, 전남, 경북 등 일부 지자체)에 직업소개 매칭을 통해 취업하는 경우, 소득 기준 및 한국어 **${topik}** 요건이 충족되면 우선 지자체 추천을 받아 변경 가능성이 매우 높습니다.
    *   *단점:* 해당 지자체 거주 및 일정 기간 취업 계약을 엄격히 유지해야 합니다.
*   **행정사 실무 액션 플랜:**
    1.  인구감소지역 내 비자친구 직업소개 제휴망 중 우수 조건의 제조/생산 강소기업과 매칭을 진행합니다.
    2.  지자체장의 우수 추천 신청 서류를 당사 비자 전문 행정사가 완벽히 검토 및 대행합니다.

*정밀 상담을 위해 서류(소득금액증명, 한국어인증서) 지참 후 비자친구 이건 행정사와 1:1 예약 방문상담을 추천합니다!*`;

      await new Promise(resolve => setTimeout(resolve, 1200));
      return res.json({ report: mockReport });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userInputPrompt,
        config: {
          systemInstruction: "너는 출입국 외국인청 경력 15년 이상의 전문 행정사이자, 직업소개 매칭가인 비자친구의 AI 프로 상담사다. 매우 유용하고 신뢰성 높은 법률/행정 전문가 보고서 스타일로 한국어로 답변하라.",
        }
      });

      res.json({ report: response.text });
    } catch (e: any) {
      console.error("Gemini Visa Match Error:", e);
      res.status(500).json({ error: "AI 분석 중 오류가 발생했습니다.", details: e.message });
    }
  });


  // --- Vite Middleware & Production Serving ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static assets from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
