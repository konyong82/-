import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import VisaIntroduction from "./components/VisaIntroduction";
import AIVisaMatcher from "./components/AIVisaMatcher";
import SuccessCasesSection from "./components/SuccessCasesSection";
import OfficeTour from "./components/OfficeTour";
import QnASection from "./components/QnASection";
import Footer from "./components/Footer";
import AICounselor from "./components/AICounselor";
import { MessageSquare, Bot, Phone, ShieldCheck, Star } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ ok: false, gemini: false });
  const [lang, setLang] = useState<"ko" | "en" | "ja" | "zh" | "vi">("ko");

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
            <div className="flex items-center gap-2 bg-blue-100/60 border border-blue-200/50 px-3 py-1 rounded-full text-blue-900 text-[11px] font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>{activeInfo.rate}</span>
            </div>
          </div>
        </div>

        {/* 3 Core Specialty Services */}
        <Services onSelectAction={handleSectionChange} lang={lang} setLang={setLang} />

        {/* Clean, Trustworthy Visa Introduction with Blog Linking */}
        <VisaIntroduction lang={lang} />

        {/* AI Visa Eligibility Matching / Score Predictor wizard */}
        <AIVisaMatcher lang={lang} />

        {/* Photo Gallery of Successful Cases */}
        <SuccessCasesSection lang={lang} />

        {/* Real Administrative Office View & Tour Section */}
        <OfficeTour lang={lang} />

        {/* Interactive Q&A Consultation Room */}
        <QnASection lang={lang} />

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

    </div>
  );
}
