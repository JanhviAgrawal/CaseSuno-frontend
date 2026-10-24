"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage, type Language } from "../../context/LanguageContext";
import { useSiteActions } from "../../context/SiteActionsContext";
import { CONTAINER, PageIntro, SiteShell, useIsIndic } from "../SiteShell";
import { WhatsAppIcon } from "../WhatsApp";

type L3 = Record<Language, string>;
type Faq = { q: string; a: string };

const F = {
  kicker: { en: "Clear Answers", hi: "स्पष्ट उत्तर", gu: "સ્પષ્ટ જવાબો" } as L3,
  title: { en: "Frequently Asked Questions", hi: "अक्सर पूछे जाने वाले प्रश्न (FAQ)", gu: "વારંવાર પૂછાતા પ્રશ્નો (FAQ)" } as L3,
  desc: {
    en: "Straightforward answers about who we are, how we work and what to expect.",
    hi: "हम कौन हैं, कैसे काम करते हैं और क्या अपेक्षा करें — इसके सीधे उत्तर।",
    gu: "અમે કોણ છીએ, કેવી રીતે કામ કરીએ છીએ અને શું અપેક્ષા રાખવી — તેના સીધા જવાબો.",
  } as L3,
  askTitle: { en: "Have a specific query?", hi: "कोई विशिष्ट प्रश्न है?", gu: "કોઈ ચોક્કસ પ્રશ્ન છે?" } as L3,
  askBody: {
    en: "Tell us about your situation and our coordinator will guide you personally.",
    hi: "अपनी स्थिति बताएं, हमारे समन्वयक व्यक्तिगत रूप से मार्गदर्शन करेंगे।",
    gu: "તમારી પરિસ્થિતિ જણાવો, અમારા કોઓર્ડિનેટર વ્યક્તિગત રીતે માર્ગદર્શન આપશે.",
  } as L3,
  ask: { en: "Ask Our Team", hi: "हमारी टीम से पूछें", gu: "અમારી ટીમને પૂછો" } as L3,
};

const faqsGu: Faq[] = [
  { q: "CASE SUNO ખરેખર શું છે?", a: "CASE SUNO એ વ્યાવસાયિક પરામર્શ, કેસ સંકલન અને વહીવટી માર્ગદર્શન સેવા છે. અમે વ્યક્તિઓ અને વ્યવસાયોને તેમની મૂંઝવણભરી કાનૂની, વાણિજ્યિક અને દસ્તાવેજી સમસ્યાઓ ઉકેલવામાં, કાગળો વ્યવસ્થિત કરવામાં અને જરૂર જણાય ત્યારે ચકાસાયેલા વકીલો કે CA સાથે સંકલન કરવામાં મદદ કરીએ છીએ." },
  { q: "શું CASE SUNO કોઈ વકીલ પેઢી (Law Firm) છે?", a: "ના. CASE SUNO કોઈ વકીલ પેઢી નથી અને તે અદાલતમાં સીધું પ્રતિનિધિત્વ આપતી નથી કે વકીલાતની જાહેરાત કરતી નથી. અમે એક સ્વતંત્ર કેસ મેનેજમેન્ટ અને સલાહકાર સંસ્થા તરીકે કાર્ય કરીએ છીએ. ઔપચારિક કોર્ટ ફાઇલિંગ કે CA ઓડિટ માટે અમે તમને સીધા લાયક સ્વતંત્ર વ્યાવસાયિકો સાથે જોડીએ છીએ." },
  { q: "એપોઇન્ટમેન્ટ આધારિત સહાય કેવી રીતે કાર્ય કરે છે?", a: "દરેક ક્લાયન્ટને પૂરતો સમય આપવા અને સંપૂર્ણ ગોપનીયતા જાળવવા માટે, અમારા તમામ સત્રો માત્ર અગાઉથી નક્કી કરેલ એપોઇન્ટમેન્ટ મુજબ જ યોજાય છે. તમે ઓનલાઇન વિડીયો અથવા ફોન સત્ર બુક કરી શકો છો." },
  { q: "શું મારી માહિતી ખાનગી રાખવામાં આવે છે?", a: "ચોક્કસપણે. CASE SUNO સાથે શેર કરવામાં આવતી દરેક વિગત, દસ્તાવેજ અને પૂછપરછ સખત બિન-જાહેર ધોરણો હેઠળ રક્ષિત છે. તમારી સ્પષ્ટ મંજૂરી વિના અમે ક્યારેય તમારી માહિતી કોઈ ત્રીજા પક્ષ સાથે શેર કરતા નથી." },
  { q: "સેવાઓ માટે શું ચાર્જ લેવામાં આવે છે?", a: "પ્રારંભિક પૂછપરછ અને વિગતો સમજવી મફત છે. ઊંડાણપૂર્વક દસ્તાવેજ વિશ્લેષણ અને કેસ ફાઇલ તૈયાર કરવા માટે અમે અગાઉથી નક્કી કરેલા પારદર્શક ચાર્જ જણાવીએ છીએ. કોઈ છુપા ખર્ચ હોતા નથી." },
  { q: "શું CASE SUNO કોઈપણ સ્થળેથી ક્લાયન્ટ્સને મદદ કરી શકે છે?", a: "હા. CASE SUNO સુરક્ષિત ઓનલાઇન માધ્યમ દ્વારા વિવિધ સ્થળોએ રહેલા ક્લાયન્ટ્સને માર્ગદર્શન અને સંકલન સેવાઓ પ્રદાન કરી શકે છે." },
  { q: "પૂછપરછ સબમિટ કર્યા પછી શું થાય છે?", a: "અમારા કેસ કોઓર્ડિનેટર તમારી વિગતો ચકાસીને ૨ વ્યાવસાયિક કલાકમાં વોટ્સએપ અથવા ફોન દ્વારા સંપર્ક કરે છે અને અનુકૂળ સમયે પ્રારંભિક સત્ર ગોઠવે છે." },
];

