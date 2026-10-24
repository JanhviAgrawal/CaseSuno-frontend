"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Car,
  ChevronRight,
  ClipboardList,
  FileText,
  Gavel,
  HeartHandshake,
  House,
  IndianRupee,
  Landmark,
  Laptop,
  ListChecks,
  Lock,
  MessageCircle,
  Play,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage, type Language } from "../context/LanguageContext";
import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";

interface HeroProps {
  /** Optional service id pre-selects the enquiry category */
  onOpenEnquiry: (category?: string) => void;
  onOpenLocationInfo?: () => void;
}

type L3 = Record<Language, string>;

const HERO_PHOTO = "/images/hero-person.webp";
const HERO_FALLBACK = "/images/hero2.webp";

/* WhatsApp: country code + number, no "+" or spaces */
const WHATSAPP_NUMBER = "918000784778";

/* CASE SUNO theme */
const INK = "#1F1E1B";
const GREEN = "#1F5C50";
const TEXT = "#3F3F3B";
const MUTED = "#6B655B";
const WA_GREEN = "#1DA851";

const TONES = [
  { bg: "#E6EFEA", fg: "#1F5C50" },
  { bg: "#F4ECDB", fg: "#8A6A2E" },
  { bg: "#EFEAE1", fg: "#5C5246" },
];

/* =====================================================================
   Copy
===================================================================== */
const H = {
  pill: [
    { en: "Real People", gu: "વાસ્તવિક લોકો", hi: "असली लोग" },
    { en: "Real Problems", gu: "વાસ્તવિક સમસ્યાઓ", hi: "असली समस्याएं" },
    { en: "Real Guidance", gu: "વાસ્તવિક માર્ગદર્શન", hi: "सही मार्गदर्शन" },
  ] as L3[],
  title: {
    en: "Facing a Legal, Financial or Official Problem?",
    gu: "કાનૂની, નાણાકીય કે સરકારી સમસ્યા છે?",
    hi: "कानूनी, वित्तीय या सरकारी समस्या है?",
  } as L3,
  accent: { en: "You're in the Right Place.", gu: "તમે યોગ્ય જગ્યાએ છો.", hi: "आप सही जगह पर हैं।" } as L3,
  desc: {
    en: "listens to your problem, helps you understand your situation, organise the information and documents, and coordinates the appropriate independent professional when required.",
    gu: "તમારી સમસ્યા સાંભળે છે, પરિસ્થિતિ સમજવામાં મદદ કરે છે, માહિતી અને દસ્તાવેજો વ્યવસ્થિત કરે છે અને જરૂર પડે ત્યારે યોગ્ય સ્વતંત્ર વ્યાવસાયિક સાથે સંકલન કરે છે.",
    hi: "आपकी समस्या सुनता है, आपकी स्थिति समझने में मदद करता है, जानकारी और दस्तावेज़ व्यवस्थित करता है और ज़रूरत पड़ने पर उपयुक्त स्वतंत्र पेशेवर से समन्वय करता है।",
  } as L3,
  features: [
    { icon: ShieldCheck, label: { en: "Simple Process", gu: "સરળ પ્રક્રિયા", hi: "सरल प्रक्रिया" } },
    { icon: ListChecks, label: { en: "Clear Next Steps", gu: "સ્પષ્ટ આગળના પગલાં", hi: "स्पष्ट अगले कदम" } },
    { icon: Users, label: { en: "Professional Coordination", gu: "વ્યાવસાયિક સંકલન", hi: "पेशेवर समन्वय" } },
    { icon: Lock, label: { en: "Confidential & Secure", gu: "ગોપનીય અને સુરક્ષિત", hi: "गोपनीय और सुरक्षित" } },
  ] as { icon: LucideIcon; label: L3 }[],
  waMsg: {
    en: "Hi CASE SUNO, I need help with my problem.",
    gu: "નમસ્તે CASE SUNO, મને મારી સમસ્યામાં મદદ જોઈએ છે.",
    hi: "नमस्ते CASE SUNO, मुझे अपनी समस्या में मदद चाहिए।",
  } as L3,
  howSub: { en: "5 simple steps", gu: "૫ સરળ તબક્કા", hi: "5 सरल चरण" } as L3,
  catPre: { en: "What Brings You to ", gu: "", hi: "" } as L3,
  catPost: { en: "?", gu: " પાસે તમે શેના માટે આવ્યા છો?", hi: " पर आप किस लिए आए हैं?" } as L3,
  search: {
    en: "Search your problem (e.g. bank notice, FIR, property, divorce...)",
    gu: "તમારી સમસ્યા શોધો (દા.ત. બેંક નોટિસ, FIR, મિલકત, છૂટાછેડા...)",
    hi: "अपनी समस्या खोजें (जैसे बैंक नोटिस, FIR, संपत्ति, तलाक...)",
  } as L3,
  clear: { en: "Clear search", gu: "શોધ સાફ કરો", hi: "खोज साफ़ करें" } as L3,
  empty: {
    en: "No exact match — tell us in your own words and we'll guide you.",
    gu: "ચોક્કસ મેળ મળ્યો નથી — તમારા શબ્દોમાં જણાવો, અમે માર્ગદર્શન આપીશું.",
    hi: "सटीक मेल नहीं मिला — अपने शब्दों में बताएं, हम मार्गदर्शन करेंगे।",
  } as L3,
  emptyCta: { en: "Start an Enquiry", gu: "પૂછપરછ શરૂ કરો", hi: "पूछताछ शुरू करें" } as L3,
};

