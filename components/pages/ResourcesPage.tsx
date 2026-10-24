"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Briefcase, CheckCircle, Download, FileText, House, Users, type LucideIcon } from "lucide-react";
import { useLanguage, type Language } from "../../context/LanguageContext";
import { useSiteActions } from "../../context/SiteActionsContext";
import { CONTAINER, PageIntro, SiteShell, useIsIndic } from "../SiteShell";
import { Reveal } from "../Reveal";

type L3 = Record<Language, string>;

const R = {
  kicker: { en: "Knowledge Repository", hi: "ज्ञान भंडार और चेकलिस्ट्स", gu: "જ્ઞાન ભંડાર અને માર્ગદર્શિકા" } as L3,
  title: { en: "Resources & Checklists", hi: "संसाधन और चेकलिस्ट्स", gu: "રિસોર્સિસ અને ચેકલિસ્ટ્સ" } as L3,
  desc: {
    en: "Free, practical checklists and preparation toolkits prepared by CASE SUNO to help you organize facts before consulting professionals.",
    hi: "विशेषज्ञों के पास जाने से पहले अपने तथ्यों और कागजातों को व्यवस्थित करने के लिए CASE SUNO द्वारा तैयार निःशुल्क चेकलिस्ट्स।",
    gu: "વ્યાવસાયિકો પાસે જતાં પહેલાં તમારી હકીકતો વ્યવસ્થિત કરવા માટે CASE SUNO દ્વારા તૈયાર કરાયેલ મફત ચેકલિસ્ટ્સ.",
  } as L3,
  getPdf: { en: "Get PDF", hi: "PDF प्राप्त करें", gu: "PDF મેળવો" } as L3,
  ready: { en: "is prepared for viewing and download.", hi: "डाउनलोड के लिए तैयार है।", gu: "ડાઉનલોડ માટે તૈયાર છે." } as L3,
  customTitle: {
    en: "Need a custom document review or personalized dossier?",
    hi: "कस्टम दस्तावेज समीक्षा या व्यक्तिगत केस फाइल की आवश्यकता है?",
    gu: "કસ્ટમ દસ્તાવેજ સમીક્ષા અથવા વ્યક્તિગત કેસ ફાઇલની જરૂર છે?",
  } as L3,
  customBody: {
    en: "Share your situation and our coordinator will help you organise exactly what your matter needs.",
    hi: "अपनी स्थिति साझा करें, हमारे समन्वयक आपके मामले की आवश्यकता अनुसार सब कुछ व्यवस्थित करने में मदद करेंगे।",
    gu: "તમારી પરિસ્થિતિ જણાવો, અમારા કોઓર્ડિનેટર તમારી બાબત માટે જરૂરી બધું વ્યવસ્થિત કરવામાં મદદ કરશે.",
  } as L3,
  request: { en: "Request Intake", hi: "पूछताछ करें", gu: "પૂછપરછ કરો" } as L3,
};

const CHECKLISTS: { id: string; icon: LucideIcon; title: L3; category: L3; pages: L3; desc: L3 }[] = [
  {
    id: "property",
    icon: House,
    title: { en: "Property & Land Title Verification Checklist", hi: "संपत्ति एवं भूमि टाइटल सत्यापन चेकलिस्ट", gu: "મિલકત અને જમીન ટાઇટલ ચકાસણી ચેકલિસ્ટ" },
    category: { en: "Documentation", hi: "दस्तावेज़ीकरण", gu: "દસ્તાવેજીકરણ" },
    pages: { en: "4 Pages", hi: "४ पृष्ठ", gu: "૪ પાના" },
    desc: {
      en: "Complete index of 7/12 extracts, index-II, municipal taxes, non-encumbrance certificates, and mutation entries required before purchasing or settling property.",
      hi: "७/१२ उद्धरण, इंडेक्स-२, नगर निगम कर रसीदें, भारमुक्ति प्रमाणपत्र और दाखिल-खारिज प्रविष्टियों की संपूर्ण सूची।",
      gu: "૭/૧૨ ના ઉતારા, ઈન્ડેક્સ-૨, મ્યુનિસિપલ વેરા બિલ, બોજા મુક્તિ પ્રમાણપત્ર અને હક્કપત્રક નોંધોની સંપૂર્ણ યાદી.",
    },
  },
  {
    id: "legal-notice",
    icon: FileText,
    title: { en: "Guide to Receiving a Legal Notice: Do’s & Don’ts", hi: "कानूनी नोटिस प्राप्त होने पर क्या करें और क्या न करें", gu: "કાનૂની નોટિસ મળવા પર શું કરવું અને શું ન કરવું" },
    category: { en: "Individual Assistance", hi: "व्यक्तिगत सहायता", gu: "વ્યક્તિગત સહાય" },
    pages: { en: "3 Pages", hi: "३ पृष्ठ", gu: "૩ પાના" },
    desc: {
      en: "Step-by-step checklist on timelines, preserved envelopes, avoiding emotional responses, and preparing structured factual points for legal reply.",
      hi: "समयसीमा का ध्यान, डाक लिफाफा संभालना, जल्दबाजी में उत्तर न देना और वकील के लिए बिंदुवार तथ्य तैयार करना।",
      gu: "સમયમર્યાદા, પોસ્ટ કવર સાચવવું, આવેશમાં જવાબ ન આપવો અને વકીલ માટે મુદ્દાસર હકીકતો તૈયાર કરવાની માર્ગદર્શિકા.",
    },
  },
  {
    id: "msme-recovery",
    icon: Briefcase,
    title: { en: "MSME Vendor Payment Recovery Framework", hi: "MSME विक्रेता भुगतान वसूली रूपरेखा", gu: "MSME વેપારી પેમેન્ટ રિકવરી ફ્રેમવર્ક" },
    category: { en: "Business Support", hi: "व्यापार सहायता", gu: "વ્યવસાય સહાય" },
    pages: { en: "5 Pages", hi: "५ पृष्ठ", gu: "૫ પાના" },
    desc: {
      en: "Documentation structure for commercial invoices, e-way bills, MSME Samadhaan conciliation filing requirements, and statutory interest calculations.",
      hi: "वाणिज्यिक चालान (Invoice), ई-वे बिल, MSME समाधान पोर्टल पर आवेदन और वैधानिक ब्याज गणना की मार्गदर्शिका।",
      gu: "વાણિજ્યિક ઇન્વોઇસ, ઇ-વે બિલ, MSME સમાધાન પોર્ટલ અરજી અને વ્યાજ ગણતરી માટેનું સંગઠિત માળખું.",
    },
  },
  {
    id: "family-settlement",
    icon: Users,
    title: { en: "Family Asset Division & Settlement Inventory Sheet", hi: "पारिवारिक संपत्ति विभाजन एवं इन्वेंट्री प्रारूप", gu: "કૌટુંબિક મિલકત વહેંચણી અને ઈન્વેન્ટરી શીટ" },
    category: { en: "Family & Estate", hi: "पारिवारिक एवं वसीयत", gu: "વારસાઈ અને મિલકત" },
    pages: { en: "6 Pages", hi: "६ पृष्ठ", gu: "૬ પાના" },
    desc: {
      en: "A calm, structured template to catalog movable, immovable, and digital assets with clear documentation proof to avert contentious disputes.",
      hi: "चल, अचल और वित्तीय संपत्तियों की पारदर्शी सूची जिससे पारिवारिक मतभेदों को शांतिपूर्ण ढंग से सुलझाया जा सके।",
      gu: "જંગમ, સ્થાવર અને નાણાકીય અસ્કયામતોની વ્યવસ્થિત નોંધણી જેથી કૌટુંબિક વિવાદો ટાળી શકાય.",
    },
  },
];

