"use client";

import React from "react";
import { Shield, Scale, Laptop, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";

export const WhyChooseSection: React.FC = () => {
  const { t, language } = useLanguage();
  const headingFont = language === "gu" || language === "hi" ? "font-sans font-semibold" : "font-serif";

  const iconClass = "w-6 h-6 text-[#3A362E] transition-colors duration-300 group-hover:text-white";
  const icons = [
    <Shield key="shield" className={iconClass} />,
    <Scale key="scale" className={iconClass} />,
    <Laptop key="laptop" className={iconClass} />,
    <Users key="users" className={iconClass} />,
  ];

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-t border-[#E8E4DB]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14 lg:mb-16">
          <div className="max-w-xl space-y-3">
            <div className="text-xs font-semibold tracking-[0.2em] text-[#8C8479] uppercase">{t.whyChoose.kicker}</div>
            <h2 className={`text-2xl sm:text-3xl lg:text-[2.65rem] font-medium text-[#1E1D1A] leading-tight tracking-tight ${headingFont}`}>
              {t.whyChoose.title}
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-[13.5px] text-[#635E56] leading-relaxed">{t.whyChoose.desc}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {t.whyChoose.pillars.map((pillar, index) => (
            <Reveal key={index} delay={index * 100} className="h-full">
              <Tilt className="h-full rounded-sm" max={6}>
                <div className="group h-full flex flex-col justify-start p-6 lg:p-7 bg-white border border-[#E8E4DB] rounded-sm hover:border-[#BFB6A6] hover:shadow-xl transition-all duration-300 [transform-style:preserve-3d]">
                  <div className="cs-tilt-pop w-12 h-12 rounded-sm bg-[#F5F2EA] flex items-center justify-center mb-5 sm:mb-6 shrink-0 transition-all duration-300 group-hover:bg-[#1F1E1B] group-hover:rotate-[-6deg] group-hover:scale-105">
                    {icons[index % icons.length]}
                  </div>
                  <h3 className={`text-lg sm:text-xl font-medium text-[#1E1D1A] mb-2.5 ${headingFont}`}>{pillar.title}</h3>
                  <p className="text-[13px] text-[#635E56] leading-relaxed mb-3">{pillar.desc}</p>
                  <p className="text-[12px] text-[#8C8479] leading-relaxed pt-2 border-t border-[#F5F2EB] mt-auto">{pillar.additional}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};