const faqsHi: Faq[] = [
  { q: "CASE SUNO वास्तव में क्या है?", a: "CASE SUNO एक पेशेवर परामर्श, केस समन्वय और प्रशासनिक मार्गदर्शन सेवा है। हम व्यक्तियों और व्यापारिक संस्थानों को उनकी जटिल व्यक्तिगत, व्यावसायिक और दस्तावेजी समस्याओं को सुलझाने, तथ्यों को व्यवस्थित करने और जरूरत पड़ने पर स्वतंत्र अधिवक्ताओं या सीए के साथ समन्वय करने में सहायता करते हैं।" },
  { q: "क्या CASE SUNO कोई लॉ फर्म (Law Firm) है?", a: "नहीं। CASE SUNO कोई वकालत फर्म नहीं है और न ही यह अदालत में सीधे पक्षकार का प्रतिनिधित्व करती है। हम एक निष्पक्ष केस आयोजक, सलाहकार और संपर्क सेतु के रूप में कार्य करते हैं। जब औपचारिक न्यायालय फाइलिंग या सीए प्रमाणन की आवश्यकता होती है, तो हम आपको सत्यापित स्वतंत्र विशेषज्ञों से जोड़ते हैं।" },
  { q: "अपॉइंटमेंट आधारित सहायता कैसे काम करती है?", a: "प्रत्येक क्लाइंट को पूरा ध्यान देने और पूर्ण गोपनीयता बनाए रखने के लिए, हमारे सभी सत्र केवल पूर्व-निर्धारित अपॉइंटमेंट के आधार पर ही आयोजित किए जाते हैं। आप ऑनलाइन वीडियो या फोन सत्र बुक कर सकते हैं।" },
  { q: "क्या मेरी जानकारी गोपनीय रखी जाती है?", a: "हाँ, पूरी तरह से। CASE SUNO के साथ साझा किया गया प्रत्येक दस्तावेज, विवरण और बातचीत गैर-प्रकटीकरण (Non-Disclosure) के सख्त नियमों से बंधी होती है। आपकी स्पष्ट सहमति के बिना आपकी जानकारी किसी तीसरे पक्ष के साथ साझा नहीं की जाती।" },
  { q: "आपकी सेवाओं के लिए क्या शुल्क है?", a: "प्रारंभिक पूछताछ और केस विवरण समझना निःशुल्क है। गहन दस्तावेज विश्लेषण और केस फाइल संरचना के लिए हम काम शुरू होने से पहले पारदर्शी और स्पष्ट अनुमान प्रदान करते हैं। कोई अप्रत्याशित शुल्क नहीं होता।" },
  { q: "क्या CASE SUNO अलग-अलग स्थानों के ग्राहकों की सहायता कर सकता है?", a: "हाँ। CASE SUNO सुरक्षित ऑनलाइन माध्यम के द्वारा अलग-अलग स्थानों पर रहने वाले ग्राहकों को मार्गदर्शन और समन्वय सेवाएँ प्रदान कर सकता है।" },
  { q: "पूछताछ दर्ज करने के बाद क्या प्रक्रिया होती है?", a: "हमारे केस समन्वयक आपकी जानकारी की समीक्षा करते हैं और २ व्यावसायिक घंटों के भीतर व्हाट्सएप या फोन द्वारा संपर्क करके आपकी सुविधानुसार प्रारंभिक सत्र तय करते हैं।" },
];

