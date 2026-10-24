"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bell, FileSearch, Hash, Lock, MessageSquareText, Phone, Wallet } from "lucide-react";
import { useLanguage, type Language } from "../../context/LanguageContext";
import { useSiteActions } from "../../context/SiteActionsContext";
import { CONTAINER, GREEN, PageIntro, SiteShell, useIsIndic } from "../SiteShell";
import { Reveal } from "../Reveal";
import { WhatsAppIcon } from "../WhatsApp";

type L3 = Record<Language, string>;

const T = {
  kicker: { en: "Request Status", hi: "अनुरोध की स्थिति", gu: "વિનંતીની સ્થિતિ" } as L3,
  title: { en: "Track Your Request", hi: "अपना अनुरोध ट्रैक करें", gu: "તમારી વિનંતી ટ્રેક કરો" } as L3,
  desc: {
    en: "Enter the reference number you received after submitting your enquiry, along with the mobile number you used.",
    hi: "पूछताछ सबमिट करने के बाद मिला संदर्भ नंबर और आपके द्वारा दिया गया मोबाइल नंबर दर्ज करें।",
    gu: "પૂછપરછ સબમિટ કર્યા પછી મળેલો સંદર્ભ નંબર અને તમે આપેલો મોબાઇલ નંબર દાખલ કરો.",
  } as L3,
  formTitle: { en: "Find your request", hi: "अपना अनुरोध खोजें", gu: "તમારી વિનંતી શોધો" } as L3,
  reference: { en: "Reference Number *", hi: "संदर्भ नंबर *", gu: "સંદર્ભ નંબર *" } as L3,
  refPh: { en: "e.g. CS-XXXXXX", hi: "उदा. CS-XXXXXX", gu: "દા.ત. CS-XXXXXX" } as L3,
  phone: { en: "Mobile Number *", hi: "मोबाइल नंबर *", gu: "મોબાઇલ નંબર *" } as L3,
  submit: { en: "Check Status", hi: "स्थिति देखें", gu: "સ્થિતિ જુઓ" } as L3,
  checking: { en: "Checking…", hi: "जांच हो रही है…", gu: "તપાસી રહ્યા છીએ…" } as L3,
  required: {
    en: "Please enter both your reference number and mobile number.",
    hi: "कृपया संदर्भ नंबर और मोबाइल नंबर दोनों दर्ज करें।",
    gu: "કૃપા કરીને સંદર્ભ નંબર અને મોબાઇલ નંબર બંને દાખલ કરો.",
  } as L3,
  notFound: {
    en: "No request found with these details. Please check and try again.",
    hi: "इन विवरणों से कोई अनुरोध नहीं मिला। कृपया जांचें और फिर से प्रयास करें।",
    gu: "આ વિગતો સાથે કોઈ વિનંતી મળી નથી. કૃપા કરીને તપાસીને ફરી પ્રયાસ કરો.",
  } as L3,
  tooMany: {
    en: "Too many attempts. Please try again in a few minutes.",
    hi: "बहुत अधिक प्रयास। कृपया कुछ मिनट बाद फिर से प्रयास करें।",
    gu: "ઘણા બધા પ્રયાસો. કૃપા કરીને થોડી મિનિટ પછી ફરી પ્રયાસ કરો.",
  } as L3,
  failed: {
    en: "Something went wrong. Please try again, or contact us on WhatsApp.",
    hi: "कुछ गलत हो गया। कृपया फिर से प्रयास करें या व्हाट्सएप पर संपर्क करें।",
    gu: "કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો અથવા વોટ્સએપ પર સંપર્ક કરો.",
  } as L3,
  secure: {
    en: "For your privacy, both details must match before any information is shown.",
    hi: "आपकी गोपनीयता के लिए, जानकारी दिखाने से पहले दोनों विवरणों का मेल होना आवश्यक है।",
    gu: "તમારી ગોપનીયતા માટે, કોઈ માહિતી બતાવતા પહેલાં બંને વિગતો મેળ ખાવી જરૂરી છે.",
  } as L3,
  seeTitle: { en: "What you can see", hi: "आप क्या देख सकते हैं", gu: "તમે શું જોઈ શકો છો" } as L3,
  lostTitle: { en: "Lost your reference number?", hi: "संदर्भ नंबर खो गया?", gu: "સંદર્ભ નંબર ખોવાઈ ગયો?" } as L3,
  lostBody: {
    en: "It was shown after you submitted your enquiry. If you can't find it, message us on WhatsApp from the same number and we'll help.",
    hi: "यह पूछताछ सबमिट करने के बाद दिखाया गया था। यदि नहीं मिल रहा, तो उसी नंबर से व्हाट्सएप करें, हम मदद करेंगे।",
    gu: "તે પૂછપરછ સબમિટ કર્યા પછી બતાવવામાં આવ્યો હતો. જો ન મળે, તો એ જ નંબર પરથી વોટ્સએપ કરો, અમે મદદ કરીશું.",
  } as L3,
  noEnquiry: { en: "Haven't submitted an enquiry yet?", hi: "अभी तक पूछताछ नहीं की?", gu: "હજુ પૂછપરછ નથી કરી?" } as L3,
  start: { en: "Start an Enquiry", hi: "पूछताछ शुरू करें", gu: "પૂછપરછ શરૂ કરો" } as L3,
};

