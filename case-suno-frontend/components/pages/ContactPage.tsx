"use client";

import React, { useState } from "react";
import { ArrowRight, Calendar, CheckCircle2, Mail, MessageSquareText, Phone } from "lucide-react";
import { useLanguage, type Language } from "../../context/LanguageContext";
import { useSiteActions } from "../../context/SiteActionsContext";
import { CONTAINER, GREEN, PageIntro, SiteShell, useIsIndic } from "../SiteShell";
import { Reveal } from "../Reveal";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, openWhatsApp } from "../contact";
import { WhatsAppIcon } from "../WhatsApp";

type L3 = Record<Language, string>;

const C = {
  kicker: { en: "Direct Assistance & Appointments", hi: "सीधी सहायता और अपॉइंटमेंट", gu: "સીધી સહાય અને એપોઇન્ટમેન્ટ" } as L3,
  title: { en: "Contact CASE SUNO", hi: "CASE SUNO से संपर्क करें", gu: "CASE SUNO નો સંપર્ક કરો" } as L3,
  desc: {
    en: "Call, message or request an appointment slot. Our coordinator usually responds within 2 business hours.",
    hi: "कॉल करें, संदेश भेजें या अपॉइंटमेंट स्लॉट का अनुरोध करें। हमारे समन्वयक आमतौर पर 2 व्यावसायिक घंटों में जवाब देते हैं।",
    gu: "કૉલ કરો, મેસેજ મોકલો અથવા એપોઇન્ટમેન્ટ સ્લોટની વિનંતી કરો. અમારા કોઓર્ડિનેટર સામાન્ય રીતે ૨ વ્યાવસાયિક કલાકમાં જવાબ આપે છે.",
  } as L3,
  callUs: { en: "Call us", hi: "कॉल करें", gu: "કૉલ કરો" } as L3,
  quickChat: { en: "Quick chat", hi: "त्वरित चैट", gu: "ઝડપી ચેટ" } as L3,
  emailSub: { en: "Confidential Dossiers", hi: "गोपनीय दस्तावेज ईमेल", gu: "ગોપનીય દસ્તાવેજ મેઇલ" } as L3,
  formTitle: { en: "Request an Appointment Slot", hi: "अपॉइंटमेंट स्लॉट के लिए अनुरोध करें", gu: "એપોઇન્ટમેન્ટ સ્લોટ માટે વિનંતી કરો" } as L3,
  name: { en: "Your Name *", hi: "आपका नाम *", gu: "તમારું નામ *" } as L3,
  namePh: { en: "e.g. Amit Desai", hi: "उदा. अमित देसाई", gu: "દા.ત. અમિત દેસાઈ" } as L3,
  phone: { en: "Phone Number *", hi: "फ़ोन नंबर *", gu: "ફોન નંબર *" } as L3,
  date: { en: "Preferred Date", hi: "पसंदीदा तारीख", gu: "પસંદગીની તારીખ" } as L3,
  confirm: { en: "Confirm Appointment Request", hi: "अपॉइंटमेंट अनुरोध की पुष्टि करें", gu: "એપોઇન્ટમેન્ટ વિનંતી કન્ફર્મ કરો" } as L3,
  invalidPhone: { en: "Please enter a valid mobile number.", hi: "कृपया मान्य मोबाइल नंबर दर्ज करें।", gu: "કૃપા કરીને માન્ય મોબાઇલ નંબર લખો." } as L3,
  received: { en: "Slot Request Received!", hi: "अनुरोध प्राप्त हुआ!", gu: "વિનંતી પ્રાપ્ત થઈ છે!" } as L3,
  edit: { en: "Edit details", hi: "विवरण बदलें", gu: "વિગતો બદલો" } as L3,
  sendWa: { en: "Send request on WhatsApp", hi: "व्हाट्सएप पर अनुरोध भेजें", gu: "વોટ્સએપ પર વિનંતી મોકલો" } as L3,
  nextTitle: { en: "What happens next", hi: "आगे क्या होता है", gu: "આગળ શું થાય છે" } as L3,
  brief: { en: "Fill Detailed Case Brief", hi: "विस्तृत केस विवरण भरें", gu: "વિસ્તૃત કેસ બ્રીફ ભરો" } as L3,
};

