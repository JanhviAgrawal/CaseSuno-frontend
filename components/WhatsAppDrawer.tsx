"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Send, MessageSquare, ExternalLink, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { ModalShell, ModalCloseButton } from "./ModalShell";
import { openWhatsApp } from "./contact";

interface WhatsAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Topic {
  id: string;
  label: string;
  message: string;
}

const TOPICS: Record<"en" | "hi" | "gu", Topic[]> = {
  gu: [
    { id: "notice-summons-court-case", label: "નોટિસ, સમન્સ અને કોર્ટ / કેસ", message: "નમસ્તે CASE SUNO, મને નોટિસ, સમન્સ અથવા કોર્ટ / કેસ સંબંધિત બાબતમાં મદદ જોઈએ છે." },
    { id: "police-cyber-online-fraud", label: "પોલીસ, સાયબર અને ઓનલાઈન ફ્રોડ", message: "નમસ્તે CASE SUNO, મને પોલીસ, સાયબર અથવા ઓનલાઈન ફ્રોડ સંબંધિત બાબતમાં મદદ જોઈએ છે." },
    { id: "property-land", label: "મિલકત અને જમીન", message: "નમસ્તે CASE SUNO, મને મિલકત અથવા જમીન સંબંધિત બાબતમાં મદદ જોઈએ છે." },
    { id: "bank-loan-money-recovery", label: "બેંક, લોન, પૈસા અને રિકવરી", message: "નમસ્તે CASE SUNO, મને બેંક, લોન, પૈસા અથવા રિકવરી સંબંધિત બાબતમાં મદદ જોઈએ છે." },
    { id: "vehicle-rto", label: "વાહન અને RTO", message: "નમસ્તે CASE SUNO, મને વાહન અથવા RTO સંબંધિત બાબતમાં મદદ જોઈએ છે." },
    { id: "family-matters", label: "પારિવારિક બાબતો", message: "નમસ્તે CASE SUNO, મને પારિવારિક બાબતમાં મદદ અથવા માર્ગદર્શન જોઈએ છે." },
    { id: "business-commercial", label: "વ્યવસાય અને કોમર્શિયલ બાબતો", message: "નમસ્તે CASE SUNO, મને વ્યવસાય અથવા કોમર્શિયલ બાબતમાં મદદ જોઈએ છે." },
    { id: "consumer-insurance", label: "ગ્રાહક અને વીમા", message: "નમસ્તે CASE SUNO, મને ગ્રાહક અથવા વીમા સંબંધિત બાબતમાં મદદ જોઈએ છે." },
    { id: "documents-government-services", label: "દસ્તાવેજો અને સરકારી સેવાઓ", message: "નમસ્તે CASE SUNO, મને દસ્તાવેજ અથવા સરકારી સેવા સંબંધિત બાબતમાં મદદ જોઈએ છે." },
    { id: "others", label: "અન્ય", message: "નમસ્તે CASE SUNO, મારે એક બાબતે મદદ જોઈએ છે." },
  ],
  hi: [
    { id: "notice-summons-court-case", label: "नोटिस, समन और कोर्ट / केस", message: "नमस्ते CASE SUNO, मुझे नोटिस, समन या कोर्ट / केस से जुड़े मामले में मदद चाहिए।" },
    { id: "police-cyber-online-fraud", label: "पुलिस, साइबर और ऑनलाइन फ्रॉड", message: "नमस्ते CASE SUNO, मुझे पुलिस, साइबर या ऑनलाइन फ्रॉड से जुड़े मामले में मदद चाहिए।" },
    { id: "property-land", label: "संपत्ति और भूमि", message: "नमस्ते CASE SUNO, मुझे संपत्ति या जमीन से जुड़े मामले में मदद चाहिए।" },
    { id: "bank-loan-money-recovery", label: "बैंक, लोन, पैसा और रिकवरी", message: "नमस्ते CASE SUNO, मुझे बैंक, लोन, पैसे या रिकवरी से जुड़े मामले में मदद चाहिए।" },
    { id: "vehicle-rto", label: "वाहन और RTO", message: "नमस्ते CASE SUNO, मुझे वाहन या RTO से जुड़े मामले में मदद चाहिए।" },
    { id: "family-matters", label: "पारिवारिक मामले", message: "नमस्ते CASE SUNO, मुझे पारिवारिक मामले में मदद या मार्गदर्शन चाहिए।" },
    { id: "business-commercial", label: "व्यवसाय और कमर्शियल मामले", message: "नमस्ते CASE SUNO, मुझे व्यवसाय या कमर्शियल मामले में मदद चाहिए।" },
    { id: "consumer-insurance", label: "उपभोक्ता और बीमा", message: "नमस्ते CASE SUNO, मुझे उपभोक्ता या बीमा से जुड़े मामले में मदद चाहिए।" },
    { id: "documents-government-services", label: "दस्तावेज और सरकारी सेवाएं", message: "नमस्ते CASE SUNO, मुझे दस्तावेज या सरकारी सेवा से जुड़े मामले में मदद चाहिए।" },
    { id: "others", label: "अन्य", message: "नमस्ते CASE SUNO, मुझे एक मामले में मदद चाहिए।" },
  ],
  en: [
    { id: "notice-summons-court-case", label: "Notice, Summons & Court / Case", message: "Hello CASE SUNO, I need help with a notice, summons, or court / case matter." },
    { id: "police-cyber-online-fraud", label: "Police, Cyber & Online Fraud", message: "Hello CASE SUNO, I need help with a police, cyber, or online fraud matter." },
    { id: "property-land", label: "Property & Land", message: "Hello CASE SUNO, I need help with a property or land matter." },
    { id: "bank-loan-money-recovery", label: "Bank, Loan, Money & Recovery", message: "Hello CASE SUNO, I need help with a bank, loan, money, or recovery matter." },
    { id: "vehicle-rto", label: "Vehicle & RTO", message: "Hello CASE SUNO, I need help with a vehicle or RTO matter." },
    { id: "family-matters", label: "Family Matters", message: "Hello CASE SUNO, I need help or guidance with a family matter." },
    { id: "business-commercial", label: "Business & Commercial Matters", message: "Hello CASE SUNO, I need help with a business or commercial matter." },
    { id: "consumer-insurance", label: "Consumer & Insurance", message: "Hello CASE SUNO, I need help with a consumer or insurance matter." },
    { id: "documents-government-services", label: "Documents & Government Services", message: "Hello CASE SUNO, I need help with a document or government service matter." },
    { id: "others", label: "Others", message: "Hello CASE SUNO, I have a query and would like some help." },
  ],
};

