import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import VisaIntroduction from "./components/VisaIntroduction";
import AIVisaMatcher from "./components/AIVisaMatcher";
import SuccessCasesSection from "./components/SuccessCasesSection";
import OfficeTour from "./components/OfficeTour";
import QnASection from "./components/QnASection";
import Footer from "./components/Footer"
import AICounselor from "./components/AICounselor";
import { MessageSquare, Bot, Phone, ShieldCheck, Star, Lock, Unlock, Key, X } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ ok: false, gemini: false });
  const [lang, setLang] = useState<"ko" | "en" | "ja" | "zh" | "vi">("ko");

  // Admin states
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("visa_friend_admin_token") === "admin-session-token-visa-friend-2026";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("visa_friend_admin_token", data.token);
        setIsAdmin(true);
        setShowLoginModal(false);
        setLoginPassword("");
        // Reload page or quiet refresh to apply permissions securely
        window.location.reload();
      } else {
        setLoginError(data.error || "비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      setLoginError("서버와의 연결에 실패했습니다.");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("visa_friend_admin_token");
    setIsAdmin(false);
    // Reload page or quiet refresh to clear memory securely
    window.location.reload();
  };

  const infoTrans = {
    ko: {
      qual: "법무부 정식 등록 출입국 대행기관 & 직업소개 허가 공인 자격 보유",
      rate: "사범심사 구제율 높음",
      floatingHint: "비자친구 AI 상담 시작하기"
    },
    en: {
      qual: "Official Ministry of Justice Immigration Agency & Certified Job Placement Agency",
      rate: "High Success Rate in Immigration Relief",
      floatingHint: "Start VisaFriend AI Chat"
    },
    ja: {
      qual: "法務部正式登録出入국대행기관＆職業紹介許可公認資格保有",
      rate: "事犯審査の高い救済率",
      floatingHint: "비자フレンドAI相談을始める"
    },
    zh: {
      qual: "法务부정식등록출입국대행기관 & 职业介绍许可公认资质拥有者",
      rate: "出入境违规审查救济率高",
      floatingHint: "开始VisaFriend AI咨询"
    },
    vi: {
      qual: "Sở hữu tư cách cơ quan đại diện XNC đăng ký chính thức của Bộ Tư pháp & Cấp phép giới thiệu việc làm",
      rate: "Tỷ lệ giải quyết cứu trợ vi phạm XNC cao",
      floatingHint: "Bắt đầu tư vấn AI VisaFriend"
    }
  };

  const activeInfo = infoTrans[lang] || infoTrans.ko;

  // Scroll to section helper
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Test backend connection on startup
  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          setBackendStatus({ ok: true, gemini: data.geminiConfigured });
        }
      })
      .catch(e => {
        console.warn("Express server not yet running or slow, operating in unified sandbox client mode", e);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative" id="visa-friend-app-root">
      
      {/* Header Navigation */}
      <Header 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange} 
        openChat={() => setIsChatOpen(true)}
        lang={lang}
        setLang={setLang}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleAdminLogout}
      />

      {/* Main Content Sections (Landing page layout) */}
      <main className="flex-1">
        
        {/* Hero Banner Section with Spline */}
        <Hero 
          setActiveSection={handleSectionChange} 
          openChat={() => setIsChatOpen(true)} 
          lang={lang}
          setLang={setLang}
        />

        {/* Floating Quick Action Indicator */}
        <div className="bg-sky-50 py-3.5 border-b border-sky-100/60 text-sky-950 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-900 shrink-0" />
              <span>{activeInfo.qual}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <div className="flex items-center gap-1.5 bg-blue-900 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider animate-pulse shadow-sm">
                  <Lock className="w-3 h-3" />
                  <span>대표행정사 관리 모드 활성화</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-blue-100/60 border border-blue-200/50 px-3 py-1 rounded-full text-blue-900 text-[11px] font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>{activeInfo.rate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery of Successful Cases - 2nd Section */}
        <SuccessCasesSection lang={lang} isAdmin={isAdmin} />

        {/* Interactive Q&A Consultation Room - 3rd Section */}
        <QnASection lang={lang} isAdmin={isAdmin} />

        {/* 3 Core Specialty Services */}
        <Services onSelectAction={handleSectionChange} lang={lang} setLang={setLang} />

        {/* Clean, Trustworthy Visa Introduction with Blog Linking */}
        <VisaIntroduction lang={lang} />

        {/* AI Visa Eligibility Matching / Score Predictor wizard */}
        <AIVisaMatcher lang={lang} />

        {/* Real Administrative Office View & Tour Section */}
        <OfficeTour lang={lang} isAdmin={isAdmin} />

      </main>

      {/* Footer Details */}
      <Footer lang={lang} />

      {/* Floating Messenger Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Phone Quick Call */}
        <a
          href="tel:0507-1472-2428"
          id="floating-phone-btn"
          className="w-12 h-12 rounded-full bg-blue-950 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform duration-200 cursor-pointer"
          title="유선 전화 직접 상담"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* AI Counselor trigger */}
        <button
          onClick={() => setIsChatOpen(true)}
          id="floating-ai-btn"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-900 to-sky-600 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer relative group"
          title="AI 1:1 상담원 연결"
        >
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
            {activeInfo.floatingHint}
          </span>
          {/* Notification bubble */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          </span>
        </button>
      </div>

      {/* AI Counselor Popup Chat Overlay */}
      <AICounselor isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} lang={lang} />

      {/* --- ADMINISTRATIVE LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-200 text-left relative overflow-hidden">
            {/* Design accents */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-950 via-blue-800 to-sky-600"></div>
            
            <button
              onClick={() => {
                setShowLoginModal(false);
                setLoginPassword("");
                setLoginError("");
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shadow-inner">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">대표 행정사 인증</h3>
                  <p className="text-xs text-slate-500">이건행정사&직업소개소 관리 권한 검증</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-600 leading-relaxed">
                행정사님만 로그인할 수 있는 공간입니다. 로그인 성공 시 <strong className="text-blue-900">성공 사례 업로드</strong>, <strong className="text-blue-900">상담실 비공개 글 즉시 열람 및 답변 등록</strong>, <strong className="text-blue-900">사무실 실제 사진 교체</strong> 권한이 활성화됩니다.
                <div className="mt-2 text-[11px] font-semibold text-slate-500">
                  💡 임시 비밀번호: <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-900 font-bold">visa1234</code>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">행정사 마스터 비밀번호</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="비밀번호를 입력해 주세요."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-100">
                    ⚠️ {loginError}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setLoginPassword("");
                      setLoginError("");
                    }}
                    className="flex-1 py-3 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    인증 및 로그인
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
