"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  FileText,
  Info,
  List,
  Paperclip,
  Phone,
  Send,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useLanguage, type Language } from "../context/LanguageContext";
import { PHONE_TEL } from "./contact";
import { WhatsAppIcon } from "./WhatsApp";

/* =====================================================================
   Types
===================================================================== */
type L3 = Record<Language, string>;
type QuickKey = "what" | "help" | "process" | "assist" | "enquiry";
type Intent =
  | QuickKey
  | "fees"
  | "lawyer"
  | "privacy"
  | "timing"
  | "location"
  | "greeting"
  | "thanks"
  | "attach"
  | "fallback";

type Action =
  | { kind: "quick"; key: QuickKey; label: string }
  | { kind: "service"; id: string; label: string }
  | { kind: "enquiry"; category?: string; label: string }
  | { kind: "whatsapp"; label: string }
  | { kind: "call"; label: string };

interface Message {
  id: number;
  from: "bot" | "user";
  at: number;
  title?: string;
  text?: string;
  list?: string[];
  note?: string;
  prompt?: string;
  menu?: boolean;
  actions?: Action[];
}

type MessageInput = Omit<Message, "id" | "at">;

interface ChatAssistantProps {
  /** Opens the enquiry modal; optional service id pre-selects the category */
  onStartEnquiry: (category?: string) => void;
  /** Opens the WhatsApp drawer */
  onOpenWhatsApp: () => void;
}

