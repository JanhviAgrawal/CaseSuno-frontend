"use client";

import React from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteActions } from "../context/SiteActionsContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./WhatsApp";

export const CONTAINER = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";
export const GREEN = "#1F5C50";

export const useIsIndic = () => {
  const { language } = useLanguage();
  return language === "gu" || language === "hi";
};

/** Section heading style that adapts to Gujarati / Hindi */
export const sectionHeading = (isIndic: boolean) =>
  isIndic
    ? "font-sans font-semibold text-xl sm:text-2xl leading-snug"
    : "font-serif font-medium text-[1.7rem] sm:text-[2.1rem] leading-tight";

/* =====================================================================
   Page wrapper (header + footer + background)
===================================================================== */
export const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative isolate flex min-h-screen flex-col bg-gradient-to-br from-[#F6F1E7] via-[#FAF9F6] to-[#F3EFE6] text-[#222222]">
    {/* Ambient blobs (clipped here so the sticky header keeps working) */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="cs-blob absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#C9A45C]/12 blur-3xl" />
      <div
        className="cs-blob absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full bg-[#1F5C50]/10 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
    </div>

    <Header />
    <main className="relative flex-1 pt-[112px] sm:pt-[124px] lg:pt-[148px] pb-20 sm:pb-24">{children}</main>
    <Footer />
  </div>
);

/* =====================================================================
   Page intro (kicker pill + big title + description)
===================================================================== */
interface PageIntroProps {
  icon: LucideIcon;
  kicker: string;
  title: string;
  desc?: string;
}

export const PageIntro: React.FC<PageIntroProps> = ({ icon: Icon, kicker, title, desc }) => {
  const isIndic = useIsIndic();
  const titleClass = isIndic
    ? "font-sans font-semibold text-[clamp(1.9rem,6vw,3rem)] leading-[1.25]"
    : "font-serif font-medium text-[clamp(2.4rem,7vw,4.2rem)] leading-[1.05]";

  return (
    <section className={CONTAINER}>
      <div className="max-w-[780px] space-y-4 sm:space-y-5">
        <div className="cs-rise inline-flex items-center gap-2 rounded-full border border-[#DCD6C9] bg-[#F1ECE1] px-3.5 py-1.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F5E58]">
          <Icon className="h-4 w-4" style={{ color: GREEN }} />
          {kicker}
        </div>
        <h1 className={`cs-rise tracking-tight text-balance text-[#171613] ${titleClass}`} style={{ animationDelay: "100ms" }}>
          {title}
        </h1>
        {desc && (
          <p
            className="cs-rise max-w-[640px] text-[15px] sm:text-[16.5px] leading-relaxed text-[#3F3F3B]"
            style={{ animationDelay: "200ms" }}
          >
            {desc}
          </p>
        )}
      </div>
    </section>
  );
};

/* =====================================================================
   CTA banner (Start Enquiry + WhatsApp)
===================================================================== */
export const CtaBand: React.FC = () => {
  const { t } = useLanguage();
  const isIndic = useIsIndic();
  const { openEnquiry, openWhatsAppDrawer } = useSiteActions();

  return (
    <section className={`${CONTAINER} mt-16 sm:mt-20`}>
      <Reveal>
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-10 sm:px-12 sm:py-14 text-white shadow-[0_30px_70px_-30px_rgba(15,68,54,0.7)]"
          style={{ background: "linear-gradient(135deg, #0E4436 0%, #14513F 50%, #1F5C50 100%)" }}
        >
          <svg aria-hidden="true" className="pointer-events-none absolute -right-6 bottom-0 h-40 w-80 opacity-80" viewBox="0 0 200 100" fill="none">
            <path d="M30 100 C 85 82, 150 52, 205 8 L205 100 Z" fill="white" fillOpacity="0.06" />
            <path d="M62 100 C 118 76, 166 44, 208 12" stroke="#C9A45C" strokeWidth="1.2" strokeOpacity="0.8" />
          </svg>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-3">
              <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-[#C9A45C]">{t.cta.kicker}</span>
              <h2
                className={`text-white ${
                  isIndic ? "font-sans font-semibold text-2xl sm:text-3xl leading-snug" : "font-serif font-medium text-3xl sm:text-[2.6rem] leading-tight"
                }`}
              >
                {t.cta.title}
              </h2>
              <p className="text-[14.5px] leading-relaxed text-white/80">{t.cta.desc}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="cs-press group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm bg-white px-6 text-[14px] font-semibold text-[#1F1E1B] shadow-[0_8px_0_-4px_rgba(0,0,0,0.35)] cursor-pointer"
              >
                {t.cta.startEnquiry}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={openWhatsAppDrawer}
                className="cs-press group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm border border-white/40 bg-white/10 px-6 text-[14px] font-medium text-white backdrop-blur-sm hover:bg-white/20 cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.cta.chatWhatsApp}
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};