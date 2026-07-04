import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { motion } from "motion/react";
import { HelpCircle, Search, MessageSquare, Lock, Unlock, Plus, AlertCircle, RefreshCw, ChevronDown, ChevronUp, CheckCircle, UserCheck, ShieldAlert, Image as ImageIcon } from "lucide-react";
import { QnAPost } from "../types";

interface QnASectionProps {
  lang?: "ko" | "en" | "ja" | "zh" | "vi";
  isAdmin?: boolean;
}

export default function QnASection({ lang = "ko", isAdmin = false }: QnASectionProps) {
  const [posts, setPosts] = useState<QnAPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const trans = {
    ko: {
      titlePre: "실시간",
      titlePost: "Q&A 상담실",
      desc: "비자 변경, 사범심사 구제, 구직 매칭과 관련된 궁금한 점을 남겨주시면 비자친구 대표 행정사가 법률 규정을 근거로 24시간 이내에 전용 맞춤 답변을 달아 드립니다.",
      cats: {
        all: "전체 질문",
        visa: "비자 업무",
        penalty: "사범심사 대행",
        job: "직업 소개",
        other: "기타 상담"
      }
    },
    en: {
      titlePre: "Live",
      titlePost: "Q&A Counseling Room",
      desc: "Ask any questions regarding visa conversion, penalty reliefs, or job placements. VisaFriend's chief administrator will personally answer within 24 hours based on official immigration guidelines.",
      cats: {
        all: "All Questions",
        visa: "Visa Support",
        penalty: "Immigration Relief",
        job: "Job Introductions",
        other: "Other Inquiries"
      }
    },
    ja: {
      titlePre: "リアルタイム",
      titlePost: "Q&A 相談室",
      desc: "ビザ変更、事犯審査救済、求人求職マッチングに関する疑問を残していただければ、ビザフレンドの代表行政書士が法律規定に基づき、24時間以内に丁寧にお答えします。",
      cats: {
        all: "すべての質問",
        visa: "ビザ業務",
        penalty: "事犯審査代行",
        job: "職業紹介",
        other: "その他相談"
      }
    },
    zh: {
      titlePre: "实时",
      titlePost: "Q&A 咨询室",
      desc: "如果您留下关于签证变更、出入境处罚救济、求职匹配等方面的疑问，VisaFriend代表行政士将依据官方法律条规，在24小时内为您提供量身定制的专属解答。",
      cats: {
        all: "全部提问",
        visa: "签证业务",
        penalty: "违规审查代办",
        job: "职业介绍",
        other: "其他咨询"
      }
    },
    vi: {
      titlePre: "Phòng tư vấn",
      titlePost: "Hỏi & Đáp (Q&A) thời gian thực",
      desc: "Nếu bạn để lại các thắc mắc liên quan đến thay đổi visa, cứu trợ vi phạm XNC hay khớp nối việc làm, đại diện hành chính của VisaFriend sẽ phản hồi chi tiết trong vòng 24 giờ dựa trên các điều luật hiện hành.",
      cats: {
        all: "Tất cả câu hỏi",
        visa: "Nhiệm vụ Visa",
        penalty: "Đại diện vi phạm XNC",
        job: "Giới thiệu việc làm",
        other: "Tư vấn khác"
      }
    }
  };

  const activeContent = trans[lang] || trans.ko;

  // Expanded post IDs
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  // Password prompt state
  const [passwordPromptPostId, setPasswordPromptPostId] = useState<string | null>(null);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [unlockedPostIds, setUnlockedPostIds] = useState<string[]>([]);

  // Add Question Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"visa" | "penalty" | "job" | "other">("visa");
  const [newAuthor, setNewAuthor] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newIsPrivate, setNewIsPrivate] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleNewImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin Answer Form State
  const [replyingPostId, setReplyingPostId] = useState<string | null>(null);
  const [adminAnswerText, setAdminAnswerText] = useState("");

  const categories = [
    { value: "all", label: activeContent.cats.all },
    { value: "visa", label: activeContent.cats.visa },
    { value: "penalty", label: activeContent.cats.penalty },
    { value: "job", label: activeContent.cats.job },
    { value: "other", label: activeContent.cats.other }
  ];

  const fetchPosts = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const token = localStorage.getItem("visa_friend_admin_token");
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/qna", { headers });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error("Error fetching Q&As:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [isAdmin]);

  useEffect(() => {
    const handleOpenQnaForm = () => {
      setShowAddForm(true);
    };
    window.addEventListener("open-qna-form", handleOpenQnaForm);
    return () => {
      window.removeEventListener("open-qna-form", handleOpenQnaForm);
    };
  }, []);

  const handleToggleExpand = (post: QnAPost) => {
    if (isAdmin) {
      // Admin bypasses private post password checks completely!
      if (expandedPostIds.includes(post.id)) {
        setExpandedPostIds(prev => prev.filter(id => id !== post.id));
      } else {
        setExpandedPostIds(prev => [...prev, post.id]);
      }
      return;
    }

    if (post.isPrivate && !unlockedPostIds.includes(post.id)) {
      // Trigger password prompt
      setPasswordPromptPostId(post.id);
      setEnteredPassword("");
      return;
    }

    if (expandedPostIds.includes(post.id)) {
      setExpandedPostIds(prev => prev.filter(id => id !== post.id));
    } else {
      setExpandedPostIds(prev => [...prev, post.id]);
    }
  };

  const handlePasswordSubmit = async (postId: string) => {
    try {
      const res = await fetch(`/api/qna/${postId}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: enteredPassword })
      });
      if (res.ok) {
        const data = await res.json();
        // Server returns unmasked content upon valid password verification.
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: data.content, imageUrl: data.imageUrl, isContentMasked: false } : p));
        setUnlockedPostIds(prev => [...prev, postId]);
        setExpandedPostIds(prev => [...prev, postId]);
        setPasswordPromptPostId(null);
        setEnteredPassword("");
      } else {
        alert("비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      alert("비밀번호 검증 중 오류가 발생했습니다.");
    }
  };

  const handleAddQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newAuthor.trim()) {
      alert("제목, 내용, 작성자는 필수 입력 항목입니다.");
      return;
    }

    try {
      const res = await fetch("/api/qna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          authorName: newAuthor,
          contactInfo: newContact,
          isPrivate: newIsPrivate,
          password: newIsPrivate ? newPassword || "1234" : undefined,
          imageUrl: newImageUrl || undefined
        })
      });

      if (res.ok) {
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setShowAddForm(false);
          // Clear form
          setNewTitle("");
          setNewContent("");
          setNewAuthor("");
          setNewContact("");
          setNewIsPrivate(false);
          setNewPassword("");
          setNewImageUrl("");
          fetchPosts(true); // Quiet refresh
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      alert("질문 등록에 실패했습니다.");
    }
  };

  const handleAdminAnswerSubmit = async (postId: string) => {
    if (!adminAnswerText.trim()) {
      alert("답변을 입력해 주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("visa_friend_admin_token");
      const res = await fetch(`/api/qna/${postId}/answer`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content: adminAnswerText,
          author: "대표 행정사 이건"
        })
      });

      if (res.ok) {
        setAdminAnswerText("");
        setReplyingPostId(null);
        fetchPosts(true); // Quiet refresh
      } else {
        alert("답변 등록 권한이 없거나 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("답변 등록에 실패했습니다.");
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="qna" className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
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
              delay: 0.8
            }}
          >
            {activeContent.titlePre} <span className="text-blue-800">{activeContent.titlePost}</span>
          </motion.h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {activeContent.desc}
          </p>
        </div>

        {/* Toolbar: Search, Filters, Add Button */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Filters */}
          <div className="flex flex-wrap gap-1.5" id="qna-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  selectedCategory === cat.value
                    ? "bg-blue-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar and Create button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="질문 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={() => fetchPosts(true)}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-600 shrink-0 transition-colors"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-800" : ""}`} />
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              id="btn-add-qna"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0 transition-all"
            >
              <Plus className="w-4 h-4" />
              비공개 질문하기
            </button>
          </div>

        </div>

        {/* --- ADD QUESTION MODAL FORM --- */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden text-left">
              
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">질문이 정상적으로 등록되었습니다!</h3>
                  <p className="text-sm text-slate-500">행정사의 빠른 맞춤 답변을 기다려 주세요.</p>
                </div>
              ) : (
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-800" />
                      신규 상담 질문 작성하기
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
                    >
                      닫기
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">작성자 명 (영문/한글)</label>
                      <input
                        type="text"
                        required
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="예: Ali (우즈벡) 또는 김한결"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">연락처 (답변 알림용)</label>
                      <input
                        type="text"
                        value={newContact}
                        onChange={(e) => setNewContact(e.target.value)}
                        placeholder="예: 010-1234-5678"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">상담 분야 선택</label>
                      <select
                        value={newCategory}
                        onChange={(e: any) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                      >
                        <option value="visa">비자 업무 (체류 자격)</option>
                        <option value="penalty">사범심사 구제</option>
                        <option value="job">직업 소개 (일자리 매칭)</option>
                        <option value="other">기타 행정 상담</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newIsPrivate}
                          onChange={(e) => setNewIsPrivate(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-200 text-blue-900 focus:ring-blue-900/50"
                        />
                        비밀 질문으로 등록 (비공개)
                      </label>
                    </div>
                  </div>

                  {newIsPrivate && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left fade-in">
                      <label className="block text-[10px] font-bold text-blue-900 mb-1">비밀번호 설정 (글 조회용)</label>
                      <input
                        type="password"
                        required={newIsPrivate}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="비밀번호 4자리 설정 (예: 1234)"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                        maxLength={8}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">질문 제목</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="궁금하신 내용을 명확히 한 줄로 적어주세요."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">상담 질문 내용</label>
                    <textarea
                      required
                      rows={5}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="상세한 본인의 상황(현재 비자, 한국 입국 연도, 사건 발달 시점 또는 취업 전공 분야 등)을 자세히 기입해 주시면 훨씬 정확한 답변이 가능합니다."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">참고 사진 / 이미지 첨부 (선택)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewImageUpload}
                        className="hidden"
                        id="qna-image-upload"
                      />
                      <label
                        htmlFor="qna-image-upload"
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/90 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4 text-slate-500" />
                        사진 선택하기
                      </label>
                      {newImageUrl && (
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 p-1.5 rounded-lg">
                          <img
                            src={newImageUrl}
                            alt="첨부 이미지 프리뷰"
                            className="w-8 h-8 object-cover rounded border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => setNewImageUrl("")}
                            className="text-red-500 hover:text-red-700 text-xs font-bold px-1.5 py-1"
                          >
                            삭제
                          </button>
                        </div>
                      )}
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
                      질문 올리기
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

        {/* --- PASSWORD CHECK PROMPT --- */}
        {passwordPromptPostId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-2xl border border-slate-200 text-center space-y-4">
              <Lock className="w-8 h-8 text-blue-900 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800">비밀글 해제</h4>
                <p className="text-[10px] text-slate-400">등록하신 질문의 비밀번호 4자리를 입력하세요.</p>
              </div>
              <input
                type="password"
                placeholder="비밀번호 입력..."
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center text-xs focus:ring-2 focus:ring-blue-900"
                maxLength={8}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePasswordSubmit(passwordPromptPostId);
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setPasswordPromptPostId(null)}
                  className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs rounded-lg cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={() => handlePasswordSubmit(passwordPromptPostId)}
                  className="flex-1 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  해제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Q&A Posts List */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-800 animate-spin mx-auto" />
            <p className="text-slate-500 text-xs font-semibold">보안 채널로부터 질문 목록을 불러오는 중...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center space-y-4 shadow-sm">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-base">검색된 상담 글이 존재하지 않습니다.</h4>
            <p className="text-xs text-slate-500">원하시는 주제로 첫 비공개 상담 글을 등록해 보세요!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              상담글 작성하기
            </button>
          </div>
        ) : (
          <div className="relative h-[600px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-150/10 p-4 shadow-inner" id="qna-marquee-container">
            {/* Top & Bottom elegant fades */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

            <style>{`
              @keyframes qnaMarqueeUp {
                0% { transform: translateY(0); }
                100% { transform: translateY(calc(-50% - 12px)); }
              }
              .animate-qna-marquee-up {
                animation: qnaMarqueeUp 22s linear infinite;
              }
              .animate-qna-marquee-up:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="animate-qna-marquee-up flex flex-col gap-6">
              {/* Copy 1 */}
              <div className="flex flex-col gap-6">
                {filteredPosts.map((post) => {
                  const isExpanded = expandedPostIds.includes(post.id);
                  const isAnswered = !!post.answer;
                  const isPrivate = post.isPrivate && !unlockedPostIds.includes(post.id);

                  return (
                    <div 
                      key={`${post.id}-copy1`} 
                      id={`qna-item-${post.id}-copy1`}
                      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden transition-all duration-200"
                    >
                      {/* Collapsible Header Accordion */}
                      <div 
                        onClick={() => handleToggleExpand(post)}
                        className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 select-none"
                      >
                        <div className="flex items-start sm:items-center gap-3 text-left">
                          {/* Status badge */}
                          {isAnswered ? (
                            <span className="shrink-0 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                              답변완료
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                              답변대기
                            </span>
                          )}

                          {/* Category Label */}
                          <span className="shrink-0 text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded">
                            {post.category === "visa" && "비자"}
                            {post.category === "penalty" && "사범심사"}
                            {post.category === "job" && "직업소개"}
                            {post.category === "other" && "기타행정"}
                          </span>

                          {/* Title */}
                          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 leading-snug">
                            {post.title}
                            {post.isPrivate && <Lock className="w-3.5 h-3.5 text-slate-400 inline shrink-0" />}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-semibold text-slate-600 block">{post.authorName}</span>
                            <span className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30 text-left space-y-5 fade-in">
                          
                          {/* User's Original Question content */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                              <HelpCircle className="w-4 h-4 text-slate-400" />
                              <span>상담 질문 원문</span>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
                              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {post.content}
                              </p>
                              {post.imageUrl && (
                                <div className="max-w-md border border-slate-200 rounded-lg overflow-hidden mt-3 shadow-sm bg-slate-50 p-1">
                                  <img 
                                    src={post.imageUrl} 
                                    alt="의뢰인 첨부 사진" 
                                    className="w-full max-h-[300px] object-contain rounded-md"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="p-1 px-2 text-[10px] text-slate-400 font-medium bg-white text-center border-t border-slate-100">
                                    📎 첨부된 참고 사진/문서
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Official Administrator Answer */}
                          {post.answer ? (
                            <div className="space-y-2 bg-blue-50/30 border border-blue-100/50 rounded-2xl p-5">
                              <div className="flex items-center justify-between border-b border-blue-100/30 pb-2 mb-2">
                                <div className="flex items-center gap-2 text-xs text-blue-900 font-extrabold">
                                  <UserCheck className="w-4 h-4 text-blue-800" />
                                  <span>{post.answer.author} (비자친구 대표 행정사) 답변</span>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(post.answer.answeredAt).toLocaleDateString()} 답변등록
                                </span>
                              </div>
                              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {post.answer.content}
                              </p>
                            </div>
                          ) : isAdmin ? (
                            /* Admin answering interface */
                            <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-xl space-y-3">
                              <div className="flex items-center gap-1.5 text-xs text-blue-900 font-extrabold">
                                <ShieldAlert className="w-4 h-4 text-blue-800" />
                                <span>대표 행정사 마스터 관리 권한: 답변 작성</span>
                              </div>
                              {replyingPostId === post.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={adminAnswerText}
                                    onChange={(e) => setAdminAnswerText(e.target.value)}
                                    placeholder="의뢰인의 상황에 부합하는 정밀하고 따뜻한 해결책을 기입해 주십시오..."
                                    rows={4}
                                    className="w-full bg-white p-3 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                                  ></textarea>
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => {
                                        setReplyingPostId(null);
                                        setAdminAnswerText("");
                                      }}
                                      className="px-3 py-1.5 border border-slate-200 hover:bg-white text-slate-700 font-medium text-xs rounded"
                                    >
                                      취소
                                    </button>
                                    <button
                                      onClick={() => handleAdminAnswerSubmit(post.id)}
                                      className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded"
                                    >
                                      답변 등록하기
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setReplyingPostId(post.id)}
                                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                                >
                                  대표 행정사 권한으로 즉시 답변 달기
                                </button>
                              )}
                            </div>
                          ) : (
                            /* Standard visitor view when unanswered */
                            <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 font-bold">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                              <span>대표 행정사의 전문 법률 검토 및 맞춤 답변이 현재 분석 중입니다. (24시간 이내 등록 완료 예정)</span>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Copy 2 */}
              <div className="flex flex-col gap-6" aria-hidden="true">
                {filteredPosts.map((post) => {
                  const isExpanded = expandedPostIds.includes(post.id);
                  const isAnswered = !!post.answer;
                  const isPrivate = post.isPrivate && !unlockedPostIds.includes(post.id);

                  return (
                    <div 
                      key={`${post.id}-copy2`} 
                      id={`qna-item-${post.id}-copy2`}
                      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden transition-all duration-200"
                    >
                      {/* Collapsible Header Accordion */}
                      <div 
                        onClick={() => handleToggleExpand(post)}
                        className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 select-none"
                      >
                        <div className="flex items-start sm:items-center gap-3 text-left">
                          {/* Status badge */}
                          {isAnswered ? (
                            <span className="shrink-0 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                              답변완료
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                              답변대기
                            </span>
                          )}

                          {/* Category Label */}
                          <span className="shrink-0 text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded">
                            {post.category === "visa" && "비자"}
                            {post.category === "penalty" && "사범심사"}
                            {post.category === "job" && "직업소개"}
                            {post.category === "other" && "기타행정"}
                          </span>

                          {/* Title */}
                          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 leading-snug">
                            {post.title}
                            {post.isPrivate && <Lock className="w-3.5 h-3.5 text-slate-400 inline shrink-0" />}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-semibold text-slate-600 block">{post.authorName}</span>
                            <span className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30 text-left space-y-5 fade-in">
                          
                          {/* User's Original Question content */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                              <HelpCircle className="w-4 h-4 text-slate-400" />
                              <span>상담 질문 원문</span>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
                              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {post.content}
                              </p>
                              {post.imageUrl && (
                                <div className="max-w-md border border-slate-200 rounded-lg overflow-hidden mt-3 shadow-sm bg-slate-50 p-1">
                                  <img 
                                    src={post.imageUrl} 
                                    alt="의뢰인 첨부 사진" 
                                    className="w-full max-h-[300px] object-contain rounded-md"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="p-1 px-2 text-[10px] text-slate-400 font-medium bg-white text-center border-t border-slate-100">
                                    📎 첨부된 참고 사진/문서
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Official Administrator Answer */}
                          {post.answer ? (
                            <div className="space-y-2 bg-blue-50/30 border border-blue-100/50 rounded-2xl p-5">
                              <div className="flex items-center justify-between border-b border-blue-100/30 pb-2 mb-2">
                                <div className="flex items-center gap-2 text-xs text-blue-900 font-extrabold">
                                  <UserCheck className="w-4 h-4 text-blue-800" />
                                  <span>{post.answer.author} (비자친구 대표 행정사) 답변</span>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(post.answer.answeredAt).toLocaleDateString()} 답변등록
                                </span>
                              </div>
                              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {post.answer.content}
                              </p>
                            </div>
                          ) : isAdmin ? (
                            /* Admin answering interface */
                            <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-xl space-y-3">
                              <div className="flex items-center gap-1.5 text-xs text-blue-900 font-extrabold">
                                <ShieldAlert className="w-4 h-4 text-blue-800" />
                                <span>대표 행정사 마스터 관리 권한: 답변 작성</span>
                              </div>
                              {replyingPostId === post.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={adminAnswerText}
                                    onChange={(e) => setAdminAnswerText(e.target.value)}
                                    placeholder="의뢰인의 상황에 부합하는 정밀하고 따뜻한 해결책을 기입해 주십시오..."
                                    rows={4}
                                    className="w-full bg-white p-3 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                                  ></textarea>
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => {
                                        setReplyingPostId(null);
                                        setAdminAnswerText("");
                                      }}
                                      className="px-3 py-1.5 border border-slate-200 hover:bg-white text-slate-700 font-medium text-xs rounded"
                                    >
                                      취소
                                    </button>
                                    <button
                                      onClick={() => handleAdminAnswerSubmit(post.id)}
                                      className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded"
                                    >
                                      답변 등록하기
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setReplyingPostId(post.id)}
                                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                                >
                                  대표 행정사 권한으로 즉시 답변 달기
                                </button>
                              )}
                            </div>
                          ) : (
                            /* Standard visitor view when unanswered */
                            <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 font-bold">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                              <span>대표 행정사의 전문 법률 검토 및 맞춤 답변이 현재 분석 중입니다. (24시간 이내 등록 완료 예정)</span>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
