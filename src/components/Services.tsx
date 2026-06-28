import { useState } from "react";
import { motion } from "motion/react";
import { FileText, Briefcase, ArrowRight, UserCheck, Scale } from "lucide-react";

interface ServicesProps {
  onSelectAction: (sectionId: string) => void;
  lang: "ko" | "en" | "ja" | "zh" | "vi";
  setLang: (lang: "ko" | "en" | "ja" | "zh" | "vi") => void;
}

export default function Services({ onSelectAction, lang, setLang }: ServicesProps) {
  const translations = {
    ko: {
      heading: "비자친구의 3대 핵심 분야",
      intro: "단순 행정 대행을 넘어 AI 정밀 분석과 구인 구직 연계를 결합한 차별화된 출입국 행정 솔루션을 제공합니다.",
      whyTitle: "💡 왜 출입국 서류는 '비자친구'와 상담해야 할까요?",
      whyDesc: "법무부 출입국 대행기관 정식 등록 및 공인 직업소개업 허가를 모두 소유하여, 외국인 인재의 비자 발급과 직업 매칭을 공인된 울타리 내에서 한 번에 해결합니다. 또한 최신 AI 심사 모델을 통해 불합격 요소를 선제 진단함으로써 불필요한 행정 수수료 낭비를 완벽히 차단합니다.",
      whyBtn: "AI 상담 시작하기",
      categories: [
        {
          id: "visa-service",
          title: "초청 및 체류관련 비자 업무",
          subtitle: "Visa Processing",
          description: "외국인 우수 인재와 숙련 기능인력들의 한국 장기 체류 비자 신청을 완벽히 대행합니다.",
          items: [
            "E-7-1 전문인력 (IT 엔지니어, 마케터, 기술 영업 등)",
            "E-7-4 숙련기능 점수제 비자 (E-9 제조업 근로자 타겟)",
            "F-2-R 지역특화 우수인재 비자 (인구감소지역 취업 조건)",
            "F-5 영주권 & F-6 결혼이민 (국내 영주정착 및 배합비자)",
            "D-10 구직비자 / D-2 유학생 비자 변경 대행"
          ],
          btnText: "비자 합격률 예측하기"
        },
        {
          id: "penalty-service",
          title: "출입국 사범심사 대행",
          subtitle: "Penalty & Screening Review",
          description: "음주운전, 행정법규 위반, 불법체류 등 출입국 단속 및 정밀 조사에 맞서 강제출국 위기를 구제합니다.",
          items: [
            "음주운전 벌금형 선고 후 출입국 사범조사 대응 및 소명",
            "미등록 체류(불법체류) 자신출국 및 자진신고 의견서 대행",
            "출입국 관리법 위반 범칙금 감면 소명 및 이의 신청",
            "강제퇴거(Deportation)명령 대상자 인도적 사유 구제",
            "행정사 공식 의견서 및 반성문, 탄원서 패키지 작성"
          ],
          btnText: "사범심사 전문 진단하기"
        },
        {
          id: "job-service",
          title: "정식 외국인 직업소개",
          subtitle: "Authorized Job Referral",
          description: "정식 등록 직업소개소로서 유학생 및 숙련기능 인력이 합법적으로 근무 가능한 우수 강소기업을 엄선 알선합니다.",
          items: [
            "전공 일치 우수 IT/제조/서비스기업 구인구직 연계",
            "E-7 비자 고용 요건 충족 기업 실사 및 매칭 검토",
            "D-10 구직자 대상 외국인 고용허가 인재 풀 등록",
            "지자체 지역특화(F-2-R) 매칭 연계 추천서 지원",
            "채용 즉시 합법 비자 자격 검토 및 비자 발급 패키지"
          ],
          btnText: "구직 매칭사례 보기"
        }
      ]
    },
    en: {
      heading: "VisaFriend's 3 Core Specialties",
      intro: "Going beyond simple administrative agency, we provide premium, AI-driven immigration solutions paired with professional job referral.",
      whyTitle: "💡 Why Consult 'VisaFriend' for Your Immigration Documents?",
      whyDesc: "Holding both an official registration as a Ministry of Justice immigration agency and an authorized job placement license, we provide a one-stop system for foreign talent's visa issuance and professional job matching. Furthermore, we use our latest AI model to analyze rejection risks in advance, completely preventing unnecessary administrative wastes.",
      whyBtn: "Start AI Consultation",
      categories: [
        {
          id: "visa-service",
          title: "Visa Processing & Stay Support",
          subtitle: "Visa Processing",
          description: "We fully represent long-term stay visa applications for excellent foreign talents and skilled professionals.",
          items: [
            "E-7-1 Professional (IT, Marketers, Tech Sales, etc.)",
            "E-7-4 Skilled Worker Points Visa (For E-9 manufacturing workers)",
            "F-2-R Regional Specialization Visa (In population-declining regions)",
            "F-5 Permanent Residency & F-6 Marriage Immigrant Visa",
            "D-10 Job Seeker / D-2 Student visa conversion agency"
          ],
          btnText: "Predict Visa Success Rate"
        },
        {
          id: "penalty-service",
          title: "Immigration Penalty representation",
          subtitle: "Penalty & Screening Review",
          description: "We prevent deportation risks from DUIs, legal violations, and unauthorized stays through precise audits.",
          items: [
            "DUI fine audit response & official justification",
            "Voluntary departure & self-report statement service",
            "Immigration Control Act penalty reduction advocacy",
            "Humanitarian grounds relief for deportation order targets",
            "Certified opinion letters, self-reflection & petition packages"
          ],
          btnText: "Start Penalty Diagnosis"
        },
        {
          id: "job-service",
          title: "Official Foreign Job Placement",
          subtitle: "Authorized Job Referral",
          description: "As a registered job agency, we match students and skilled workers with high-quality, legally compliant companies.",
          items: [
            "Major-aligned jobs in IT, manufacturing, and services",
            "E-7 visa employer requirement audit and screening",
            "Foreign talent pool registration for D-10 job seekers",
            "Local regional talent (F-2-R) job matching & letters of recommendation",
            "Immediate legal check & visa application package upon hiring"
          ],
          btnText: "View Matching Cases"
        }
      ]
    },
    ja: {
      heading: "ビザフレンドの3大核心専門分野",
      intro: "単なる行政代行を超え、AI精密分析と求人求職連携を融合した、差別化された出入国行政ソリューションを提供いたします。",
      whyTitle: "💡 なぜ出入国書類は「ビザフレンド」に相談すべきなのか？",
      whyDesc: "法務部出入国代行機関の正式登録と、公認職業紹介業の許可を両方取得しているため、外国人材のビザ発給と職業マッチングを、公認された枠組みの中で一度に解決します。また、最新のAI審査モデルにより不合格要素を事前に診断し、不要な行政手数料の浪費を完全に防ぎます。",
      whyBtn: "AI相談を始める",
      categories: [
        {
          id: "visa-service",
          title: "招へいおよび滞在関連ビザ業務",
          subtitle: "Visa Processing",
          description: "優秀な外国人材や熟練技能人材の韓国長期滞在ビザ申請手続きを完璧に代行いたします。",
          items: [
            "E-7-1 専門人材 (ITエンジニア、マーケター、技術営業など)",
            "E-7-4 熟練技能点数制ビザ (E-9製造業労働者対象)",
            "F-2-R 地域特化優秀人材ビザ (人口減少地域での就業条件)",
            "F-5 永住権 & F-6 結婚移民 (韓国内での永住定着および配偶者ビザ)",
            "D-10 求職ビザ / D-2 留学生ビザの変更代行"
          ],
          btnText: "ビザ合格率を予測する"
        },
        {
          id: "penalty-service",
          title: "出入国事犯審査代行",
          subtitle: "Penalty & Screening Review",
          description: "飲酒運転、行政法規違反、不法滞在など、出入国取り締まりや精密調査に対して、強制出国（国外退去）の危機から救済します。",
          items: [
            "飲酒運転の罰금刑宣告後の出入国事犯調査対応および釈明",
            "未登録滞在（不法滞在）の自発的出国および自発申告意見書の作成代行",
            "出入国管理法違反に伴る反則金の減免釈明および異議申し立て",
            "強制退去命令対象者の人道的理由による救済手続き",
            "行政書士公式意見書、反省文、嘆願書パッケージの作成"
          ],
          btnText: "専門的な事犯審査を診断"
        },
        {
          id: "job-service",
          title: "公式外国人職業紹介",
          subtitle: "Authorized Job Referral",
          description: "正式に登録された職業紹介所として、留学生や熟練技能人材が合法的に勤務できる優秀な優良・中堅企業を厳選して斡旋します。",
          items: [
            "専攻に合致した優秀なIT・製造・サービス企業との求人求職連携",
            "E-7ビザ雇用要件を満たす企業の現地調査およびマッチング検討",
            "D-10求職者を対象とした外国人雇用許可人材プールへの登録",
            "地方自治体の地域特化(F-2-R)マッチング連携推薦書のサポート",
            "採用決定時の即時ビザ資格審査およびビザ発給パッケージの提供"
          ],
          btnText: "マッチング事例を見る"
        }
      ]
    },
    zh: {
      heading: "VisaFriend的三大核心专业领域",
      intro: "超越单纯的行政代办，结合AI精准分析与求职招聘对接，提供差异化的出入境行政解决方案。",
      whyTitle: "💡 为什么出入境手续要咨询 'VisaFriend' ？",
      whyDesc: "我们同时拥有法务部出入境代办机构正式注册和公认职业介绍所许可，在合法的框架下一次性解决外国人才的签证签发与求职匹配。此外，通过最新的AI审核模型预先诊断不合格因素，彻底避免不必要的行政规费浪费。",
      whyBtn: "开始 AI 咨询",
      categories: [
        {
          id: "visa-service",
          title: "邀请及在留相关签证业务",
          subtitle: "Visa Processing",
          description: "完美代办优秀外国人才和熟练技术人员的韩国长期滞留签证申请。",
          items: [
            "E-7-1 专业人才 (IT工程师、市场营销、技术销售等)",
            "E-7-4 熟练技能积分制签证 (针对E-9制造业劳动者)",
            "F-2-R 区域特化优秀人才签证 (人口减少地区就业条件)",
            "F-5 永住权 & F-6 结婚移民 (国内定居及配偶签证)",
            "D-10 求职签证 / D-2 留学生签证变更代办"
          ],
          btnText: "预测签证通过率"
        },
        {
          id: "penalty-service",
          title: "出入境审查与违规辩护",
          subtitle: "Penalty & Screening Review",
          description: "针对酒后驾驶、违反行政法规、非法滞留等出入境稽查和调查，提供免于遣返的救济方案。",
          items: [
            "酒后驾驶罚金判决后的出入境调查应对与陈述",
            "非法滞留自愿离境及自愿申报意见书代办",
            "违反出入境管理法罚款减免申诉及异议申请",
            "针对被下达强制驱逐令对象的人道主义救济",
            "撰写行政士官方意见书、反省书及请愿书全套材料"
          ],
          btnText: "违规审查诊断"
        },
        {
          id: "job-service",
          title: "正规外国人才职业介绍",
          subtitle: "Authorized Job Referral",
          description: "作为正规注册的职业介绍所，严选留学生及熟练技术人员可合法工作的优秀中小型企业并进行推荐。",
          items: [
            "对口专业的优秀IT、制造、服务企业求职招聘对接",
            "符合E-7签证雇用条件的雇主实地考察与匹配评估",
            "针对D-10求职者的外国雇员许可人才库登记",
            "地方政府区域特化(F-2-R)匹配对接及推荐信支持",
            "录用后立即进行合法签证资格评估及签证发放全套服务"
          ],
          btnText: "查看推荐成功案例"
        }
      ]
    },
    vi: {
      heading: "3 Lĩnh Vực Chuyên Môn Cốt Lõi của VisaFriend",
      intro: "Vượt qua giới hạn của việc đại diện hành chính đơn thuần, chúng tôi cung cấp giải pháp hành chính xuất nhập cảnh khác biệt, kết hợp phân tích chính xác bằng AI và kết nối tìm kiếm việc làm.",
      whyTitle: "💡 Tại sao nên tư vấn hồ sơ xuất nhập cảnh với 'VisaFriend'?",
      whyDesc: "Sở hữu cả giấy đăng ký chính thức của cơ quan đại diện xuất nhập cảnh thuộc Bộ Tư pháp và giấy phép giới thiệu việc làm được công nhận, chúng tôi giải quyết việc cấp visa và kết nối việc làm cho nhân tài nước ngoài cùng một lúc trong một vòng kết nối hợp pháp. Ngoài ra, chúng tôi chẩn đoán trước các yếu tố không đạt thông qua mô hình thẩm định AI mới nhất để ngăn chặn triệt để việc lãng phí phí hành chính không cần thiết.",
      whyBtn: "Bắt đầu tư vấn AI",
      categories: [
        {
          id: "visa-service",
          title: "Nghiệp vụ Visa Bảo lãnh & Cư trú",
          subtitle: "Visa Processing",
          description: "Đại diện hoàn tất thủ tục xin visa cư trú dài hạn tại Hàn Quốc cho các nhân tài nước ngoài ưu tú và lao động kỹ năng lành nghề.",
          items: [
            "E-7-1 Nhân lực chuyên môn (Kỹ sư IT, Tiếp thị, Bán hàng kỹ thuật, v.v.)",
            "E-7-4 Visa tay nghề điểm số (Dành cho người lao động ngành chế tạo E-9)",
            "F-2-R Visa nhân tài ưu tú đặc thù khu vực (Điều kiện làm việc tại vùng giảm dân số)",
            "F-5 Quyền định cư & F-6 Kết hôn định cư (Định cư lâu dài và visa kết hôn)",
            "Đại diện chuyển đổi visa tìm việc D-10 / visa du học sinh D-2"
          ],
          btnText: "Dự đoán tỷ lệ đậu visa"
        },
        {
          id: "penalty-service",
          title: "Đại diện Thẩm định Vi phạm Xuất nhập cảnh",
          subtitle: "Penalty & Screening Review",
          description: "Hỗ trợ cứu nguy cơ bị trục xuất cưỡng chế đối với các hành vi vi phạm xuất nhập cảnh như lái xe khi say rượu, vi phạm quy định hành chính, cư trú bất hợp pháp.",
          items: [
            "Ứng phó và giải trình xuất nhập cảnh sau khi bị phạt tiền do lái xe khi say rượu",
            "Đại diện làm tờ khai tự nguyện xuất cảnh và tự nguyện khai báo cư trú bất hợp pháp",
            "Giải trình xin giảm tiền phạt vi phạm Luật Quản lý Xuất nhập cảnh và đơn khiếu nại",
            "Cứu trợ theo diện nhân đạo cho đối tượng bị lệnh trục xuất cưỡng chế (Deportation)",
            "Soạn thảo văn bản ý kiến chính thức của hành chính văn phòng, bản kiểm điểm, đơn thỉnh nguyện"
          ],
          btnText: "Chẩn đoán vi phạm"
        },
        {
          id: "job-service",
          title: "Giới thiệu Việc làm Chính thức cho Người nước ngoài",
          subtitle: "Authorized Job Referral",
          description: "Là văn phòng giới thiệu việc làm đã đăng ký chính thức, chúng tôi tuyển chọn và giới thiệu các doanh nghiệp vừa và nhỏ xuất sắc phù hợp cho du học sinh và lao động kỹ năng lành nghề làm việc hợp pháp.",
          items: [
            "Kết nối tìm việc làm tại các doanh nghiệp IT, chế tạo, dịch vụ xuất sắc đúng chuyên ngành",
            "Thực địa doanh nghiệp đáp ứng yêu cầu tuyển dụng visa E-7 và đánh giá mức độ phù hợp",
            "Đăng ký bể nhân tài được phép tuyển dụng người nước ngoài dành cho người tìm việc D-10",
            "Hỗ trợ thư giới thiệu liên kết khớp nối đặc thù khu vực (F-2-R) của chính quyền địa phương",
            "Đánh giá tư cách visa hợp pháp ngay sau khi tuyển dụng và gói hồ sơ cấp visa"
          ],
          btnText: "Xem các trường hợp kết nối"
        }
      ]
    }
  };

  const activeContent = translations[lang];

  const getIconForService = (id: string) => {
    if (id === "visa-service") return FileText;
    if (id === "penalty-service") return Scale;
    return Briefcase;
  };

  const getStylesForService = (id: string) => {
    if (id === "visa-service") {
      return {
        color: "from-blue-600 to-sky-600",
        accent: "text-blue-600",
        bgLight: "bg-blue-50/50",
        border: "border-blue-100",
      };
    }
    if (id === "penalty-service") {
      return {
        color: "from-red-600 to-amber-600",
        accent: "text-red-600",
        bgLight: "bg-red-50/50",
        border: "border-red-100",
      };
    }
    return {
      color: "from-green-600 to-emerald-600",
      accent: "text-emerald-600",
      bgLight: "bg-emerald-50/50",
      border: "border-emerald-100",
    };
  };

  return (
    <section id="services" className="py-20 bg-slate-50 border-y border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
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
              delay: 0.2
            }}
          >
            {activeContent.heading}
          </motion.h2>

          <div className="pt-2">
            <p className="text-slate-600 text-base sm:text-lg break-keep px-4 max-w-2xl mx-auto text-center font-medium leading-relaxed p-3 bg-blue-50/10 rounded-2xl">
              {activeContent.intro}
            </p>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeContent.categories.map((service, idx) => {
            const IconComponent = getIconForService(service.id);
            const style = getStylesForService(service.id);
            return (
              <div 
                key={service.id} 
                id={`card-${service.id}`}
                className={`bg-white rounded-2xl p-8 border ${style.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Card Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center text-white shadow-md`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-400 tracking-wider uppercase">
                      {service.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="w-full h-px bg-slate-100 mb-6"></div>

                  {/* Bullet Points */}
                  <ul className="space-y-3.5 mb-8">
                    {service.items.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <UserCheck className={`w-4 h-4 ${style.accent} shrink-0 mt-0.5`} />
                        <span className="leading-relaxed font-medium">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer CTA button inside card */}
                <button
                  onClick={() => onSelectAction(service.id === "job-service" ? "cases" : "ai-match")}
                  className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border cursor-pointer transition-colors duration-200 ${
                    idx === 1 
                      ? "bg-red-50 text-red-700 hover:bg-red-100/80 border-red-200" 
                      : idx === 2 
                      ? "bg-green-50 text-emerald-700 hover:bg-green-100/80 border-green-200"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100/80 border-blue-200"
                  }`}
                >
                  {service.btnText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Why Visa Friend Banner */}
        <div className="mt-16 bg-white rounded-3xl p-8 lg:p-10 border border-slate-200/60 shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-left space-y-4">
            <h4 className="text-lg sm:text-xl font-bold text-slate-800">
              {activeContent.whyTitle}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {activeContent.whyDesc}
            </p>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button
              onClick={() => onSelectAction("ai-match")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-extrabold bg-blue-900 hover:bg-blue-950 text-white shadow-md transition-all duration-200 cursor-pointer text-center"
            >
              {activeContent.whyBtn}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
