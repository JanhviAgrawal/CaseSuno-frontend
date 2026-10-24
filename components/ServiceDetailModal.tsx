"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { ServiceItem } from "./ServicesSection";
import { useLanguage } from "../context/LanguageContext";
import { ModalShell, ModalCloseButton } from "./ModalShell";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  /** Receives the service id (EnquiryModal pre-selects the matching category) */
  onStartEnquiry: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose, onStartEnquiry }) => {
  const { language } = useLanguage();
  const isGu = language === "gu";
  const isHi = language === "hi";

  if (!service) return null;
  const headingFont = isGu || isHi ? "font-sans font-semibold" : "font-serif";

  return (
    <ModalShell onClose={onClose} ariaLabel={service.title}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E8E4DB] bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#F5F2EA] flex items-center justify-center shrink-0">{service.icon}</div>
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#8C8479] uppercase block">
              {isGu ? "સેવા વિહંગાવલોકન" : isHi ? "सेवा विवरण" : "Service Overview"}
            </span>
            <h3 className={`text-xl sm:text-2xl text-[#1E1D1A] ${headingFont}`}>{service.title}</h3>
          </div>
        </div>
        <ModalCloseButton onClick={onClose} />
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 text-[#38352F]">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8479] mb-2">
            {isGu ? "આ સેવા વિશે" : isHi ? "इस सेवा के बारे में" : "About This Service"}
          </h4>
          <p className="text-sm text-[#47433B] leading-relaxed">{service.overview}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8479]">
            {isGu ? "CASE SUNO કેવી રીતે મદદ કરે છે:" : isHi ? "CASE SUNO किस प्रकार सहायता करता है:" : "How CASE SUNO Helps:"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {service.whatWeDo.map((item, idx) => (
              <div
                key={idx}
                className="cs-rise flex items-start gap-2.5 p-3 bg-white border border-[#E8E4DB] rounded-sm text-xs leading-normal transition-all duration-200 hover:border-[#BFB6A6] hover:-translate-y-0.5 hover:shadow-xs"
                style={{ animationDelay: `${100 + idx * 50}ms` }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#7A6B52] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8479]">
            {isGu ? "આવરી લેવામાં આવેલી સામાન્ય પરિસ્થિતિઓ:" : isHi ? "शामिल सामान्य स्थितियां:" : "Common Scenarios Covered:"}
          </h4>
          <ul className="space-y-2 text-xs text-[#524E46]">
            {service.commonSituations.map((sit, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C8479] shrink-0" />
                <span>{sit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3.5 sm:p-4 bg-[#F2EDE2] border border-[#DDD6C8] rounded-sm flex items-start gap-3 text-xs text-[#4F493D]">
          <Clock className="w-4 h-4 text-[#8C8479] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-[#262420]">
              {isGu ? "માધ્યમ અને પદ્ધતિ:" : isHi ? "माध्यम एवं प्रणाली:" : "Format & Mode:"}
            </span>
            <span>{service.deliveryMode}</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 border-t border-[#E8E4DB] bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-[#7A7468]">
          {isGu ? "ગોપનીય · બિન-બાધ્યતાકારી પ્રારંભિક ચકાસણી" : isHi ? "गोपनीय · गैर-बाध्यकारी प्रारंभिक समीक्षा" : "Confidential · Non-binding preliminary intake"}
        </span>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 sm:w-auto px-4 py-2 border border-[#D9D3C7] text-xs text-[#5C564C] rounded-sm hover:text-black hover:border-[#1E1D1A] active:scale-[0.97] transition-all cursor-pointer"
          >
            {isGu ? "બંધ કરો" : isHi ? "बंद करें" : "Close"}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartEnquiry(service.id);
            }}
            className="group w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1F1E1B] hover:bg-[#33312B] text-white text-xs font-medium rounded-sm hover:shadow-md active:scale-[0.97] transition-all cursor-pointer"
          >
            <span>{isGu ? "આ સેવા માટે પૂછપરછ" : isHi ? "इस सेवा के लिए पूछताछ" : `Enquire for ${service.title}`}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </ModalShell>
  );
};