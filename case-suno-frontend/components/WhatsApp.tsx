"use client";

import React from "react";
import { openWhatsApp } from "./contact";
import { useLanguage } from "../context/LanguageContext";

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "h-3.5 w-3.5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.49 0 .16 5.33.16 11.88c0 2.09.55 4.13 1.6 5.92L.05 24l6.35-1.66a11.87 11.87 0 0 0 5.64 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.17-3.41-8.41Zm-8.47 18.32h-.01a9.870 9.870 0 0 1-5.03-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.9 9.9 0 1 1 8.39 4.65Zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.890 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
  </svg>
);

interface WhatsAppFloatingButtonProps {
  /** If provided (e.g. open WhatsAppDrawer), used instead of opening WhatsApp directly */
  onClick?: () => void;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ onClick }) => {
  const { language } = useLanguage();
  const label =
    language === "gu" ? "વોટ્સએપ પર ચેટ કરો" : language === "hi" ? "व्हाट्सएप पर चैट करें" : "Chat on WhatsApp";

  return (
    <button
      type="button"
      onClick={onClick ?? (() => openWhatsApp())}
      aria-label={label}
      title={label}
      className="cs-float-in group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1EBE5D] hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" aria-hidden="true" />
      <WhatsAppIcon className="relative h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-sm bg-[#1F1E1B] px-3 py-1.5 text-xs font-medium text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:block">
        {label}
      </span>
    </button>
  );
};