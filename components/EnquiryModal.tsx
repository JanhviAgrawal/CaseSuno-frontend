"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { ModalShell, ModalCloseButton } from "./ModalShell";
import { openWhatsApp } from "./contact";
import { WhatsAppIcon } from "./WhatsApp";

type LegalType = "privacy" | "terms" | "disclaimer";

/** Must match the API rule: description: z.string().trim().min(5) */
const MIN_DESCRIPTION = 5;

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Category id, service id (e.g. "property-land") or label */
  initialCategory?: string;
  onOpenLegal?: (type: LegalType) => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, initialCategory = "", onOpenLegal }) => {
  const { language } = useLanguage();
  const isGu = language === "gu";
  const isHi = language === "hi";
  const L = (en: string, hi: string, gu: string) => (isGu ? gu : isHi ? hi : en);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState({ fullName: "", phone: "", email: "", city: "" });
  const [referenceId, setReferenceId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [trackUrl, setTrackUrl] = useState("");

  const categories = [
    { id: "Notice, Summons & Court / Case", slug: "notice-summons-court-case",
      label: L("Notice, Summons & Court / Case", "नोटिस, समन और कोर्ट / केस", "નોટિસ, સમન્સ અને કોર્ટ / કેસ"),
      desc: L("Court, summons, government & demand notices, case assistance, documents, hearings & tracking", "कोर्ट, समन, सरकारी और डिमांड नोटिस, केस सहायता, दस्तावेज़, सुनवाई और केस ट्रैकिंग", "કોર્ટ, સમન્સ, સરકારી અને ડિમાન્ડ નોટિસ, કેસ સહાય, દસ્તાવેજો, સુનાવણી અને કેસ ટ્રેકિંગ") },
    { id: "Police, Cyber & Online Fraud", slug: "police-cyber-online-fraud",
      label: L("Police, Cyber & Online Fraud", "पुलिस, साइबर और ऑनलाइन धोखाधड़ी", "પોલીસ, સાયબર અને ઓનલાઈન છેતરપિંડી"),
      desc: L("Complaints, FIR, police notices, seizure, UPI, banking fraud, hacking & scams", "शिकायत, FIR, पुलिस नोटिस, जब्ती, UPI, बैंकिंग धोखाधड़ी, हैकिंग और स्कैम", "ફરિયાદ, FIR, પોલીસ નોટિસ, જપ્તી, UPI, બેંકિંગ છેતરપિંડી, હેકિંગ અને સ્કેમ") },
    { id: "Property & Land", slug: "property-land",
      label: L("Property & Land", "संपत्ति और भूमि", "મિલકત અને જમીન"),
      desc: L("Possession, property & land disputes, bank-sealed property & society matters", "कब्जा, संपत्ति और भूमि विवाद, बैंक द्वारा सील संपत्ति और सोसायटी मामले", "કબજો, મિલકત અને જમીન વિવાદ, બેંક દ્વારા સીલ કરેલી મિલકત અને સોસાયટી બાબતો") },
    { id: "Bank, Loan, Money & Recovery", slug: "bank-loan-money-recovery",
      label: L("Bank, Loan, Money & Recovery", "बैंक, लोन, पैसे और रिकवरी", "બેંક, લોન, પૈસા અને વસૂલાત"),
      desc: L("EMI, loans, mortgage, bank accounts, bank recovery, payments, invoices, refunds & money recovery", "EMI, लोन, मॉर्गेज, बैंक अकाउंट, बैंक रिकवरी, भुगतान, इनवॉइस, रिफंड और पैसे की रिकवरी", "EMI, લોન, મોર્ટગેજ, બેંક એકાઉન્ટ, બેંક રિકવરી, ચુકવણી, ઇનવોઇસ, રિફંડ અને પૈસાની વસૂલાત") },
    { id: "Vehicle & RTO", slug: "vehicle-rto",
      label: L("Vehicle & RTO", "वाहन और RTO", "વાહન અને RTO"),
      desc: L("Challans, vehicle seizure, RC, licence, RTO matters & accidents", "चालान, वाहन जब्ती, RC, लाइसेंस, RTO मामले और दुर्घटनाएं", "ચલણ, વાહન જપ્તી, RC, લાઇસન્સ, RTO બાબતો અને અકસ્માત") },
    { id: "Family Matters", slug: "family-matters",
      label: L("Family Matters", "पारिवारिक मामले", "કૌટુંબિક બાબતો"),
      desc: L("Matrimonial matters, maintenance & family disputes", "विवाह संबंधी मामले, भरण-पोषण और पारिवारिक विवाद", "લગ્ન સંબંધિત બાબતો, ભરણપોષણ અને કૌટુંબિક વિવાદ") },
    { id: "Business & Commercial Matters", slug: "business-commercial",
      label: L("Business & Commercial Matters", "व्यवसाय और व्यावसायिक मामले", "વ્યવસાય અને કોમર્શિયલ બાબતો"),
      desc: L("Business disputes, business documents, contracts, payments & commercial matters", "व्यावसायिक विवाद, बिजनेस दस्तावेज़, अनुबंध, भुगतान और व्यावसायिक मामले", "વ્યવસાયિક વિવાદ, બિઝનેસ દસ્તાવેજો, કરાર, ચુકવણી અને કોમર્શિયલ બાબતો") },
    { id: "Consumer & Insurance", slug: "consumer-insurance",
      label: L("Consumer & Insurance", "उपभोक्ता और बीमा", "ગ્રાહક અને વીમો"),
      desc: L("Product & service issues, consumer matters & insurance claims", "उत्पाद और सेवा संबंधी समस्याएं, उपभोक्ता मामले और बीमा दावे", "પ્રોડક્ટ અને સેવા સંબંધિત સમસ્યાઓ, ગ્રાહક બાબતો અને વીમા દાવા") },
    { id: "Documents & Government Services", slug: "documents-government-services",
      label: L("Documents & Government Services", "दस्तावेज़ और सरकारी सेवाएं", "દસ્તાવેજો અને સરકારી સેવાઓ"),
      desc: L("Documentation, applications, certificates & official government processes", "दस्तावेज़ीकरण, आवेदन, प्रमाणपत्र और आधिकारिक सरकारी प्रक्रियाएं", "દસ્તાવેજીકરણ, અરજીઓ, પ્રમાણપત્રો અને સત્તાવાર સરકારી પ્રક્રિયાઓ") },
    { id: "Others", slug: "others",
      label: L("Others", "अन्य मामले", "અન્ય બાબતો"),
      desc: L("Any matter not covered above — our coordinator will help identify the appropriate category", "ऊपर दी गई श्रेणियों में शामिल न होने वाले अन्य मामले — हमारे समन्वयक सही श्रेणी तय करने में मदद करेंगे", "ઉપરની કોઈ શ્રેણીમાં ન આવતી અન્ય બાબતો — અમારા કોઓર્ડિનેટર યોગ્ય શ્રેણી નક્કી કરવામાં મદદ કરશે") },
  ];

  const resetEnquiry = () => {
    setStep(1);
    setCategory("");
    setDescription("");
    setTermsAccepted(false);
    setFormData({ fullName: "", phone: "", email: "", city: "" });
    setReferenceId("");
    setErrorMsg("");
    setTrackUrl("");
    setSubmitting(false);
  };

  // Pre-select a matching category each time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    const match = categories.find(
      (c) => c.id === initialCategory || c.slug === initialCategory || c.label === initialCategory,
    );
    setCategory(match ? match.id : "");
    setStep(match ? 2 : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialCategory]);

  const handleClose = () => {
    resetEnquiry();
    onClose();
  };

  if (!isOpen) return null;

  const selectedLabel = categories.find((c) => c.id === category)?.label ?? category;
  const headingFont = isGu || isHi ? "font-sans font-semibold" : "font-serif";
  const inputClass =
    "w-full p-2.5 text-sm bg-white border border-[#D5CFBF] rounded-sm text-[#1E1D1A] placeholder:text-[#9C9588] transition-all focus:outline-hidden focus:border-[#1E1D1A] focus:ring-2 focus:ring-[#1E1D1A]/10";

  // Plain JSX (not inner components) so they don't remount on every keystroke
  const errorBox = errorMsg ? (
    <div className="cs-slide-down p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm" role="alert">
      {errorMsg}
    </div>
  ) : null;

  const legalLink = (type: LegalType, text: string) =>
    onOpenLegal ? (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenLegal(type);
        }}
        className="font-medium text-[#1F5C50] underline underline-offset-2 hover:text-[#16463D] cursor-pointer"
      >
        {text}
      </button>
    ) : (
      <span className="font-medium text-[#1F5C50]">{text}</span>
    );

  const backBtn = (to: 1 | 2) => (
    <button
      type="button"
      onClick={() => {
        setErrorMsg("");
        setStep(to);
      }}
      className="px-4 py-2 text-xs text-[#5C564C] hover:text-black font-medium bg-[#E7E2DA] hover:bg-[#DCD6CC] rounded-sm active:scale-[0.97] transition-all cursor-pointer"
    >
      {L("Back", "पीछे जाएं", "પાછા જાવ")}
    </button>
  );

  const handleNextStep2 = () => {
    const text = description.trim();
    if (!text) {
      setErrorMsg(L("Please write a brief summary of what you are dealing with.", "कृपया अपनी समस्या का संक्षिप्त विवरण लिखें।", "કૃપા કરીને તમારી સમસ્યાનો ટૂંકો સારાંશ લખો."));
      return;
    }
    if (text.length < MIN_DESCRIPTION) {
      setErrorMsg(L("Please describe your situation in a few more words.", "कृपया अपनी स्थिति कुछ और शब्दों में बताएं।", "કૃપા કરીને તમારી પરિસ્થિતિ થોડા વધુ શબ્દોમાં જણાવો."));
      return;
    }
    setErrorMsg("");
    setStep(3);
  };

  const genericError = L(
    "We couldn't submit your enquiry right now. Please try again, or contact us on WhatsApp.",
    "आपकी पूछताछ अभी सबमिट नहीं हो सकी। कृपया फिर से प्रयास करें या व्हाट्सएप पर संपर्क करें।",
    "તમારી પૂછપરછ હાલમાં સબમિટ થઈ શકી નથી. કૃપા કરીને ફરી પ્રયાસ કરો અથવા વોટ્સએપ પર સંપર્ક કરો.",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMsg(L("Please confirm that you agree to share your details with CASE SUNO.", "कृपया अपनी जानकारी साझा करने के लिए सहमति दें।", "કૃપા કરીને તમારી વિગતો શેર કરવા માટે સંમતિ આપો."));
      return;
    }
    if (formData.fullName.trim().length < 2) {
      setErrorMsg(L("Please enter your full name.", "कृपया अपना पूरा नाम लिखें।", "કૃપા કરીને તમારું પૂરું નામ લખો."));
      return;
    }
    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      setErrorMsg(L("Please enter a valid mobile / WhatsApp number.", "कृपया मान्य व्हाट्सएप/मोबाइल नंबर दर्ज करें।", "કૃપા કરીને માન્ય વોટ્સએપ/મોબાઇલ નંબર લખો."));
      return;
    }
    if (description.trim().length < MIN_DESCRIPTION) {
      setErrorMsg(L("Please go back and describe your situation in a few more words.", "कृपया पीछे जाकर अपनी स्थिति कुछ और शब्दों में बताएं।", "કૃપા કરીને પાછા જઈને તમારી પરિસ્થિતિ થોડા વધુ શબ્દોમાં જણાવો."));
      return;
    }

    setErrorMsg("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description, ...formData, language }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Enquiry submit failed:", res.status, data);
        // 4xx = the server rejected something specific (form details, rate limit) → show its reason
        if (res.status >= 400 && res.status < 500 && typeof data.error === "string") {
          setErrorMsg(data.error);
          return;
        }
        throw new Error(data.error || "failed");
      }

      setReferenceId(data.reference);
      setTrackUrl(data.trackUrl);
      setStep(4);
    } catch (err) {
      console.error("Enquiry submit error:", err);
      setErrorMsg(genericError);
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsAppConfirmation = () => {
    const brief = description.length > 100 ? `${description.slice(0, 100)}...` : description;
    openWhatsApp(
      `Hello CASE SUNO, I submitted an enquiry (${referenceId}) regarding ${category}.\nName: ${formData.fullName}\nPhone: ${formData.phone}\nCity: ${formData.city || "-"}\nBrief: ${brief}${trackUrl ? `\nTrack: ${trackUrl}` : ""}`,
    );
  };

  const descLength = description.trim().length;

  return (
    <ModalShell onClose={handleClose} maxHeightClass="max-h-[92vh]" ariaLabel="Enquiry">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-[#E8E4DB] bg-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#8C8479] uppercase block">
              {L("Case Suno Enquiry", "CASE SUNO पूछताछ", "CASE SUNO પૂછપરછ")}
            </span>
            <h3 className={`text-lg sm:text-xl text-[#1E1D1A] ${headingFont}`}>
              {step === 4
                ? L("Enquiry Registered", "पूछताछ दर्ज कर ली गई है", "પૂછપરછ નોંધાઈ ગઈ છે")
                : L("Start Your Enquiry", "अपनी पूछताछ शुरू करें", "તમારી પૂછપરછ શરૂ કરો")}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {step < 4 && (
              <span className="text-xs text-[#787268] tabular-nums font-medium">
                {L(`Step ${step} of 3`, `चरण ${step} / 3`, `તબક્કો ${step} / 3`)}
              </span>
            )}
            <ModalCloseButton onClick={handleClose} />
          </div>
        </div>
        {step < 4 && (
          <div className="mt-3 h-1 w-full bg-[#F0ECE4] rounded-full overflow-hidden">
            <div className="h-full bg-[#1F5C50] rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
        {/* Step 1 */}
        {step === 1 && (
          <div key="s1" className="cs-fade space-y-4">
            <div>
              <h4 className={`text-base sm:text-lg text-[#1E1D1A] ${headingFont}`}>
                {L("Select the category that best matches your situation:", "अपनी स्थिति से संबंधित श्रेणी चुनें:", "તમારી પરિસ્થિતિ સાથે સુસંગત શ્રેણી પસંદ કરો:")}
              </h4>
              <p className="text-xs text-[#6B655B] mt-1">
                {L("Don't worry if multiple apply; our coordinator will clarify during intake.", "यदि एक से अधिक श्रेणियां लागू होती हैं तो चिंता न करें, हमारे समन्वयक कॉल पर स्पष्ट कर देंगे।", "ચિંતા કરશો નહીં જો એકથી વધુ લાગુ પડતી હોય, અમારા કોઓર્ડિનેટર કોલ પર સ્પષ્ટતા કરી આપશે.")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              {categories.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategory(c.id);
                    setStep(2);
                  }}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`cs-rise p-3 sm:p-3.5 text-left border rounded-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] ${
                    category === c.id
                      ? "border-[#1E1D1A] bg-white shadow-xs ring-1 ring-[#1E1D1A]"
                      : "border-[#E3DED4] bg-[#FAF9F6] hover:bg-white hover:border-[#B5AEA1]"
                  }`}
                >
                  <p className="text-sm font-semibold text-[#1E1D1A]">{c.label}</p>
                  <p className="text-xs text-[#6B655B] mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div key="s2" className="cs-fade space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setStep(1)}
                title={L("Change category", "श्रेणी बदलें", "શ્રેણી બદલો")}
                className="inline-block mb-2 px-2.5 py-1 text-[11px] font-medium bg-[#F2EDE2] hover:bg-[#E8E1D2] text-[#5E5648] rounded-full transition-colors cursor-pointer"
              >
                {selectedLabel} ✎
              </button>
              <h4 className={`text-base sm:text-lg text-[#1E1D1A] ${headingFont}`}>
                {L("Describe what you are facing", "आप किस समस्या या आवश्यकता का सामना कर रहे हैं?", "તમે કઈ સમસ્યાનો સામનો કરી રહ્યા છો તે જણાવો")}
              </h4>
              <p className="text-xs text-[#6B655B] mt-1">
                {L("Share only as much as you feel comfortable. All information is strictly confidential.", "जितनी जानकारी आप सहजता से देना चाहें उतनी ही साझा करें। सभी विवरण पूर्णतः गोपनीय रहेंगे।", "તમે જેટલું યોગ્ય સમજો એટલું જ જણાવો. તમામ માહિતી સંપૂર્ણપણે ગોપનીય રાખવામાં આવે છે.")}
              </p>
            </div>
            {errorBox}
            <div>
              <label htmlFor="enq-desc" className="block text-xs font-semibold text-[#302E2A] mb-1.5">
                {L("Brief Summary of the Situation / Requirement *", "स्थिति / आवश्यकता का संक्षिप्त विवरण *", "પરિસ્થિતિ / જરૂરિયાતનો સંક્ષિપ્ત સારાંશ *")}
              </label>
              <textarea
                id="enq-desc"
                rows={4}
                maxLength={1500}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder={L(
                  "e.g., Received a notice regarding property inheritance / Need help reviewing a partnership deed / In a payment dispute with a supplier...",
                  "उदा. संपत्ति या वसीयत पर नोटिस प्राप्त हुआ / साझेदारी अनुबंध की जांच करानी है / विक्रेता भुगतान लंबित है...",
                  "દા.ત., વારસાઈ મિલકત અંગે નોટિસ મળી છે / ભાગીદારી કરાર ચકાસવો છે / વેપારી પેમેન્ટ અટક્યું છે...",
                )}
                className={`${inputClass} p-3 resize-y`}
              />
              <div className="mt-1 flex items-center justify-between text-[10px] tabular-nums">
                <span className={descLength > 0 && descLength < MIN_DESCRIPTION ? "text-red-700" : "text-[#9C9588]"}>
                  {L(`Minimum ${MIN_DESCRIPTION} characters`, `न्यूनतम ${MIN_DESCRIPTION} अक्षर`, `ઓછામાં ઓછા ${MIN_DESCRIPTION} અક્ષરો`)}
                </span>
                <span className="text-[#9C9588]">{description.length}/1500</span>
              </div>
            </div>
            <div className="pt-3 flex items-center justify-between border-t border-[#EAE6DD]">
              {backBtn(1)}
              <button
                type="button"
                onClick={handleNextStep2}
                className="group inline-flex items-center gap-2 px-6 py-2.5 bg-[#1F1E1B] hover:bg-[#33312B] text-white text-xs font-medium tracking-wide rounded-sm hover:shadow-md active:scale-[0.97] transition-all cursor-pointer"
              >
                <span>{L("Next: Contact Details", "संपर्क विवरण", "સંપર્ક વિગતો")}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form key="s3" onSubmit={handleSubmit} className="cs-fade space-y-4" noValidate>
            <div>
              <h4 className={`text-base sm:text-lg text-[#1E1D1A] ${headingFont}`}>
                {L("How should our coordinator reach you?", "हमारे समन्वयक आपसे किस प्रकार संपर्क करें?", "અમારા કોઓર્ડિનેટર તમારો સંપર્ક કેવી રીતે કરે?")}
              </h4>
              <p className="text-xs text-[#6B655B] mt-1">
                {L("We will contact you to confirm a quiet appointment time.", "हम शांत और सुगम बातचीत के लिए उपयुक्त समय तय करने हेतु संपर्क करेंगे।", "અમે શાંતિપૂર્વક વાતચીત માટે અનુકૂળ સમય નક્કી કરવા તમારો સંપર્ક કરીશું.")}
              </p>
            </div>
            {errorBox}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="enq-name" className="block text-xs font-semibold text-[#302E2A] mb-1">
                  {L("Your Full Name *", "आपका पूरा नाम *", "તમારું પૂરું નામ *")}
                </label>
                <input id="enq-name" type="text" autoComplete="name" value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={L("e.g. Rajesh Patel", "उदा. राजेश शर्मा", "દા.ત. રાજેશ પટેલ")} className={inputClass} />
              </div>
              <div>
                <label htmlFor="enq-phone" className="block text-xs font-semibold text-[#302E2A] mb-1">
                  {L("WhatsApp / Mobile Number *", "व्हाट्सएप / मोबाइल नंबर *", "વોટ્સએપ / મોબાઇલ નંબર *")}
                </label>
                <input id="enq-phone" type="tel" inputMode="tel" autoComplete="tel" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98250 12345" className={inputClass} />
              </div>
              <div>
                <label htmlFor="enq-email" className="block text-xs font-semibold text-[#302E2A] mb-1">
                  {L("Email Address (Optional)", "ईमेल (वैकल्पिक)", "ઇમેઇલ (વૈકલ્પિક)")}
                </label>
                <input id="enq-email" type="email" autoComplete="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com" className={inputClass} />
              </div>
              <div>
                <label htmlFor="enq-city" className="block text-xs font-semibold text-[#302E2A] mb-1">
                  {L("City / Location", "शहर / स्थान", "શહેર / સ્થળ")}
                </label>
                <input id="enq-city" type="text" autoComplete="address-level2" value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder={L("City, State", "शहर, राज्य", "શહેર, રાજ્ય")} className={inputClass} />
              </div>
            </div>

            <div className="p-3 bg-[#F4F0E6] border border-[#E3DCCB] rounded-sm flex items-center gap-2.5 text-xs text-[#524C41]">
              <Shield className="w-4 h-4 text-[#756C5B] shrink-0" />
              <span>
                {L("Your privacy is protected. We will never share your contacts or circumstances without consent.", "आपकी गोपनीयता पूर्णतः सुरक्षित है। हम आपकी सहमति के बिना आपकी जानकारी कभी साझा नहीं करते।", "તમારી ગોપનીયતા સુરક્ષિત છે. અમે તમારી સંમતિ વિના વિગતો ક્યારેય શેર કરતા નથી.")}
              </span>
            </div>

            <div className={`p-3.5 bg-white border rounded-sm transition-colors ${termsAccepted ? "border-[#1F5C50]/40" : "border-[#E3DED4]"}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (e.target.checked) setErrorMsg("");
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#1F5C50]"
                />
                <span className="text-xs leading-relaxed text-[#524C41]">
                  {isGu ? (
                    <>હું મારી વિગતો CASE SUNO સાથે શેર કરવા માટે સંમત છું અને {legalLink("privacy", "ગોપનીયતા નીતિ")} અને {legalLink("terms", "નિયમો અને શરતો")} વાંચી છે.</>
                  ) : isHi ? (
                    <>मैं अपनी जानकारी CASE SUNO के साथ साझा करने के लिए सहमत हूं और {legalLink("privacy", "गोपनीयता नीति")} और {legalLink("terms", "नियम और शर्तें")} पढ़ी हैं।</>
                  ) : (
                    <>I confirm that I agree to share my details with CASE SUNO and have read the {legalLink("privacy", "Privacy Policy")} and {legalLink("terms", "Terms & Conditions")}.</>
                  )}
                </span>
              </label>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#EAE6DD]">
              {backBtn(2)}
              <button
                type="submit"
                disabled={!termsAccepted || submitting}
                className="group inline-flex items-center gap-2 px-6 py-2.5 bg-[#1F1E1B] hover:bg-[#33312B] text-white text-xs font-medium tracking-wide rounded-sm hover:shadow-md active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
              >
                <span>
                  {submitting
                    ? L("Submitting…", "सबमिट हो रहा है…", "સબમિટ થઈ રહ્યું છે…")
                    : L("Submit Confidential Enquiry", "गोपनीय पूछताछ सबमिट करें", "ગોપનીય પૂછપરછ સબમિટ કરો")}
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div key="s4" className="cs-fade text-center py-4 space-y-4 sm:space-y-5">
            <div className="cs-modal-panel w-14 h-14 bg-[#EEF5EC] text-[#3B7A38] rounded-full flex items-center justify-center mx-auto border border-[#CDE3C9]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-[#F2EDE2] text-[#5E5648] text-xs font-mono font-medium rounded-xs mb-2">
                {L("Reference", "संदर्भ संख्या", "સંદર્ભ ક્રમાંક")}: {referenceId}
              </span>
              <h4 className={`text-xl sm:text-2xl text-[#1E1D1A] ${headingFont}`}>
                {L(`Thank You, ${formData.fullName}.`, `धन्यवाद, ${formData.fullName}`, `આભાર, ${formData.fullName}`)}
              </h4>
              <p className="text-xs sm:text-sm text-[#5C564C] max-w-md mx-auto mt-2 leading-relaxed">
                {L(
                  `We have received your enquiry regarding ${selectedLabel}. Our case coordinator will review your notes and reach out within 2 business hours.`,
                  `हमें ${selectedLabel} से संबंधित आपकी पूछताछ प्राप्त हो गई है। हमारे केस समन्वयक आपके विवरण की समीक्षा करेंगे और २ व्यावसायिक घंटों में संपर्क करेंगे।`,
                  `અમને ${selectedLabel} અંગે તમારી પૂછપરછ મળી ગઈ છે. અમારા કેસ કોઓર્ડિનેટર વિગતો ચકાસીને ૨ વ્યાવસાયિક કલાકમાં તમારો સંપર્ક કરશે.`,
                )}
              </p>
            </div>

            <div className="p-4 bg-white border border-[#E6E1D6] rounded-sm max-w-md mx-auto text-left text-xs space-y-2 text-[#4A453C]">
              <div className="flex justify-between gap-3">
                <span className="text-[#878072]">{L("Status:", "स्थिति:", "સ્થિતિ:")}</span>
                <span className="font-medium text-[#2F662C]">{L("Under Preliminary Review", "प्रारंभिक समीक्षाधीन", "પ્રારંભિક સમીક્ષા હેઠળ")}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#878072]">{L("Contact Number:", "संपर्क नंबर:", "સંપર્ક નંબર:")}</span>
                <span className="font-medium text-[#1E1D1A]">{formData.phone}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              {trackUrl && (
                <a
                  href={trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1F5C50] hover:bg-[#174A41] text-white text-xs font-medium rounded-sm active:scale-[0.97] transition-all"
                >
                  {L("Track your request", "अपना अनुरोध ट्रैक करें", "તમારી વિનંતી ટ્રેક કરો")}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              )}
              <button
                type="button"
                onClick={openWhatsAppConfirmation}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-medium rounded-sm hover:shadow-md active:scale-[0.97] transition-all cursor-pointer"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                <span>{L("Connect Instantly on WhatsApp", "व्हाट्सएप पर तुरंत जुड़ें", "વોટ્સએપ પર તરત જોડાઓ")}</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1F1E1B] hover:bg-[#33312B] text-white text-xs font-medium rounded-sm active:scale-[0.97] transition-all cursor-pointer"
              >
                {L("Done", "संपन्न", "પૂર્ણ")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
};