const FEATURES: { icon: typeof Bell; title: L3; desc: L3 }[] = [
  {
    icon: Bell,
    title: { en: "Current status", hi: "वर्तमान स्थिति", gu: "હાલની સ્થિતિ" },
    desc: {
      en: "Where your request stands right now.",
      hi: "आपका अनुरोध अभी किस चरण में है।",
      gu: "તમારી વિનંતી હાલમાં કયા તબક્કે છે.",
    },
  },
  {
    icon: MessageSquareText,
    title: { en: "Updates & messages", hi: "अपडेट और संदेश", gu: "અપડેટ અને સંદેશા" },
    desc: {
      en: "Notes and replies from your coordinator.",
      hi: "आपके समन्वयक के नोट्स और जवाब।",
      gu: "તમારા કોઓર્ડિનેટરની નોંધો અને જવાબો.",
    },
  },
  {
    icon: Wallet,
    title: { en: "Fees & payments", hi: "शुल्क और भुगतान", gu: "ફી અને ચુકવણી" },
    desc: {
      en: "Any agreed fee and its payment status.",
      hi: "तय शुल्क और उसकी भुगतान स्थिति।",
      gu: "નક્કી થયેલી ફી અને તેની ચુકવણી સ્થિતિ.",
    },
  },
];

export const TrackLookupPage: React.FC = () => {
  const { language } = useLanguage();
  const { openEnquiry, openWhatsAppDrawer } = useSiteActions();
  const router = useRouter();
  const isIndic = useIsIndic();
  const tr = (v: L3) => v[language];

  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || phone.replace(/\D/g, "").length < 10) {
      setError(tr(T.required));
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/track-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference.trim(), phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && typeof data.path === "string") {
        router.push(data.path);
        return; // keep the button in "Checking…" while the next page loads
      }

      setError(res.status === 404 ? tr(T.notFound) : res.status === 429 ? tr(T.tooMany) : res.status === 400 ? tr(T.required) : tr(T.failed));
      setLoading(false);
    } catch {
      setError(tr(T.failed));
      setLoading(false);
    }
  };

  const inputWrap = "relative";
  const inputClass =
    "w-full rounded-lg border border-[#D5CFBF] bg-[#FAF9F6] py-3 pl-11 pr-3.5 text-[16px] sm:text-[14px] text-[#1E1D1A] transition-all outline-none placeholder:text-[#9C9588] focus:border-[#1F5C50]/60 focus:bg-white focus:ring-4 focus:ring-[#1F5C50]/10";
  const iconClass = "pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#8C8479]";
  const labelClass = "mb-1.5 block text-[12px] font-semibold text-[#4A453C]";
  const cardHeading = isIndic ? "font-sans font-semibold text-lg sm:text-xl" : "font-serif font-semibold text-[1.5rem] sm:text-[1.7rem]";

  return (
    <SiteShell>
      <PageIntro icon={FileSearch} kicker={tr(T.kicker)} title={tr(T.title)} desc={tr(T.desc)} />

      <section className={`${CONTAINER} mt-10 sm:mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10`}>
        {/* Lookup form */}
        <Reveal className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="h-full rounded-2xl border border-[#E8E4DB] bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(31,30,27,0.3)]"
          >
            <h2 className={`text-[#1E1D1A] ${cardHeading}`}>{tr(T.formTitle)}</h2>

            {error && (
              <div role="alert" className="cs-slide-down mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-800">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="trk-ref" className={labelClass}>{tr(T.reference)}</label>
                <div className={inputWrap}>
                  <Hash className={iconClass} />
                  <input
                    id="trk-ref"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    value={reference}
                    onChange={(e) => {
                      setReference(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder={tr(T.refPh)}
                    className={`${inputClass} font-mono uppercase tracking-wide placeholder:normal-case placeholder:font-sans placeholder:tracking-normal`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="trk-phone" className={labelClass}>{tr(T.phone)}</label>
                <div className={inputWrap}>
                  <Phone className={iconClass} />
                  <input
                    id="trk-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="+91 98250 12345"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cs-shine cs-press group relative mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-sm bg-[#1F1E1B] px-7 text-[14px] font-medium text-white shadow-[0_8px_0_-4px_#000,0_16px_30px_-14px_rgba(31,30,27,0.6)] disabled:opacity-60 disabled:cursor-wait cursor-pointer"
            >
              {loading ? tr(T.checking) : tr(T.submit)}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>

            <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-[#6B655B]">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
              {tr(T.secure)}
            </p>

            <div className="mt-6 flex flex-col gap-2 border-t border-[#EFEBE3] pt-5 text-[13px] text-[#6B655B] sm:flex-row sm:items-center sm:justify-between">
              <span>{tr(T.noEnquiry)}</span>
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="nav-link-underline self-start font-semibold text-[#1F5C50] hover:text-[#174A41] cursor-pointer"
              >
                {tr(T.start)} →
              </button>
            </div>
          </form>
        </Reveal>

        {/* Info */}
        <Reveal className="lg:col-span-5" delay={120}>
          <aside className="flex h-full flex-col gap-5">
            <div className="rounded-2xl border border-[#E8E4DB] bg-[#F4EFE6]/80 p-6 sm:p-7">
              <h2 className={`text-[#1E1D1A] ${cardHeading}`}>{tr(T.seeTitle)}</h2>
              <ul className="mt-5 space-y-4">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <li key={i} className="flex gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1F5C50] shadow-xs">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div>
                        <span className="block text-[14.5px] font-semibold text-[#1E1D1A]">{tr(f.title)}</span>
                        <span className="block text-[13px] leading-relaxed text-[#6B655B]">{tr(f.desc)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl p-6 sm:p-7 text-white shadow-[0_24px_50px_-24px_rgba(31,92,80,0.7)]"
              style={{ background: "linear-gradient(145deg, #2C7A67 0%, #1F5C50 100%)" }}
            >
              <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <span className="relative block text-[15.5px] font-semibold">{tr(T.lostTitle)}</span>
              <p className="relative mt-1.5 text-[13px] leading-relaxed text-white/80">{tr(T.lostBody)}</p>
              <button
                type="button"
                onClick={openWhatsAppDrawer}
                className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[13.5px] font-semibold text-[#1F5C50] transition-all hover:bg-[#F4F1EA] active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </button>
            </div>
          </aside>
        </Reveal>
      </section>
    </SiteShell>
  );
};