export const ResourcesPage: React.FC = () => {
  const { language } = useLanguage();
  const { openEnquiry } = useSiteActions();
  const isIndic = useIsIndic();
  const tr = (v: L3) => v[language];
  const [downloaded, setDownloaded] = useState<string | null>(null);

  // Auto-hide the toast
  useEffect(() => {
    if (!downloaded) return;
    const timer = setTimeout(() => setDownloaded(null), 3000);
    return () => clearTimeout(timer);
  }, [downloaded]);

  return (
    <SiteShell>
      <PageIntro icon={BookOpen} kicker={tr(R.kicker)} title={tr(R.title)} desc={tr(R.desc)} />

      {/* Toast */}
      {downloaded && (
        <div
          role="status"
          className="cs-slide-down fixed left-1/2 top-24 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-[13px] text-emerald-800 shadow-lg"
        >
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>
            “{downloaded}” {tr(R.ready)}
          </span>
        </div>
      )}

      {/* Checklists */}
      <section className={`${CONTAINER} mt-10 sm:mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2`}>
        {CHECKLISTS.map((res, i) => {
          const Icon = res.icon;
          return (
            <Reveal key={res.id} delay={(i % 2) * 90} className="h-full">
              <div className="group flex h-full flex-col rounded-2xl border border-[#E8E4DB] bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#BFB6A6] hover:shadow-[0_22px_44px_-20px_rgba(31,30,27,0.35)]">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6EFEA] text-[#1F5C50] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-[#1F5C50] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-[#E3DED4] bg-[#FAF9F6] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-[#8C8479]">
                    {tr(res.category)} · {tr(res.pages)}
                  </span>
                </div>

                <h2
                  className={`mt-5 text-[#1E1D1A] ${
                    isIndic ? "font-sans font-semibold text-[17px] leading-snug" : "font-serif font-semibold text-[1.35rem] leading-tight"
                  }`}
                >
                  {tr(res.title)}
                </h2>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[#6B655B]">{tr(res.desc)}</p>

                <button
                  type="button"
                  onClick={() => setDownloaded(tr(res.title))}
                  className="group/btn mt-6 inline-flex w-full sm:w-auto self-start items-center justify-center gap-2 rounded-sm border border-[#D9D3C7] bg-white px-4 py-2.5 text-[13px] font-medium text-[#1E1D1A] transition-all hover:border-[#1E1D1A] hover:bg-[#1E1D1A] hover:text-white active:scale-[0.96] cursor-pointer"
                >
                  <Download className="h-4 w-4 transition-transform group-hover/btn:translate-y-0.5" />
                  {tr(R.getPdf)}
                </button>
              </div>
            </Reveal>
          );
        })}
      </section>

      {/* Custom review */}
      <section className={`${CONTAINER} mt-10 sm:mt-14`}>
        <Reveal>
          <div className="flex flex-col gap-5 rounded-2xl border border-[#E0D9CB] bg-[#F5F1E8] p-6 sm:p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h2 className={`text-[#1E1D1A] ${isIndic ? "font-sans font-semibold text-lg" : "font-serif font-semibold text-[1.5rem] leading-tight"}`}>
                {tr(R.customTitle)}
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#6B655B]">{tr(R.customBody)}</p>
            </div>
            <button
              type="button"
              onClick={() => openEnquiry("documents-government-services")}
              className="cs-shine cs-press group relative inline-flex min-h-[50px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-sm bg-[#1F1E1B] px-6 text-[14px] font-medium text-white shadow-[0_8px_0_-4px_#000] cursor-pointer"
            >
              {tr(R.request)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
};