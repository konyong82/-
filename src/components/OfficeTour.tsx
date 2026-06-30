import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { motion } from "motion/react";
import { Briefcase, Eye, ShieldAlert, CheckCircle, MapPin, Compass, Clock, Car, Footprints, Upload, RotateCcw, Image as ImageIcon } from "lucide-react";

import defaultWorkspaceImg from "../assets/images/office_workspace_edited_1782559416311.jpg";
import defaultMeetingImg from "../assets/images/office_meeting_edited_1782559431521.jpg";
import fallbackDeskImg from "../assets/images/office_desk_1782557779076.jpg";
import fallbackMeetingImg from "../assets/images/office_meeting_1782557796153.jpg";

interface OfficeTourProps {
  lang?: "ko" | "en" | "ja" | "zh" | "vi";
  isAdmin?: boolean;
}

export default function OfficeTour({ lang = "ko", isAdmin = false }: OfficeTourProps) {
  const trans = {
    ko: {
      badge: "신뢰할 수 있는 전문 환경",
      titlePre: "비자친구",
      titlePost: "이건행정사&직업소개소 상담 공간",
      desc: "비자친구 이건행정사&직업소개소는 국가 공인 등록 법인으로서 의뢰인의 소중한 비자 자격 승인과 권리 구제를 위해 완벽히 세팅된 쾌적하고 투명한 오프라인 사무 환경을 운영하고 있습니다.",
      locTitle: "오시는 길 및 내방 안내",
      locHeading: "남산역 도보 10분 거리에 위치하여 내방이 편리합니다",
      locDesc: "사범심사 구제 상담, 비자 자격 변경을 위한 구비 서류 제출 등 대면 상담 및 수임 업무를 위해 방문하실 경우 아래의 오시는 길 및 운영 정보를 확인해 주십시오. (※ 대기 최소화를 위해 모든 방문은 사전 예약제입니다)",
      addrTitle: "사무실 주소",
      addrValue: "부산시 금정구 중앙대로1985번길 54, 2층",
      subwayTitle: "지하철 이용 시",
      subwayValue: "남산역 1번 출구로 나와 다이소 건물 옆길로 직진 도보 10분",
      carTitle: "자가용 및 주차",
      carValue: "사무실 앞에 잠시 주차 가능 / 편리한 무료 간이 주차",
      timeTitle: "업무 시간",
      timeValue: "평일 오전 9:00 - 오후 18:00 (토·일·공휴일 휴무)",
      reserveTitle: "상담 일정 및 대면 예약 신청",
      reserveDesc: "행정사 대면 집무실 내방 상담 및 서류 위임 계약을 원하시는 경우 대표전화 혹은 인공지능 매니저를 통해 예약을 잡아 주시면 원스톱 지원을 약속드립니다.",
      callBtn: "📞 유선 예약: 0507-1472-2428"
    },
    en: {
      badge: "Trusted Professional Environment",
      titlePre: "VisaFriend's",
      titlePost: "Keon Administrative Office & Counseling Spaces",
      desc: "VisaFriend Keon Administrative Agency is a state-registered professional office with clean, comfortable, and fully transparent offline environments to secure visa approvals and legal remedies.",
      locTitle: "Directions & Visitation Info",
      locHeading: "Conveniently located within a 10-minute walk from Namsan Station",
      locDesc: "Please check the directions and operational details below if you plan to visit for face-to-face consulting, penalty relief audits, or document submissions. (※ Pre-booking is required to minimize wait time)",
      addrTitle: "Office Address",
      addrValue: "2nd Floor, 54 Jungang-daero 1985beon-gil, Geumjeong-gu, Busan",
      subwayTitle: "By Subway",
      subwayValue: "Go out of Namsan Station Exit 1 and walk straight along the side road of the Daiso building for 10 minutes",
      carTitle: "Car & Parking",
      carValue: "Temporary parking available in front of the office / Free parking",
      timeTitle: "Business Hours",
      timeValue: "Weekdays 9:00 AM - 6:00 PM (Closed on Sat, Sun, & holidays)",
      reserveTitle: "Schedule & Appointment Reservation",
      reserveDesc: "If you want face-to-face consultations or paperwork contracts, please schedule via representative call or the AI Counselor.",
      callBtn: "📞 Phone Booking: 0507-1472-2428"
    },
    ja: {
      badge: "信頼できる専門的な環境",
      titlePre: "ビザフレンドの",
      titlePost: "イ・ゴン行政書士事務所の全景と相談スペース",
      desc: "ビザフレンド・イ・ゴン行政書士事務所は、国家公認의登録法人として、依頼者の大切なビザ資格の承認と権利救済のために完璧にセットされた、快適で透明なオフライン事務所を運営しています。",
      locTitle: "アクセスおよび内訪のご案内",
      locHeading: "南山駅から徒歩10分の距離に位置し、アクセスが便利です",
      locDesc: "事犯審査救済相談、ビザ資格変更のための書類提出など、対面での相談や受任業務のためにご訪問される際は、以下のアクセスおよび運営情報をご確認ください。（※待ち時間最小化のため、すべての訪問は事前予約制です）",
      addrTitle: "事務所住所",
      addrValue: "釜山市金井区中央大路1985番吉54、2階",
      subwayTitle: "地下鉄をご利用の場合",
      subwayValue: "南山駅1番出口から出て、ダイソービルの横の道を直進徒歩10分",
      carTitle: "自家用車および駐車場",
      carValue: "事務所の前に一時駐車可能 / 便利な無料簡易駐車場",
      timeTitle: "業務時間",
      timeValue: "平日 午前9:00 - 午後18:00（土・日・祝日は休み）",
      reserveTitle: "相談日程および対面予約の申し込み",
      reserveDesc: "行政書士との対面執務室での相談および書類委任契約をご希望の場合は、代表電話またはAIマネージャーを通じて予約をお取りいただければ、ワンストップ支援をお約束します。",
      callBtn: "📞 電話予約: 0507-1472-2428"
    },
    zh: {
      badge: "值得信赖的专业环境",
      titlePre: "VisaFriend",
      titlePost: "李健行政士事务所全景与咨询空间",
      desc: "VisaFriend李健行政士事务所作为国家官方注册法人，为客户宝贵的签证审核通过及权益救济运行着完备、舒适且高度透明的线下办公环境。",
      locTitle: "路线与到店指南",
      locHeading: "位于南山站步行10分钟路程，到店极为便利",
      locDesc: "如果因违规审查救济咨询、签证类型变更递交材料等需要面谈或委托业务而到店，请提前确认下方路线及运营信息。（※为减少等待时间，到店咨询实行全预约制）",
      addrTitle: "事务所地址",
      addrValue: "釜山市金井区中央大路1985街54, 2楼",
      subwayTitle: "乘坐地铁时",
      subwayValue: "从南山站1号出口出来，沿大创(Daiso)大楼旁的道路直行步行10分钟",
      carTitle: "自驾与停车",
      carValue: "事务所门前可临时停车 / 极为便利的免费简易停车",
      timeTitle: "办公时间",
      timeValue: "工作日上午9:00 - 下午18:00（周六、周日及公休日休息）",
      reserveTitle: "咨询日程与到店预约申请",
      reserveDesc: "如需在行政士办公室进行面谈或签署委托协议，请通过代表电话或AI助理进行预约，我们将为您提供一站式支持承诺。",
      callBtn: "📞 电话预约: 0507-1472-2428"
    },
    vi: {
      badge: "Môi trường chuyên nghiệp đáng tin cậy",
      titlePre: "Toàn cảnh văn phòng",
      titlePost: "Hành chính VisaFriend & Không gian Tư vấn",
      desc: "Văn phòng Hành chính VisaFriend là một pháp nhân được nhà nước chứng nhận đăng ký, vận hành môi trường làm việc thoải mái và minh bạch nhất nhằm phục vụ đắc lực cho việc cấp visa và cứu trợ quyền lợi của khách hàng.",
      locTitle: "Đường đi & Hướng dẫn đến văn phòng",
      locHeading: "Thuận tiện di chuyển, cách Ga Namsan chỉ 10 phút đi bộ",
      locDesc: "Nếu bạn có kế hoạch ghé thăm để nhận tư vấn trực tiếp về vi phạm XNC hoặc nộp hồ sơ xin visa, xin vui lòng kiểm tra đường đi và thời gian hoạt động dưới đây. (※ Đặt lịch hẹn trước để tránh phải xếp hàng chờ đợi)",
      addrTitle: "Địa chỉ văn phòng",
      addrValue: "Tầng 2, 54 Jungang-daero 1985beon-gil, Geumjeong-gu, Busan",
      subwayTitle: "Đi bằng tàu điện ngầm",
      subwayValue: "Đi ra ở Lối ra số 1 Ga Namsan, đi thẳng theo lối đi bên cạnh tòa nhà Daiso, đi bộ 10 phút",
      carTitle: "Xe hơi & Đỗ xe",
      carValue: "Có thể đỗ xe tạm thời trước văn phòng / Đỗ xe miễn phí tiện lợi",
      timeTitle: "Giờ làm việc",
      timeValue: "Ngày thường từ 9:00 sáng đến 6:00 chiều (Nghỉ thứ Bảy, Chủ nhật và ngày lễ)",
      reserveTitle: "Lịch tư vấn & Đăng ký đặt hẹn trực tiếp",
      reserveDesc: "Nếu bạn muốn nhận tư vấn trực tiếp tại văn phòng hành chính hoặc ủy quyền hồ sơ, xin vui lòng đặt chỗ qua số điện thoại đại diện hoặc quản lý AI để được hỗ trợ từ A đến Z.",
      callBtn: "📞 Đặt lịch hẹn qua điện thoại: 0507-1472-2428"
    }
  };

  const activeContent = trans[lang] || trans.ko;

  const [deskImage, setDeskImage] = useState<string>(() => {
    return localStorage.getItem("visa_friend_office_desk") || defaultWorkspaceImg;
  });
  const [deskFallbackUsed, setDeskFallbackUsed] = useState(false);

  const [meetingImage, setMeetingImage] = useState<string>(() => {
    return localStorage.getItem("visa_friend_office_meeting") || defaultMeetingImg;
  });
  const [meetingFallbackUsed, setMeetingFallbackUsed] = useState(false);

  // Fetch images from server on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/office/images");
        if (res.ok) {
          const data = await res.json();
          if (data.deskImage) {
            setDeskImage(data.deskImage);
            localStorage.setItem("visa_friend_office_desk", data.deskImage);
          }
          if (data.meetingImage) {
            setMeetingImage(data.meetingImage);
            localStorage.setItem("visa_friend_office_meeting", data.meetingImage);
          }
        }
      } catch (err) {
        console.error("Error loading remote office images:", err);
      }
    };
    fetchImages();
  }, []);

  const deskInputRef = useRef<HTMLInputElement>(null);
  const meetingInputRef = useRef<HTMLInputElement>(null);

  const handleDeskError = () => {
    if (!deskFallbackUsed) {
      setDeskImage(fallbackDeskImg);
      setDeskFallbackUsed(true);
    }
  };

  const handleMeetingError = () => {
    if (!meetingFallbackUsed) {
      setMeetingImage(fallbackMeetingImg);
      setMeetingFallbackUsed(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "desk" | "meeting") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // Optimistic update
        if (type === "desk") {
          localStorage.setItem("visa_friend_office_desk", base64String);
          setDeskImage(base64String);
        } else {
          localStorage.setItem("visa_friend_office_meeting", base64String);
          setMeetingImage(base64String);
        }

        try {
          const token = localStorage.getItem("visa_friend_admin_token");
          const res = await fetch("/api/office/images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ type, base64: base64String })
          });
          if (!res.ok) {
            console.error("Failed to upload image to server database");
          }
        } catch (err) {
          console.error("Failed to upload image to server database:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = async (type: "desk" | "meeting") => {
    if (type === "desk") {
      localStorage.removeItem("visa_friend_office_desk");
      setDeskImage(defaultWorkspaceImg);
      setDeskFallbackUsed(false);
    } else {
      localStorage.removeItem("visa_friend_office_meeting");
      setMeetingImage(defaultMeetingImg);
      setMeetingFallbackUsed(false);
    }

    try {
      const token = localStorage.getItem("visa_friend_admin_token");
      await fetch(`/api/office/images/${type}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Failed to delete image on server:", err);
    }
  };

  const spaces = [
    {
      title: "행정사 집무 및 비자 처리실 (Main Workspace)",
      image: deskImage,
      onError: handleDeskError,
      type: "desk" as const,
      description: "법무부 출입국 대행기관 정식 업무와 외국인 비자 심사 서류 처리가 상시 이루어지는 핵심 집무 공간입니다.",
      features: [
        "법무부 출입국민원 공식 연계 업무를 위한 보안 인증 설비 완비",
        "신속하고 오차 없는 비자 요건 진단 및 분석을 위한 다중 모니터 시스템",
        "개인정보보호법에 의거한 의뢰인 민감 신원 자료 이중 암호 보관실 운영",
        "제조업, IT, 농어업 고용 기업체들과의 실시간 연계를 위한 업무망 가동"
      ],
      badge: "보안·사무 공간",
      badgeColor: "bg-blue-900/90 text-sky-300"
    },
    {
      title: "1:1 집중 심층 상담실 (Private Consultation Lounge)",
      image: meetingImage,
      onError: handleMeetingError,
      type: "meeting" as const,
      description: "의뢰인의 민감한 권리 구제 사안(음주운전, 불법체류 사범심사 등)과 취업 연계 상담이 아늑하고 프라이빗하게 보장되는 전용 라운지입니다.",
      features: [
        "철저한 사생활 및 비밀 보호가 가능한 독립형 단독 상담 설계",
        "대형 스마트 화면을 통해 의뢰인의 비자 예측 점수 및 구제 성공율 시각적 상담 시연",
        "내방 상담 고객들의 정서적 안정과 안락한 대기를 위한 고풍스러운 유화 및 가구 배치",
        "베트남어, 몽골어, 영어, 크메르어 등 전문 통역 파트너 합동 상담 테이블 완비"
      ],
      badge: "비밀보장 상담실",
      badgeColor: "bg-emerald-900/90 text-emerald-300"
    }
  ];

  return (
    <section id="office-tour" className="py-20 bg-slate-50 border-y border-slate-200/60">
      {/* Hidden File Upload Inputs for Admin */}
      {isAdmin && (
        <>
          <input 
            type="file" 
            ref={deskInputRef} 
            onChange={(e) => handleFileUpload(e, "desk")} 
            accept="image/*" 
            className="hidden" 
          />
          <input 
            type="file" 
            ref={meetingInputRef} 
            onChange={(e) => handleFileUpload(e, "meeting")} 
            accept="image/*" 
            className="hidden" 
          />
        </>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-blue-700" />
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
              delay: 0.6
            }}
          >
            {activeContent.titlePre} <span className="text-blue-800">{activeContent.titlePost}</span>
          </motion.h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {activeContent.desc}
          </p>
        </div>

        {/* Space Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16" id="office-spaces-grid">
          {spaces.map((space, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/70 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container with overlays */}
              <div className="relative h-[280px] sm:h-[350px] overflow-hidden bg-slate-950 shrink-0 group">
                <img 
                  src={space.image} 
                  alt={space.title}
                  onError={space.onError}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                
                {/* Badge Overlay */}
                <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wide shadow-md ${space.badgeColor}`}>
                  {space.badge}
                </span>

                {/* Micro hover indicator / Action Buttons */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => {
                          if (space.type === "desk") {
                            deskInputRef.current?.click();
                          } else {
                            meetingInputRef.current?.click();
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white backdrop-blur-sm px-3 py-1.5 rounded-xl border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        title="실제 사진 업로드"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        실제사진 넣기
                      </button>

                      {(localStorage.getItem(`visa_friend_office_${space.type}`) || space.image.startsWith("data:")) && (
                        <button 
                          onClick={() => handleReset(space.type)}
                          className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 backdrop-blur-sm p-1.5 rounded-xl border border-white/10 text-xs font-bold transition-all shadow-md cursor-pointer"
                          title="기본 이미지로 복원"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Text Description and Bullet List */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between text-left space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <span className="text-blue-700 font-bold font-mono">0{idx + 1}.</span> {space.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {space.description}
                  </p>
                </div>

                {/* Features Check List */}
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">주요 운영 설비 및 수칙</p>
                  <ul className="space-y-2.5">
                    {space.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Location & Directions Card */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl text-white p-6 sm:p-10 shadow-xl border border-slate-800 text-left relative overflow-hidden" id="office-directions-card">
          {/* Subtle decoration */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Guide Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> {activeContent.locTitle}
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight">{activeContent.locHeading}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeContent.locDesc}
                </p>
              </div>

              {/* Transport Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                  <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-100">{activeContent.addrTitle}</p>
                    <p className="text-slate-300 mt-1 leading-normal">
                      {activeContent.addrValue}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                  <Footprints className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-100">{activeContent.subwayTitle}</p>
                    <p className="text-slate-300 mt-1 leading-normal">
                      {activeContent.subwayValue}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                  <Car className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-100">{activeContent.carTitle}</p>
                    <p className="text-slate-300 mt-1 leading-normal">
                      {activeContent.carValue}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                  <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-100">{activeContent.timeTitle}</p>
                    <p className="text-slate-300 mt-1 leading-normal">
                      {activeContent.timeValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick RSVP CTA Panel */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-800/80 flex items-center justify-center mx-auto border border-blue-700/50">
                <Clock className="w-5 h-5 text-sky-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{activeContent.reserveTitle}</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {activeContent.reserveDesc}
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href="tel:0507-1472-2428"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all"
                >
                  {activeContent.callBtn}
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
