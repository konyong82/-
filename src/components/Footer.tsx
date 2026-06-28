import { Shield, Mail, Phone, MapPin, ExternalLink, Calendar, MessageSquare } from "lucide-react";
import logoImg from "../assets/images/visa_friend_blue_mint_logo_1782662971714.jpg";

interface FooterProps {
  lang?: "ko" | "en" | "ja" | "zh" | "vi";
}

export default function Footer({ lang = "ko" }: FooterProps) {
  const trans = {
    ko: {
      brandName: "비자친구",
      brandSub: "이건행정사&직업소개소",
      desc: "비자친구 이건행정사사무소 및 직업소개소는 법무부 출입국민원 공식 등록 대행기관이자 공인 유료직업소개 등록 기관입니다. 외국인의 합법적 국내 정착 및 강소기업 고용 연계를 전문으로 조력합니다.",
      bizNo: "사업자등록번호: 876-22-01863",
      contactTitle: "상담 및 업무 문의",
      phone: "대표 전화: 0507-1472-2428",
      email: "이메일: kon1122@naver.com",
      address: "부산시 금정구 중앙대로1985번길 54, 2층",
      directions: "(남산역 1번 출구 다이소 건물 옆길로 직진 도보 10분)",
      hoursTitle: "사무소 운영 안내",
      weekday: "평일: 오전 9시 - 오후 6시",
      hoursDesc: "주말 및 공휴일은 휴무이며, 의뢰인 상담의 질적 유지를 위해 모든 내방 상담은 **사전 예약제**로 운영하고 있습니다.",
      kakao: "카카오톡 1:1 빠른상담",
      copyright: "© 2026 비자친구 이건행정사 & 직업소개소. All Rights Reserved. 대표행정사: 이건.",
      terms: "이용약관",
      privacy: "개인정보처리방침"
    },
    en: {
      brandName: "VisaFriend",
      brandSub: "Keon Admin & Job Agency",
      desc: "VisaFriend Keon Administrative Agency & Job Agency is officially registered under the Ministry of Justice for immigration affairs and is an authorized job placement agency. We facilitate legal domestic settlement and hiring.",
      bizNo: "Business Registration No: 876-22-01863",
      contactTitle: "Inquiries & Consultations",
      phone: "Representative Phone: 0507-1472-2428",
      email: "Email: kon1122@naver.com",
      address: "54, Jungang-daero 1985beon-gil, Geumjeong-gu, Busan, 2nd Floor",
      directions: "(10-minute straight walk along the side road of the Daiso building from Namsan Station Exit 1)",
      hoursTitle: "Business Hours",
      weekday: "Weekdays: 9:00 AM - 6:00 PM",
      hoursDesc: "Closed on weekends & national holidays. To maintain high-quality consulting, all office visits are by **prior reservation only**.",
      kakao: "KakaoTalk 1:1 Fast Chat",
      copyright: "© 2026 VisaFriend Keon Admin & Job Agency. All Rights Reserved. General Admin: Keon Lee.",
      terms: "Terms of Service",
      privacy: "Privacy Policy"
    },
    ja: {
      brandName: "ビザフレンド",
      brandSub: "イ・ゴン行政書士＆職業紹介所",
      desc: "ビザフレンド・イ・ゴン行政書士事務所および職業紹介所は、法務部出入国請願の公式登録代行機関であり、公認の有料職業紹介登録機関です。外国人の合法的な国内定住と優良企業への就職支援を専門としています。",
      bizNo: "事業者登録番号: 876-22-01863",
      contactTitle: "相談および業務のお問い合わせ",
      phone: "代表電話: 0507-1472-2428",
      email: "Eメール: kon1122@naver.com",
      address: "釜山市金井区中央大路1985番吉54、2階",
      directions: "（南山駅1番出口、ダイソービルの横の道を直進徒歩10分）",
      hoursTitle: "事務所運営のご案内",
      weekday: "平日: 午前9時 - 午後6時",
      hoursDesc: "土日祝日は休務日であり、相談の質維持のため、すべての来訪相談は**事前予約制**で運営しております。",
      kakao: "カカオトーク 1:1 迅速相談",
      copyright: "© 2026 ビザフレンド イ・ゴン行政書士＆職業紹介所. All Rights Reserved. 代表行政書士: イ・ゴン.",
      terms: "利用規約",
      privacy: "個人情報処理方針"
    },
    zh: {
      brandName: "VisaFriend",
      brandSub: "李健行政士&职业介绍所",
      desc: "VisaFriend李健行政士事务所及职业介绍所是韩国法务部官方出入境事务注册代办机构，及公认的收费职业介绍注册机构。我们专注于协助外国人合法定居并对接在韩优秀企业雇佣。",
      bizNo: "企业注册号: 876-22-01863",
      contactTitle: "咨询及业务联系",
      phone: "代表电话: 0507-1472-2428",
      email: "电子邮箱: kon1122@naver.com",
      address: "釜山市金井区中央大路1985街54, 2楼",
      directions: "（南山站1号出口 沿大创(Daiso)大楼旁路直行 步行10分钟）",
      hoursTitle: "事务所运营时间",
      weekday: "工作日: 上午9:00 - 下午6:00",
      hoursDesc: "周末及公休日休息。为了确保高水准的业务指导，所有到店咨询均实行**预约制**。",
      kakao: "KakaoTalk 1:1 快速咨询",
      copyright: "© 2026 VisaFriend 李健行政士 & 职业介绍所. 版权所有. 首席行政士: 李健.",
      terms: "使用条款",
      privacy: "个人信息处理方针"
    },
    vi: {
      brandName: "VisaFriend",
      brandSub: "VP Hành chính & Giới thiệu việc làm Keon",
      desc: "Văn phòng Hành chính & Giới thiệu việc làm VisaFriend Keon là đại lý đăng ký chính thức của Bộ Tư pháp cho các dịch vụ nhập cảnh và là cơ quan giới thiệu việc làm có phí được chứng nhận. Chúng tôi hỗ trợ người nước ngoài ổn định cuộc sống và tìm việc làm tại các doanh nghiệp vừa và nhỏ.",
      bizNo: "Mã số doanh nghiệp: 876-22-01863",
      contactTitle: "Yêu cầu Tư vấn & Công việc",
      phone: "Điện thoại đại diện: 0507-1472-2428",
      email: "Email: kon1122@naver.com",
      address: "Tầng 2, 54 Jungang-daero 1985beon-gil, Geumjeong-gu, Busan",
      directions: "(Từ Lối ra số 1 Ga Namsan, đi thẳng theo lối đi bên cạnh tòa nhà Daiso, đi bộ 10 phút)",
      hoursTitle: "Hướng dẫn hoạt động văn phòng",
      weekday: "Ngày thường: 9:00 sáng - 6:00 chiều",
      hoursDesc: "Nghỉ Thứ bảy, Chủ nhật và ngày lễ. Để đảm bảo chất lượng tư vấn tốt nhất, tất cả các buổi gặp trực tiếp tại văn phòng đều hoạt động theo hình thức **đặt lịch hẹn trước**.",
      kakao: "KakaoTalk Tư vấn nhanh 1:1",
      copyright: "© 2026 Văn phòng Hành chính & Giới thiệu việc làm VisaFriend Keon. Bảo lưu mọi quyền. Đại diện hành chính: Keon Lee.",
      terms: "Điều khoản sử dụng",
      privacy: "Chính sách bảo mật"
    }
  };

  const activeContent = trans[lang] || trans.ko;

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core footer details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand/Legal */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-white flex items-center justify-center shrink-0">
                <img 
                  src={logoImg} 
                  alt="비자친구 로고" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white font-sans leading-tight">
                  {activeContent.brandName} <span className="text-blue-400 text-xs font-semibold">{activeContent.brandSub}</span>
                </span>
                <span className="text-[8px] font-black tracking-widest text-[#2dd4bf] font-mono bg-[#111827] px-1 py-0.5 mt-0.5 rounded border border-slate-800 leading-none uppercase max-w-max">
                  visa79
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {activeContent.desc}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1.5" id="footer-official-badges">
              <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {activeContent.bizNo}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{activeContent.contactTitle}</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-slate-300 font-semibold">{activeContent.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{activeContent.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  {activeContent.address} <br />
                  <span className="text-sky-300 font-medium">{activeContent.directions}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Business Hours & Quick Callouts */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{activeContent.hoursTitle}</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{activeContent.weekday}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px] whitespace-pre-line">
                {activeContent.hoursDesc}
              </p>
              
              <div className="pt-1.5">
                <a
                  href="https://pf.kakao.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-[10px] transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-slate-900" />
                  {activeContent.kakao}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar Divider */}
        <div className="w-full h-px bg-slate-800 mb-8"></div>

        {/* Copryight & Disclaimers */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="text-center sm:text-left">
            {activeContent.copyright}
          </p>
          <div className="flex gap-4">
            <a href="#services" className="hover:text-slate-300 transition-colors">{activeContent.terms}</a>
            <span className="text-slate-700">|</span>
            <a href="#qna" className="hover:text-slate-300 transition-colors font-semibold text-slate-400">{activeContent.privacy}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