/* =====================================================================
   Copy (EN / GU / HI)
===================================================================== */
const S = {
  subtitle: { en: "AI Assistant", gu: "AI આસિસ્ટન્ટ", hi: "AI असिस्टेंट" },
  tagline: { en: "Quick answers. Better guidance.", gu: "ઝડપી જવાબો. વધુ સારું માર્ગદર્શન.", hi: "त्वरित उत्तर। बेहतर मार्गदर्शन।" },
  welcomeTitle: { en: "Hi! I'm the CASE SUNO Assistant.", gu: "નમસ્તે! હું CASE SUNO આસિસ્ટન્ટ છું.", hi: "नमस्ते! मैं CASE SUNO असिस्टेंट हूँ।" },
  welcomeBody: {
    en: "I can help you understand our services, answer your questions and guide you on what to do next.",
    gu: "હું તમને અમારી સેવાઓ સમજવામાં, તમારા પ્રશ્નોના જવાબ આપવામાં અને આગળ શું કરવું તે અંગે માર્ગદર્શન આપવામાં મદદ કરી શકું છું.",
    hi: "मैं आपको हमारी सेवाएं समझने, आपके प्रश्नों के उत्तर देने और आगे क्या करना है, इसमें मार्गदर्शन करने में मदद कर सकता हूँ।",
  },
  prompt: { en: "How can I help you today?", gu: "આજે હું તમારી કેવી રીતે મદદ કરી શકું?", hi: "आज मैं आपकी कैसे मदद कर सकता हूँ?" },
  q_what: { en: "What is CASE SUNO?", gu: "CASE SUNO શું છે?", hi: "CASE SUNO क्या है?" },
  q_help: { en: "What can you help me with?", gu: "તમે શેમાં મદદ કરી શકો?", hi: "आप किसमें मदद कर सकते हैं?" },
  q_process: { en: "How does the process work?", gu: "પ્રક્રિયા કેવી રીતે કામ કરે છે?", hi: "प्रक्रिया कैसे काम करती है?" },
  q_assist: { en: "I want assistance", gu: "મારે સહાય જોઈએ છે", hi: "मुझे सहायता चाहिए" },
  q_enquiry: { en: "Start an Enquiry", gu: "પૂછપરછ શરૂ કરો", hi: "पूछताछ शुरू करें" },
  placeholder: { en: "Type your question...", gu: "તમારો પ્રશ્ન લખો...", hi: "अपना प्रश्न लिखें..." },
  disclaimer: {
    en: "This AI assistant provides general information and cannot solve your case. For detailed help, please submit your enquiry.",
    gu: "આ AI આસિસ્ટન્ટ સામાન્ય માહિતી આપે છે અને તમારો કેસ ઉકેલી શકતો નથી. વિગતવાર મદદ માટે કૃપા કરીને તમારી પૂછપરછ સબમિટ કરો.",
    hi: "यह AI असिस्टेंट सामान्य जानकारी देता है और आपका मामला हल नहीं कर सकता। विस्तृत सहायता के लिए कृपया अपनी पूछताछ सबमिट करें।",
  },
  justNow: { en: "Just now", gu: "હમણાં જ", hi: "अभी" },
  openChat: { en: "Ask CASE SUNO", gu: "CASE SUNO ને પૂછો", hi: "CASE SUNO से पूछें" },
  closeChat: { en: "Close chat", gu: "ચેટ બંધ કરો", hi: "चैट बंद करें" },
  send: { en: "Send", gu: "મોકલો", hi: "भेजें" },
  attach: { en: "Attach a document", gu: "દસ્તાવેજ જોડો", hi: "दस्तावेज़ जोड़ें" },
  enquireThis: { en: "Enquire about this", gu: "આ માટે પૂછપરછ કરો", hi: "इसके लिए पूछताछ करें" },
  callUs: { en: "Call us", gu: "કૉલ કરો", hi: "कॉल करें" },

  a_what: {
    en: "CASE SUNO is a consultation, case-organisation and guidance service. We listen to your situation, organise your documents, explain realistic options and connect you with verified independent professionals (advocates, CAs, mediators) only when needed.",
    gu: "CASE SUNO એ પરામર્શ, કેસ સંકલન અને માર્ગદર્શન સેવા છે. અમે તમારી વાત સાંભળીએ છીએ, દસ્તાવેજો વ્યવસ્થિત કરીએ છીએ, વાસ્તવિક વિકલ્પો સમજાવીએ છીએ અને જરૂર પડે ત્યારે જ ચકાસાયેલા સ્વતંત્ર વ્યાવસાયિકો (વકીલ, CA, મધ્યસ્થી) સાથે જોડીએ છીએ.",
    hi: "CASE SUNO एक परामर्श, केस समन्वय और मार्गदर्शन सेवा है। हम आपकी बात सुनते हैं, दस्तावेज़ व्यवस्थित करते हैं, व्यावहारिक विकल्प समझाते हैं और ज़रूरत पड़ने पर ही सत्यापित स्वतंत्र पेशेवरों (वकील, CA, मध्यस्थ) से जोड़ते हैं।",
  },
  a_lawyer: {
    en: "CASE SUNO is not a law firm and does not represent anyone in court. When formal legal work is needed, we connect you with verified independent professionals.",
    gu: "CASE SUNO કોઈ વકીલ પેઢી નથી અને અદાલતમાં કોઈનું પ્રતિનિધિત્વ કરતી નથી. ઔપચારિક કાનૂની કામની જરૂર હોય ત્યારે અમે તમને ચકાસાયેલા સ્વતંત્ર વ્યાવસાયિકો સાથે જોડીએ છીએ.",
    hi: "CASE SUNO कोई लॉ फर्म नहीं है और अदालत में किसी का प्रतिनिधित्व नहीं करता। औपचारिक कानूनी काम की ज़रूरत होने पर हम आपको सत्यापित स्वतंत्र पेशेवरों से जोड़ते हैं।",
  },
  a_help: {
    en: "Here are the areas we support. Tap one to learn more:",
    gu: "અમે આ ક્ષેત્રોમાં સહાય કરીએ છીએ. વધુ જાણવા માટે કોઈ એક પસંદ કરો:",
    hi: "हम इन क्षेत्रों में सहायता करते हैं। अधिक जानने के लिए किसी एक को चुनें:",
  },
  a_process: { en: "Our process has 5 simple steps:", gu: "અમારી પ્રક્રિયામાં ૫ સરળ તબક્કા છે:", hi: "हमारी प्रक्रिया में 5 सरल चरण हैं:" },
  a_assist: {
    en: "Of course. Choose how you'd like to reach us — our coordinator usually responds within 2 business hours.",
    gu: "ચોક્કસ. અમારો સંપર્ક કેવી રીતે કરવો તે પસંદ કરો — અમારા કોઓર્ડિનેટર સામાન્ય રીતે ૨ વ્યાવસાયિક કલાકમાં જવાબ આપે છે.",
    hi: "ज़रूर। हमसे संपर्क का तरीका चुनें — हमारे समन्वयक आमतौर पर 2 व्यावसायिक घंटों में जवाब देते हैं।",
  },
  a_enquiry: { en: "Opening the enquiry form for you…", gu: "તમારા માટે પૂછપરછ ફોર્મ ખોલી રહ્યા છીએ…", hi: "आपके लिए पूछताछ फ़ॉर्म खोल रहे हैं…" },
  a_fees: {
    en: "Your preliminary enquiry and initial review are free. For detailed document work, we share a clear, upfront quote before any work begins — no hidden charges.",
    gu: "પ્રારંભિક પૂછપરછ અને પ્રાથમિક સમીક્ષા મફત છે. વિગતવાર દસ્તાવેજ કાર્ય માટે, કામ શરૂ થાય તે પહેલાં અમે સ્પષ્ટ અને પારદર્શક ચાર્જ જણાવીએ છીએ — કોઈ છુપા ખર્ચ નહીં.",
    hi: "प्रारंभिक पूछताछ और प्राथमिक समीक्षा निःशुल्क है। विस्तृत दस्तावेज़ कार्य के लिए, काम शुरू होने से पहले हम स्पष्ट और पारदर्शी शुल्क बताते हैं — कोई छिपा शुल्क नहीं।",
  },
  a_privacy: {
    en: "Your information is kept strictly confidential. We never share your details or documents with anyone without your explicit permission.",
    gu: "તમારી માહિતી સંપૂર્ણ ગોપનીય રાખવામાં આવે છે. તમારી સ્પષ્ટ મંજૂરી વિના અમે ક્યારેય તમારી વિગતો કે દસ્તાવેજો કોઈ સાથે શેર કરતા નથી.",
    hi: "आपकी जानकारी पूरी तरह गोपनीय रखी जाती है। आपकी स्पष्ट अनुमति के बिना हम आपकी जानकारी या दस्तावेज़ किसी के साथ साझा नहीं करते।",
  },
  a_timing: {
    en: "After you submit an enquiry, our case coordinator contacts you within 2 business hours on WhatsApp or phone.",
    gu: "પૂછપરછ સબમિટ કર્યા પછી, અમારા કેસ કોઓર્ડિનેટર ૨ વ્યાવસાયિક કલાકમાં વોટ્સએપ અથવા ફોન દ્વારા તમારો સંપર્ક કરે છે.",
    hi: "पूछताछ सबमिट करने के बाद, हमारे केस समन्वयक 2 व्यावसायिक घंटों में व्हाट्सएप या फ़ोन से संपर्क करते हैं।",
  },
  a_location: {
    en: "We work online and by appointment, so we can help clients in different locations. Sessions are by video or phone call.",
    gu: "અમે ઓનલાઇન અને એપોઇન્ટમેન્ટ આધારે કામ કરીએ છીએ, તેથી વિવિધ સ્થળોના ક્લાયન્ટ્સને મદદ કરી શકીએ છીએ. સત્રો વિડીયો અથવા ફોન કૉલ દ્વારા થાય છે.",
    hi: "हम ऑनलाइन और अपॉइंटमेंट के आधार पर काम करते हैं, इसलिए अलग-अलग स्थानों के ग्राहकों की मदद कर सकते हैं। सत्र वीडियो या फ़ोन कॉल से होते हैं।",
  },
  a_greeting: { en: "Namaste! 🙏 How can I help you today?", gu: "નમસ્તે! 🙏 આજે હું તમારી કેવી રીતે મદદ કરી શકું?", hi: "नमस्ते! 🙏 आज मैं आपकी कैसे मदद कर सकता हूँ?" },
  a_thanks: {
    en: "You're welcome! If you'd like our team to look at your situation, you can start an enquiry anytime.",
    gu: "આપનો આભાર! જો તમે ઇચ્છો કે અમારી ટીમ તમારી પરિસ્થિતિ જુએ, તો તમે ગમે ત્યારે પૂછપરછ શરૂ કરી શકો છો.",
    hi: "आपका स्वागत है! यदि आप चाहते हैं कि हमारी टीम आपकी स्थिति देखे, तो आप कभी भी पूछताछ शुरू कर सकते हैं।",
  },
  a_attach: {
    en: "For your privacy, documents aren't uploaded in this chat. Please share them securely through the enquiry form, or on WhatsApp after our coordinator contacts you.",
    gu: "તમારી ગોપનીયતા માટે, આ ચેટમાં દસ્તાવેજો અપલોડ થતા નથી. કૃપા કરીને પૂછપરછ ફોર્મ દ્વારા અથવા અમારા કોઓર્ડિનેટર સંપર્ક કરે પછી વોટ્સએપ પર સુરક્ષિત રીતે શેર કરો.",
    hi: "आपकी गोपनीयता के लिए, इस चैट में दस्तावेज़ अपलोड नहीं होते। कृपया पूछताछ फ़ॉर्म से, या हमारे समन्वयक के संपर्क करने के बाद व्हाट्सएप पर सुरक्षित रूप से साझा करें।",
  },
  a_fallback: {
    en: "I may not have the exact answer to that. Our team can look at your situation directly — would you like to start an enquiry or chat on WhatsApp?",
    gu: "મારી પાસે કદાચ આનો ચોક્કસ જવાબ ન હોય. અમારી ટીમ તમારી પરિસ્થિતિ સીધી સમજી શકે છે — શું તમે પૂછપરછ શરૂ કરવા અથવા વોટ્સએપ પર વાત કરવા માંગો છો?",
    hi: "मेरे पास शायद इसका सटीक उत्तर न हो। हमारी टीम सीधे आपकी स्थिति समझ सकती है — क्या आप पूछताछ शुरू करना या व्हाट्सएप पर बात करना चाहेंगे?",
  },
} satisfies Record<string, L3>;

