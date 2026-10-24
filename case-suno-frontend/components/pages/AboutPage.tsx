"use client";

import React from "react";
import { ArrowRight, Eye, HeartHandshake, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage, type Language } from "../../context/LanguageContext";
import { useSiteActions } from "../../context/SiteActionsContext";
import { CONTAINER, CtaBand, GREEN, PageIntro, SiteShell, sectionHeading, useIsIndic } from "../SiteShell";
import { Reveal } from "../Reveal";

type L3 = Record<Language, string>;

const A = {
  kicker: { en: "Our Story & Philosophy", hi: "हमारी कहानी और विचार", gu: "અમારી વાર્તા અને વિચારધારા" } as L3,
  title: { en: "About CASE SUNO", hi: "CASE SUNO के बारे में", gu: "CASE SUNO વિશે" } as L3,
  desc: {
    en: "The calm, structured bridge between confusion and progress.",
    hi: "असमंजस और समाधान के बीच एक शांत, व्यवस्थित सेतु।",
    gu: "મૂંઝવણ અને પ્રગતિ વચ્ચેનો શાંત, વ્યવસ્થિત સેતુ.",
  } as L3,
  quote: {
    en: "“You may not always know the answers. But you can always take the next step. That's what CASE SUNO is here for.”",
    hi: "“हो सकता है आपके पास हमेशा सभी उत्तर न हों। लेकिन आप हमेशा अगला कदम उठा सकते हैं। CASE SUNO इसी के लिए उपस्थित है।”",
    gu: "“તમારી પાસે કદાચ હંમેશા જવાબો ન હોય. પરંતુ તમે હંમેશા આગલું પગલું ભરી શકો છો. CASE SUNO એના માટે જ હાજર છે.”",
  } as L3,
  whyTitle: { en: "Why We Started", hi: "हमने शुरुआत क्यों की", gu: "અમે શા માટે શરૂઆત કરી" } as L3,
  p1: {
    en: "Individuals, families, and business owners often face unexpected legal notices, property ambiguities, family settlements, and commercial disagreements.",
    hi: "व्यक्ति, परिवार और व्यवसायी अक्सर अप्रत्याशित कानूनी नोटिस, संपत्ति की अस्पष्टता, पारिवारिक समझौते और व्यावसायिक मतभेदों का सामना करते हैं।",
    gu: "વ્યક્તિઓ, પરિવારો અને વ્યવસાયિકો ઘણીવાર અણધારી કાનૂની નોટિસ, મિલકતની અસ્પષ્ટતા, વારસાઈ વહેંચણી અને વેપારી મતભેદોનો સામનો કરતા હોય છે.",
  } as L3,
  p2: {
    en: "Often, the hardest hurdle isn't the legal dispute itself—it's the initial paralysis. Where do I go? Who can I trust? Will I get overcharged? What documents do I actually need?",
    hi: "अक्सर सबसे बड़ी बाधा विवाद नहीं होता—बल्कि प्रारंभिक भ्रम और असमंजस होता है: मुझे कहाँ जाना चाहिए? किस पर भरोसा करें? किन दस्तावेजों की आवश्यकता होगी? क्या अत्यधिक शुल्क लिया जाएगा?",
    gu: "મોટેભાગે, સૌથી મોટો અવરોધ વિવાદ નથી હોતો—પરંતુ શરૂઆતની મૂંઝવણ હોય છે: મારે ક્યાં જવું? કોના પર વિશ્વાસ કરવો? કયા કાગળોની જરૂર પડશે? શું વધારે ફી વસૂલવામાં આવશે?",
  } as L3,
  p3: {
    en: "was founded with a singular, quiet purpose: to be the calm, structured bridge between confusion and progress. We do not solicit litigation. Instead, we listen deeply, organize your paperwork, clarify realistic options, and introduce you to verified, independent professionals only when necessary.",
    hi: "की स्थापना एक स्पष्ट उद्देश्य के साथ हुई है: असमंजस और समाधान के बीच एक शांत, व्यवस्थित सेतु बनना। हम अनावश्यक विवादों को बढ़ावा नहीं देते। हम आपकी बात सुनते हैं, कागजात व्यवस्थित करते हैं, व्यावहारिक विकल्प स्पष्ट करते हैं और जरूरत पड़ने पर ही स्वतंत्र विशेषज्ञों से संपर्क कराते हैं।",
    gu: "ની સ્થાપના એક જ સ્પષ્ટ હેતુ સાથે થઈ છે: મૂંઝવણ અને પ્રગતિ વચ્ચેનો શાંત, વ્યવસ્થિત સેતુ બનવું. અમે કાયદાકીય તકરારોને પ્રોત્સાહન આપતા નથી. અમે તમારી વાત સાંભળીએ છીએ, કાગળો વ્યવસ્થિત કરીએ છીએ, વાસ્તવિક વિકલ્પો સ્પષ્ટ કરીએ છીએ અને જરૂર જણાય ત્યારે જ સ્વતંત્ર વ્યાવસાયિકો સાથે જોડીએ છીએ.",
  } as L3,
  howTitle: { en: "How We Help", hi: "हम कैसे मदद करते हैं", gu: "અમે કેવી રીતે મદદ કરીએ છીએ" } as L3,
  commitTitle: { en: "Our Guiding Commitments", hi: "हमारी मुख्य प्रतिबद्धताएं", gu: "અમારી મુખ્ય પ્રતિબદ્ધતાઓ" } as L3,
  start: { en: "Start Your Enquiry", hi: "अपनी पूछताछ शुरू करें", gu: "પૂછપરછ શરૂ કરો" } as L3,
};

