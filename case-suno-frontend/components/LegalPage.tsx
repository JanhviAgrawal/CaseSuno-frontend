"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  FileText,
  Globe,
  Printer,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useLanguage, type Language } from "../context/LanguageContext";
import { LEGAL_DOCS, LEGAL_ORDER, LEGAL_UPDATED, type L3, type LegalType } from "../lib/legal";
import { openWhatsApp } from "./contact";
import { WhatsAppIcon } from "./WhatsApp";

const GREEN = "#1F5C50";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "gu", label: "ગુજરાતી" },
];

const DOC_ICONS: Record<LegalType, LucideIcon> = {
  privacy: ShieldCheck,
  terms: FileText,
  disclaimer: Scale,
};

const UI = {
  back: { en: "Back to Home", hi: "होम पर वापस", gu: "હોમ પર પાછા" } as L3,
  onThisPage: { en: "On this page", hi: "इस पृष्ठ पर", gu: "આ પૃષ્ઠ પર" } as L3,
  print: { en: "Print", hi: "प्रिंट करें", gu: "પ્રિન્ટ કરો" } as L3,
  legal: { en: "Legal", hi: "कानूनी", gu: "કાનૂની" } as L3,
  helpBody: {
    en: "Reach out and our team will clarify anything in this document.",
    hi: "हमसे संपर्क करें, हमारी टीम इस दस्तावेज़ से जुड़ा हर प्रश्न स्पष्ट करेगी।",
    gu: "અમારો સંપર્ક કરો, અમારી ટીમ આ દસ્તાવેજ સંબંધિત દરેક પ્રશ્ન સ્પષ્ટ કરશે.",
  } as L3,
};

interface LegalPageProps {
  type: LegalType;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { t, language, setLanguage } = useLanguage();
  const tr = (v: L3) => v[language];
  const isIndic = language === "gu" || language === "hi";

  const doc = LEGAL_DOCS[type];
  const DocIcon = DOC_ICONS[type];
  const pageTitle = doc.title[language];

  const [activeId, setActiveId] = useState(doc.sections[0]?.id ?? "");

  const shortLabel = (k: LegalType) =>
    k === "privacy" ? t.footer.privacy : k === "terms" ? t.footer.terms : t.footer.disclaimer;

  /* Browser tab title follows the selected language */
  useEffect(() => {
    document.title = `${pageTitle} | CASE SUNO`;
  }, [pageTitle]);