const QUICK_ICONS: Record<QuickKey, React.ReactNode> = {
  what: <Info className="w-[18px] h-[18px]" />,
  help: <List className="w-[18px] h-[18px]" />,
  process: <Settings className="w-[18px] h-[18px]" />,
  assist: <UserRound className="w-[18px] h-[18px]" />,
  enquiry: <FileText className="w-[18px] h-[18px]" />,
};

/* =====================================================================
   Keyword matching (EN / GU / HI)
===================================================================== */
const INTENT_KEYWORDS: { key: Intent; kw: string[] }[] = [
  { key: "fees", kw: ["fee", "fees", "charge", "charges", "cost", "price", "pricing", "free", "ફી", "ચાર્જ", "ખર્ચ", "મફત", "શુલ્ક", "शुल्क", "फीस", "चार्ज", "खर्च", "मुफ्त", "निःशुल्क"] },
  { key: "lawyer", kw: ["lawyer", "advocate", "law firm", "attorney", "vakil", "વકીલ", "એડવોકેટ", "वकील", "अधिवक्ता", "लॉ फर्म"] },
  { key: "privacy", kw: ["confidential", "privacy", "private", "safe", "secure", "data", "ગોપનીય", "ખાનગી", "સુરક્ષિત", "गोपनीय", "सुरक्षित", "निजी"] },
  { key: "timing", kw: ["how long", "when will", "reply", "respond", "response", "call back", "contact me", "ક્યારે", "કેટલા સમય", "જવાબ", "कब", "कितने समय", "जवाब"] },
    { key: "location", kw: ["where", "location", "office", "online", "city", "visit", "address", "ક્યાં", "ઓફિસ", "સરનામું", "कहाँ", "कहां", "ऑफिस", "पता"] },
  { key: "process", kw: ["process", "how does it work", "how it works", "steps", "procedure", "પ્રક્રિયા", "કેવી રીતે કામ", "તબક્કા", "प्रक्रिया", "कैसे काम", "चरण"] },
  { key: "enquiry", kw: ["enquiry", "inquiry", "enquire", "form", "register", "book", "appointment", "પૂછપરછ", "એપોઇન્ટમેન્ટ", "ફોર્મ", "पूछताछ", "अपॉइंटमेंट", "फ़ॉर्म", "फॉर्म"] },
];