const COMMITMENTS = [
  {
    icon: ShieldCheck,
    title: { en: "Absolute Privacy", hi: "पूर्ण गोपनीयता", gu: "સંપૂર્ણ ગોપનીયતા" } as L3,
    desc: {
      en: "Your situation stays strictly confidential and unshared.",
      hi: "आपकी स्थिति पूर्णतः निजी और सुरक्षित रहती है।",
      gu: "તમારી પરિસ્થિતિ સંપૂર્ણ ખાનગી અને સુરક્ષિત રહે છે.",
    } as L3,
  },
  {
    icon: Eye,
    title: { en: "Zero Hidden Fees", hi: "कोई छिपा शुल्क नहीं", gu: "શૂન્ય છુપી ફી" } as L3,
    desc: {
      en: "Clear upfront costs with no misleading retainers.",
      hi: "पारदर्शी शुल्क, कोई अप्रत्याशित खर्च नहीं।",
      gu: "પારદર્શક કિંમતો, કોઈ અણધાર્યા ખર્ચ નહીં.",
    } as L3,
  },
  {
    icon: HeartHandshake,
    title: { en: "Independent Vetting", hi: "सत्यापित विशेषज्ञ", gu: "સ્વતંત્ર ચકાસણી" } as L3,
    desc: {
      en: "Referrals based on merit, competence, and your exact case fit.",
      hi: "योग्यता और अनुभव के आधार पर ही विशेषज्ञों से परिचय।",
      gu: "લાયકાત અને યોગ્યતાના આધારે જ નિષ્ણાતો સાથે જોડાણ.",
    } as L3,
  },
];

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { openEnquiry } = useSiteActions();
  const isIndic = useIsIndic();
  const tr = (v: L3) => v[language];

  return (
    <SiteShell>
      <PageIntro icon={Sparkles} kicker={tr(A.kicker)} title={tr(A.title)} desc={tr(A.desc)} />

      {/* Quote */}
      <section className={`${CONTAINER} mt-10 sm:mt-14`}>
        <Reveal>
          <figure className="relative overflow-hidden rounded-2xl border border-[#262421] bg-[#161513] px-6 py-10 sm:px-12 sm:py-14 text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(circle at 85% 15%, rgba(201,164,92,0.35) 0%, transparent 55%)" }}
            />
            <Quote className="relative h-9 w-9 text-[#C9A45C]" />
            <blockquote
              className={`relative mt-5 max-w-4xl text-white ${
                isIndic ? "font-sans font-medium text-xl sm:text-2xl leading-relaxed" : "font-serif italic text-2xl sm:text-[2.2rem] leading-snug"
              }`}
            >
              {tr(A.quote)}
            </blockquote>
          </figure>
        </Reveal>
      </section>

      {/* Story + How we help */}
      <section className={`${CONTAINER} mt-12 sm:mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10`}>
        <Reveal className="lg:col-span-7">
          <article className="h-full rounded-2xl border border-[#E8E4DB] bg-white/90 p-6 sm:p-10 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(31,30,27,0.3)]">
            <h2 className={`text-[#1E1D1A] ${sectionHeading(isIndic)}`}>{tr(A.whyTitle)}</h2>
            <div className="mt-5 space-y-4 text-[15px] sm:text-[15.5px] leading-[1.8] text-[#3F3F3B]">
              <p>{tr(A.p1)}</p>
              <p>{tr(A.p2)}</p>
              <p>
                <strong className="font-bold text-[#1E1D1A]">CASE SUNO</strong> {tr(A.p3)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="cs-shine cs-press group relative mt-8 inline-flex min-h-[52px] items-center gap-2.5 overflow-hidden rounded-sm bg-[#1F1E1B] px-6 text-[14px] font-medium text-white shadow-[0_8px_0_-4px_#000,0_16px_30px_-14px_rgba(31,30,27,0.6)] cursor-pointer"
            >
              {tr(A.start)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </article>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={120}>
          <aside className="h-full rounded-2xl border border-[#E8E4DB] bg-[#F4EFE6]/80 p-6 sm:p-8">
            <h2 className={`text-[#1E1D1A] ${sectionHeading(isIndic)}`}>{tr(A.howTitle)}</h2>
            <ol className="mt-6 space-y-5">
              {t.process.steps.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(31,92,80,0.6)]"
                    style={{ background: GREEN }}
                  >
                    {s.step}
                  </span>
                  <div>
                    <span className="block text-[15px] font-semibold text-[#1E1D1A]">{s.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-[#6B655B]">{s.desc}</span>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </Reveal>
      </section>

      {/* Commitments */}
      <section className={`${CONTAINER} mt-12 sm:mt-16`}>
        <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C8479]">{tr(A.commitTitle)}</span>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COMMITMENTS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={i} delay={i * 90} className="h-full">
                <div className="group h-full rounded-2xl border border-[#E8E4DB] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#BFB6A6] hover:shadow-[0_22px_44px_-20px_rgba(31,30,27,0.35)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6EFEA] text-[#1F5C50] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-[#1F5C50] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-4 block text-[16px] font-semibold text-[#1E1D1A]">{tr(c.title)}</span>
                  <span className="mt-1.5 block text-[13.5px] leading-relaxed text-[#6B655B]">{tr(c.desc)}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
};