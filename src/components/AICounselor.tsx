import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Shield, Calendar, Phone, Sparkles } from "lucide-react";
import { ChatMessage } from "../types";

interface AICounselorProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "ko" | "en" | "ja" | "zh" | "vi";
}

export default function AICounselor({ isOpen, onClose, lang = "ko" }: AICounselorProps) {
  const trans = {
    ko: {
      welcome: "안녕하세요! '비자친구' 대표행정사 대리 AI 상담원입니다. \n\n체류 비자 변경 자격 진단, 음주운전/불법체류로 인한 사범심사 구제 방법, 그리고 우수 강소기업 합법 취업 매칭에 관해 무엇이든 물어보세요! 친절히 답변해 드리겠습니다. 😊",
      errText: "죄송합니다. 서버가 혼잡하여 실시간 AI 상담 답변을 불러오지 못했습니다. 0507-1472-2428로 바로 연락 주시면 친절히 대표 행정사가 1:1 유선 상담을 도와드리겠습니다.",
      headerTitle: "비자친구 AI 스마트 카운셀러",
      headerLive: "실시간",
      headerDesc: "체류 자격 / 사범심사 / 우수기업 직업매칭 실시간 상담",
      closeBtn: "닫기",
      warning: "본 AI 상담은 행정 자문을 돕는 참고용입니다. 공식 접수는 행정사와 직접 최종 상의해야 안전합니다.",
      loadingText: "답변 분석 중...",
      quickLabel: "자주 묻는 질문:",
      placeholder: "상담하실 내용을 입력하세요... (예: 음주운전 범칙금, E-7 비자 고용 계약 등)",
      callTitle: "대표 유선 상담: 0507-1472-2428",
      workHours: "영업시간 평일 09:00 - 18:00 (사무소 방문 예약제 운영)",
      confirmReset: "상담 내역을 초기화하시겠습니까?",
      quick: [
        { text: "E-7-4 비자 전환 기준은?", label: "E-7-4 비자" },
        { text: "음주운전 벌금형 사범심사 상담", label: "사범심사 구제" },
        { text: "지역특화비자 F-2-R 설명해줘", label: "F-2-R 비자" },
        { text: "유학생 구직 일자리 매칭", label: "취업 소개" }
      ]
    },
    en: {
      welcome: "Hello! I am the AI Counselor representing 'VisaFriend'. \n\nFeel free to ask me anything about your visa qualification check, penalty relief for DUI/illegal stay, or matching with promising small-and-medium enterprises in Korea! 😊",
      errText: "We are sorry. The server is currently busy and unable to fetch AI responses. Please call 0507-1472-2428 directly for a 1:1 teleconsultation with our chief administrator.",
      headerTitle: "VisaFriend AI Smart Counselor",
      headerLive: "LIVE",
      headerDesc: "Real-time chat for Visa Status / Penalties / Job Placement",
      closeBtn: "Close",
      warning: "This AI consultation serves as administrative reference only. Official visa filing must be finalized with the certified administrator for legal safety.",
      loadingText: "Analyzing response...",
      quickLabel: "FAQ:",
      placeholder: "Type your query... (e.g. DUI fine, E-7 visa contract details)",
      callTitle: "Hotline: 0507-1472-2428",
      workHours: "Hours: Weekdays 09:00 - 18:00 (Pre-booking required for visits)",
      confirmReset: "Do you want to clear your chat history?",
      quick: [
        { text: "What are the E-7-4 visa conversion criteria?", label: "E-7-4 Visa" },
        { text: "Consultation on DUI fine penalty relief", label: "Penalty Relief" },
        { text: "Explain regional F-2-R visa", label: "F-2-R Visa" },
        { text: "Job placement for international students", label: "Job Matching" }
      ]
    },
    ja: {
      welcome: "こんにちは！「ビザフレンド」の代表行政書士代理AIカウンセラーです。\n\n滞在ビザ変更資格の自己診断、飲酒運転・不法滞在による事犯審査救済の方法、そして優秀な強小企業への合法就職マッチングについて、何でもお気軽にご質問ください！😊",
      errText: "申し訳ありません。サーバーが混雑しているため、AIの回答を読み込めませんでした。0507-1472-2428に直接お電話いただければ、代表行政書士が1対1で電話相談を承ります。",
      headerTitle: "ビザフレンド AIスマートカウンセラー",
      headerLive: "リアルタイム",
      headerDesc: "滞在資格 / 事犯審査 / 優秀企業就職マッチング リアルタイム相談",
      closeBtn: "閉じる",
      warning: "本AI相談は、行政アドバイスを支援するための参考用です。公式申請は、行政書士と直接最終相談することをお勧めします。",
      loadingText: "回答分析中...",
      quickLabel: "よくある質問:",
      placeholder: "相談内容を入力してください...（例：飲酒運転の罰金、E-7ビザの雇用契約など）",
      callTitle: "代表電話相談: 0507-1472-2428",
      workHours: "営業時間 平日 09:00 - 18:00（訪問予約制）",
      confirmReset: "相談内容をリセットしますか？",
      quick: [
        { text: "E-7-4ビザへの変更基準は？", label: "E-7-4ビザ" },
        { text: "飲酒運転罰금刑の事犯審査相談", label: "事犯審査救済" },
        { text: "地域特化ビザF-2-Rについて説明して", label: "F-2-Rビザ" },
        { text: "留学生の求職・仕事マッチング", label: "就職紹介" }
      ]
    },
    zh: {
      welcome: "您好！我是代表“VisaFriend”的AI咨询顾问。\n\n关于签证变更资格自我诊断、酒驾/非法滞留出入境处罚救济、优秀小巨人企业合法就业匹配等，有任何疑问请随时向我咨询！😊",
      errText: "十分抱歉。因目前网络繁忙未能加载AI应答。请拨打0507-1472-2428直接与代表行政士进行1:1电话咨询。",
      headerTitle: "VisaFriend AI 智能咨询助手",
      headerLive: "实时",
      headerDesc: "签证状态 / 违规审查救济 / 优秀企业求职匹配实时咨询",
      closeBtn: "关闭",
      warning: "本AI咨询仅作为行政法案参考。官方递交必须由执业行政士进行最终审核以保障法律安全。",
      loadingText: "正在分析回答...",
      quickLabel: "常用问题:",
      placeholder: "请输入您要咨询的内容... (例如: 酒驾罚款, E-7签证雇佣合同等)",
      callTitle: "代表热线咨询: 0507-1472-2428",
      workHours: "营业时间 工作日 09:00 - 18:00 (到店实行预约制)",
      confirmReset: "您确定要清除所有的咨询记录吗？",
      quick: [
        { text: "E-7-4 签证转换标准是什么？", label: "E-7-4 签证" },
        { text: "酒驾罚金出入境审查救济咨询", label: "违规审查救济" },
        { text: "介绍一下区域特化 F-2-R 签证", label: "F-2-R 签证" },
        { text: "留学生求职与工作岗位匹配", label: "岗位介绍" }
      ]
    },
    vi: {
      welcome: "Xin chào! Tôi là Trợ lý AI đại diện cho 'VisaFriend'. \n\nĐừng ngần ngại hỏi tôi bất kỳ điều gì về đánh giá tư cách đổi visa, phương án cứu trợ vi phạm XNC do lái xe khi say rượu/cư trú bất hợp pháp, hay giới thiệu việc làm hợp pháp tại các doanh nghiệp vừa và nhỏ xuất sắc tại Hàn Quốc! 😊",
      errText: "Xin lỗi. Máy chủ hiện đang bận và không thể tải câu trả lời AI. Hãy gọi trực tiếp đến 0507-1472-2428 để nhận tư vấn điện thoại 1:1 từ hành chính đại diện.",
      headerTitle: "Trợ lý AI Thông minh VisaFriend",
      headerLive: "Trực tuyến",
      headerDesc: "Tư vấn thời gian thực về tư cách lưu trú / Vi phạm XNC / Giới thiệu việc làm",
      closeBtn: "Đóng",
      warning: "Tư vấn AI này chỉ mang tính chất tham khảo hành chính. Để an toàn về mặt pháp lý, việc nộp hồ sơ chính thức phải được thống nhất với chuyên viên hành chính.",
      loadingText: "Đang phân tích phản hồi...",
      quickLabel: "Câu hỏi thường gặp:",
      placeholder: "Nhập nội dung tư vấn... (Ví dụ: Tiền phạt lái xe say rượu, hợp đồng lao động visa E-7)",
      callTitle: "Tư vấn điện thoại đại diện: 0507-1472-2428",
      workHours: "Giờ làm việc: Ngày thường 09:00 - 18:00 (Áp dụng chế độ đặt lịch hẹn trước)",
      confirmReset: "Bạn có muốn khôi phục lịch sử hội thoại?",
      quick: [
        { text: "Tiêu chuẩn chuyển đổi sang visa E-7-4 là gì?", label: "Visa E-7-4" },
        { text: "Tư vấn cứu trợ vi phạm XNC do phạt tiền lái xe say rượu", label: "Cứu trợ vi phạm XNC" },
        { text: "Giải thích về visa đặc thù khu vực F-2-R", label: "Visa F-2-R" },
        { text: "Khớp nối cơ hội việc làm cho du học sinh", label: "Giới thiệu việc làm" }
      ]
    }
  };

  const active = trans[lang] || trans.ko;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize messages once lang changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: active.welcome,
        timestamp: new Date().toLocaleTimeString(lang === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [lang]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(lang === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: chatHistory })
      });

      if (!res.ok) {
        throw new Error("서버 통신 오류");
      }

      const data = await res.json();
      
      const modelMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "model",
          text: active.errText,
          timestamp: new Date().toLocaleTimeString(lang === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = active.quick;

  const clearChat = () => {
    if (window.confirm(active.confirmReset)) {
      setMessages([
        {
          id: "welcome",
          role: "model",
          text: active.welcome,
          timestamp: new Date().toLocaleTimeString(lang === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot className="w-5 h-5 text-sky-300 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base">{active.headerTitle}</h3>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-semibold border border-sky-400/20">{active.headerLive}</span>
              </div>
              <p className="text-[11px] text-sky-200">{active.headerDesc}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              title="대화 초기화"
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="text-slate-300 hover:text-white font-medium text-sm px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              {active.closeBtn}
            </button>
          </div>
        </div>

        {/* Warning Indicator */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-6 py-2 flex items-center gap-2 text-[11px] text-amber-800 font-medium">
          <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{active.warning}</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isModel = msg.role === "model";
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${isModel ? "justify-start text-left" : "justify-end text-right"}`}
              >
                {isModel && (
                  <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-sky-400" />
                  </div>
                )}
                
                <div className={`max-w-[80%] space-y-1`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isModel 
                      ? "bg-white text-slate-800 shadow-sm border border-slate-100" 
                      : "bg-blue-900 text-white shadow-md shadow-blue-900/10 rounded-tr-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center shrink-0 animate-bounce">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
              <div className="bg-white text-slate-500 text-sm px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-700 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-blue-700 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2.5 h-2.5 bg-blue-700 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-400 ml-1">{active.loadingText}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 border-t border-slate-100 bg-white flex flex-wrap gap-2 items-center">
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3 text-sky-500" /> {active.quickLabel}
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.text)}
              className="text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-900 px-3 py-1.5 rounded-full border border-slate-200/80 transition-all duration-150 cursor-pointer font-medium"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={active.placeholder}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-900 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors shadow-md cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Professional Contact Direct Row */}
        <div className="bg-slate-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-0">
            <Phone className="w-3.5 h-3.5 text-blue-800" />
            <span className="font-semibold text-slate-700">{active.callTitle}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-700" />
            <span>{active.workHours}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