export const WhatsAppDrawer: React.FC<WhatsAppDrawerProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const lang = (language === "gu" || language === "hi" ? language : "en") as "en" | "hi" | "gu";
  const topics = useMemo(() => TOPICS[lang], [lang]);

  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [customText, setCustomText] = useState(topics[0].message);

  // Keep the same topic but switch its message when language changes
  useEffect(() => {
    const same = topics.find((t) => t.id === selectedTopicId) ?? topics[0];
    setSelectedTopicId(same.id);
    setCustomText(same.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  if (!isOpen) return null;

  const L = (en: string, hi: string, gu: string) => (lang === "gu" ? gu : lang === "hi" ? hi : en);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopicId(topic.id);
    setCustomText(topic.message);
  };

  const handleLaunchWhatsApp = () => {
    const topicLabel = topics.find((t) => t.id === selectedTopicId)?.label ?? topics[0].label;
    openWhatsApp(`*CASE SUNO Inquiry*\n*Topic:* ${topicLabel}\n\n${customText.trim() || topics[0].message}`);
    onClose();
  };

  return (
    <ModalShell onClose={onClose} maxWidthClass="max-w-md" maxHeightClass="max-h-[92vh]" panelClassName="bg-white" ariaLabel="WhatsApp">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-[#075E54] text-white">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-[#075E54]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">{L("CASE SUNO Support", "CASE SUNO सहायता", "CASE SUNO સપોર્ટ")}</h3>
            <p className="text-[11px] text-[#A7D8CC]">{L("Online · Quick response", "ऑनलाइन · जल्द जवाब मिलेगा", "ઓનલાઇન · ટૂંક સમયમાં જવાબ")}</p>
          </div>
        </div>
        <ModalCloseButton onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10" />
      </div>

      <div className="p-4 sm:p-5 bg-[#ECE5DD] space-y-3.5 sm:space-y-4 overflow-y-auto">
        <div className="cs-rise flex flex-col items-start max-w-[90%] sm:max-w-[85%]" style={{ animationDelay: "120ms" }}>
          <div className="p-3 bg-white rounded-lg rounded-tl-none shadow-xs text-xs text-[#2A2927] space-y-1.5 leading-relaxed">
            <p className="font-medium text-[#1E1D1A]">
              {L("Namaste 🙏 Welcome to CASE SUNO.", "नमस्ते 🙏 CASE SUNO में आपका स्वागत है।", "નમસ્તે 🙏 CASE SUNO માં આપનું સ્વાગત છે.")}
            </p>
            <p>
              {L(
                "Tell us about your situation. Choose a topic below and send us a message.",
                "अपनी समस्या या जरूरत बताएं। नीचे एक विषय चुनें और हमें मैसेज भेजें।",
                "તમારી સમસ્યા અથવા જરૂરિયાત જણાવો. નીચેનો વિષય પસંદ કરો અને અમને મેસેજ મોકલો.",
              )}
            </p>
            <span className="text-[9px] text-[#8C8479] text-right block">{L("Just now", "अभी", "હમણાં જ")}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#5A554D] uppercase tracking-wider block">
            {L("Choose a topic", "विषय चुनें", "વિષય પસંદ કરો")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleTopicSelect(topic)}
                aria-pressed={selectedTopicId === topic.id}
                className={`px-2.5 py-1 text-[11px] rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
                  selectedTopicId === topic.id
                    ? "bg-[#128C7E] text-white border-[#128C7E] shadow-xs"
                    : "bg-white text-[#38352F] border-[#D1CBC0] hover:bg-[#F7F5F0] hover:border-[#128C7E]/50"
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <label htmlFor="wa-msg" className="text-[11px] font-semibold text-[#5A554D] uppercase tracking-wider block">
            {L("Your message", "आपका संदेश", "તમારો મેસેજ")}
          </label>
          <textarea
            id="wa-msg"
            rows={3}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full p-2.5 text-xs bg-white border border-[#C5BFA3] rounded-md text-[#1E1D1A] resize-none transition-all focus:outline-hidden focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/20"
          />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#5C564C]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#128C7E] shrink-0" />
          <span>{L("Secure chat on WhatsApp", "WhatsApp पर सुरक्षित चैट", "WhatsApp પર સુરક્ષિત ચેટ")}</span>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-[#E8E4DB] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-2 text-xs text-[#6B655B] hover:text-black font-medium rounded-md hover:bg-[#F4F1EA] transition-colors cursor-pointer"
        >
          {L("Cancel", "रद्द करें", "રદ કરો")}
        </button>
        <button
          type="button"
          onClick={handleLaunchWhatsApp}
          className="group flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-md shadow-xs hover:shadow-md active:scale-[0.97] transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span>{L("Open WhatsApp", "व्हाट्सएप खोलें", "વોટ્સએપ ખોલો")}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </ModalShell>
  );
};