/* =====================================================================
   Floating category bubbles (clickable)
   pos values are % of the photo frame (right half of the hero).
===================================================================== */
type Tone = "mint" | "peach" | "solid";

const BUBBLE_TONES: Record<Tone, { bg: string; fg: string }> = {
  mint: { bg: "linear-gradient(145deg, #E6F3ED 0%, #CFE5DB 100%)", fg: "#1F5C50" },
  peach: { bg: "linear-gradient(145deg, #FBEDDD 0%, #F1D6BA 100%)", fg: "#8A5A2B" },
  solid: { bg: "linear-gradient(145deg, #2C7A67 0%, #1F5C50 100%)", fg: "#FFFFFF" },
};

interface Bubble {
  key: string;
  serviceId: string;
  icon: LucideIcon;
  tone: Tone;
  title: L3;
  desc: L3;
  side: "left" | "right";
  pos: { top: number; left?: number; right?: number };
  /** "xl" = only on wide screens; "lg" = from 1024px */
  show: "lg" | "xl";
  line?: boolean;
  delay: number;
  mobile?: React.CSSProperties;
}

const BUBBLES: Bubble[] = [
  /* ---------- Left column (xl+) ---------- */
  { key: "bank", serviceId: "bank-loan-money-recovery", icon: Landmark, tone: "mint", side: "left", show: "xl", line: true,
    pos: { top: 7, left: 14 }, delay: 0, mobile: { top: "5%", left: "4%" },
    title: { en: "Bank Notice", gu: "બેંક નોટિસ", hi: "बैंक नोटिस" },
    desc: { en: "EMI, recovery, account issues, loan disputes...", gu: "EMI, રિકવરી, એકાઉન્ટ સમસ્યા, લોન વિવાદ...", hi: "EMI, रिकवरी, खाता समस्या, लोन विवाद..." } },
  { key: "property", serviceId: "property-land", icon: House, tone: "peach", side: "left", show: "xl", line: true,
    pos: { top: 25, left: 1 }, delay: 1.2,
    title: { en: "Property Dispute", gu: "મિલકત વિવાદ", hi: "संपत्ति विवाद" },
    desc: { en: "Possession, dispute, society, land issues...", gu: "કબજો, વિવાદ, સોસાયટી, જમીન સમસ્યા...", hi: "कब्ज़ा, विवाद, सोसायटी, ज़मीन मामले..." } },
  { key: "court", serviceId: "notice-summons-court-case", icon: FileText, tone: "mint", side: "left", show: "xl", line: true,
    pos: { top: 44, left: 3 }, delay: 2.4,
    title: { en: "Court / Case", gu: "કોર્ટ / કેસ", hi: "कोर्ट / केस" },
    desc: { en: "Case assistance, hearings, tracking...", gu: "કેસ સહાય, સુનાવણી, ટ્રેકિંગ...", hi: "केस सहायता, सुनवाई, ट्रैकिंग..." } },
  { key: "family", serviceId: "family-matters", icon: HeartHandshake, tone: "peach", side: "left", show: "xl",
    pos: { top: 63, left: 0 }, delay: 3.4, mobile: { bottom: "6%", right: "4%" },
    title: { en: "Family & Divorce", gu: "પરિવાર અને છૂટાછેડા", hi: "परिवार और तलाक" },
    desc: { en: "Divorce, maintenance, custody, family disputes...", gu: "છૂટાછેડા, ભરણપોષણ, કસ્ટડી, પારિવારિક વિવાદ...", hi: "तलाक, भरण-पोषण, कस्टडी, पारिवारिक विवाद..." } },

  /* ---------- Right column (lg+) ---------- */
  { key: "police", serviceId: "police-cyber-online-fraud", icon: ShieldCheck, tone: "peach", side: "right", show: "lg", line: true,
    pos: { top: 6, right: 3 }, delay: 0.6,
    title: { en: "Police Matter", gu: "પોલીસ બાબત", hi: "पुलिस मामला" },
    desc: { en: "Complaint, FIR, police notice, seizure, legal help...", gu: "ફરિયાદ, FIR, પોલીસ નોટિસ, જપ્તી, કાનૂની મદદ...", hi: "शिकायत, FIR, पुलिस नोटिस, जब्ती, कानूनी मदद..." } },
  { key: "money", serviceId: "bank-loan-money-recovery", icon: IndianRupee, tone: "solid", side: "right", show: "lg", line: true,
    pos: { top: 27, right: 2.5 }, delay: 1.8,
    title: { en: "Money Recovery", gu: "પૈસાની વસૂલાત", hi: "पैसे की वसूली" },
    desc: { en: "Payments, refunds, recovery...", gu: "ચુકવણી, રિફંડ, વસૂલાત...", hi: "भुगतान, रिफंड, वसूली..." } },
  { key: "vehicle", serviceId: "vehicle-rto", icon: Car, tone: "peach", side: "right", show: "lg", line: true,
    pos: { top: 54, right: 2.5 }, delay: 3,
    title: { en: "Vehicle & RTO", gu: "વાહન અને RTO", hi: "वाहन और RTO" },
    desc: { en: "Challans, licence, RC, accidents...", gu: "ચલણ, લાઇસન્સ, RC, અકસ્માત...", hi: "चालान, लाइसेंस, RC, दुर्घटना..." } },
];

