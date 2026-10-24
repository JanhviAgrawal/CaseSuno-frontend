"use client";

import React from "react";
import {
  ArrowRight, Users, Briefcase, FileText, Network, Headphones,
  ShieldCheck, Building2, Car, Heart, Landmark, Scale,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./Reveal";

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  overview: string;
  whatWeDo: string[];
  commonSituations: string[];
  deliveryMode: string;
}

const iconClass = "w-5 h-5 text-[#38352F] transition-transform duration-300 group-hover:scale-110";

const serviceIcons: Record<string, React.ReactNode> = {
  "notice-summons-court-case": <Scale className={iconClass} />,
  "police-cyber-online-fraud": <ShieldCheck className={iconClass} />,
  "property-land": <Building2 className={iconClass} />,
  "bank-loan-money-recovery": <Landmark className={iconClass} />,
  "vehicle-rto": <Car className={iconClass} />,
  "family-matters": <Heart className={iconClass} />,
  "business-commercial": <Briefcase className={iconClass} />,
  "consumer-insurance": <Headphones className={iconClass} />,
  "documents-government-services": <FileText className={iconClass} />,
  others: <Network className={iconClass} />,
};

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { t, language } = useLanguage();
  const headingFont = language === "gu" || language === "hi" ? "font-sans font-semibold" : "font-serif";

  const services: ServiceItem[] = t.services.items.map((item: Omit<ServiceItem, "icon">) => ({
    ...item,
    icon: serviceIcons[item.id] || <Users className={iconClass} />,
  }));

  // Duplicate so the marquee loops seamlessly
  const marqueeServices = [...services, ...services];

  return (
    <section id="services" className="w-full py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-t border-[#E8E4DB]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 lg:mb-16">
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-[#8C8479] uppercase">
              <span className="w-6 h-[1.5px] bg-[#8C8479]" aria-hidden="true" />
              <span>{t.services.kicker}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-[2.65rem] font-medium text-[#1E1D1A] leading-tight tracking-tight ${headingFont}`}>
              {t.services.title}
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-[13.5px] text-[#635E56] leading-relaxed">{t.services.desc}</p>
          </div>
        </Reveal>
      </div>

      <Reveal className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12" delay={120}>
        <div className="services-marquee services-marquee-viewport relative w-full overflow-hidden py-3">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 z-10 bg-gradient-to-r from-[#FAF9F6] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 z-10 bg-gradient-to-l from-[#FAF9F6] to-transparent" />

          <div className="services-marquee-track flex w-max">
            {marqueeServices.map((service, index) => {
              const isDuplicate = index >= services.length;
              return (
                <button
                  type="button"
                  key={`${service.id}-${index}`}
                  onClick={() => onSelectService(service)}
                  aria-hidden={isDuplicate || undefined}
                  tabIndex={isDuplicate ? -1 : 0}
                  className="group flex-shrink-0 flex flex-col justify-between text-left p-5 lg:p-6 bg-white border border-[#E8E4DB] rounded-sm hover:border-[#BFB6A6] hover:shadow-lg hover:-translate-y-1.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F1E1B]/30 transition-all duration-300 cursor-pointer w-[250px] sm:w-[275px] lg:w-[290px] min-h-[250px] sm:min-h-[270px]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-sm bg-[#F5F2EA] flex items-center justify-center mb-5 group-hover:bg-[#EBE5D8] group-hover:rotate-[-6deg] transition-all duration-300">
                      {service.icon}
                    </div>
                    <h3 className={`text-base sm:text-lg lg:text-[18.5px] font-medium text-[#1E1D1A] leading-snug mb-2.5 ${headingFont}`}>
                      {service.title}
                    </h3>
                    <p className="text-[12.5px] text-[#6B655B] leading-relaxed line-clamp-3">{service.shortDesc}</p>
                  </div>

                  <div className="w-full pt-5 mt-2 border-t border-[#F2EFE9] flex items-center justify-between text-xs font-medium text-[#1E1D1A] group-hover:text-[#806B49] transition-colors">
                    <span>{t.services.learnMore}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
};