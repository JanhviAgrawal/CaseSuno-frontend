"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./Reveal";

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  detail: string;
  deliverables: string[];
}

interface ProcessSectionProps {
  onKnowMore: () => void;
  onOpenEnquiry: () => void;
}

/** Animated height wrapper (CSS grid-rows trick). Defined at module level so it never remounts. */
const Collapse: React.FC<{ open: boolean; className?: string; children: React.ReactNode }> = ({
  open,
  className = "",
  children,
}) => (
  <div
    className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${
      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
    } ${className}`}
    aria-hidden={!open}
    inert={!open}
  >
    <div className="overflow-hidden min-h-0">{children}</div>
  </div>
);

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onKnowMore, onOpenEnquiry }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  // Remembers the last opened step so content stays visible while the panel animates closed
  const [drawerStep, setDrawerStep] = useState(0);
  const { t, language } = useLanguage();

  const steps: ProcessStep[] = t.process.steps;
  const isIndianLanguage = language === "gu" || language === "hi";
  const stepWord = language === "gu" ? "તબક્કો" : language === "hi" ? "चरण" : "Step";
  const headingFont = isIndianLanguage ? "font-sans font-semibold" : "font-serif";
  const drawerItem = steps[drawerStep] ?? steps[0];

  const toggleStep = (idx: number) => {
    setDrawerStep(idx);
    setActiveStep((cur) => (cur === idx ? null : idx));
  };

  const renderStepCard = (item: ProcessStep, idx: number) => {
    const isSelected = activeStep === idx;
    return (
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isSelected}
        onClick={() => toggleStep(idx)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleStep(idx);
          }
        }}
        className={`h-full flex flex-col items-center lg:items-start text-center lg:text-left cursor-pointer group transition-all duration-300 p-4 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#1F1E1B]/30 active:scale-[0.98] ${
          isSelected
            ? "bg-white shadow-md border border-[#DFD9CE] -translate-y-1"
            : "hover:bg-white/70 hover:-translate-y-1 hover:shadow-sm border border-transparent"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium mb-4 sm:mb-5 transition-all duration-300 ${
            isSelected
              ? "bg-[#1F1E1B] text-white ring-4 ring-[#E5DFC4] scale-110"
              : "bg-[#988C78] text-[#FDFCFB] group-hover:bg-[#1F1E1B] group-hover:text-white group-hover:scale-110"
          }`}
        >
          <span>{item.step}</span>
        </div>

        <h3 className={`text-base sm:text-lg font-medium text-[#1E1D1A] mb-2 group-hover:text-black ${headingFont}`}>
          {item.title}
        </h3>

        <p className="text-[12.5px] text-[#6B655B] leading-relaxed max-w-[260px] lg:max-w-[220px]">{item.desc}</p>

        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#8F8778] group-hover:text-[#1E1D1A] transition-colors">
          {isSelected ? t.process.hideDetails : t.process.clickToInspect}
          <ArrowRight
            className={`w-3 h-3 transition-transform duration-300 ${isSelected ? "rotate-90" : "group-hover:translate-x-0.5"}`}
          />
        </span>
      </div>
    );
  };

  const renderDetail = (item: ProcessStep, layout: "mobile" | "desktop") => {
    const isDesktop = layout === "desktop";
    return (
      <div className={`bg-white border border-[#DFD9CE] rounded-sm shadow-xs ${isDesktop ? "p-5 sm:p-8" : "p-5"}`}>
        <div className={isDesktop ? "flex flex-col md:flex-row md:items-start justify-between gap-6" : "space-y-4"}>
          <div className={isDesktop ? "max-w-2xl space-y-3" : "space-y-4"}>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#806B49] uppercase tracking-wider">
              <span>
                {stepWord} {item.step} {t.process.deepDive}
              </span>
              <span>·</span>
              <span>{item.title}</span>
            </div>

            <h4 className={`text-xl ${isDesktop ? "sm:text-2xl" : ""} text-[#1E1D1A] ${headingFont}`}>
              {t.process.howWeHandle} {item.title}
            </h4>

            <p className="text-sm text-[#5C564C] leading-relaxed">{item.detail}</p>

            <div className="pt-1">
              <span className="text-xs font-semibold text-[#1F1E1B] uppercase tracking-wider block mb-2">
                {t.process.keyDeliverables}
              </span>
              <div className={`grid grid-cols-1 ${isDesktop ? "sm:grid-cols-3" : ""} gap-2`}>
                {item.deliverables.map((d, i) => (
                  <div
                    key={`${item.step}-${layout}-deliverable-${i}`}
                    className="flex items-center gap-2 p-2 bg-[#FAF9F6] border border-[#EBE7DF] rounded-xs text-xs text-[#3A3834] transition-colors hover:border-[#BFB6A6] hover:bg-white"
                  >
                    <Check className="w-3.5 h-3.5 text-[#6D8A68] shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={isDesktop ? "flex flex-row md:flex-col gap-2.5 shrink-0 pt-2 md:pt-0" : "flex gap-2 pt-2"}>
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="group flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#1F1E1B] hover:bg-[#33312B] text-white text-xs font-medium rounded-sm transition-all active:scale-[0.97] cursor-pointer"
            >
              {t.process.startStep1}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(null)}
              className="flex-1 md:flex-none px-4 py-2.5 text-xs text-[#706B62] hover:text-black hover:border-[#1E1D1A] border border-[#D9D3C7] rounded-sm transition-all active:scale-[0.97] cursor-pointer"
            >
              {t.process.closeStep}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const tabletRows: ProcessStep[][] = [];
  for (let i = 0; i < steps.length; i += 2) tabletRows.push(steps.slice(i, i + 2));

  return (
    <section id="how-it-works" className="w-full py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-t border-[#E8E4DB]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-20">
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-[#8C8479] uppercase">
              <span className="w-6 h-[1.5px] bg-[#8C8479]" aria-hidden="true" />
              <span>{t.process.kicker}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-[2.65rem] font-medium text-[#1E1D1A] leading-tight tracking-tight ${headingFont}`}>
              {t.process.title} <br className="hidden sm:inline" />
              {t.process.titleSub}
            </h2>
          </div>

          <div className="max-w-md space-y-3">
            <p className="text-[13.5px] text-[#635E56] leading-relaxed">{t.process.desc}</p>
            <button
              type="button"
              onClick={onKnowMore}
              className="nav-link-underline inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F1E1B] hover:text-[#57534D] transition-colors group cursor-pointer"
            >
              <span>{t.process.knowMore}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>

        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-9 left-[5%] right-[5%] h-[1.5px] bg-[#DED8CC]" aria-hidden="true" />

          {/* MOBILE (<640px) */}
          <div className="sm:hidden flex flex-col gap-6 relative z-10">
            {steps.map((item, idx) => (
              <Reveal key={`${item.step}-mobile`} delay={idx * 60} className="w-full">
                {renderStepCard(item, idx)}
                <Collapse open={activeStep === idx} className={activeStep === idx ? "mt-3" : "mt-0"}>
                  {renderDetail(item, "mobile")}
                </Collapse>
              </Reveal>
            ))}
          </div>

          {/* TABLET (640–1023px) */}
          <div className="hidden sm:flex lg:hidden flex-col gap-6 relative z-10">
            {tabletRows.map((row, rowIndex) => {
              const rowStart = rowIndex * 2;
              const inRow = (i: number | null) => i !== null && i >= rowStart && i < rowStart + row.length;
              const rowOpen = inRow(activeStep);
              return (
                <Reveal key={`tablet-row-${rowIndex}`} delay={rowIndex * 80}>
                  <div className="grid grid-cols-2 gap-6">
                    {row.map((item, col) => (
                      <div key={`${item.step}-tablet`} className="min-w-0">
                        {renderStepCard(item, rowStart + col)}
                      </div>
                    ))}
                  </div>
                  <Collapse open={rowOpen} className={rowOpen ? "mt-4" : "mt-0"}>
                    {inRow(drawerStep) && renderDetail(steps[drawerStep], "mobile")}
                  </Collapse>
                </Reveal>
              );
            })}
          </div>

          {/* DESKTOP (1024px+) */}
          <div className="hidden lg:grid grid-cols-5 gap-4 relative z-10">
            {steps.map((item, idx) => (
              <Reveal key={`${item.step}-desktop`} delay={idx * 90} className="h-full">
                {renderStepCard(item, idx)}
              </Reveal>
            ))}
          </div>

          {/* Desktop drawer */}
          <div className="hidden lg:block">
            <Collapse open={activeStep !== null} className={activeStep !== null ? "mt-8" : "mt-0"}>
              {drawerItem && renderDetail(drawerItem, "desktop")}
            </Collapse>
          </div>
        </div>
      </div>
    </section>
  );
};