const NEXT_STEPS: { title: L3; desc: L3 }[] = [
  {
    title: { en: "Share your details", hi: "अपना विवरण साझा करें", gu: "તમારી વિગતો શેર કરો" },
    desc: {
      en: "Request a slot here, or send a detailed case brief.",
      hi: "यहां स्लॉट का अनुरोध करें या विस्तृत केस विवरण भेजें।",
      gu: "અહીં સ્લોટની વિનંતી કરો અથવા વિસ્તૃત કેસ બ્રીફ મોકલો.",
    },
  },
  {
    title: { en: "We contact you", hi: "हम आपसे संपर्क करते हैं", gu: "અમે તમારો સંપર્ક કરીએ છીએ" },
    desc: {
      en: "Our coordinator responds within 2 business hours on WhatsApp or phone.",
      hi: "हमारे समन्वयक 2 व्यावसायिक घंटों में व्हाट्सएप या फ़ोन पर जवाब देते हैं।",
      gu: "અમારા કોઓર્ડિનેટર ૨ વ્યાવસાયિક કલાકમાં વોટ્સએપ અથવા ફોન પર જવાબ આપે છે.",
    },
  },
  {
    title: { en: "Your session", hi: "आपका सत्र", gu: "તમારું સત્ર" },
    desc: {
      en: "A confidential video or phone session at a time that suits you.",
      hi: "आपकी सुविधा के समय एक गोपनीय वीडियो या फ़ोन सत्र।",
      gu: "તમારી અનુકૂળતાના સમયે ગોપનીય વિડીયો અથવા ફોન સત્ર.",
    },
  },
];

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { openEnquiry } = useSiteActions();
  const isIndic = useIsIndic();
  const tr = (v: L3) => v[language];

  const [booked, setBooked] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = contactPhone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      setError(tr(C.invalidPhone));
      return;
    }
    setError("");
    setBooked(true);
  };

  const sendOnWhatsApp = () =>
    openWhatsApp(
      `Hello CASE SUNO, I would like to request an appointment.\nName: ${contactName}\nPhone: ${contactPhone}\nPreferred date: ${preferredDate || "Earliest available"}`,
    );

  const receivedText = {
    en: `Our case coordinator will confirm your preferred timing (${preferredDate || "Upcoming opening"}) with ${contactName || "you"} at ${contactPhone}.`,
    hi: `हमारे समन्वयक आपके पसंदीदा समय (${preferredDate || "आगामी स्लॉट"}) की पुष्टि के लिए ${contactName || "आपसे"} ${contactPhone} पर संपर्क करेंगे।`,
    gu: `અમારા કોઓર્ડિનેટર તમારા અનુકૂળ સમય (${preferredDate || "આગામી સ્લોટ"}) ની પુષ્ટિ કરવા માટે ${contactName || "તમને"} ${contactPhone} પર સંપર્ક કરશે.`,
  }[language];

  const inputClass =
    "w-full rounded-lg border border-[#D5CFBF] bg-[#FAF9F6] px-3.5 py-3 text-[16px] sm:text-[14px] text-[#1E1D1A] transition-all outline-none focus:border-[#1F5C50]/60 focus:bg-white focus:ring-4 focus:ring-[#1F5C50]/10";
  const labelClass = "mb-1.5 block text-[12px] font-semibold text-[#4A453C]";

  const channelClass =
    "group flex h-full items-center gap-4 rounded-2xl border border-[#E8E4DB] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#BFB6A6] hover:shadow-[0_22px_44px_-20px_rgba(31,30,27,0.35)] active:scale-[0.98] cursor-pointer";
  const iconWrap =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6EFEA] text-[#1F5C50] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-white";

  return (
    <SiteShell>
      <PageIntro icon={MessageSquareText} kicker={tr(C.kicker)} title={tr(C.title)} desc={tr(C.desc)} />

      {/* Channels */}
      <section className={`${CONTAINER} mt-10 sm:mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3`}>
        <Reveal className="h-full">
          <a href={`tel:${PHONE_TEL}`} className={channelClass}>
            <span className={`${iconWrap} group-hover:bg-[#1F1E1B]`}>
              <Phone className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold text-[#1E1D1A]">{PHONE_DISPLAY}</span>
              <span className="block text-[12.5px] text-[#7A7468]">{tr(C.callUs)}</span>
            </span>
          </a>
        </Reveal>
        <Reveal className="h-full" delay={80}>
          <button type="button" onClick={() => openWhatsApp()} className={`${channelClass} w-full`}>
            <span className={`${iconWrap} group-hover:bg-[#25D366]`}>
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-[#1E1D1A]">WhatsApp</span>
              <span className="block text-[12.5px] text-[#7A7468]">{tr(C.quickChat)}</span>
            </span>
          </button>
        </Reveal>
        <Reveal className="h-full" delay={160}>
          <a href={`mailto:${EMAIL}`} className={channelClass}>
            <span className={`${iconWrap} group-hover:bg-[#1F1E1B]`}>
              <Mail className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold text-[#1E1D1A]">{EMAIL}</span>
              <span className="block text-[12.5px] text-[#7A7468]">{tr(C.emailSub)}</span>
            </span>
          </a>
        </Reveal>
      </section>

      {/* Form + next steps */}
      <section className={`${CONTAINER} mt-8 sm:mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10`}>
        <Reveal className="lg:col-span-7">
          <div className="h-full rounded-2xl border border-[#E8E4DB] bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(31,30,27,0.3)]">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5" style={{ color: GREEN }} />
              <h2 className={`text-[#1E1D1A] ${isIndic ? "font-sans font-semibold text-lg sm:text-xl" : "font-serif font-semibold text-[1.5rem] sm:text-[1.7rem]"}`}>
                {tr(C.formTitle)}
              </h2>
            </div>

            {booked ? (
              <div className="cs-fade mt-6 space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-[#CDE3C9] bg-[#EEF5EC] p-4 text-[13.5px] text-[#2E682A]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <span className="block text-[15px] font-semibold">{tr(C.received)}</span>
                    <span>{receivedText}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setBooked(false)}
                    className="rounded-sm border border-[#D9D3C7] px-5 py-2.5 text-[13px] text-[#5C564C] transition-all hover:border-[#1E1D1A] hover:text-black active:scale-[0.97] cursor-pointer"
                  >
                    {tr(C.edit)}
                  </button>
                  <button
                    type="button"
                    onClick={sendOnWhatsApp}
                    className="group inline-flex items-center justify-center gap-2 rounded-sm bg-[#1DA851] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#178F45] hover:shadow-md active:scale-[0.97] cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    {tr(C.sendWa)}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div role="alert" className="cs-slide-down rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-800">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ct-name" className={labelClass}>{tr(C.name)}</label>
                    <input
                      id="ct-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={tr(C.namePh)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className={labelClass}>{tr(C.phone)}</label>
                    <input
                      id="ct-phone"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98..."
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ct-date" className={labelClass}>{tr(C.date)}</label>
                    <input
                      id="ct-date"
                      type="date"
                      min={todayISO()}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="cs-shine cs-press group relative inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-sm bg-[#1F1E1B] px-7 text-[14px] font-medium text-white shadow-[0_8px_0_-4px_#000,0_16px_30px_-14px_rgba(31,30,27,0.6)] cursor-pointer"
                >
                  {tr(C.confirm)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={120}>
          <aside className="h-full rounded-2xl border border-[#E8E4DB] bg-[#F4EFE6]/80 p-6 sm:p-8">
            <h2 className={`text-[#1E1D1A] ${isIndic ? "font-sans font-semibold text-lg sm:text-xl" : "font-serif font-semibold text-[1.5rem] sm:text-[1.7rem]"}`}>
              {tr(C.nextTitle)}
            </h2>
            <ol className="mt-6 space-y-5">
              {NEXT_STEPS.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                    style={{ background: GREEN }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="block text-[15px] font-semibold text-[#1E1D1A]">{tr(s.title)}</span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-[#6B655B]">{tr(s.desc)}</span>
                  </div>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => openEnquiry()}
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F5C50] px-5 py-3 text-[13.5px] font-medium text-white transition-all hover:bg-[#174A41] active:scale-[0.98] cursor-pointer"
            >
              {tr(C.brief)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="mt-5 flex items-center gap-2 text-[12px] text-[#6B655B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" aria-hidden="true" />
              {t.footer.locationNotice}
            </div>
          </aside>
        </Reveal>
      </section>
    </SiteShell>
  );
};