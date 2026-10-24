"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe, ChevronDown, UserRound } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteActions } from "../context/SiteActionsContext";
import { NAV_ITEMS, navLabel, pageKeyFromPath, scrollToSection, type NavItem, type NavKey } from "../lib/nav";
import { openWhatsApp } from "./contact";
import { WhatsAppIcon } from "./WhatsApp";

type Lang = "en" | "hi" | "gu";

const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हिं" },
  { code: "gu", label: "ગુજરાતી", short: "ગુજ" },
];

/* Home-page sections tracked by scroll-spy → nav key */
const SPY: Record<string, NavKey> = {
  home: "home",
  "how-it-works": "how",
  services: "services",
};

export const Header: React.FC = () => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const { openEnquiry } = useSiteActions();
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  const isGu = language === "gu";
  const isHi = language === "hi";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [spyActive, setSpyActive] = useState<NavKey>("home");
  const [hovered, setHovered] = useState<NavKey | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  /* On home: scroll-spy decides. On other pages: the URL decides. */
  const active: NavKey | null = isHome ? spyActive : pageKeyFromPath(pathname);

  const itemRefs = useRef<Partial<Record<NavKey, HTMLAnchorElement | null>>>({});
  const accountRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const accountText = {
    title: isGu ? "ક્લાયન્ટ એકાઉન્ટ" : isHi ? "क्लाइंट अकाउंट" : "Client Accounts",
    body: isGu
      ? "ઓનલાઇન લોગિન ટૂંક સમયમાં આવી રહ્યું છે. ત્યાં સુધી પૂછપરછ શરૂ કરો, અમારા કોઓર્ડિનેટર તમારો સંપર્ક કરશે."
      : isHi
        ? "ऑनलाइन लॉगिन जल्द आ रहा है। तब तक पूछताछ शुरू करें, हमारे समन्वयक आपसे संपर्क करेंगे।"
        : "Online login is coming soon. Meanwhile, start an enquiry and our coordinator will contact you.",
    cta: isGu ? "પૂછપરછ શરૂ કરો" : isHi ? "पूछताछ शुरू करें" : "Start an Enquiry",
    aria: isGu ? "લોગિન / સાઇન અપ" : isHi ? "लॉगिन / साइन अप" : "Login / Sign up",
  };

  /* ---------------- scroll state ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- scroll-spy (home page only) ---------------- */
  useEffect(() => {
    if (!isHome) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && SPY[e.target.id]) setSpyActive(SPY[e.target.id]);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    Object.keys(SPY).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [isHome]);

  /* ---------------- sliding indicator ---------------- */
  const updateIndicator = useCallback(() => {
    const key = hovered ?? active;
    const el = key ? itemRefs.current[key] : null;
    if (!el) return setIndicator((i) => ({ ...i, ready: false }));
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [hovered, active]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator, language]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    document.fonts?.ready.then(updateIndicator).catch(() => {});
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  /* ---------------- close menus ---------------- */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!accountOpen && !mobileOpen) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (accountOpen && accountRef.current && !accountRef.current.contains(target)) setAccountOpen(false);
      if (mobileOpen && mobileRef.current && !mobileRef.current.contains(target)) setMobileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAccountOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen, mobileOpen]);

  /* ---------------- actions ---------------- */
  /** On the home page, section links scroll instead of navigating. */
  const handleNavClick = (item: NavItem) => (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (isHome && item.section) {
      e.preventDefault();
      setSpyActive(item.key);
      scrollToSection(item.section);
    }
  };

  const homeItem = NAV_ITEMS[0];
  const mobileLangLabel = LANGS.find((l) => l.code === language)?.short ?? "EN";

  const glassBtn =
    "border border-white/70 bg-white/55 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_-8px_rgba(31,30,27,0.3)]";

  return (
    <header className="pointer-events-none sticky top-0 z-40 h-[72px] lg:h-[88px] -mb-[72px] lg:-mb-[88px] px-3 sm:px-5 lg:px-8 pt-2.5 lg:pt-3.5">
      <div ref={mobileRef} className="relative mx-auto max-w-[1400px]">
        {/* ================= Glass bar ================= */}
        <div
          className={`pointer-events-auto relative flex items-center justify-between gap-3 overflow-visible rounded-2xl xl:rounded-full border px-3 sm:px-4 xl:pl-6 xl:pr-2.5 transition-all duration-500 ease-out ${
            scrolled
              ? "h-[54px] lg:h-[60px] border-white/70 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_16px_40px_-16px_rgba(31,30,27,0.3),inset_0_1px_0_rgba(255,255,255,0.9)]"
              : "h-[56px] lg:h-[64px] border-white/60 bg-white/45 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_34px_-16px_rgba(31,30,27,0.22),inset_0_1px_0_rgba(255,255,255,0.85)]"
          }`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/50 via-white/10 to-transparent"
          />

          {/* Brand */}
          <Link
            href="/"
            onClick={handleNavClick(homeItem)}
            className="relative shrink-0 rounded-md transition-transform duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5C50]/40"
            aria-label="CASE SUNO Home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="CASE SUNO" className="h-9 lg:h-10 w-auto" />
          </Link>

          {/* ================= Desktop nav with sliding pill ================= */}
          <nav
            aria-label="Primary Navigation"
            onMouseLeave={() => setHovered(null)}
            className="relative hidden xl:flex items-center gap-0.5 rounded-full border border-white/50 bg-[#1F1E1B]/[0.035] p-1"
          >
            <span
              aria-hidden="true"
              className={`absolute top-1 bottom-1 rounded-full bg-white shadow-[0_4px_14px_-6px_rgba(31,30,27,0.35),inset_0_1px_0_rgba(255,255,255,1)] ring-1 ring-black/[0.04] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                indicator.ready ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: indicator.left, width: indicator.width }}
            />
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[item.key] = el;
                  }}
                  onClick={handleNavClick(item)}
                  onMouseEnter={() => setHovered(item.key)}
                  onFocus={() => setHovered(item.key)}
                  onBlur={() => setHovered(null)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative z-10 whitespace-nowrap rounded-full px-3.5 2xl:px-4 py-2 text-[13.5px] font-medium transition-colors duration-200 focus-visible:outline-none ${
                    isActive ? "text-[#1F1E1B]" : "text-[#5A564F] hover:text-[#1F1E1B]"
                  }`}
                >
                  {navLabel(t, item.key)}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#1F5C50]" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ================= Desktop actions ================= */}
          <div className="relative hidden xl:flex items-center gap-2 shrink-0">
            {/* Language */}
            <div className="group relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Lang)}
                aria-label="Language selection"
                className={`appearance-none cursor-pointer rounded-full pl-9 pr-8 py-2 text-xs font-semibold text-[#1F1E1B] outline-none transition-all hover:bg-white/80 focus:ring-2 focus:ring-[#1F5C50]/20 ${glassBtn}`}
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

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                aria-label={accountText.aria}
                aria-expanded={accountOpen}
                title={accountText.aria}
                className={`group inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-[#1F5C50] hover:text-white hover:border-[#1F5C50] active:scale-90 cursor-pointer ${
                  accountOpen ? "bg-[#1F5C50] text-white border border-[#1F5C50]" : `text-[#2C2A26] ${glassBtn}`
                }`}
              >
                <UserRound className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" strokeWidth={1.8} />
              </button>

              {accountOpen && (
                <div className="cs-slide-down absolute right-0 top-[calc(100%+12px)] w-72 space-y-3 rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur-2xl shadow-[0_24px_50px_-20px_rgba(31,30,27,0.4)]">
                  <span className="block text-sm font-semibold text-[#1E1D1A]">{accountText.title}</span>
                  <p className="text-xs leading-relaxed text-[#6B655B]">{accountText.body}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      openEnquiry();
                    }}
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F1E1B] px-4 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#33312B] active:scale-[0.98] cursor-pointer"
                  >
                    <span>{accountText.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </div>

            {/* CTA (very wide screens) */}
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="cs-shine group relative hidden 2xl:inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#1F1E1B] pl-5 pr-4 py-2.5 text-[13px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(31,30,27,0.6)] transition-all duration-300 hover:bg-[#1F5C50] hover:shadow-[0_10px_24px_-10px_rgba(31,92,80,0.7)] active:scale-95 cursor-pointer"
            >
              <span>{t.nav.getStarted}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>

          {/* ================= Mobile actions ================= */}
          <div className="relative flex xl:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Switch language"
              className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-[#1F1E1B] active:scale-95 transition-transform cursor-pointer ${glassBtn}`}
            >
              <Globe className="h-3 w-3 text-[#6B655B]" />
              <span>{mobileLangLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full active:scale-90 transition-transform cursor-pointer ${glassBtn}`}
            >
              <span className="relative block h-3.5 w-[18px]">
                <span
                  className={`absolute left-0 h-[2px] w-full rounded-full bg-[#1F1E1B] transition-all duration-300 ${
                    mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-[#1F1E1B] transition-all duration-300 ${
                    mobileOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-full rounded-full bg-[#1F1E1B] transition-all duration-300 ${
                    mobileOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* ================= Mobile glass menu ================= */}
        {mobileOpen && (
          <div className="cs-slide-down pointer-events-auto absolute inset-x-0 top-[calc(100%+8px)] xl:hidden max-h-[calc(100dvh-96px)] overflow-y-auto rounded-2xl border border-white/70 bg-white/80 p-4 sm:p-5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_60px_-20px_rgba(31,30,27,0.45)]">
            <div className="flex flex-col">
              {NAV_ITEMS.map((item, i) => {
                const isActive = active === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={handleNavClick(item)}
                    aria-current={isActive ? "page" : undefined}
                    style={{ animationDelay: `${i * 35}ms` }}
                    className={`cs-slide-down group flex items-center justify-between rounded-xl px-3 py-3 text-left text-[14.5px] font-medium transition-all ${
                      isActive ? "bg-white text-[#1F1E1B] shadow-xs" : "text-[#4A4742] hover:bg-white/70 hover:text-[#1F1E1B]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${isActive ? "bg-[#1F5C50]" : "bg-[#D9D3C7] group-hover:bg-[#1F5C50]/60"}`}
                      />
                      {navLabel(t, item.key)}
                    </span>
                    <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 text-[#1F5C50]" />
                  </Link>
                );
              })}
            </div>

            {/* Language segmented control */}
            <div className="mt-4 flex items-center gap-1 rounded-full border border-white/70 bg-[#1F1E1B]/[0.04] p-1">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all cursor-pointer ${
                    language === l.code ? "bg-[#1F1E1B] text-white shadow-xs" : "text-[#4A4742] hover:bg-white/70"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openEnquiry();
                }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F1E1B] px-4 py-3 text-[13.5px] font-medium text-white transition-all hover:bg-[#33312B] active:scale-[0.98] cursor-pointer"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openWhatsApp();
                }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F5C50] px-4 py-3 text-[13.5px] font-medium text-white transition-all hover:bg-[#174A41] active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};