const faqsEn: Faq[] = [
  { q: "What exactly is CASE SUNO?", a: "CASE SUNO is a professional consultation, case organization, and administrative guidance service. We help individuals and businesses untangle complex personal, commercial, and documentation problems, structure their materials cleanly, and coordinate with verified independent advocates, CAs, or mediators when formal intervention is required." },
  { q: "Is CASE SUNO a law firm?", a: "No. CASE SUNO is not a law firm and does not solicit legal work, nor do we provide direct legal representation in court. We act as an independent case organizer, advisor, and liaison. When formal legal counsel, court filings, or CA certifications are needed, we connect you with verified, independent professionals under their respective statutory guidelines." },
  { q: "How does appointment-based assistance work?", a: "To guarantee dedicated attention and complete confidentiality, all sessions are conducted strictly by appointment. You can book a confidential virtual video or phone session. Walk-ins are not accommodated to safeguard client privacy." },
  { q: "Is my information kept confidential?", a: "Absolutely. Every consultation, document uploaded, and inquiry submitted to CASE SUNO is governed by strict non-disclosure principles. We never sell, broadcast, or share your data with third parties without your explicit authorization." },
  { q: "What are the charges for your services?", a: "Preliminary intake and inquiry review are free. For in-depth document organization, case dossier structuring, and ongoing administrative coordination, we provide clear, upfront milestone-based quotes before any work begins. There are never surprise fees or billable hour inflation." },
  { q: "Can you help clients from different locations?", a: "Yes. CASE SUNO can provide guidance and coordination services to clients in different locations through secure online appointment infrastructure." },
  { q: "What happens after I submit an inquiry?", a: "Our case coordinator reviews your notes and contacts you within 2 business hours via WhatsApp or phone call to schedule your preliminary intake session at a time convenient for you." },
];

export const FaqPage: React.FC = () => {
  const { language } = useLanguage();
  const { openEnquiry, openWhatsAppDrawer } = useSiteActions();
  const isIndic = useIsIndic();
  const tr = (v: L3) => v[language];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = language === "gu" ? faqsGu : language === "hi" ? faqsHi : faqsEn;

  return (
    <SiteShell>
      <PageIntro icon={HelpCircle} kicker={tr(F.kicker)} title={tr(F.title)} desc={tr(F.desc)} />

      <section className={`${CONTAINER} mt-10 sm:mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10`}>
        {/* Accordion */}
        <div className="space-y-3 lg:col-span-8">
          {faqs.map((faq, idx) => {
            const expanded = openIdx === idx;
            return (
              <div
                key={idx}
                className={`cs-rise overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  expanded ? "border-[#BFB6A6] shadow-[0_18px_40px_-24px_rgba(31,30,27,0.4)]" : "border-[#E8E4DB] hover:border-[#D3CCBF]"
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(expanded ? null : idx)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-[#FAF8F4] cursor-pointer"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${
                      expanded ? "bg-[#1F5C50] text-white" : "bg-[#E6EFEA] text-[#1F5C50]"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex-1 text-[#1E1D1A] ${
                      isIndic ? "font-sans font-semibold text-[15.5px] leading-snug" : "font-serif font-semibold text-[1.2rem] sm:text-[1.3rem] leading-snug"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${expanded ? "rotate-180 text-[#1F5C50]" : "text-[#8C8479]"}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="border-t border-[#F2EEE6] px-5 sm:px-6 pb-6 pt-4 sm:pl-[4.75rem] text-[14.5px] leading-[1.8] text-[#3F3F3B]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ask card */}
        <aside className="lg:col-span-4">
          <div
            className="cs-rise relative overflow-hidden rounded-2xl p-6 sm:p-7 text-white shadow-[0_24px_50px_-24px_rgba(31,92,80,0.7)] lg:sticky lg:top-28"
            style={{ animationDelay: "200ms", background: "linear-gradient(145deg, #2C7A67 0%, #1F5C50 100%)" }}
          >
            <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
            <h2 className={`relative ${isIndic ? "font-sans font-semibold text-xl" : "font-serif font-medium text-[1.8rem] leading-tight"}`}>
              {tr(F.askTitle)}
            </h2>
            <p className="relative mt-2 text-[13.5px] leading-relaxed text-white/80">{tr(F.askBody)}</p>
            <div className="relative mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[13.5px] font-semibold text-[#1F5C50] transition-all hover:bg-[#F4F1EA] active:scale-[0.98] cursor-pointer"
              >
                {tr(F.ask)}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={openWhatsAppDrawer}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-[13.5px] font-medium text-white transition-all hover:bg-white/20 active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </button>
            </div>
          </div>
        </aside>
      </section>
    </SiteShell>
  );
};