/* Approximate card size in % of the frame — used to draw the dotted lines */
const CARD_W = 24;
const CARD_H = 10;
const HEAD_LEFT = { x: 46, y: 30 };
const HEAD_RIGHT = { x: 65, y: 26 };

const linePath = (b: Bubble) => {
  const sy = b.pos.top + CARD_H / 2;
  const sx = b.side === "left" ? (b.pos.left ?? 0) + CARD_W : 100 - (b.pos.right ?? 0) - CARD_W;
  const e = b.side === "left" ? HEAD_LEFT : HEAD_RIGHT;
  const cx = (sx + e.x) / 2;
  const cy = Math.min(sy, e.y) - 5;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${e.x} ${e.y}`;
};

const SPARKLES = [
  { top: "20%", left: "42%", size: 8, delay: 0 },
  { top: "9%", left: "41%", size: 6, delay: 1.1 },
  { top: "38%", left: "38%", size: 7, delay: 2.2 },
  { top: "56%", left: "34%", size: 6, delay: 1.6 },
];

/* =====================================================================
   Category grid (all open the enquiry form)
===================================================================== */
interface Category {
  key: string;
  serviceId: string;
  icon: LucideIcon;
  title: L3;
  desc: L3;
  kw: string;
}

const CATEGORIES: Category[] = [
  { key: "bank", serviceId: "bank-loan-money-recovery", icon: Landmark,
    title: { en: "Bank & Loan Problems", gu: "બેંક અને લોન સમસ્યાઓ", hi: "बैंक और लोन समस्याएं" },
    desc: { en: "EMI, recovery, bank notices, account issues, loan disputes", gu: "EMI, રિકવરી, બેંક નોટિસ, એકાઉન્ટ સમસ્યા, લોન વિવાદ", hi: "EMI, रिकवरी, बैंक नोटिस, खाता समस्या, लोन विवाद" },
    kw: "emi loan bank recovery account mortgage" },
  { key: "property", serviceId: "property-land", icon: House,
    title: { en: "Property & Land", gu: "મિલકત અને જમીન", hi: "संपत्ति और भूमि" },
    desc: { en: "Possession, property disputes, bank-sealed property, society issues", gu: "કબજો, મિલકત વિવાદ, બેંક દ્વારા સીલ મિલકત, સોસાયટી મુદ્દા", hi: "कब्ज़ा, संपत्ति विवाद, बैंक द्वारा सील संपत्ति, सोसायटी मामले" },
    kw: "property land flat house plot possession society sealed" },
  { key: "notices", serviceId: "notice-summons-court-case", icon: FileText,
    title: { en: "Notices & Summons", gu: "નોટિસ અને સમન્સ", hi: "नोटिस और समन" },
    desc: { en: "Court, police, bank, government, tax, RTO, legal notices", gu: "કોર્ટ, પોલીસ, બેંક, સરકારી, ટેક્સ, RTO, કાનૂની નોટિસ", hi: "कोर्ट, पुलिस, बैंक, सरकारी, टैक्स, RTO, कानूनी नोटिस" },
    kw: "notice summons legal notice tax" },
  { key: "police", serviceId: "police-cyber-online-fraud", icon: ShieldAlert,
    title: { en: "Police Matters", gu: "પોલીસ બાબતો", hi: "पुलिस मामले" },
    desc: { en: "Complaint, FIR, police notice, seizure, investigation", gu: "ફરિયાદ, FIR, પોલીસ નોટિસ, જપ્તી, તપાસ", hi: "शिकायत, FIR, पुलिस नोटिस, जब्ती, जांच" },
    kw: "police fir complaint arrest seizure investigation" },
  { key: "court", serviceId: "notice-summons-court-case", icon: Gavel,
    title: { en: "Court & Case Assistance", gu: "કોર્ટ અને કેસ સહાય", hi: "कोर्ट और केस सहायता" },
    desc: { en: "Case documents, hearing dates, case tracking, next steps", gu: "કેસ દસ્તાવેજો, સુનાવણીની તારીખો, કેસ ટ્રેકિંગ, આગળના પગલાં", hi: "केस दस्तावेज़, सुनवाई की तारीखें, केस ट्रैकिंग, अगले कदम" },
    kw: "court case hearing tracking judge" },
  { key: "money", serviceId: "bank-loan-money-recovery", icon: IndianRupee,
    title: { en: "Money & Payment Issues", gu: "પૈસા અને ચુકવણી સમસ્યાઓ", hi: "पैसे और भुगतान समस्याएं" },
    desc: { en: "Unpaid money, invoices, refunds, payment disputes, recovery", gu: "બાકી પૈસા, ઇનવોઇસ, રિફંડ, ચુકવણી વિવાદ, વસૂલાત", hi: "बकाया पैसा, इनवॉइस, रिफंड, भुगतान विवाद, वसूली" },
    kw: "money payment invoice refund recovery owe unpaid" },
  { key: "vehicle", serviceId: "vehicle-rto", icon: Car,
    title: { en: "Vehicle & RTO", gu: "વાહન અને RTO", hi: "वाहन और RTO" },
    desc: { en: "Challans, vehicle seizure, licence, RC, accidents, RTO notices", gu: "ચલણ, વાહન જપ્તી, લાઇસન્સ, RC, અકસ્માત, RTO નોટિસ", hi: "चालान, वाहन जब्ती, लाइसेंस, RC, दुर्घटना, RTO नोटिस" },
    kw: "vehicle rto challan licence license rc accident car bike" },
  { key: "cyber", serviceId: "police-cyber-online-fraud", icon: Laptop,
    title: { en: "Cyber & Online Fraud", gu: "સાયબર અને ઓનલાઇન ફ્રોડ", hi: "साइबर और ऑनलाइन फ्रॉड" },
    desc: { en: "UPI fraud, online scams, hacked accounts, identity theft", gu: "UPI ફ્રોડ, ઓનલાઇન સ્કેમ, હેક થયેલા એકાઉન્ટ, ઓળખની ચોરી", hi: "UPI फ्रॉड, ऑनलाइन स्कैम, हैक अकाउंट, पहचान की चोरी" },
    kw: "cyber fraud upi scam hacked hack identity online" },
  { key: "business", serviceId: "business-commercial", icon: Briefcase,
    title: { en: "Business & Employment", gu: "વ્યવસાય અને રોજગાર", hi: "व्यवसाय और रोज़गार" },
    desc: { en: "Business disputes, vendor issues, employment matters, contracts", gu: "વ્યવસાયિક વિવાદ, વેન્ડર સમસ્યા, રોજગાર બાબતો, કરાર", hi: "व्यावसायिक विवाद, वेंडर समस्या, रोज़गार मामले, अनुबंध" },
    kw: "business employment job salary vendor contract agreement" },
  { key: "family", serviceId: "family-matters", icon: Users,
    title: { en: "Family & Matrimonial", gu: "પરિવાર અને લગ્ન સંબંધિત", hi: "परिवार और वैवाहिक" },
    desc: { en: "Divorce, maintenance, custody, family disputes", gu: "છૂટાછેડા, ભરણપોષણ, કસ્ટડી, પારિવારિક વિવાદ", hi: "तलाक, भरण-पोषण, कस्टडी, पारिवारिक विवाद" },
    kw: "family divorce marriage maintenance custody inheritance will" },
  { key: "documents", serviceId: "documents-government-services", icon: ClipboardList,
    title: { en: "Documents & Government", gu: "દસ્તાવેજો અને સરકાર", hi: "दस्तावेज़ और सरकार" },
    desc: { en: "Certificates, applications, official notices, government processes", gu: "પ્રમાણપત્રો, અરજીઓ, સત્તાવાર નોટિસ, સરકારી પ્રક્રિયાઓ", hi: "प्रमाणपत्र, आवेदन, आधिकारिक नोटिस, सरकारी प्रक्रियाएं" },
    kw: "document certificate government application official" },
  { key: "other", serviceId: "others", icon: MessageCircle,
    title: { en: "Other / Not Sure", gu: "અન્ય / ખાતરી નથી", hi: "अन्य / पक्का नहीं" },
    desc: { en: "A different problem, or not sure which category to pick", gu: "અલગ સમસ્યા, અથવા કઈ શ્રેણી પસંદ કરવી તે ખબર નથી", hi: "कोई अलग समस्या, या कौन सी श्रेणी चुनें पता नहीं" },
    kw: "other not sure different unknown help" },
];

const haystack = (c: Category) =>
  [c.title.en, c.title.gu, c.title.hi, c.desc.en, c.desc.gu, c.desc.hi, c.kw].join(" ").toLowerCase();

/* =====================================================================
   Component
===================================================================== */
export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry }) => {
  const { t, language } = useLanguage();
  const tr = (v: L3) => v[language];
  const isIndic = language === "gu" || language === "hi";

  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const frame = useRef(0);
  const [photo, setPhoto] = useState(HERO_PHOTO);
  const [query, setQuery] = useState("");

  const showBubbles = photo === HERO_PHOTO;

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(tr(H.waMsg))}`;

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setPhoto(HERO_FALLBACK);
  }, []);

  // Gentle parallax for the bubble layer only (desktop). The photo stays static.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame.current);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    const words = q.split(/\s+/).filter(Boolean);
    return CATEGORIES.filter((c) => {
      const h = haystack(c);
      return words.every((w) => h.includes(w));
    });
  }, [query]);

  const scrollToHow = () => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

  const headlineClass = isIndic
    ? "font-sans font-semibold text-[clamp(1.9rem,7vw,3.2rem)] lg:text-[clamp(2.3rem,3.3vw,3.4rem)] leading-[1.25]"
    : "font-serif font-medium text-[clamp(2.2rem,8.4vw,3.8rem)] lg:text-[clamp(2.7rem,3.9vw,4rem)] leading-[1.05]";

  /* ---------- bubble card ---------- */
  const renderBubble = (b: Bubble, variant: "desktop" | "mobile") => {
    const Icon = b.icon;
    const tone = BUBBLE_TONES[b.tone];
    const isMobile = variant === "mobile";

    const posStyle: React.CSSProperties = isMobile
      ? b.mobile ?? {}
      : {
          top: `${b.pos.top}%`,
          ...(b.pos.left !== undefined ? { left: `${b.pos.left}%` } : {}),
          ...(b.pos.right !== undefined ? { right: `${b.pos.right}%` } : {}),
        };

    return (
      <div
        key={`${b.key}-${variant}`}
        className={`absolute z-20 ${!isMobile && b.show === "xl" ? "hidden xl:block" : ""}`}
        style={posStyle}
      >
        <div className="cs-bob" style={{ animationDelay: `${b.delay}s` }}>
          <button
            type="button"
            onClick={() => onOpenEnquiry(b.serviceId)}
            aria-label={`${tr(b.title)} — ${tr(b.desc)}`}
            className={`cs-rise group relative flex items-center text-left border border-white/90 bg-white/75 backdrop-blur-xl ring-1 ring-black/[0.03] shadow-[0_18px_40px_-18px_rgba(31,30,27,0.35),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/95 hover:shadow-[0_26px_50px_-18px_rgba(31,92,80,0.45),inset_0_1px_0_rgba(255,255,255,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5C50]/40 active:scale-[0.97] cursor-pointer ${
              isMobile
                ? "w-[172px] gap-2.5 rounded-2xl p-2 pr-3"
                : "w-[clamp(200px,12.5vw,250px)] gap-3.5 rounded-[22px] p-3 pr-4"
            }`}
            style={rise(450 + b.delay * 110)}
          >
            <span
              className={`relative flex shrink-0 items-center justify-center rounded-full shadow-[inset_0_-3px_6px_rgba(0,0,0,0.07),0_6px_14px_-6px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 ${
                isMobile ? "h-9 w-9" : "h-[54px] w-[54px]"
              }`}
              style={{ background: tone.bg, color: tone.fg }}
            >
              <Icon className={isMobile ? "h-4 w-4" : "h-6 w-6"} strokeWidth={2.1} />
            </span>

            <span className="min-w-0 flex-1">
              <span
                className={`block font-semibold leading-tight text-[#1E1D1A] ${
                  isMobile ? "text-[12.5px]" : "text-[15.5px]"
                }`}
              >
                {tr(b.title)}
              </span>
              <span
                className={`leading-snug text-[#6B655B] ${
                  isMobile ? "mt-0.5 text-[10.5px] line-clamp-1" : "mt-1 text-[12.5px] line-clamp-2"
                }`}
              >
                {tr(b.desc)}
              </span>
            </span>
          </button>
        </div>
      </div>
    );
  };

  const xlLines = BUBBLES.filter((b) => b.line && b.show === "xl");

  const DottedLines: React.FC<{ items: Bubble[]; className?: string }> = ({ items, className = "" }) => (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 h-full w-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      style={{ filter: "drop-shadow(0 1px 2px rgba(31,30,27,0.25))" }}
    >
      {items.map((b) => (
        <path
          key={b.key}
          d={linePath(b)}
          stroke="#FFFFFF"
          strokeOpacity={0.95}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeDasharray="0.1 8"
          vectorEffect="non-scaling-stroke"
          className="cs-dash"
        />
      ))}
    </svg>
  );

  return (
    <>
      {/* ============================== HERO ============================== */}
      <section
        id="home"
        ref={sectionRef}
        className="relative isolate w-full overflow-hidden bg-gradient-to-br from-[#F6F1E7] via-[#FAF9F6] to-[#F3EFE6]"
      >
        {/* Ambient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
          <div className="cs-blob absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#C9A45C]/12 blur-3xl" />
          <div className="cs-blob absolute -bottom-32 right-1/3 h-[380px] w-[380px] rounded-full bg-[#1F5C50]/10 blur-3xl" style={{ animationDelay: "-6s" }} />
        </div>

        {/* Desktop visual — fixed-height frame (never resizes with language) */}
        <div className="hidden lg:block absolute right-0 top-0 z-0 w-[52%] h-[clamp(720px,100svh,980px)]">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, #000 20%), linear-gradient(to bottom, #000 82%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskImage:
                "linear-gradient(to right, transparent 0%, #000 20%), linear-gradient(to bottom, #000 82%, transparent 100%)",
              maskComposite: "intersect",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={photo}
              alt=""
              fetchPriority="high"
              onError={() => setPhoto(HERO_FALLBACK)}
              className="cs-fade h-full w-full object-cover object-[60%_center]"
            />
          </div>

          {/* Bubble layer (lines + sparkles + cards move together) */}
          {showBubbles && (
            <div
              className="absolute inset-x-0 bottom-0 top-[88px]"
              style={{
                transform: "translate3d(calc(var(--px, 0) * 14px), calc(var(--py, 0) * 10px), 0)",
                transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              <DottedLines items={xlLines} className="hidden xl:block" />

              {SPARKLES.map((s, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="cs-twinkle pointer-events-none absolute z-10 hidden xl:block rounded-full bg-white"
                  style={{
                    top: s.top,
                    left: s.left,
                    width: s.size,
                    height: s.size,
                    animationDelay: `${s.delay}s`,
                    boxShadow: "0 0 10px 3px rgba(255,255,255,0.85), 0 1px 3px rgba(31,30,27,0.2)",
                  }}
                />
              ))}

              {BUBBLES.map((b) => renderBubble(b, "desktop"))}
            </div>
          )}
        </div>

        {/* Content — clicks pass through to the bubbles except on the text column */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-[96px] sm:pt-[104px] lg:pt-[128px] pb-24 lg:pb-36 lg:min-h-[clamp(720px,100svh,980px)] lg:flex lg:items-center lg:pointer-events-none">
          <div className="grid w-full grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 xl:col-span-5 2xl:col-span-6 min-w-0 max-w-[620px] space-y-5 sm:space-y-6 lg:pointer-events-auto">
              {/* Pill */}
              <div
                className="cs-rise inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-[#DCD6C9] bg-[#F1ECE1] px-3.5 py-1.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F5E58]"
                style={rise(0)}
              >
                <Users className="h-4 w-4" style={{ color: GREEN }} />
                {H.pill.map((p, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-[#BFB6A6]">|</span>}
                    <span>{tr(p)}</span>
                  </React.Fragment>
                ))}
              </div>

              {/* Headline */}
              <h1 className={`cs-rise tracking-tight text-balance ${headlineClass}`} style={{ ...rise(100), color: "#171613" }}>
                {tr(H.title)}{" "}
                <span className="cs-gradient-text block mt-1" style={{ ["--c1" as string]: GREEN, ["--c2" as string]: "#3E8B76" }}>
                  {tr(H.accent)}
                </span>
              </h1>

              {/* Description */}
              <p className="cs-rise max-w-[580px] text-[15px] sm:text-[16px] leading-relaxed" style={{ ...rise(200), color: TEXT }}>
                <strong className="font-bold" style={{ color: INK }}>CASE SUNO</strong> {tr(H.desc)}
              </p>

              {/* Feature row */}
              <ul className="cs-rise grid grid-cols-2 gap-x-4 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-6" style={rise(300)}>
                {H.features.map(({ icon: Icon, label }, i) => (
                  <li key={i} className="group flex items-center gap-2 text-[12.5px] sm:text-[13.5px] font-medium text-[#2C2A26]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D9D3C7] bg-[#F4F1EA] text-[#1F5C50] transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-[#1F5C50] group-hover:text-white group-hover:border-[#1F5C50]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {tr(label)}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="cs-rise flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1" style={rise(400)}>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.cta.chatWhatsApp}
                  className="cs-shine cs-press group relative inline-flex min-h-[56px] items-center justify-center gap-3 overflow-hidden rounded-sm px-7 text-[14px] sm:text-[15px] font-medium tracking-wide text-white shadow-[0_8px_0_-4px_#0B5E2E,0_16px_30px_-14px_rgba(18,140,126,0.6)] cursor-pointer"
                  style={{ background: WA_GREEN }}
                >
                  <FaWhatsapp className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:scale-110" />
                  <span>{t.cta.chatWhatsApp}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                <button
                  type="button"
                  onClick={scrollToHow}
                  className="cs-press group inline-flex min-h-[56px] items-center gap-3 rounded-sm border border-[#D9D3C7] bg-white px-4 pr-6 text-left shadow-[0_8px_0_-4px_#E4DED3,0_14px_28px_-16px_rgba(31,30,27,0.3)] cursor-pointer"
                >
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white" style={{ background: GREEN }}>
                    <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: GREEN }} />
                    <Play className="relative h-4 w-4 translate-x-px fill-current" />
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-semibold leading-tight" style={{ color: INK }}>{t.nav.howItWorks}</span>
                    <span className="block text-[12px]" style={{ color: MUTED }}>{tr(H.howSub)}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / tablet visual */}
        <div className="lg:hidden relative z-10 mx-auto -mt-16 w-full max-w-[1400px] px-4 sm:px-6 md:px-8 pb-24">
          <div className="cs-rise relative aspect-[5/4] sm:aspect-[16/10] overflow-hidden rounded-2xl border border-[#E3DED4] shadow-[0_24px_50px_-24px_rgba(31,30,27,0.45)]" style={rise(450)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              onError={() => setPhoto(HERO_FALLBACK)}
              className="pointer-events-none h-full w-full object-cover object-[65%_center]"
            />
            {showBubbles && BUBBLES.filter((b) => b.mobile).map((b) => renderBubble(b, "mobile"))}
          </div>
        </div>
      </section>

      {/* ======================= CATEGORY PANEL ======================= */}
      <div id="categories" className="relative z-10 mx-auto -mt-16 lg:-mt-28 w-full max-w-[1400px] px-3 sm:px-6 lg:px-12">
        <Reveal>
          <div className="rounded-2xl border border-[#E8E4DB] bg-white/90 p-4 sm:p-6 lg:p-8 shadow-[0_30px_80px_-30px_rgba(31,30,27,0.3)] backdrop-blur-xl">
            <div className="mb-5 sm:mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2
                className={`tracking-tight text-[#1E1D1A] ${
                  isIndic ? "font-sans font-semibold text-[1.6rem] sm:text-3xl leading-snug" : "font-serif font-medium text-[1.9rem] sm:text-[2.4rem] leading-tight"
                }`}
              >
                {tr(H.catPre)}
                <span style={{ color: GREEN }}>CASE SUNO</span>
                {tr(H.catPost)}
              </h2>

              <label className="group relative block w-full lg:max-w-[540px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8C8479] transition-colors group-focus-within:text-[#1F5C50]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filtered.length === 1) onOpenEnquiry(filtered[0].serviceId);
                  }}
                  placeholder={tr(H.search)}
                  aria-label={tr(H.search)}
                  className="h-12 sm:h-[52px] w-full rounded-full border border-[#DCD6C9] bg-[#FAF9F6] pl-12 pr-11 text-[16px] sm:text-[14.5px] text-[#1E1D1A] outline-none transition-all placeholder:text-[#9C9588] focus:border-[#1F5C50]/50 focus:bg-white focus:ring-4 focus:ring-[#1F5C50]/10 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label={tr(H.clear)}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#8C8479] hover:bg-[#F2EFE9] hover:text-[#1E1D1A] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((c, i) => {
                  const Icon = c.icon;
                  const tone = TONES[CATEGORIES.indexOf(c) % TONES.length];
                  return (
                    <Reveal key={c.key} delay={(i % 4) * 70} className="h-full">
                      <Tilt className="h-full rounded-xl" max={7}>
                        <button
                          type="button"
                          onClick={() => onOpenEnquiry(c.serviceId)}
                          className="group relative flex h-full w-full items-center gap-4 rounded-xl border border-[#E8E4DB] bg-white p-4 sm:p-5 text-left transition-[box-shadow,border-color] duration-300 [transform-style:preserve-3d] hover:border-[#BFB6A6] hover:shadow-[0_22px_44px_-20px_rgba(31,30,27,0.35)] active:scale-[0.98] cursor-pointer"
                        >
                          <span
                            className="cs-tilt-pop flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:!bg-[#1F5C50] group-hover:!text-white"
                            style={{ background: tone.bg, color: tone.fg }}
                          >
                            <Icon className="h-6 w-6" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] font-semibold leading-snug text-[#1E1D1A]">{tr(c.title)}</span>
                            <span className="mt-1 text-[12.5px] leading-relaxed text-[#6B655B] line-clamp-2">{tr(c.desc)}</span>
                          </span>
                          <ChevronRight className="h-5 w-5 shrink-0 text-[#BFB6A6] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#1F5C50]" />
                        </button>
                      </Tilt>
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              <div className="cs-fade flex flex-col items-center gap-4 rounded-xl border border-dashed border-[#DCD6C9] bg-[#FAF9F6] px-6 py-10 text-center">
                <p className="max-w-md text-[14px] text-[#6B655B]">{tr(H.empty)}</p>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry()}
                  className="cs-press group inline-flex items-center gap-2 rounded-sm px-5 py-3 text-[14px] font-medium text-white cursor-pointer"
                  style={{ background: INK }}
                >
                  {tr(H.emptyCta)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      <div className="h-12 sm:h-16" aria-hidden="true" />
    </>
  );
};