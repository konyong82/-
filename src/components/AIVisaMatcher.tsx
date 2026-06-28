import { useState } from "react";
import { motion } from "motion/react";
import { Bot, Sparkles, AlertCircle, FileText, CheckCircle, Award, ArrowRight, Loader2, HelpCircle } from "lucide-react";
import { VisaProfile } from "../types";

interface AIVisaMatcherProps {
  lang?: "ko" | "en" | "ja" | "zh" | "vi";
}

export default function AIVisaMatcher({ lang = "ko" }: AIVisaMatcherProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<VisaProfile>({
    nationality: "",
    education: "Bachelor",
    topik: "No Score",
    annualIncome: "2,600만 원 미만",
    currentVisa: "E-9 (비전문취업)",
    message: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const trans = {
    ko: {
      badge: "AI 법률 지능 엔진 탑재",
      titlePre: "인공지능 실시간",
      titlePost: "비자 자격 매칭기",
      desc: "본인의 학력, 한국어 점수, 현재 비자 및 소득 수준을 입력하시면 해당 점수를 정밀 계산하여 합격 가능한 추천 비자와 보완 조건을 실시간으로 매칭 진단합니다."
    },
    en: {
      badge: "AI Legal Intelligence Engine",
      titlePre: "AI Live",
      titlePost: "Visa Eligibility Matcher",
      desc: "Enter your nationality, education, TOPIK level, current visa, and income. We will compute your eligibility score and matches for recommendable visas and supplement terms in real-time."
    },
    ja: {
      badge: "AI法律知能エンジン搭載",
      titlePre: "AIリアルタイム",
      titlePost: "ビザ診断シミュレーター",
      desc: "学歴、日本語能力（TOPIK）、現在のビザ、および所得水準を入力していただくと、該当する点数を精密に計算し、合格可能なビザと補完条件をリアルタイムでマッチング診断します。"
    },
    zh: {
      badge: "搭载 AI 法律智能引擎",
      titlePre: "人工智能实时",
      titlePost: "签证资格评估器",
      desc: "输入您的国籍、学历、韩语成绩、当前签证和收入水平，我们将精确计算您的积分，并实时评估可推荐的签证种类及合规补充条件。"
    },
    vi: {
      badge: "Trang bị Động cơ Trí tuệ Pháp lý AI",
      titlePre: "Khớp nối tự động",
      titlePost: "Tư cách Visa AI thời gian thực",
      desc: "Nhập quốc tịch, trình độ học vấn, điểm TOPIK, tư cách visa hiện tại và mức thu nhập của bạn. Chúng tôi sẽ tính toán chính xác số điểm và khớp nối các tư cách visa phù hợp nhất trong thời gian thực."
    }
  };

  const activeContent = trans[lang] || trans.ko;

  const educationOptions = [
    { value: "HighSchool", label: "고등학교 졸업 (High School)" },
    { value: "Associate", label: "전문대학 학사 (Associate Degree)" },
    { value: "Bachelor", label: "4년제 대학 학사 (Bachelor's Degree)" },
    { value: "MasterOrHigher", label: "대학원 석사/박사 (Master's or Ph.D.)" }
  ];

  const topikOptions = [
    { value: "No Score", label: "자격증 없음 / 기초 회화 수준" },
    { value: "TOPIK 1-2", label: "TOPIK 1~2급 / 사회통합프로그램 1~2단계 이수" },
    { value: "TOPIK 3", label: "TOPIK 3급 / 사회통합프로그램 3단계 이수" },
    { value: "TOPIK 4", label: "TOPIK 4급 / 사회통합프로그램 4단계 이수" },
    { value: "TOPIK 5-6", label: "TOPIK 5~6급 / 사회통합프로그램 5단계 이수" }
  ];

  const incomeOptions = [
    { value: "Under 24M", label: "연 2,400만 원 미만" },
    { value: "24M - 28M", label: "연 2,400만 원 이상 ~ 2,800만 원 미만" },
    { value: "28M - 33M", label: "연 2,800만 원 이상 ~ 3,300만 원 미만" },
    { value: "33M - 40M", label: "연 3,300만 원 이상 ~ 4,000만 원 미만" },
    { value: "40M Over", label: "연 4,000만 원 이상 (GNI 1배 이상 우수 소득)" }
  ];

  const currentVisaOptions = [
    { value: "E-9 (비전문취업)", label: "E-9 비전문취업 (제조/건설 근로자)" },
    { value: "D-10 (구직)", label: "D-10 구직 (국내 대학 졸업 미취업 자)" },
    { value: "D-2 (유학)", label: "D-2 유학생 (전문학사/학사/석사 과정)" },
    { value: "G-1 (기타)", label: "G-1 기타체류 (인도적 체류자 포함)" },
    { value: "H-2 (방문취업)", label: "H-2 방문취업 (중국/구소련 동포)" },
    { value: "Other/None", label: "기타 자격 또는 무비자/불법체류 신분" }
  ];

  const handleNext = () => {
    if (step === 1 && !profile.nationality.trim()) {
      alert("국적을 입력해 주세요.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setReport(null);
    try {
      const res = await fetch("/api/visa-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error("분석 요청 실패");
      const data = await res.json();
      setReport(data.report);
      setStep(5); // Show report step
    } catch (e) {
      console.error(e);
      alert("AI 분석 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetMatcher = () => {
    setProfile({
      nationality: "",
      education: "Bachelor",
      topik: "No Score",
      annualIncome: "Under 24M",
      currentVisa: "E-9 (비전문취업)",
      message: ""
    });
    setReport(null);
    setStep(1);
  };

  return (
    <section id="ai-match" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5 text-blue-700 animate-pulse" />
            {activeContent.badge}
          </div>
          <motion.h2 
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 cursor-default"
            animate={{ 
              scale: [1, 1.01, 1],
              opacity: [1, 0.6, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {activeContent.titlePre} <span className="text-blue-800">{activeContent.titlePost}</span>
          </motion.h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {activeContent.desc}
          </p>
          
          {/* Warning Banner */}
          <div className="mt-6 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left max-w-2xl mx-auto flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed break-keep">
              {lang === "ko" && "[주의사항] 실제로 출입국의 정책 및 요건이 달라질 수 있으므로, 정확한 개별 진단을 위해 전화상담이나 방문상담 또는 아래의 Q&A 상담을 받아보시기를 권장합니다."}
              {lang === "en" && "[Notice] Since actual immigration policies and requirements vary and change, we recommend seeking a telephone, in-person, or the Q&A consultation below for accurate assessment."}
              {lang === "ja" && "[注意事項] 実際の出入国管理政策や要件は変更される可能性があるため、確実な診断のために、お電話やご来訪、または下記のQ&Aによる相談を受けられることをお勧めします。"}
              {lang === "zh" && "[注意事项] 鉴于出入境政策和具体要求可能有所变动，为了确保评估准确，建议您进行电话咨询、来访面谈或通过下方的Q&A进行咨询。"}
              {lang === "vi" && "[Lưu ý] Vì các chính sách và điều kiện xuất nhập cảnh thực tế có thể thay đổi, chúng tôi khuyên bạn nên nhận tư vấn qua điện thoại, gặp mặt trực tiếp hoặc thông qua phần Tư vấn Q&A bên dưới để được đánh giá chính xác nhất."}
            </p>
          </div>
        </div>

        {/* Wizard Form Wrapper */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200/60 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          
          {/* Progress indicators */}
          {step <= 4 && (
            <div className="flex items-center justify-between mb-10 max-w-md mx-auto" id="progress-bar-wizard">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step === s 
                      ? "bg-blue-900 text-white ring-4 ring-blue-900/10 scale-105" 
                      : step > s 
                      ? "bg-sky-500 text-slate-900" 
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`h-1 flex-1 mx-2 rounded ${
                      step > s ? "bg-sky-500" : "bg-slate-200"
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Basic Info (Nationality & Visa) */}
          {step === 1 && (
            <div className="space-y-6 text-left fade-in" id="wizard-step-1">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-500" />
                기본 신원 정보를 입력해 주세요
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">현재 국적 (Nationality)</label>
                  <input
                    type="text"
                    value={profile.nationality}
                    onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                    placeholder="예: 베트남 (Vietnam), 네팔, 우즈베키스탄 등"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">현재 소지 중인 체류 비자 (Current Visa)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentVisaOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, currentVisa: opt.value })}
                        className={`px-4 py-3.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          profile.currentVisa === opt.value
                            ? "bg-blue-900 text-white border-blue-900 shadow-md"
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-md shadow-blue-900/10 cursor-pointer transition-colors"
                >
                  다음 단계로
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Academic & Language */}
          {step === 2 && (
            <div className="space-y-6 text-left fade-in" id="wizard-step-2">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-500" />
                학력 및 한국어 구사 능력을 선택해 주세요
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">최종 학력 (Education Level)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {educationOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, education: opt.value })}
                        className={`px-4 py-3.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          profile.education === opt.value
                            ? "bg-blue-900 text-white border-blue-900 shadow-md"
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">한국어 능력 시험 / 사회통합프로그램 이수 등급</label>
                  <div className="space-y-2">
                    {topikOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, topik: opt.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                          profile.topik === opt.value
                            ? "bg-blue-900 text-white border-blue-900 shadow-md"
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {profile.topik === opt.value && <CheckCircle className="w-4 h-4 text-sky-300" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm cursor-pointer transition-colors"
                >
                  이전으로
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-md shadow-blue-900/10 cursor-pointer transition-colors"
                >
                  다음 단계로
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Income & Extra details */}
          {step === 3 && (
            <div className="space-y-6 text-left fade-in" id="wizard-step-3">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-500" />
                소득 기준 및 추가 희망사항을 입력해 주세요
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">연간 소득 금액 (Korean Annual Income)</label>
                  <div className="space-y-2">
                    {incomeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, annualIncome: opt.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                          profile.annualIncome === opt.value
                            ? "bg-blue-900 text-white border-blue-900 shadow-md"
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {profile.annualIncome === opt.value && <CheckCircle className="w-4 h-4 text-sky-300" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">추가 희망사항 또는 구체적인 체류 상황 (선택)</label>
                  <textarea
                    rows={3}
                    value={profile.message}
                    onChange={(e) => setProfile({ ...profile, message: e.target.value })}
                    placeholder="예: 제조업 공장에서 용접공으로 4년 근무했습니다. 한국어 3급 있습니다. E-7-4로 바꾸고 싶습니다."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm cursor-pointer transition-colors"
                >
                  이전으로
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-md shadow-blue-900/10 cursor-pointer transition-colors"
                >
                  입력 정보 확인
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Summary Confirm Before Submission */}
          {step === 4 && (
            <div className="space-y-6 text-left fade-in" id="wizard-step-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-600" />
                입력하신 신원 정보를 최종 확인해 주세요
              </h3>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 space-y-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">국적</span>
                    <span className="font-bold text-slate-800">{profile.nationality}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">현재 비자</span>
                    <span className="font-bold text-slate-800">{profile.currentVisa}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">최종 학력</span>
                    <span className="font-bold text-slate-800">
                      {educationOptions.find(o => o.value === profile.education)?.label || profile.education}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">한국어 수준</span>
                    <span className="font-bold text-slate-800">
                      {topikOptions.find(o => o.value === profile.topik)?.label || profile.topik}
                    </span>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-xs text-slate-400 block font-medium">소득 구간</span>
                  <span className="font-bold text-slate-800">
                    {incomeOptions.find(o => o.value === profile.annualIncome)?.label || profile.annualIncome}
                  </span>
                </div>

                {profile.message && (
                  <div className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium mb-1">작성하신 상세상황</span>
                    <span className="text-slate-700 italic">"{profile.message}"</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-950 leading-relaxed">
                  **개인정보 암호화 수립**: 입력하신 정보는 외부로 유출되지 않으며 비자친구 AI 비자 예측 로직과 대표 행정사의 무료 점수 진단 목적 이외에는 사용되지 않습니다.
                </p>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm cursor-pointer transition-colors"
                >
                  이전으로
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 text-slate-950 disabled:text-slate-400 rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/10 cursor-pointer transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                      AI 진단 정밀 분석 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-blue-900 animate-pulse" />
                      AI 비자 자격 매칭 리포트 출력
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Report Display */}
          {step === 5 && report && (
            <div className="space-y-6 text-left fade-in" id="wizard-step-5">
              
              {/* Report Header Decorative Card */}
              <div className="bg-gradient-to-r from-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-sky-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">비자친구 AI 정밀 분석 보고서</h4>
                    <p className="text-xs text-sky-200 font-mono">Report ID: VF-{Date.now().toString().slice(-6)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  {profile.nationality} 국적의 자격요건을 토대로 현행 법무부 국적 및 출입국 개정안(최신 숙련인력, 지역특화 확대 조치)을 결합하여 도출된 전문 결과 보고서입니다.
                </p>
              </div>

              {/* Real Markdown Style Report Body */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-inner prose max-w-none text-slate-800 max-h-[450px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-sm">
                {report}
              </div>

              {/* Final Step Action Recommendations */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-800" />
                    더 구체적인 합격 의견서가 필요하십니까?
                  </h4>
                  <p className="text-xs text-blue-900/80">
                    보고서를 가지고 방문상담 예약 신청 시 대표행정사가 가산점 혜택 보완 증빙 작성을 무료 검토해 드립니다.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="tel:0507-1472-2428"
                    className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    전화 예약
                  </a>
                  <button
                    onClick={resetMatcher}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all"
                  >
                    다시 진단하기
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
