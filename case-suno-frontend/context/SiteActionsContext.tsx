"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { EnquiryModal } from "../components/EnquiryModal";
import { LegalModal } from "../components/LegalModal";
import { WhatsAppDrawer } from "../components/WhatsAppDrawer";
import { ChatAssistant } from "../components/ChatAssistant";
import type { LegalType } from "../lib/legal";

interface SiteActions {
  /** Opens the enquiry form; optional service id pre-selects the category */
  openEnquiry: (category?: string) => void;
  /** Opens the WhatsApp drawer */
  openWhatsAppDrawer: () => void;
}

const SiteActionsContext = createContext<SiteActions | undefined>(undefined);

/**
 * Global UI available on every page:
 * enquiry form, WhatsApp drawer, chat assistant and the legal popup used by the form.
 */
export const SiteActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryCategory, setEnquiryCategory] = useState("");
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [legalType, setLegalType] = useState<LegalType | null>(null);

  /** Always resets the category so an old selection never "sticks". */
  const openEnquiry = useCallback((category: string = "") => {
    setEnquiryCategory(category);
    setEnquiryOpen(true);
  }, []);

  const openWhatsAppDrawer = useCallback(() => setWhatsAppOpen(true), []);

  const value = useMemo(() => ({ openEnquiry, openWhatsAppDrawer }), [openEnquiry, openWhatsAppDrawer]);

  return (
    <SiteActionsContext.Provider value={value}>
      {children}

      {/* Floating chat button */}
      <ChatAssistant onStartEnquiry={openEnquiry} onOpenWhatsApp={openWhatsAppDrawer} />

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        initialCategory={enquiryCategory}
        onOpenLegal={setLegalType}
      />

      <WhatsAppDrawer isOpen={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />

      {/* Rendered last + z-[60] so it sits above the Enquiry modal */}
      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </SiteActionsContext.Provider>
  );
};

export const useSiteActions = (): SiteActions => {
  const ctx = useContext(SiteActionsContext);
  if (!ctx) throw new Error("useSiteActions must be used within a SiteActionsProvider");
  return ctx;
};