const SERVICE_KEYWORDS: { id: string; kw: string[] }[] = [
  { id: "notice-summons-court-case", kw: ["notice", "summons", "court", "hearing", "case", "નોટિસ", "સમન્સ", "કોર્ટ", "કેસ", "સુનાવણી", "नोटिस", "समन", "कोर्ट", "केस", "सुनवाई"] },
  { id: "police-cyber-online-fraud", kw: ["police", "fir", "cyber", "fraud", "scam", "upi", "hack", "hacked", "પોલીસ", "સાયબર", "ફ્રોડ", "છેતરપિંડી", "पुलिस", "साइबर", "फ्रॉड", "धोखाधड़ी", "ठगी"] },
  { id: "property-land", kw: ["property", "land", "flat", "house", "plot", "possession", "society", "મિલકત", "જમીન", "મકાન", "પ્લોટ", "संपत्ति", "जमीन", "ज़मीन", "भूमि", "मकान", "प्लॉट"] },
  { id: "bank-loan-money-recovery", kw: ["bank", "loan", "emi", "recovery", "payment", "money", "refund", "mortgage", "બેંક", "લોન", "પૈસા", "રિકવરી", "વસૂલાત", "बैंक", "लोन", "पैसा", "पैसे", "रिकवरी", "वसूली"] },
  { id: "vehicle-rto", kw: ["vehicle", "rto", "challan", "licence", "license", "car", "bike", "accident", "વાહન", "ચલણ", "લાઇસન્સ", "અકસ્માત", "वाहन", "चालान", "लाइसेंस", "दुर्घटना"] },
  { id: "family-matters", kw: ["family", "divorce", "marriage", "maintenance", "inheritance", "will", "પરિવાર", "પારિવારિક", "લગ્ન", "છૂટાછેડા", "વારસ", "વસિયત", "परिवार", "पारिवारिक", "तलाक", "विवाह", "वसीयत", "विरासत"] },
  { id: "business-commercial", kw: ["business", "contract", "agreement", "vendor", "commercial", "partnership", "વ્યવસાય", "કરાર", "ધંધો", "व्यवसाय", "अनुबंध", "बिजनेस", "धंधा"] },
  { id: "consumer-insurance", kw: ["consumer", "insurance", "claim", "warranty", "product", "ગ્રાહક", "વીમા", "વીમો", "ક્લેમ", "उपभोक्ता", "बीमा", "क्लेम"] },
  { id: "documents-government-services", kw: ["document", "documents", "certificate", "government", "application", "દસ્તાવેજ", "પ્રમાણપત્ર", "સરકારી", "અરજી", "दस्तावेज", "दस्तावेज़", "प्रमाणपत्र", "सरकारी", "आवेदन"] },
];

