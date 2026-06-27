import { useState, useEffect, FormEvent } from "react";
import { Award, Search, Sparkles, Filter, Plus, CheckCircle2, UserCheck, RefreshCw, FileText, Globe } from "lucide-react";
import { SuccessCase } from "../types";

interface SuccessCasesSectionProps {
  lang?: "ko" | "en" | "ja" | "zh" | "vi";
}

export default function SuccessCasesSection({ lang = "ko" }: SuccessCasesSectionProps) {
  const [cases, setCases] = useState<SuccessCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const trans = {
    ko: {
      badge: "증명된 행정 전문 실무",
      titlePre: "비자친구",
      titlePost: "허가 및 구제 성공 사례",
      desc: "어려운 불합격 처분 보완, 까다로운 기업 실사 승인, 긴급 출국 정지 명령 구제 등 실제 의뢰인들과 함께 이뤄낸 자랑스러운 허가 사례와 관서 허가 내역들을 투명하게 나열합니다.",
      cats: {
        all: "전체 성공사례",
        visa: "체류 비자 발급",
        penalty: "사범심사 구제",
        job: "직업소개 매칭"
      }
    },
    en: {
      badge: "Proven Administrative Experience",
      titlePre: "VisaFriend's",
      titlePost: "Successful Approval & Relief Cases",
      desc: "Supplement for complex rejections, official approvals for rigid corporate audits, urgent deportation reliefs, and real transparent successful authorization outcomes with government departments.",
      cats: {
        all: "All Success Cases",
        visa: "Visa Issuance",
        penalty: "Immigration Relief",
        job: "Job Placements"
      }
    },
    ja: {
      badge: "証明された行政実務実績",
      titlePre: "ビザフレンドの",
      titlePost: "許可・救済の成功事例",
      desc: "難しい不合格処分の補完、厳しい企業実地調査の承認、緊急出国停止命令の救済など、実際の依頼者と共に成し遂げた誇らしい許可事例を透明に公開します。",
      cats: {
        all: "すべての成功事例",
        visa: "在留資格取得・変更",
        penalty: "事犯審査救済",
        job: "就職紹介マッチング"
      }
    },
    zh: {
      badge: "经证实的专业行政实务",
      titlePre: "VisaFriend",
      titlePost: "许可与违规救济成功案例",
      desc: "疑难不合格补件、严苛企业实地审查通过、紧急限制出境命令救济等，我们将与客户共同实现的真实获批案例在此公开展示。",
      cats: {
        all: "全部成功案例",
        visa: "在留签证签发",
        penalty: "出入境审查救济",
        job: "职业介绍匹配"
      }
    },
    vi: {
      badge: "Kinh nghiệm thực tiễn hành chính được kiểm chứng",
      titlePre: "Các trường hợp",
      titlePost: "Cấp phép & Cứu trợ thành công của VisaFriend",
      desc: "Bổ sung hồ sơ bị từ chối, phê duyệt thẩm định doanh nghiệp khắt khe, cứu trợ lệnh cấm xuất cảnh khẩn cấp,... liệt kê minh bạch những hồ sơ thành công thực tế.",
      cats: {
        all: "Tất cả các ca thành công",
        visa: "Cấp thị thực lưu trú",
        penalty: "Cứu trợ vi phạm XNC",
        job: "Khớp nối giới thiệu việc làm"
      }
    }
  };

  const activeContent = trans[lang] || trans.ko;

  // Add Success Case Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"visa" | "penalty" | "job">("visa");
  const [newNationality, setNewNationality] = useState("");
  const [newVisaType, setNewVisaType] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Image preset options to choose from
  const imagePresets = [
    { label: "전문직 계약", url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400" },
    { label: "법률 서류 서명", url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400" },
    { label: "우수 공장 근로", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400" },
    { label: "사무실 비자 상담", url: "https://images.unsplash.com/photo-1521791136368-1a46827d0515?auto=format&fit=crop&q=80&w=400" }
  ];

  const categories = [
    { value: "all", label: activeContent.cats.all },
    { value: "visa", label: activeContent.cats.visa },
    { value: "penalty", label: activeContent.cats.penalty },
    { value: "job", label: activeContent.cats.job }
  ];

  const fetchCases = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await fetch("/api/cases");
      if (res.ok) {
        const data = await res.json();
        setCases(data);
      }
    } catch (e) {
      console.error("Error fetching cases:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleAddCase = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newVisaType.trim()) {
      alert("제목, 비자 형태, 상세 설명은 필수입니다.");
      return;
    }

    try {
      const finalImage = newImageUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400";
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          clientNationality: newNationality || "기타",
          visaType: newVisaType,
          description: newDescription,
          outcome: newOutcome || "비자 변경 발급 완료",
          imageUrl: finalImage
        })
      });

      if (res.ok) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setShowAddForm(false);
          // Clear
          setNewTitle("");
          setNewNationality("");
          setNewVisaType("");
          setNewDescription("");
          setNewOutcome("");
          setNewImageUrl("");
          fetchCases(true); // Quiet reload
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      alert("성공 사례 등록 실패");
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientNationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.visaType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="cases" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-blue-700" />
            {activeContent.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {activeContent.titlePre} <span className="text-blue-800">{activeContent.titlePost}</span>
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 text-sm sm:text-base">
            {activeContent.desc}
          </p>
        </div>

        {/* Toolbar: Category tabs, Search, Add Case */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5" id="cases-tabs">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 ${
                  selectedCategory === cat.value
                    ? "bg-blue-900 text-white shadow-md shadow-blue-950/10"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="국적, 비자명 등으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => fetchCases(true)}
              disabled={isRefreshing}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-xl shrink-0 cursor-pointer transition-all"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-900" : ""}`} />
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              사례 등록
            </button>
          </div>

        </div>

        {/* --- ADD CASE MODAL FORM --- */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left overflow-y-auto max-h-[90vh]">
              
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                    <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">성공사례가 무사히 등록되었습니다!</h3>
                  <p className="text-sm text-slate-500">웹사이트 메인 그리드에 즉시 실시간 반영됩니다.</p>
                </div>
              ) : (
                <form onSubmit={handleAddCase} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-sky-500 animate-pulse" />
                      허가 성공사례 업로드 (행정사 전용)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
                    >
                      닫기
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">성공사례 제목</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="예: 베트남 출신 용접 전문가 E-7-4 변경 발급 완료"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">업무 대분류</label>
                      <select
                        value={newCategory}
                        onChange={(e: any) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        <option value="visa">체류 비자 발급</option>
                        <option value="penalty">사범심사 구제</option>
                        <option value="job">직업소개 매칭</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">체류 비자형태</label>
                      <input
                        type="text"
                        required
                        value={newVisaType}
                        onChange={(e) => setNewVisaType(e.target.value)}
                        placeholder="예: E-7-4 또는 F-6-1"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">고객 국적</label>
                      <input
                        type="text"
                        value={newNationality}
                        onChange={(e) => setNewNationality(e.target.value)}
                        placeholder="예: 캄보디아, 몽골"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">최종 행정 허가 성과 (Outcome)</label>
                    <input
                      type="text"
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      placeholder="예: 사범조사 벌금 하향 및 체류연장 특별허가 취득 완료"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">성공사례 상세 설명</label>
                    <textarea
                      required
                      rows={4}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="행정사 대행 요점과 소명 사유 등을 육하원칙에 맞추어 의뢰인의 입장에서 알기 쉽게 풀어 설명해 주세요."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">자료 첨부 사진 프리셋 선택 (클릭)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {imagePresets.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setNewImageUrl(preset.url)}
                          className={`p-2 border rounded-xl text-left transition-all ${
                            newImageUrl === preset.url
                              ? "border-blue-950 bg-blue-50/50 ring-2 ring-blue-900/15"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-12 object-cover rounded-lg mb-1 pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                          <p className="text-[9px] font-bold text-slate-600 text-center">{preset.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer transition-colors"
                    >
                      성공사례 승인 등록
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

        {/* --- GRID OF PHOTO SUCCESS STORIES --- */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-900 animate-spin mx-auto" />
            <p className="text-slate-500 text-xs font-semibold">성공 실적 포트폴리오 정렬 중...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200/50 text-slate-500">
            <p className="text-sm font-semibold">조건에 맞는 실적 사례가 없습니다. 검색어를 다시 한번 확인해 주십시오.</p>
          </div>
        ) : (
          <div className="relative h-[640px] overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/20 p-4 shadow-inner" id="cases-marquee-container">
            {/* Top & Bottom elegant fades */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <style>{`
              @keyframes marqueeUp {
                0% { transform: translateY(0); }
                100% { transform: translateY(calc(-50% - 16px)); }
              }
              .animate-marquee-up {
                animation: marqueeUp 40s linear infinite;
              }
              .animate-marquee-up:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="animate-marquee-up flex flex-col gap-8">
              {/* Copy 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCases.map((c) => (
                  <div 
                    key={`${c.id}-c1`} 
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row text-left"
                  >
                    {/* Photo Thumb */}
                    <div className="w-full sm:w-2/5 min-h-[160px] relative bg-slate-900 overflow-hidden shrink-0">
                      <img
                        src={c.imageUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400"}
                        alt={c.title}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {/* Category overlay label */}
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-extrabold text-white tracking-wider uppercase shadow-md ${
                        c.category === "penalty"
                          ? "bg-red-600/95"
                          : c.category === "job"
                          ? "bg-emerald-600/95"
                          : "bg-blue-800/95"
                      }`}>
                        {c.category === "penalty" && "사범심사구제"}
                        {c.category === "job" && "직업소개알선"}
                        {c.category === "visa" && "체류자격취득"}
                      </span>
                    </div>

                    {/* Text Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-slate-400">
                          <Globe className="w-3.5 h-3.5 text-blue-800" />
                          <span>의뢰 국적: <span className="text-slate-700">{c.clientNationality}</span></span>
                          <span className="text-slate-300">|</span>
                          <span className="text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">{c.visaType}</span>
                        </div>

                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm md:text-base mb-1 sm:mb-2 tracking-tight line-clamp-2 leading-snug">
                          {c.title}
                        </h3>

                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                          {c.description}
                        </p>
                      </div>

                      {/* Stamp Outcome Banner inside card */}
                      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/60 flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                          c.category === "penalty" ? "text-red-600" : "text-blue-700"
                        }`} />
                        <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-tight">
                          성과: {c.outcome}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Copy 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" aria-hidden="true">
                {filteredCases.map((c) => (
                  <div 
                    key={`${c.id}-c2`} 
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row text-left"
                  >
                    {/* Photo Thumb */}
                    <div className="w-full sm:w-2/5 min-h-[160px] relative bg-slate-900 overflow-hidden shrink-0">
                      <img
                        src={c.imageUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400"}
                        alt={c.title}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {/* Category overlay label */}
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-extrabold text-white tracking-wider uppercase shadow-md ${
                        c.category === "penalty"
                          ? "bg-red-600/95"
                          : c.category === "job"
                          ? "bg-emerald-600/95"
                          : "bg-blue-800/95"
                      }`}>
                        {c.category === "penalty" && "사범심사구제"}
                        {c.category === "job" && "직업소개알선"}
                        {c.category === "visa" && "체류자격취득"}
                      </span>
                    </div>

                    {/* Text Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-slate-400">
                          <Globe className="w-3.5 h-3.5 text-blue-800" />
                          <span>의뢰 국적: <span className="text-slate-700">{c.clientNationality}</span></span>
                          <span className="text-slate-300">|</span>
                          <span className="text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">{c.visaType}</span>
                        </div>

                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm md:text-base mb-1 sm:mb-2 tracking-tight line-clamp-2 leading-snug">
                          {c.title}
                        </h3>

                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                          {c.description}
                        </p>
                      </div>

                      {/* Stamp Outcome Banner inside card */}
                      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/60 flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                          c.category === "penalty" ? "text-red-600" : "text-blue-700"
                        }`} />
                        <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-tight">
                          성과: {c.outcome}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
