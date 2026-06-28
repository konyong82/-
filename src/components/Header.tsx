import { Shield, Bot, HelpCircle, CheckSquare, Briefcase, FileText, Lock, Unlock } from "lucide-react";
import logoImg from "../assets/images/visa_friend_blue_mint_logo_1782662971714.jpg";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  openChat: () => void;
  lang: "ko" | "en" | "ja" | "zh" | "vi";
  setLang: (lang: "ko" | "en" | "ja" | "zh" | "vi") => void;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function Header({ 
  activeSection, 
  setActiveSection, 
  openChat, 
  lang, 
  setLang,
  isAdmin,
  onLoginClick,
  onLogoutClick
}: HeaderProps) {
  const trans = {
    ko: {
      brandName: "비자친구",
      brandSub: "이건행정사&직업소개소",
      services: "전문 서비스",
      visaIntro: "비자 소개",
      aiMatch: "AI 비자 매칭",
      cases: "성공 사례",
      officeTour: "사무실 전경",
      qna: "Q&A 상담실",
      aiConsult: "AI 1:1 상담실"
    },
    en: {
      brandName: "VisaFriend",
      brandSub: "Keon Admin & Job Agency",
      services: "Specialties",
      visaIntro: "Visa Guide",
      aiMatch: "AI Visa Match",
      cases: "Success Cases",
      officeTour: "Office Tour",
      qna: "Q&A Lounge",
      aiConsult: "AI Counseling"
    },
    ja: {
      brandName: "ビザフレンド",
      brandSub: "イ・ゴン行政書士＆職業紹介所",
      services: "専門サービス",
      visaIntro: "ビザ紹介",
      aiMatch: "AIビザマッチング",
      cases: "成功事例",
      officeTour: "オフィス全景",
      qna: "Q&A相談室",
      aiConsult: "AI 1:1相談室"
    },
    zh: {
      brandName: "VisaFriend",
      brandSub: "李健行政士&职业介绍所",
      services: "专业服务",
      visaIntro: "签证介绍",
      aiMatch: "AI签证匹配",
      cases: "成功案例",
      officeTour: "办公室实景",
      qna: "Q&A咨询室",
      aiConsult: "AI 1:1咨询室"
    },
    vi: {
      brandName: "VisaFriend",
      brandSub: "VP Hành chính & Giới thiệu việc làm Keon",
      services: "Dịch vụ chuyên môn",
      visaIntro: "Giới thiệu Visa",
      aiMatch: "Khớp Visa AI",
      cases: "Trường hợp thành công",
      officeTour: "Toàn cảnh văn phòng",
      qna: "Phòng tư vấn Q&A",
      aiConsult: "Tư vấn AI 1:1"
    }
  };

  const activeContent = trans[lang] || trans.ko;

  const navItems = [
    { id: "services", label: activeContent.services, icon: Shield },
    { id: "visa-intro", label: activeContent.visaIntro, icon: FileText },
    { id: "ai-match", label: activeContent.aiMatch, icon: Bot, highlight: true },
    { id: "cases", label: activeContent.cases, icon: CheckSquare },
    { id: "office-tour", label: activeContent.officeTour, icon: Briefcase },
    { id: "qna", label: activeContent.qna, icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveSection("hero")} 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          id="logo-container"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-200 bg-white border border-slate-100 shrink-0">
            <img 
              src={logoImg} 
              alt="비자친구 로고" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base lg:text-[13px] xl:text-lg font-bold tracking-tight text-slate-800 font-sans whitespace-nowrap">
                {activeContent.brandName}
              </span>
              <span className="text-blue-700 font-semibold text-[10px] xl:text-xs">
                {activeContent.brandSub}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-black tracking-widest text-[#0b7a75] font-mono bg-[#f0fdfa] px-1 py-0.5 rounded border border-[#ccfbf1] leading-none uppercase">
                visa79
              </span>
              <p className="text-[9px] lg:text-[7px] xl:text-[9px] text-slate-400 font-mono tracking-wider uppercase whitespace-nowrap">
                Visa Friend Admin & Job Agency
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  item.highlight
                    ? "bg-sky-50 text-sky-700 hover:bg-sky-100/80 border border-sky-200/50"
                    : isSelected
                    ? "text-blue-950 bg-slate-100 font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-3 h-3 xl:w-3.5 xl:h-3.5 ${isSelected ? "text-blue-700" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Call to Action and Language Switcher */}
        <div className="flex items-center gap-1.5 xl:gap-3 shrink-0">
          {/* Segmented Flag Selectors */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 xl:p-1 rounded-xl border border-slate-200" id="header-lang-switcher">
            {(["ko", "en", "ja", "zh", "vi"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`w-6.5 h-6.5 xl:w-7 xl:h-7 rounded-lg flex items-center justify-center text-xs xl:text-sm cursor-pointer transition-all ${
                  lang === l 
                    ? "bg-white text-slate-900 shadow-sm font-bold scale-105" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
                title={`${l.toUpperCase()} Version`}
              >
                {l === "ko" && "🇰🇷"}
                {l === "en" && "🇺🇸"}
                {l === "ja" && "🇯🇵"}
                {l === "zh" && "🇨🇳"}
                {l === "vi" && "🇻🇳"}
              </button>
            ))}
          </div>

          {/* Administrative Portal Action */}
          {isAdmin ? (
            <button
              onClick={onLogoutClick}
              id="btn-admin-logout"
              className="flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-[11px] xl:text-xs font-extrabold cursor-pointer transition-all whitespace-nowrap"
              title="대표 행정사 로그아웃"
            >
              <Unlock className="w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0 text-red-600" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              id="btn-admin-login"
              className="flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl text-[11px] xl:text-xs font-extrabold cursor-pointer transition-all whitespace-nowrap"
              title="대표 행정사 로그인"
            >
              <Lock className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-slate-400 shrink-0" />
              <span className="hidden sm:inline">행정사로그인</span>
            </button>
          )}

          <button
            onClick={openChat}
            id="btn-quick-ai"
            className="flex items-center gap-1 xl:gap-2 px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold bg-gradient-to-r from-blue-900 to-sky-700 hover:from-blue-950 hover:to-sky-800 text-white shadow-md shadow-blue-900/15 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Bot className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-sky-300 animate-pulse shrink-0" />
            <span className="hidden xl:inline">{activeContent.aiConsult}</span>
            <span className="inline xl:hidden">{lang === "ko" ? "상담" : "AI"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
