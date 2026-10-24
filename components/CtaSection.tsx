"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./WhatsApp";

interface CtaSectionProps {
  onStartEnquiry: () => void;
  onOpenWhatsApp: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartEnquiry, onOpenWhatsApp }) => {
  const { t, language } = useLanguage();
  const headingFont = language === "gu" || language === "hi" ? "font-sans font-semibold" : "font-serif";

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-[#E8E4DB]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          <Reveal className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="text-xs font-semibold tracking-[0.2em] text-[#8C8479] uppercase">{t.cta.kicker}</div>
            <h2 className={`text-2xl sm:text-4xl lg:text-[3.25rem] font-medium text-[#1E1D1A] leading-[1.14] tracking-tight ${headingFont}`}>
              {t.cta.title}
            </h2>
            <p className="text-[14px] sm:text-base text-[#57534D] leading-relaxed max-w-lg">{t.cta.desc}</p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartEnquiry}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#1F1E1B] hover:bg-[#33312B] text-white text-[13.5px] font-medium tracking-wide rounded-sm shadow-xs hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>{t.cta.startEnquiry}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onOpenWhatsApp}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-[#1F5C50] hover:text-white hover:border-[#1F5C50] text-[#1E1D1A] border border-[#D9D3C7] text-[13.5px] font-medium tracking-wide rounded-sm shadow-2xs hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6 relative" delay={150}>
            <div className="group relative w-full h-[280px] sm:h-[380px] rounded-lg overflow-hidden border border-[#E3DED4] shadow-xs bg-[#e7e6ef]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/footer-bg.webp"
                alt="CASE SUNO consultation guidance"
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};