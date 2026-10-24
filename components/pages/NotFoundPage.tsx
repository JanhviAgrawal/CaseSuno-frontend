"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, Compass } from "lucide-react";
import { useLanguage, type Language } from "../../context/LanguageContext";
import { CONTAINER, PageIntro, SiteShell } from "../SiteShell";

type L3 = Record<Language, string>;

const T = {
  kicker: { en: "Page not found", hi: "पेज नहीं मिला", gu: "પેજ મળ્યું નથી" },
  title: { en: "This page doesn't exist", hi: "यह पेज मौजूद नहीं है", gu: "આ પેજ અસ્તિત્વમાં નથી" },
  desc: {
    en: "The link may be incorrect or the page may have moved. If you were opening a request link, please use “Track request” with your reference number.",
    hi: "लिंक गलत हो सकता है या पेज हटाया गया हो सकता है। यदि आप अपना अनुरोध देख रहे थे, तो कृपया संदर्भ नंबर के साथ “अनुरोध ट्रैक करें” का उपयोग करें।",
    gu: "લિંક ખોટી હોઈ શકે છે અથવા પેજ ખસેડાયું હોઈ શકે છે. જો તમે તમારી વિનંતી જોઈ રહ્યા હતા, તો કૃપા કરીને સંદર્ભ નંબર સાથે “વિનંતી ટ્રેક કરો” નો ઉપયોગ કરો.",
  },
  home: { en: "Go to homepage", hi: "होमपेज पर जाएं", gu: "હોમપેજ પર જાવ" },
  track: { en: "Track a request", hi: "अनुरोध ट्रैक करें", gu: "વિનંતી ટ્રેક કરો" },
} satisfies Record<string, L3>;

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const tr = (v: L3) => v[language];

  return (
    <SiteShell>
      <PageIntro icon={Compass} kicker={tr(T.kicker)} title={tr(T.title)} desc={tr(T.desc)} />
      <section className={`${CONTAINER} mt-8 mb-16 flex flex-wrap gap-3`}>
        <Link
          href="/"
          className="cs-press inline-flex items-center gap-2 rounded-full bg-[#1F1E1B] px-5 py-3 text-[14px] font-medium text-white transition-all hover:bg-[#1F5C50]"
        >
          {tr(T.home)} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/track"
          className="inline-flex items-center gap-2 rounded-full border border-[#DCD6C9] bg-white px-5 py-3 text-[14px] font-medium text-[#2C2A26] transition-all hover:border-[#1F5C50] hover:text-[#1F5C50]"
        >
          {tr(T.track)}
        </Link>
      </section>
    </SiteShell>
  );
};
