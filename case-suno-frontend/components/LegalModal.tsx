"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LEGAL_DOCS, LEGAL_UPDATED, type LegalType } from "../lib/legal";
import { ModalShell, ModalCloseButton } from "./ModalShell";

interface LegalModalProps {
  type: LegalType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { language } = useLanguage();
  const isIndic = language === "gu" || language === "hi";

  if (!type) return null;

  const active = LEGAL_DOCS[type];
  const tr = (v: Record<typeof language, string>) => v[language];
  const headingFont = isIndic ? "font-sans" : "font-serif";

  const openFull = { en: "Open full page", hi: "पूरा पृष्ठ खोलें", gu: "આખું પૃષ્ઠ ખોલો" }[language];
  const understand = { en: "I Understand", hi: "मैं समझता/समझती हूँ", gu: "હું સમજું છું" }[language];

  return (
    <ModalShell onClose={onClose} maxHeightClass="max-h-[85vh]" zIndexClass="z-[60]" ariaLabel={tr(active.title)}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E8E4DB] bg-white">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#8C8479] uppercase block">{tr(active.kicker)}</span>
          <h3 className={`text-xl sm:text-2xl text-[#1E1D1A] ${isIndic ? "font-sans font-semibold" : "font-serif"}`}>
            {tr(active.title)}
          </h3>
        </div>
        <ModalCloseButton onClick={onClose} />
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs text-[#524E46] leading-relaxed">
        <p className="text-[11px] text-[#8C8479] font-mono">{tr(LEGAL_UPDATED)}</p>
        {active.sections.map((sec, idx) => (
          <div key={sec.id} className="cs-rise space-y-1.5" style={{ animationDelay: `${80 + idx * 80}ms` }}>
            <h4 className={`text-sm sm:text-base font-semibold text-[#1E1D1A] ${headingFont}`}>{tr(sec.h)}</h4>
            <p>{tr(sec.p)}</p>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#E8E4DB] bg-white flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <a
          href={active.href}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link-underline self-center sm:self-auto inline-flex items-center gap-1 text-xs font-medium text-[#1F5C50] hover:text-[#174A41]"
        >
          {openFull}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2 bg-[#1F1E1B] hover:bg-[#33312B] text-white text-xs font-medium rounded-sm hover:shadow-md active:scale-[0.97] transition-all cursor-pointer"
        >
          {understand}
        </button>
      </div>
    </ModalShell>
  );
};