const LATE_INTENTS: { key: Intent; kw: string[] }[] = [
  { key: "assist", kw: ["assistance", "assist", "talk", "speak", "human", "agent", "call", "whatsapp", "contact", "મદદ", "વાત", "સંપર્ક", "सहायता", "मदद", "बात", "संपर्क"] },
  { key: "what", kw: ["what is", "about", "who are you", "tell me about", "casesuno", "શું છે", "વિશે", "क्या है", "बारे में"] },
  { key: "help", kw: ["help with", "services", "service", "what can you", "સેવા", "સેવાઓ", "सेवा", "सेवाएं"] },
  { key: "greeting", kw: ["hi", "hello", "hey", "namaste", "namaskar", "good morning", "good evening", "નમસ્તે", "કેમ છો", "नमस्ते", "नमस्कार"] },
  { key: "thanks", kw: ["thank", "thanks", "thank you", "ok thanks", "આભાર", "धन्यवाद", "शुक्रिया"] },
];

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasKeyword = (text: string, kw: string) =>
  /^[\x00-\x7F]+$/.test(kw) ? new RegExp(`\\b${escapeRegExp(kw)}\\b`, "i").test(text) : text.includes(kw);
const matchAny = (text: string, list: string[]) => list.some((kw) => hasKeyword(text, kw));

function detect(raw: string): { type: "intent"; key: Intent } | { type: "service"; id: string } {
  const text = raw.toLowerCase().replace(/case\s*suno/g, " casesuno ").trim();
  for (const i of INTENT_KEYWORDS) if (matchAny(text, i.kw)) return { type: "intent", key: i.key };
  for (const s of SERVICE_KEYWORDS) if (matchAny(text, s.kw)) return { type: "service", id: s.id };
  for (const i of LATE_INTENTS) if (matchAny(text, i.kw)) return { type: "intent", key: i.key };
  return { type: "intent", key: "fallback" };
}

/* =====================================================================
   Brand mark (logo icon with graceful fallback)
===================================================================== */
const BrandMark: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={`flex h-full w-full items-center justify-center rounded-full bg-[#1F5C50] font-serif font-semibold text-white ${className}`}>
        C
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      onError={() => setFailed(true)}
      className={`h-full w-full rounded-full object-contain ${className}`}
    />
  );
};

