import { motion } from "motion/react";
import { Shield, Sparkles, CheckCircle2, ArrowRight, Bot, MessageSquare } from "lucide-react";
import Globe from "./Globe";

interface HeroProps {
  setActiveSection: (section: string) => void;
  openChat: () => void;
  lang: "ko" | "en" | "ja" | "zh" | "vi";
  setLang: (lang: "ko" | "en" | "ja" | "zh" | "vi") => void;
}

export default function Hero({ setActiveSection, openChat, lang, setLang }: HeroProps) {
  const trans = {
    ko: {
      badge: "대한민국 대표 외국인 행정·일자리 전문 기관",
      titlePre: "외국인 비자부터 취업까지,",
      titlePost: "가 든든하게 해결합니다",
      brandName: "비자친구",
      desc: "초청 및 체류관련 비자 자격 검토, 까다로운 출입국 사범심사, 최적의 우수 강소기업 취업 연계까지! 합법적이고 안전한 국내 체류의 모든 솔루션을 원스톱으로 제공합니다.",
      cred1: "법무부 출입국민원 대행기관",
      cred2: "정식 등록 직업소개소",
      cred3: "AI 기반 실시간 비자 자격 예측",
      cred4: "사범심사 구제 특별 성공 노하우",
      ctaMatch: "AI 비자 즉시 매칭하기",
      ctaChat: "실시간 1:1 인공지능 상담",
      simTitle: "AI 비자 시뮬레이터 실시간 가동 중",
      simDesc: "자격 점수, 지자체 추천 조건 등 자동 매칭",
      phoneLabel: "대표 유선 상담: 0507-1472-2428",
      chooseLang: "원하시는 언어로 전체 웹사이트 번역하기:"
    },
    en: {
      badge: "Korea's Leading Immigration & Employment Agency",
      titlePre: "From Visa to Employment,",
      titlePost: "safely solves all your worries",
      brandName: "VisaFriend",
      desc: "From stay visa eligibility reviews and complex immigration penalty audits to connecting you with premium small & medium enterprises! We provide a professional one-stop solution for a legal and safe stay in Korea.",
      cred1: "Official Justice Ministry Agency",
      cred2: "Registered Job Placement Agency",
      cred3: "AI-based Live Visa Predictor",
      cred4: "Immigration Penalty Relief Expertise",
      ctaMatch: "Start AI Visa Match",
      ctaChat: "Live 1:1 AI Counseling",
      simTitle: "AI Visa Simulator Running Live",
      simDesc: "Auto matching eligibility points & recommendation conditions",
      phoneLabel: "Call Hotline: 0507-1472-2428",
      chooseLang: "Translate the entire website into your language:"
    },
    ja: {
      badge: "大韓民国を代表する外国人行政・就職専門機関",
      titlePre: "外国人のビザから就職まで、",
      titlePost: "が心強く解決します",
      brandName: "ビザフレンド",
      desc: "招へいおよび滞在関連のビザ審査、厳しい出入国事犯審査、最適な優良企業への就職支援まで！合法的で安全な韓国内滞在のすべてのソリューションをワンストップで提供します。",
      cred1: "法務部出入国民間代行機関",
      cred2: "正式登録職業紹介所",
      cred3: "AIベースのリアルタイムビザ診断",
      cred4: "事犯審査救済の特別成功ノ하우",
      ctaMatch: "AIビザ即時マッチング",
      ctaChat: "リアルタイム1:1AI相談",
      simTitle: "AIビザシミュレーターリアルタイム稼働中",
      simDesc: "資格点数、自治体推薦条件などの自動マッチング",
      phoneLabel: "代表電話相談: 0507-1472-2428",
      chooseLang: "ご希望の言語にウェブサイト全体を翻訳:"
    },
    zh: {
      badge: "大韩民国代表性外国人行政及就业专业机构",
      titlePre: "从外国人签证到就业，",
      titlePost: "为您保驾护航",
      brandName: "VisaFriend",
      desc: "从邀请及在留签证评估、严苛的出入境违规申诉，到严选优质中小企业就业对接！我们提供在韩合法、安全滞留的一站式解决方案。",
      cred1: "法务部出入境代办机构",
      cred2: "正式注册职业介绍所",
      cred3: "基于AI的实时签证预测",
      cred4: "违规审查救济专属成功经验",
      ctaMatch: "立即进行AI签证匹配",
      ctaChat: "实时1:1人工智能咨询",
      simTitle: "AI签证模拟器实时运行中",
      simDesc: "自动计算评分、地方政府推荐信等条件",
      phoneLabel: "代表热线咨询: 0507-1472-2428",
      chooseLang: "将整个网站翻译成您所选的语言:"
    },
    vi: {
      badge: "Cơ quan chuyên môn về hành chính và việc làm cho người nước ngoài hàng đầu Hàn Quốc",
      titlePre: "Từ Visa đến việc làm cho người nước ngoài,",
      titlePost: "giải quyết mọi lo lắng cho bạn",
      brandName: "VisaFriend",
      desc: "Từ thẩm định tư cách visa bảo lãnh & cư trú, đại diện thẩm định vi phạm xuất nhập cảnh phức tạp đến liên kết việc làm tại các doanh nghiệp vừa và nhỏ xuất sắc! Chúng tôi cung cấp mọi giải pháp cư trú hợp pháp và an toàn tại Hàn Quốc một cách trọn gói.",
      cred1: "Cơ quan đại diện XNC của Bộ Tư pháp",
      cred2: "Văn phòng giới thiệu việc làm chính thức",
      cred3: "Dự đoán tư cách visa thời gian thực bằng AI",
      cred4: "Bí quyết giải quyết vi phạm XNC đặc biệt",
      ctaMatch: "Khớp Visa AI ngay",
      ctaChat: "Tư vấn AI thời gian thực 1:1",
      simTitle: "Trình mô phỏng Visa AI đang chạy thời gian thực",
      simDesc: "Tự động khớp điểm tư cách và điều kiện đề cử",
      phoneLabel: "Tư vấn điện thoại đại diện: 0507-1472-2428",
      chooseLang: "Dịch toàn bộ trang web sang ngôn ngữ của bạn:"
    }
  };

  const activeContent = trans[lang] || trans.ko;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-16 lg:py-24 text-white">
      {/* Visual background image with restrained opacity suitable for a professional law/administrative office */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.12] pointer-events-none mix-blend-luminosity transition-opacity duration-1000"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80')" 
        }} 
      />

      {/* Visual background accents with restrained patterns */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        {/* Soft glowing ambient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-sky-500/20 blur-3xl"></div>
        
        {/* Fine professional dot grid */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        
        {/* Elegant structural thin lines reflecting order, trust, and legal precision */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="legal-grid" width="160" height="160" patternUnits="userSpaceOnUse">
              <path d="M 160 0 L 0 0 0 160" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#legal-grid)" />
          
          {/* Abstract elegant thin diagonal line symbolizing path & solution */}
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.75" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              {activeContent.badge}
            </div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight cursor-default"
              animate={{ 
                scale: [1, 1.01, 1],
                opacity: [1, 0.6, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            >
              {activeContent.titlePre} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                {activeContent.brandName}
              </span>
              {activeContent.titlePost}
            </motion.h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              {activeContent.desc}
            </p>

            {/* Premium Language Selection Row (Glassmorphic) requested by the user */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl max-w-xl space-y-2.5 backdrop-blur-md" id="hero-interactive-language-bar">
              <p className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {activeContent.chooseLang}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: "ko", name: "한국어", flag: "🇰🇷" },
                  { code: "en", name: "English", flag: "🇺🇸" },
                  { code: "ja", name: "日本語", flag: "🇯🇵" },
                  { code: "zh", name: "中文", flag: "🇨🇳" },
                  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLang(item.code as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      lang === item.code
                        ? "bg-sky-500 border-sky-400 text-slate-950 scale-105 shadow-md shadow-sky-500/20"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">{activeContent.cred1}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">{activeContent.cred2}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">{activeContent.cred3}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">{activeContent.cred4}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4 sm:items-center">
              <button
                onClick={() => {
                  setActiveSection("qna");
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("open-qna-form"));
                  }, 300);
                }}
                id="hero-cta-qna"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-tight shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <MessageSquare className="w-5 h-5 animate-pulse shrink-0" />
                <span className="whitespace-nowrap">
                  {lang === "ko" && "실시간 Q&A 질문하기"}
                  {lang === "en" && "Ask Real-time Q&A"}
                  {lang === "ja" && "リアルタイムQ&Aで質問する"}
                  {lang === "zh" && "实时 Q&A 提问"}
                  {lang === "vi" && "Hỏi đáp Q&A thời gian thực"}
                </span>
              </button>

              <button
                onClick={() => setActiveSection("ai-match")}
                id="hero-cta-aimatch"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold tracking-tight shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <Bot className="w-5 h-5 animate-bounce shrink-0" />
                <span className="whitespace-nowrap">{activeContent.ctaMatch}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              
              <button
                onClick={openChat}
                id="hero-cta-chat"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-white font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">{activeContent.ctaChat}</span>
              </button>
            </div>
          </div>

          {/* 3D Rotating Interactive Globe Integration */}
          <div className="lg:col-span-5 h-[350px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative bg-slate-950 flex items-center justify-center">
            {/* The custom 3D interactive Globe component */}
            <div className="absolute inset-0 w-full h-full">
              <Globe />
            </div>
            
            {/* Overlay indicators to make it look highly professional */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left z-10">
              <div className="pointer-events-none">
                <p className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  {activeContent.simTitle}
                </p>
                <p className="text-[10px] text-slate-400">{activeContent.simDesc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Shield className="w-6 h-6 text-blue-400 stroke-[1.5] pointer-events-none hidden sm:block" />
                <a 
                  href="tel:0507-1472-2428" 
                  className="pointer-events-auto bg-blue-600/80 hover:bg-blue-600 border border-blue-400/40 px-2.5 py-1.5 rounded-lg text-[10px] font-black text-white hover:text-sky-200 transition-all shadow-sm hover:scale-[1.03]"
                >
                  {activeContent.phoneLabel || "0507-1472-2428"}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