  /* Highlight the section currently in view */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    doc.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [doc]);

  const titleClass = isIndic
    ? "font-sans font-semibold text-[clamp(1.9rem,6vw,3rem)] leading-[1.25]"
    : "font-serif font-medium text-[clamp(2.3rem,7vw,4rem)] leading-[1.05]";

  const sectionHeadingClass = isIndic
    ? "font-sans font-semibold text-[1.1rem] sm:text-xl leading-snug"
    : "font-serif font-semibold text-[1.4rem] sm:text-[1.65rem] leading-tight";

  const glassBtn =
    "border border-white/70 bg-white/55 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_-8px_rgba(31,30,27,0.3)]";

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-gradient-to-br from-[#F6F1E7] via-[#FAF9F6] to-[#F3EFE6] text-[#222222] print:bg-white">
      {/* Ambient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden print:hidden">
        <div className="cs-blob absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#C9A45C]/12 blur-3xl" />
        <div
          className="cs-blob absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full bg-[#1F5C50]/10 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      {/* ============================ HEADER ============================ */}
      <header className="sticky top-0 z-40 px-3 sm:px-5 lg:px-8 pt-2.5 lg:pt-3.5 print:hidden">
        <div className="relative mx-auto flex h-[56px] lg:h-[64px] max-w-[1200px] items-center justify-between gap-3 rounded-2xl xl:rounded-full border border-white/60 bg-white/60 backdrop-blur-xl backdrop-saturate-150 px-3 sm:px-4 lg:pl-6 lg:pr-2.5 shadow-[0_10px_34px_-16px_rgba(31,30,27,0.22),inset_0_1px_0_rgba(255,255,255,0.85)]">
          <Link
            href="/"
            aria-label="CASE SUNO Home"
            className="shrink-0 rounded-md transition-transform duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5C50]/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="CASE SUNO" className="h-9 lg:h-10 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="group relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Language selection"
                className={`appearance-none cursor-pointer rounded-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 text-[11px] sm:text-xs font-semibold text-[#1F1E1B] outline-none transition-all hover:bg-white/80 focus:ring-2 focus:ring-[#1F5C50]/20 ${glassBtn}`}
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B655B] transition-transform duration-500 group-hover:rotate-180" />
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B655B]" />
            </div>

            {/* Back to home */}
            <Link
              href="/"
              aria-label={tr(UI.back)}
              className="cs-shine group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#1F1E1B] px-3 sm:pl-4 sm:pr-5 py-2.5 text-[13px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(31,30,27,0.6)] transition-all duration-300 hover:bg-[#1F5C50] active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">{tr(UI.back)}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ============================= MAIN ============================= */}
      <main className="relative mx-auto w-full max-w-[1200px] flex-1 px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-20">
        {/* Document tabs */}
        <nav
          aria-label={tr(UI.legal)}
          className="cs-rise mb-8 sm:mb-10 inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/70 bg-[#1F1E1B]/[0.04] p-1 print:hidden"
        >
          {LEGAL_ORDER.map((k) => {
            const isActive = k === type;
            const TabIcon = DOC_ICONS[k];
            return (
              <Link
                key={k}
                href={LEGAL_DOCS[k].href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-white text-[#1F1E1B] shadow-[0_4px_14px_-6px_rgba(31,30,27,0.35)] ring-1 ring-black/[0.04]"
                    : "text-[#5A564F] hover:bg-white/60 hover:text-[#1F1E1B]"
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" style={{ color: isActive ? GREEN : undefined }} />
                {shortLabel(k)}
              </Link>
            );
          })}
        </nav>

        {/* Title block */}
        <div className="max-w-[760px] space-y-4 sm:space-y-5">
          <div
            className="cs-rise inline-flex items-center gap-2 rounded-full border border-[#DCD6C9] bg-[#F1ECE1] px-3.5 py-1.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F5E58]"
            style={{ animationDelay: "60ms" }}
          >
            <DocIcon className="h-4 w-4" style={{ color: GREEN }} />
            {tr(doc.kicker)}
          </div>

          <h1
            className={`cs-rise tracking-tight text-balance text-[#171613] ${titleClass}`}
            style={{ animationDelay: "120ms" }}
          >
            {tr(doc.title)}
          </h1>

          <div
            className="cs-rise flex flex-wrap items-center gap-3 text-[13px] text-[#6B655B]"
            style={{ animationDelay: "180ms" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" style={{ color: GREEN }} />
              {tr(LEGAL_UPDATED)}
            </span>
            <span aria-hidden="true" className="text-[#BFB6A6] print:hidden">
              |
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="nav-link-underline inline-flex items-center gap-1.5 font-medium text-[#3F3F3B] hover:text-[#1F1E1B] cursor-pointer print:hidden"
            >
              <Printer className="h-4 w-4" />
              {tr(UI.print)}
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-4 print:hidden">
            <div className="space-y-5 lg:sticky lg:top-28">
              {/* Table of contents */}
              <div
                className="cs-rise rounded-2xl border border-[#E8E4DB] bg-white/80 p-5 backdrop-blur-xl shadow-[0_20px_50px_-30px_rgba(31,30,27,0.3)]"
                style={{ animationDelay: "240ms" }}
              >
                <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C8479]">
                  {tr(UI.onThisPage)}
                </span>
                <ul className="mt-3 space-y-1">
                  {doc.sections.map((s) => {
                    const isActive = activeId === s.id;
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={`group flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-[13px] leading-snug transition-all ${
                            isActive
                              ? "bg-[#E6EFEA] text-[#1F5C50] font-semibold"
                              : "text-[#524E46] hover:bg-[#F4F1EA] hover:text-[#1E1D1A]"
                          }`}
                        >
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                              isActive ? "bg-[#1F5C50]" : "bg-[#D9D3C7] group-hover:bg-[#1F5C50]/60"
                            }`}
                          />
                          {tr(s.h)}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Help card */}
              <div
                className="cs-rise relative overflow-hidden rounded-2xl p-5 text-white shadow-[0_24px_50px_-24px_rgba(31,92,80,0.7)]"
                style={{ animationDelay: "320ms", background: "linear-gradient(145deg, #2C7A67 0%, #1F5C50 100%)" }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                />
                <span className="block text-[15px] font-semibold">{t.cta.kicker}</span>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/80">{tr(UI.helpBody)}</p>
                <button
                  type="button"
                  onClick={() => openWhatsApp()}
                  className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-[#1F5C50] transition-all hover:bg-[#F4F1EA] active:scale-[0.98] cursor-pointer"
                >
                  <WhatsAppIcon />
                  <span>{t.cta.chatWhatsApp}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </aside>

          {/* Article */}
          <article
            className="cs-rise lg:col-span-8 rounded-2xl border border-[#E8E4DB] bg-white/90 p-5 sm:p-8 lg:p-10 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(31,30,27,0.3)] print:col-span-12 print:border-0 print:p-0 print:shadow-none"
            style={{ animationDelay: "200ms" }}
          >
            <div className="divide-y divide-[#EFEBE3]">
              {doc.sections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-28 py-7 first:pt-0 last:pb-0">
                  <h2 className={`text-[#1E1D1A] ${sectionHeadingClass}`}>{tr(sec.h)}</h2>
                  <p className="mt-3 text-[15px] sm:text-[15.5px] leading-[1.8] text-[#3F3F3B]">{tr(sec.p)}</p>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="relative border-t border-[#E8E4DB] bg-[#FAF9F6]/80 print:hidden">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 sm:px-6 lg:px-8 py-8 text-xs text-[#787268] lg:flex-row lg:items-center lg:justify-between">
          <p className="tabular-nums">{t.footer.rights}</p>

          <nav className="flex flex-wrap items-center gap-3" aria-label={tr(UI.legal)}>
            {LEGAL_ORDER.map((k, i) => (
              <React.Fragment key={k}>
                {i > 0 && <span aria-hidden="true">|</span>}
                <Link
                  href={LEGAL_DOCS[k].href}
                  className={`nav-link-underline transition-colors hover:text-[#1A1917] ${
                    k === type ? "active text-[#1A1917] font-medium" : ""
                  }`}
                >
                  {shortLabel(k)}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" aria-hidden="true" />
            {t.footer.locationNotice}
          </div>
        </div>
      </footer>
    </div>
  );
};