/* =====================================================================
   Component
===================================================================== */
export const ChatAssistant: React.FC<ChatAssistantProps> = ({ onStartEnquiry, onOpenWhatsApp }) => {
  const { language, t } = useLanguage();
  const tr = (v: L3) => v[language];

  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const idRef = useRef(1);
  const timers = useRef<number[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickMenu = (lang: Language): Action[] => [
    { kind: "quick", key: "what", label: S.q_what[lang] },
    { kind: "quick", key: "help", label: S.q_help[lang] },
    { kind: "quick", key: "process", label: S.q_process[lang] },
    { kind: "quick", key: "assist", label: S.q_assist[lang] },
    { kind: "quick", key: "enquiry", label: S.q_enquiry[lang] },
  ];

  const buildWelcome = (lang: Language): Message => ({
    id: 0,
    from: "bot",
    at: Date.now(),
    title: S.welcomeTitle[lang],
    text: S.welcomeBody[lang],
    prompt: S.prompt[lang],
    menu: true,
    actions: quickMenu(lang),
  });

  const [messages, setMessages] = useState<Message[]>(() => [buildWelcome("en")]);

  // Re-localise the welcome message if the user hasn't started chatting yet
  useEffect(() => {
    setMessages((m) => (m.length <= 1 ? [buildWelcome(language)] : m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Cleanup pending timers
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  // Auto-scroll
  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  // Escape to close, focus input on desktop, lock body scroll on mobile
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const prevOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";
    else inputRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      if (isMobile) document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  /* ---------- message helpers ---------- */
  const push = (msg: MessageInput) =>
    setMessages((m) => [...m, { ...msg, id: idRef.current++, at: Date.now() }]);

  const botReply = (msg: MessageInput, after?: () => void) => {
    setTyping(true);
    const delay = 450 + Math.min(700, (msg.text?.length ?? 40) * 4);
    const id = window.setTimeout(() => {
      setTyping(false);
      push({ ...msg, from: "bot" });
      if (after) {
        const id2 = window.setTimeout(after, 500);
        timers.current.push(id2);
      }
    }, delay);
    timers.current.push(id);
  };

  const enquiryAction = (category?: string, label = tr(S.q_enquiry)): Action => ({ kind: "enquiry", category, label });
  const whatsappAction = (): Action => ({ kind: "whatsapp", label: t.cta.chatWhatsApp });
  const callAction = (): Action => ({ kind: "call", label: tr(S.callUs) });

  const respondService = (id: string) => {
    const item = t.services.items.find((s) => s.id === id);
    if (!item) return respondIntent("fallback");
    botReply({
      from: "bot",
      title: item.title,
      text: item.overview,
      list: item.commonSituations,
      actions: [enquiryAction(item.id, tr(S.enquireThis)), { kind: "quick", key: "help", label: t.services.viewAll }],
    });
  };

  const respondIntent = (key: Intent) => {
    switch (key) {
      case "what":
        return botReply({
          from: "bot",
          text: tr(S.a_what),
          note: tr(S.a_lawyer),
          actions: [
            { kind: "quick", key: "help", label: tr(S.q_help) },
            { kind: "quick", key: "process", label: tr(S.q_process) },
          ],
        });
      case "help":
        return botReply({
          from: "bot",
          text: tr(S.a_help),
          actions: t.services.items.map((s) => ({ kind: "service" as const, id: s.id, label: s.title })),
        });
      case "process":
        return botReply({
          from: "bot",
          text: tr(S.a_process),
          list: t.process.steps.map((s) => `${s.title} — ${s.desc}`),
          actions: [enquiryAction()],
        });
      case "assist":
        return botReply({ from: "bot", text: tr(S.a_assist), actions: [enquiryAction(), whatsappAction(), callAction()] });
      case "enquiry":
        return botReply({ from: "bot", text: tr(S.a_enquiry) }, () => {
          setOpen(false);
          onStartEnquiry();
        });
      case "fees":
        return botReply({ from: "bot", text: tr(S.a_fees), actions: [enquiryAction()] });
      case "lawyer":
        return botReply({ from: "bot", text: tr(S.a_lawyer), actions: [{ kind: "quick", key: "help", label: tr(S.q_help) }, enquiryAction()] });
      case "privacy":
        return botReply({ from: "bot", text: tr(S.a_privacy), actions: [enquiryAction()] });
      case "timing":
        return botReply({ from: "bot", text: tr(S.a_timing), actions: [enquiryAction(), whatsappAction()] });
      case "location":
        return botReply({ from: "bot", text: tr(S.a_location), actions: [enquiryAction(), whatsappAction()] });
      case "greeting":
        return botReply({ from: "bot", text: tr(S.a_greeting), menu: true, actions: quickMenu(language) });
      case "thanks":
        return botReply({ from: "bot", text: tr(S.a_thanks), actions: [enquiryAction(), whatsappAction()] });
      case "attach":
        return botReply({ from: "bot", text: tr(S.a_attach), actions: [enquiryAction(), whatsappAction()] });
      default:
        return botReply({ from: "bot", text: tr(S.a_fallback), actions: [enquiryAction(), whatsappAction()] });
    }
  };

  /* ---------- user actions ---------- */
  const handleAction = (action: Action) => {
    if (typing) return;
    switch (action.kind) {
      case "quick":
        push({ from: "user", text: action.label });
        return respondIntent(action.key);
      case "service":
        push({ from: "user", text: action.label });
        return respondService(action.id);
      case "enquiry":
        setOpen(false);
        return onStartEnquiry(action.category);
      case "whatsapp":
        setOpen(false);
        return onOpenWhatsApp();
      case "call":
        window.location.href = `tel:${PHONE_TEL}`;
        return;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    push({ from: "user", text });
    const result = detect(text);
    if (result.type === "service") respondService(result.id);
    else respondIntent(result.key);
  };

  const toggle = () => {
    setOpen((o) => !o);
    setSeen(true);
  };

  /* ---------- formatting ---------- */
  const formatTime = (at: number) => {
    if (Date.now() - at < 60_000) return tr(S.justNow);
    const locale = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "gu-IN";
    return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(at);
  };

  const actionIcon = (a: Action) =>
    a.kind === "whatsapp" ? <WhatsAppIcon className="w-3.5 h-3.5" /> : a.kind === "call" ? <Phone className="w-3.5 h-3.5" /> : null;

  /* =====================================================================
     Render
  ===================================================================== */
  return (
    <>
      {/* ---------------- Chat window ---------------- */}
      {open && (
        <div
          role="dialog"
          aria-label="CASE SUNO AI Assistant"
          className="cs-chat-in fixed z-40 inset-0 sm:inset-auto sm:right-6 sm:bottom-[6.5rem] sm:w-[390px] sm:h-[min(680px,calc(100dvh-8.5rem))] flex flex-col bg-[#FBFAF7] sm:rounded-[22px] sm:border sm:border-[#E6E1D6] shadow-[0_24px_60px_-16px_rgba(20,40,32,0.35)] overflow-hidden"
        >
          {/* Header */}
          <div
            className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#0E4436] via-[#14513F] to-[#1F5C50] px-5 pb-5 text-white"
            style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
          >
            <svg aria-hidden="true" className="pointer-events-none absolute -right-4 bottom-0 h-24 w-52" viewBox="0 0 200 100" fill="none">
              <path d="M30 100 C 85 82, 150 52, 205 8 L205 100 Z" fill="white" fillOpacity="0.06" />
              <path d="M62 100 C 118 76, 166 44, 208 12" stroke="#C9A45C" strokeWidth="1.5" strokeOpacity="0.85" />
            </svg>

            <div className="relative flex items-center gap-3.5">
              <div className="h-[58px] w-[58px] shrink-0 rounded-full bg-[#FAF9F6] p-[3px] ring-2 ring-[#C9A45C] shadow-md">
                <BrandMark />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[21px] font-semibold tracking-[0.14em] leading-tight">CASE SUNO</p>
                <p className="text-[14px] text-white/90 leading-snug">{tr(S.subtitle)}</p>
                <p className="mt-0.5 text-[12px] text-white/75">{tr(S.tagline)}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={tr(S.closeChat)}
                className="self-start -mr-1 p-1.5 rounded-full text-white/85 hover:text-white hover:bg-white/10 hover:rotate-90 active:scale-90 transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-5" aria-live="polite">
            {messages.map((m) =>
              m.from === "user" ? (
                <div key={m.id} className="cs-fade flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[#1F5C50] px-4 py-2.5 text-[13.5px] leading-relaxed text-white shadow-xs">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="cs-rise flex items-start gap-2.5">
                  <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-[#FAF9F6] p-[2px] ring-1 ring-[#C9A45C] shadow-xs">
                    <BrandMark />
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    {(m.title || m.text || m.list) && (
                      <div className="w-fit max-w-full rounded-2xl rounded-tl-md bg-[#F1EEE8] px-4 py-3 text-[13.5px] leading-relaxed text-[#3A3833]">
                        {m.title && <p className="mb-1 font-semibold text-[#1E1D1A]">{m.title}</p>}
                        {m.text && <p>{m.text}</p>}
                        {m.list && (
                          <ul className="mt-2 space-y-1.5">
                            {m.list.map((li, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F5C50]" />
                                <span>{li}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {m.note && (
                          <p className="mt-2.5 border-t border-[#E2DDD3] pt-2.5 text-[12.5px] text-[#6B655B]">{m.note}</p>
                        )}
                      </div>
                    )}

                    {m.prompt && <p className="pt-1 text-[13.5px] text-[#2C2A26]">{m.prompt}</p>}

                    {/* Big menu buttons (welcome / greeting) */}
                    {m.menu && m.actions && (
                      <div className="space-y-2">
                        {m.actions.map((a) => (
                          <button
                            key={a.label}
                            type="button"
                            onClick={() => handleAction(a)}
                            className="group flex w-full items-center gap-3 rounded-xl border border-[#E3DED4] bg-white px-4 py-3 text-left text-[13.5px] font-medium text-[#1E1D1A] shadow-2xs transition-all duration-200 hover:border-[#1F5C50]/40 hover:shadow-sm hover:-translate-y-px active:scale-[0.98] cursor-pointer"
                          >
                            <span className="text-[#1F5C50]">{a.kind === "quick" ? QUICK_ICONS[a.key] : null}</span>
                            <span className="flex-1">{a.label}</span>
                            <ChevronRight className="w-4 h-4 text-[#9A9387] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#1F5C50]" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Chip actions */}
                    {!m.menu && m.actions && m.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.actions.map((a) => {
                          const primary = a.kind === "enquiry";
                          return (
                            <button
                              key={`${a.kind}-${a.label}`}
                              type="button"
                              onClick={() => handleAction(a)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
                                primary
                                  ? "border-[#1F5C50] bg-[#1F5C50] text-white hover:bg-[#174A41]"
                                  : "border-[#D9D3C7] bg-white text-[#2C2A26] hover:border-[#1F5C50]/50 hover:text-[#1F5C50]"
                              }`}
                            >
                              {actionIcon(a)}
                              {a.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <p className="text-[10.5px] text-[#9A9387]">{formatTime(m.at)}</p>
                  </div>
                </div>
              ),
            )}

            {/* Typing indicator */}
            {typing && (
              <div className="cs-fade flex items-start gap-2.5" aria-label="typing">
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-[#FAF9F6] p-[2px] ring-1 ring-[#C9A45C]">
                  <BrandMark />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-[#F1EEE8] px-4 py-3.5">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="cs-typing-dot h-1.5 w-1.5 rounded-full bg-[#1F5C50]" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-[#EEEAE2] bg-[#FBFAF7] px-3.5 pt-3"
            style={{ paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center gap-1 rounded-full border border-[#E3DED4] bg-[#F3F1EC] py-1.5 pl-1.5 pr-1.5 transition-all focus-within:border-[#1F5C50]/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1F5C50]/10">
              <button
                type="button"
                onClick={() => {
                  if (typing) return;
                  respondIntent("attach");
                }}
                aria-label={tr(S.attach)}
                title={tr(S.attach)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6B655B] transition-colors hover:bg-white hover:text-[#1F5C50] cursor-pointer"
              >
                <Paperclip className="w-[18px] h-[18px]" />
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={tr(S.placeholder)}
                maxLength={500}
                enterKeyHint="send"
                aria-label={tr(S.placeholder)}
                className="min-w-0 flex-1 bg-transparent px-1 text-[16px] sm:text-[14px] text-[#1E1D1A] outline-none placeholder:text-[#9A9387]"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label={tr(S.send)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F5C50] text-white shadow-sm transition-all hover:bg-[#174A41] hover:scale-105 active:scale-90 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 -translate-x-px translate-y-px" />
              </button>
            </div>
            <p className="mt-2 px-3 text-center text-[10.5px] leading-snug text-[#8C8479]">{tr(S.disclaimer)}</p>
          </form>
        </div>
      )}

      {/* ---------------- Floating launcher ---------------- */}
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? tr(S.closeChat) : tr(S.openChat)}
        aria-expanded={open}
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}
        className={`cs-float-in group fixed right-4 sm:right-6 z-40 h-16 w-16 rounded-full bg-white p-[3px] shadow-[0_12px_30px_-8px_rgba(15,74,60,0.45)] ring-1 ring-black/5 transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_36px_-8px_rgba(15,74,60,0.55)] active:scale-95 cursor-pointer ${
          open ? "max-sm:hidden" : ""
        }`}
      >
        {!seen && (
          <>
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#C9A45C]/60 animate-ping" aria-hidden="true" />
            <span className="absolute right-0.5 top-0.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#25D366]" aria-hidden="true" />
          </>
        )}
        <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-[#C9A45C] bg-[#FAF9F6]">
          <span className={`absolute inset-0 p-[3px] transition-all duration-300 ${open ? "scale-50 opacity-0 rotate-90" : "scale-100 opacity-100"}`}>
            <BrandMark />
          </span>
          <X className={`h-6 w-6 text-[#1F5C50] transition-all duration-300 ${open ? "scale-100 opacity-100" : "scale-50 opacity-0 -rotate-90"}`} />
        </span>

        {/* Tooltip */}
        {!open && (
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-sm bg-[#1F1E1B] px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
            {tr(S.openChat)}
          </span>
        )}
      </button>
    </>
  );
};