import React, { useState } from "react";
import { FileText, ArrowUpRight, Search, CheckCircle, ShieldCheck, HelpCircle, ExternalLink, Globe } from "lucide-react";

interface VisaIntroductionProps {
  lang?: "ko" | "en" | "ja" | "zh" | "vi";
}

export default function VisaIntroduction({ lang = "ko" }: VisaIntroductionProps) {
  const trans = {
    ko: {
      badge: "출입국 공식 등록 대행기관 제공",
      titlePre: "신뢰할 수 있는",
      titlePost: "대한민국 대표 비자 가이드",
      desc: "비자친구 이건행정사가 법무부 출입국 규정을 분석하여 핵심 자격 요건을 알기 쉽게 정리해 드립니다. 비자 아이콘을 누르시면 대표 행정사가 분석한 Naver 블로그의 정밀 상세 실무 포스팅으로 즉시 연결됩니다.",
      actionBtn: "상세 블로그 분석 및 성공사례 보기",
      searchPlaceholder: "비자 코드 검색 (예: E-7, F-2-R)...",
      allVisas: "전체 비자",
      popular: "인기",
      recommend: "추천",
      requirements: "주요 핵심 요건:",
      disclaimer: "※ 각 비자는 개별 상황(학력, 소득, 기업 상태 등)에 따라 적용 요건이 매우 다릅니다. 최종 진행을 위해서는 대면 또는 AI 상담을 통해 행정사 전밀 검토를 거치는 것이 안전합니다.",
      blogSearchBtn: "네이버 블로그에서 전체 비자 실무 검색하기",
      cats: {
        all: "전체 비자",
        employ: "취업/기능",
        reside: "거주/영주",
        study: "유학/기타"
      }
    },
    en: {
      badge: "Provided by Ministry of Justice Registered Agency",
      titlePre: "Comprehensive",
      titlePost: "South Korea Visa Directory",
      desc: "VisaFriend's Keon Admin Agency breaks down the core visa qualifications based on latest guidelines. Click any card to access deep official Naver Blog analysis posts authored directly by our chief administrator.",
      actionBtn: "View Deep Blog Analysis & Success Cases",
      searchPlaceholder: "Search visa code (e.g., E-7, F-2-R)...",
      allVisas: "All Visas",
      popular: "Popular",
      recommend: "Recommend",
      requirements: "Key Prerequisites:",
      disclaimer: "※ Requirements vary greatly by education, income, and corporate status. For safe processing, please consult with the administrative attorney directly.",
      blogSearchBtn: "Search all visa practices on Naver Blog",
      cats: {
        all: "All Visas",
        employ: "Work / Skilled",
        reside: "Residency / PR",
        study: "Study / Others"
      }
    },
    ja: {
      badge: "出入国公式登録代行機関提供",
      titlePre: "信頼できる",
      titlePost: "韓国の在留資格（ビザ）ガイド",
      desc: "ビザフレンドのイ・ゴン行政書士が最新の出入国管理法に基づき、主要なビザの要件を分かりやすく整理しました。カードをクリックすると、代表行政書士が執筆したNaverブログの実務記事に直接移動します。",
      actionBtn: "ブログ詳細分析と成功事例を見る",
      searchPlaceholder: "ビザコード検索 (例: E-7, F-2-R)...",
      allVisas: "すべてのビザ",
      popular: "人気",
      recommend: "推薦",
      requirements: "主要な要件:",
      disclaimer: "※ 在留資格は個別の状況（学歴、年収、雇用企業など）により大きく異なります。安全な申請のため、行政書士との直接面談・相談を強く推奨します。",
      blogSearchBtn: "Naverブログでビザ実務全体を検索する",
      cats: {
        all: "すべてのビザ",
        employ: "就労・技能",
        reside: "居住・永住",
        study: "留学・その他"
      }
    },
    zh: {
      badge: "出入境官方注册代办机构提供",
      titlePre: "权威可信赖的",
      titlePost: "大韩民国代表签证指南",
      desc: "VisaFriend李健行政士根据韩国法务部最新法案，将核心签证资质要点简明梳理。点击卡片可直接跳转至李健代表行政士亲自撰写的Naver博客深度实务分析文章。",
      actionBtn: "查看博客深度分析及成功案例",
      searchPlaceholder: "搜索签证代码 (例如: E-7, F-2-R)...",
      allVisas: "全部签证",
      popular: "热门",
      recommend: "推荐",
      requirements: "主要核心条件:",
      disclaimer: "※ 各签证根据个人背景（学历、收入、企业资质等）要求差异极大。为确保万无一失，递交前请务必与执业行政士进行最终确认。",
      blogSearchBtn: "在 Naver 博客上搜索全部签证实务",
      cats: {
        all: "全部签证",
        employ: "就职 / 技术",
        reside: "居住 / 绿卡",
        study: "留学 / 其他"
      }
    },
    vi: {
      badge: "Cung cấp bởi Cơ quan đại diện Đăng ký chính thức Bộ Tư pháp",
      titlePre: "Cẩm nang hướng dẫn",
      titlePost: "Các loại Visa Hàn Quốc đáng tin cậy",
      desc: "Hành chính viên Keon của VisaFriend phân tích các quy định xuất nhập cảnh mới nhất để tóm tắt các yêu cầu cốt lõi. Click vào thẻ để kết nối ngay với bài phân tích chuyên sâu trên Naver Blog chính thức.",
      actionBtn: "Xem phân tích chi tiết & Ca thành công trên Blog",
      searchPlaceholder: "Tìm mã visa (Ví dụ: E-7, F-2-R)...",
      allVisas: "Tất cả các loại Visa",
      popular: "Hot",
      recommend: "Khuyên dùng",
      requirements: "Yêu cầu cốt lõi:",
      disclaimer: "※ Mỗi loại visa có các yêu cầu áp dụng rất khác nhau tùy thuộc vào hoàn cảnh của từng cá nhân. Vui lòng thảo luận trực tiếp với hành chính viên để được rà soát an toàn.",
      blogSearchBtn: "Tìm kiếm toàn bộ thực tiễn visa trên Naver Blog",
      cats: {
        all: "Tất cả Visa",
        employ: "Làm việc / Tay nghề",
        reside: "Cư trú / Định cư",
        study: "Du học / Khác"
      }
    }
  };

  const activeContent = trans[lang] || trans.ko;

  const visaData = {
    ko: [
      {
        code: "E-7",
        name: "특정활동 비자",
        sub: "E-7-1 전문직종 / E-7-4 숙련기능인력",
        desc: "대한민국 공·사기관 등과의 계약에 따라 법무부 장관이 특별히 지정하는 활동에 종사하는 전문 외국인 인력 비자입니다. 연봉 수준, 학력, 경력 요건이 중요하게 심사됩니다.",
        tags: ["연봉 요건 (GNI 80% 이상)", "고용추천서 연계", "숙련기능전환 지원"],
        blogQuery: "E-7 비자",
        badge: "전문가 추천",
        category: "employ"
      },
      {
        code: "F-2-R",
        name: "지역특화형 거주비자",
        sub: "인구감소지역 지자체 추천 정착 비자",
        desc: "인구 감소 지역의 강소기업에 취업하거나 일정 기간 거주하는 우수 외국인 인재를 위한 맞춤형 비자입니다. 지자체장 추천서가 필수적이며, 취득 시 안정적인 배우자 동반 동거가 가능합니다.",
        tags: ["지자체 추천 필수", "인구감소지역 지정업체", "한국어 소득기준 충족"],
        blogQuery: "F-2-R 비자",
        badge: "가장 인기",
        category: "reside"
      },
      {
        code: "F-5",
        name: "영주 비자 (영주권)",
        sub: "체류 자격의 영구 보장 및 국적 전환 전단계",
        desc: "체류 기간 제한 없이 한국에 무기한 거주할 수 있는 가장 공신력 높은 권리입니다. 소득(GNI 2배 등 유형별 상이) 및 한국어 능력(사회통합프로그램 5단계) 요건이 매우 철저하게 검증됩니다.",
        tags: ["GNI 소득기준 2배 이상", "사회통합프로그램 이수", "신원보증 및 범죄경력 조회"],
        blogQuery: "F-5 영주권",
        badge: "최종 목표 비자",
        category: "reside"
      },
      {
        code: "F-6",
        name: "결혼이민 비자",
        sub: "한국 국민과의 혼인 관계 수립 및 가정 형성",
        desc: "한국인 배우자와의 적법한 혼인 관계를 기반으로 장기 동거 및 합법 취업이 자유로운 비자입니다. 위장 결혼을 차단하기 위해 법무부의 혼인 진정성 및 소득 증명, 주거지가 정밀하게 심사됩니다.",
        tags: ["혼인의 진정성 입증", "초청인 소득 요건 충족", "의사소통 가능 여부"],
        blogQuery: "F-6 결혼비자",
        badge: "엄격 심사 대상",
        category: "reside"
      },
      {
        code: "D-10 / D-2",
        name: "구직 및 유학 비자",
        sub: "글로벌 유학생 유치 및 국내 정식 취업 매칭",
        desc: "한국 대학 학사/석사 졸업(D-2) 후 정식 취업을 도모하거나 인턴십 계약을 체결하기 위해 머무는 구직(D-10) 단계입니다. 비자친구 직업소개 매칭 센터에서 우수 강소기업 채용을 실시간 중개합니다.",
        tags: ["점수제 구직 조건 충족", "우수 기업 일자리 매칭", "인턴십 고용 계약서 검토"],
        blogQuery: "D-10 구직비자",
        badge: "취업 매칭 연계",
        category: "study"
      },
      {
        code: "E-9",
        name: "비전문취업 비자",
        sub: "제조업·건설업·농축어업 고용허가 인력",
        desc: "고용허가제(EPS)를 통해 입국하여 지정된 현장 산업에 근무하는 비전문 기능인력입니다. 4년 이상 성실 근무 후 점수제를 축적하여 E-7-4 전문 숙련인력으로 신분 상승하는 정밀 설계가 대단히 활발합니다.",
        tags: ["E-7-4 비자 전환 점수 설계", "산업기능인력 계산", "고소득 연봉 매칭"],
        blogQuery: "E-9 비자 E-7-4",
        badge: "상담 폭주",
        category: "employ"
      }
    ],
    en: [
      {
        code: "E-7",
        name: "Special Activity Visa",
        sub: "E-7-1 Professional / E-7-4 Skilled Worker",
        desc: "A residency tier for foreign professionals engaged in fields specially designated by the Ministry of Justice. Strict salary standards, academic degrees, and matching industry categories are examined.",
        tags: ["Salary Level (over 80% GNI)", "Official Recommendation Letters", "Transition to Skilled Resident"],
        blogQuery: "E-7 Visa South Korea",
        badge: "Recommended",
        category: "employ"
      },
      {
        code: "F-2-R",
        name: "Regional Residency Visa",
        sub: "Local Municipal Recommendation Program",
        desc: "A tailored long-term residency visa for foreign talents who reside or work in population-declining counties. Municipal recommendations guarantee fast-track, stable residence and family companionship.",
        tags: ["Requires Local Mayor's Letter", "Certified Regional Employer", "KIIP or TOPIK Certified"],
        blogQuery: "F-2-R Visa Korea",
        badge: "Trending",
        category: "reside"
      },
      {
        code: "F-5",
        name: "Permanent Residency",
        sub: "Unlimited Legal Residence Security",
        desc: "The highest status authorizing permanent residence with absolute work freedom. Demands highly strict standards including stable income (commonly 2x GNI) and complete Integration Program completion.",
        tags: ["Income Level Audit", "KIIP Stage 5 Completion", "Favorable Background Screening"],
        blogQuery: "F-5 Permanent Resident Korea",
        badge: "Ultimate Goal",
        category: "reside"
      },
      {
        code: "F-6",
        name: "Marriage Migrant Visa",
        sub: "For Married Partners of Korean Citizens",
        desc: "Authorizes long-term living and free job opportunities based on authentic marital relationships. Highly audited on marital integrity, sponsor's minimum annual income, and decent living facilities.",
        tags: ["Proof of Authentic Marriage", "Sponsor Income Level", "Mutual Language Capability"],
        blogQuery: "F-6 Marriage Visa Korea",
        badge: "Highly Screened",
        category: "reside"
      },
      {
        code: "D-10 / D-2",
        name: "Job Seeker / Student Visa",
        sub: "Transition Pathway to Full Employment",
        desc: "D-2 for students in Korean universities and D-10 for job seekers conducting internships. Our certified introduction agency provides full employment matching with approved local corporate sponsors.",
        tags: ["Points System Evaluation", "Promising Business Matching", "Internship Paperwork Audits"],
        blogQuery: "D-10 Job Seeker Visa Korea",
        badge: "Career Match",
        category: "study"
      },
      {
        code: "E-9",
        name: "Non-Professional Visa",
        sub: "Manufacturing & Heavy Industrial Sectors",
        desc: "EPS employment scheme for production and agricultural industries. Sincere workers who stay over 4 years can strategically accumulate scores with us to upgrade to the high-tier E-7-4 status.",
        tags: ["E-7-4 Score Calculation", "Work Performance Merits", "Company Sponsorship Checks"],
        blogQuery: "E-9 Visa to E-7-4 Korea",
        badge: "Conversion Audit",
        category: "employ"
      }
    ],
    ja: [
      {
        code: "E-7",
        name: "特定活動ビザ",
        sub: "E-7-1専門職種 / E-7-4熟練技能就労",
        desc: "韓国の公私機関等との契約に基づき、法務部長官が指定する専門業務に従事する就労ビザです。年収水準、学歴、関連経歴が厳しく審査されます。",
        tags: ["年収基準 (GNI 80%以上)", "雇用推薦書の取得", "熟練技能者への転換支援"],
        blogQuery: "E-7 ビザ",
        badge: "専門家推薦",
        category: "employ"
      },
      {
        code: "F-2-R",
        name: "地域特化型居住ビザ",
        sub: "人口減少地域を対象とする地方自治体推薦ビザ",
        desc: "人口減少地域にある強小企業に就労するか一定期間居住する優秀な外国人のための特別居住枠です。知事の推薦書が必須で、配偶者の同伴就労が可能です。",
        tags: ["自治体推薦必須", "地域指定企業への勤務", "韓国語・所得基準の充足"],
        blogQuery: "F-2-R ビザ",
        badge: "最も人気",
        category: "reside"
      },
      {
        code: "F-5",
        name: "永주権ビザ",
        sub: "在留資格の無期限の保障",
        desc: "在留期間の更新制限なく韓国に永久居住できる最高の権利です。所得要件（GNI2倍以上など）と韓国語能力（KIIP5段階）が緻密にチェックされます。",
        tags: ["GNI所得基準2倍以上", "社会統合プログラム(KIIP)修了", "身元保証および犯罪経歴照会"],
        blogQuery: "F-5 永住権",
        badge: "最終目標",
        category: "reside"
      },
      {
        code: "F-6",
        name: "結婚移民ビザ",
        sub: "韓国国民との婚姻関係の成立・維持",
        desc: "韓国人配偶者との適法な婚姻関係に基づき、長期滞在および制限のない就職が保証されるビザです。偽装結婚防止のため、婚姻の真実性、所得基準が徹底的に審査されます。",
        tags: ["婚姻の真実性の立証", "招請人の所得要件充足", "意思疎通可能の証明"],
        blogQuery: "F-6 結婚ビザ",
        badge: "厳密な審査",
        category: "reside"
      },
      {
        code: "D-10 / D-2",
        name: "求職・留学ビザ",
        sub: "留学生誘致および韓国内就職マッチング",
        desc: "韓国の大学・大学院（D-2）を修了後、正規就職やインターンシップ契約を締結するための求職活動（D-10）ビザです。当社の就職仲介センターを通じて優秀な求人をご案内します。",
        tags: ["ポイント制求職基準充足", "優秀企業求人のマッチング", "インターンシップ契約の精査"],
        blogQuery: "D-10 求職ビザ",
        badge: "求職連携",
        category: "study"
      },
      {
        code: "E-9",
        name: "非専門就労ビザ",
        sub: "製造業・建設業・農林漁業などの雇用許可",
        desc: "雇用許可制度（EPS）によって入国し、各種現場産業で働く従業員です。4年以上勤務し、点数を蓄積した後にE-7-4（熟練技能）に転換するプランが極めて盛んです。",
        tags: ["E-7-4転換ポイント設計", "産業機能点数計算", "雇用主との推薦マッチング"],
        blogQuery: "E-9 ビ자 E-7-4",
        badge: "相談殺到",
        category: "employ"
      }
    ],
    zh: [
      {
        code: "E-7",
        name: "特定活动签证",
        sub: "E-7-1 专业人才 / E-7-4 熟练技能人才",
        desc: "韩国公、私机构等签约，从事法务部长官特别指定活动的外国专业人才。审查重点在于聘用岗位的相关性、企业雇佣配额、年薪（通常要求上一年度GNI 80%以上）。",
        tags: ["年薪标准 (GNI 80%以上)", "关联部委雇佣推荐信", "熟练技能积分转签"],
        blogQuery: "E-7 签证",
        badge: "专家推荐",
        category: "employ"
      },
      {
        code: "F-2-R",
        name: "区域特化型居住签证",
        sub: "人口减少地方自治体市长推荐签证",
        desc: "针对在人口流失地区工作并居住的杰出外国人才提供的特别居住签证。须持地方自治体首长推荐信，家属可自由陪同、合法务工。",
        tags: ["地方首长推荐书", "指定人口减少区企业", "韩语及基本收入达标"],
        blogQuery: "F-2-R 签证",
        badge: "最火爆",
        category: "reside"
      },
      {
        code: "F-5",
        name: "永住签证 (韩国绿卡)",
        sub: "无限期居留及完全就业自由",
        desc: "无须定期延长签证、可终身在韩生活的最高级别签证。审查条件极严，须满足高额收入（一般国民GNI两倍以上）及社会统合课程KIIP 5阶段合格等核心要件。",
        tags: ["国民GNI 2倍收入基准", "社会统合课程(KIIP)通关", "无犯罪记录公证双认证"],
        blogQuery: "F-5 永住权",
        badge: "终极目标",
        category: "reside"
      },
      {
        code: "F-6",
        name: "结婚移民签证",
        sub: "与韩国国民结婚构建真实家庭关系",
        desc: "与韩国国民建立合法婚姻配偶关系，从而在韩国长期共同生活并拥有就业完全自由的签证。严格防范虚假通婚，对通婚真实性、韩方收入来源和住宅设施进行实地考察。",
        tags: ["婚姻实质性真诚度审查", "韩方配偶年收入标准", "日常沟通语言条件"],
        blogQuery: "F-6 结婚签证",
        badge: "严查对象",
        category: "reside"
      },
      {
        code: "D-10 / D-2",
        name: "求职与留学签证",
        sub: "吸纳全球学子及在韩名企求职匹配",
        desc: "韩国大学毕业留学生(D-2)或拟寻找正规职业工作(D-10)的外国人求职转换阶段。通过本所特设的职业介绍服务，精准匹配可给予签证担保的韩国强小企业。",
        tags: ["打分制求职签证标准", "名企岗位及雇佣配额对接", "实习合同合法合规性审查"],
        blogQuery: "D-10 求职签证",
        badge: "求职引流",
        category: "study"
      },
      {
        code: "E-9",
        name: "非专业就业签证",
        sub: "制造业、重工业、农林牧渔业EPS劳工",
        desc: "根据政府雇佣许可制度(EPS)入境，并被分配到一线行业劳作的务工人员。通过持续稳定服务累积年资、并在行政士指导下提高打分积分，升级转换为E-7-4居住。咨询最为火热。",
        tags: ["规划E-7-4转签打分方案", "产业累积积分核算", "雇主推荐信联络"],
        blogQuery: "E-9 签证 转 E-7-4",
        badge: "咨询火爆",
        category: "employ"
      }
    ],
    en_translate: [], // Just auxiliary
    vi: [
      {
        code: "E-7",
        name: "Visa Hoạt động Đặc biệt",
        sub: "E-7-1 Chuyên gia / E-7-4 Lao động lành nghề",
        desc: "Thị thực dành cho người nước ngoài tham gia vào hoạt động do Bộ Tư pháp quy định dựa trên hợp đồng lao động. Thẩm định khắt khe mức lương, kinh nghiệm làm việc và sự phù hợp ngành nghề.",
        tags: ["Yêu cầu mức lương (trên 80% GNI)", "Cần thư giới thiệu ngành nghề", "Hỗ trợ chuyển đổi sang E-7-4"],
        blogQuery: "E-7 Visa Han Quoc",
        badge: "Khuyên dùng",
        category: "employ"
      },
      {
        code: "F-2-R",
        name: "Visa Định cư Đặc thù Khu vực",
        sub: "Chương trình định cư theo đề xuất của chính quyền địa phương",
        desc: "Chính sách ưu đãi cấp visa định cư lâu dài cho nhân tài nước ngoài sinh sống và làm việc tại khu vực dân số giảm. Đảm bảo cuộc sống ổn định và khả năng đưa vợ/chồng sang làm việc hợp pháp.",
        tags: ["Cần thư đề cử của Tỉnh trưởng", "Doanh nghiệp chỉ định tại vùng thưa dân", "Đáp ứng năng lực tiếng Hàn & thu nhập"],
        blogQuery: "F-2-R Visa Han Quoc",
        badge: "Yêu thích nhất",
        category: "reside"
      },
      {
        code: "F-5",
        name: "Visa Định cư Vĩnh viễn (F-5)",
        sub: "Định cư trọn đời tại Hàn Quốc",
        desc: "Trạng thái pháp lý cao quý nhất, cho phép cư trú vĩnh viễn không giới hạn công việc hay thời hạn lưu trú. Thẩm định cực kỳ nghiêm ngặt về mức thu nhập (thường trên 2 lần GNI) và tiếng Hàn KIIP Lớp 5.",
        tags: ["Mức thu nhập GNI gấp 2 lần", "Hoàn thành KIIP lớp 5", "Xác nhận lý lịch tư pháp không tỳ vết"],
        blogQuery: "F-5 Dinh Cu Vinh Vien Han Quoc",
        badge: "Mục tiêu cuối",
        category: "reside"
      },
      {
        code: "F-6",
        name: "Visa Kết hôn định cư",
        sub: "Xây dựng gia đình hợp pháp cùng công dân Hàn Quốc",
        desc: "Visa dành cho người nước ngoài kết hôn hợp pháp với người Hàn Quốc, cho phép tự do làm việc và cư trú lâu dài. Bộ Tư pháp thẩm định nghiêm tính chân thực hôn nhân, thu nhập người bảo lãnh, và chỗ ở.",
        tags: ["Chứng minh hôn nhân chân thực", "Thu nhập tối thiểu người bảo lãnh", "Khả năng ngôn ngữ giao tiếp chung"],
        blogQuery: "F-6 Ket Hon Han Quoc",
        badge: "Thẩm định ngặt",
        category: "reside"
      },
      {
        code: "D-10 / D-2",
        name: "Visa Du học & Tìm việc",
        sub: "Lộ trình chuyển tiếp từ đi học sang làm việc chính thức",
        desc: "Học tập tại các trường Đại học (D-2) và giai đoạn tìm việc chính thức/thực tập (D-10). Trung tâm giới thiệu việc làm VisaFriend hỗ trợ kết nối trực tiếp với các doanh nghiệp lớn bảo lãnh visa phù hợp.",
        tags: ["Đủ điểm xét tuyển visa D-10", "Khớp nối việc làm doanh nghiệp uy tín", "Rà soát kỹ hợp đồng thực tập"],
        blogQuery: "D-10 Tim Viec Han Quoc",
        badge: "Khớp việc làm",
        category: "study"
      },
      {
        code: "E-9",
        name: "Visa Lao động Phổ thông (EPS)",
        sub: "Lao động sản xuất công nghiệp, nông nghiệp",
        desc: "Visa diện EPS làm việc tại các nhà máy, công trường, trang trại được chỉ định. Sau 4 năm làm việc chăm chỉ, người lao động có thể tích lũy điểm để chuyển sang diện E-7-4 vô cùng tiềm năng.",
        tags: ["Thiết lập thang điểm E-7-4", "Tính điểm tay nghề tích lũy", "Hợp đồng lao động thu nhập cao"],
        blogQuery: "E-9 Chuyen Sang E-7-4",
        badge: "Đăng ký nhiều",
        category: "employ"
      }
    ]
  };

  const activeVisas = visaData[lang] || visaData.ko;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredVisas = activeVisas.filter((v) => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.sub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleBlogRedirect = (query: string) => {
    // Standard Naver Blog search inside a specific user ID
    const url = `https://blog.naver.com/PostSearchList.naver?blogId=kon1122&searchText=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const categories = [
    { value: "all", label: activeContent.cats.all },
    { value: "employ", label: activeContent.cats.employ },
    { value: "reside", label: activeContent.cats.reside },
    { value: "study", label: activeContent.cats.study },
  ];

  return (
    <section id="visa-intro" className="py-24 bg-slate-50 border-t border-slate-200/60 relative scroll-mt-20">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" id="visa-intro-heading">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200/80 text-blue-900 text-xs font-bold uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-800 animate-pulse" />
            {activeContent.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {activeContent.titlePre} <span className="text-blue-800">{activeContent.titlePost}</span>
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed break-keep">
            {activeContent.desc}
          </p>
        </div>

        {/* Search & Category Filter bar */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/60 max-w-4xl mx-auto mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeContent.searchPlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/40 focus:border-blue-900 focus:bg-white transition-all"
                id="visa-search-input"
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 justify-center w-full sm:w-auto" id="visa-category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.value
                      ? "bg-blue-900 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visa Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="visa-cards-grid">
          {filteredVisas.map((visa, index) => (
            <div
              key={`${visa.code}-${index}`}
              onClick={() => handleBlogRedirect(visa.blogQuery)}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              id={`visa-card-${visa.code.replace("/", "-").replace(/\s+/g, "")}`}
            >
              {/* Card top decorative color bar based on category */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                visa.category === "employ" ? "bg-amber-400" :
                visa.category === "reside" ? "bg-emerald-500" : "bg-purple-500"
              }`}></div>

              <div>
                {/* Badge and Code */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-blue-950 tracking-tight font-mono">
                    {visa.code}
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                    {visa.badge}
                  </span>
                </div>

                {/* Visa Title and Subtitle */}
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                  {visa.name}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mb-3">
                  {visa.sub}
                </p>

                {/* Brief description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-5 break-keep">
                  {visa.desc}
                </p>
              </div>

              {/* Requirements checklist */}
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                  {activeContent.requirements}
                </span>
                <ul className="space-y-1.5 mb-5">
                  {visa.tags.map((tag, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-tight font-medium">{tag}</span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Action Indicator */}
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 group-hover:text-blue-700 pt-2 border-t border-slate-50">
                  <span>{activeContent.actionBtn}</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state when search doesn't match anything */}
        {filteredVisas.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-xl mx-auto" id="visa-search-empty">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-bounce" />
            <p className="text-slate-500 text-sm font-semibold">
              {lang === "ko" ? "검색한 비자를 찾을 수 없습니다." : "No matching visas found."}
            </p>
          </div>
        )}

        {/* Bottom trust notes & disclaimer */}
        <div className="max-w-4xl mx-auto mt-16 text-center space-y-6">
          <p className="text-[11px] text-slate-500 leading-relaxed break-keep max-w-3xl mx-auto bg-slate-100/50 p-4 rounded-2xl border border-slate-200/50">
            {activeContent.disclaimer}
          </p>

          <div className="pt-2">
            <button
              onClick={() => handleBlogRedirect("")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-extrabold text-slate-800 hover:bg-slate-50 hover:text-blue-900 hover:border-blue-300 transition-all cursor-pointer"
              id="btn-naver-blog-global-search"
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>{activeContent.blogSearchBtn}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
