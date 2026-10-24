import type { Language } from "../context/LanguageContext";

export type LegalType = "privacy" | "terms" | "disclaimer";
export type L3 = Record<Language, string>;

export interface LegalSection {
  id: string;
  h: L3;
  p: L3;
}

export interface LegalDoc {
  type: LegalType;
  href: string;
  title: L3;
  kicker: L3;
  sections: LegalSection[];
}

export const LEGAL_ORDER: LegalType[] = ["privacy", "terms", "disclaimer"];

export const LEGAL_UPDATED: L3 = {
  en: "Updated: September 2026",
  hi: "अद्यतित: सेप्टम्बर २०२६",
  gu: "અપડેટ: સપ્ટેમ્બર ૨૦૨૬",
};

export const LEGAL_DOCS: Record<LegalType, LegalDoc> = {
  /* ============================ PRIVACY ============================ */
  privacy: {
    type: "privacy",
    href: "/privacy-policy",
    title: { en: "Privacy Policy", hi: "गोपनीयता नीति", gu: "ગોપનીયતા નીતિ" },
    kicker: {
      en: "Data Protection & Confidentiality",
      hi: "डेटा सुरक्षा एवं गोपनीयता",
      gu: "ડેટા સુરક્ષા અને ગુપ્તતા",
    },
    sections: [
      {
        id: "commitment",
        h: {
          en: "1. Commitment to Absolute Discretion",
          hi: "१. पूर्ण गोपनीयता और सुरक्षा की प्रतिबद्धता",
          gu: "૧. સંપૂર્ણ વિવેકબુદ્ધિ અને ગોપનીયતા",
        },
               p: {
          en: "CASE SUNO collects only the necessary details required to understand your matter and organize your documentation. We maintain non-disclosure standards across all digital communication, telephone conferences, and documents shared with our team.",
          hi: "CASE SUNO केवल आपकी स्थिति को समझने और दस्तावेजों को व्यवस्थित करने के लिए आवश्यक जानकारी ही एकत्र करता है। डिजिटल माध्यम, फोन या अपॉइंटमेंट के दौरान हमारी टीम के साथ साझा किए गए सभी विवरण सख्त गैर-प्रकटीकरण मानकों के तहत सुरक्षित रहते हैं।",
          gu: "CASE SUNO માત્ર તમારી બાબત સમજવા અને તમારા દસ્તાવેજો વ્યવસ્થિત કરવા માટે જરૂરી વિગતો જ એકત્રિત કરે છે. ડિજિટલ માધ્યમ, ફોન અથવા એપોઇન્ટમેન્ટ દરમિયાન અમારી ટીમ સાથે શેર કરેલી તમામ વિગતો પર કડક ગોપનીયતા ધોરણો લાગુ પડે છે.",
        },
      },
      {
        id: "documents",
        h: {
          en: "2. Document Handling and Storage",
          hi: "२. दस्तावेज रखरखाव और सुरक्षित भंडारण",
          gu: "૨. દસ્તાવેજ સંભાળ અને સંગ્રહ",
        },
        p: {
          en: "Documents and case files shared by users are encrypted and stored in secure digital vaults. Access is strictly limited to authorized intake coordinators handling your specific matter. We never sell or share data with marketers or non-consented third parties.",
          hi: "ग्राहकों द्वारा साझा की गई फाइलें एन्क्रिप्टेड डिजिटल वॉल्ट में सुरक्षित रखी जाती हैं। हम कभी भी विपणक या अनधिकृत तीसरे पक्ष को डेटा नहीं बेचते और न ही साझा करते हैं।",
          gu: "ક્લાયન્ટ્સ દ્વારા શેર કરવામાં આવેલી ફાઇલો એન્ક્રિપ્ટેડ ડિજિટલ વોલ્ટમાં સુરક્ષિત રહે છે. અમે માર્કેટર્સ અથવા બિન-સંમત ત્રીજા પક્ષોને ક્યારેય ડેટા વેચતા કે શેર કરતા નથી.",
        },
      },
      {
        id: "retention",
        h: {
          en: "3. Data Retention and Erasure",
          hi: "३. डेटा प्रतिधारण और निष्कासन",
          gu: "૩. ડેટા જાળવણી અને રદબાતલ",
        },
        p: {
          en: "Upon completion of coordination or at your written request, case dossiers and personal records can be permanently expunged from our active records in compliance with applicable Indian digital data privacy regulations.",
          hi: "समन्वय पूर्ण होने के उपरांत या आपके लिखित अनुरोध पर, भारतीय डिजिटल डेटा गोपनीयता नियमों के अनुसार केस फाइलें हमारे सक्रिय रिकॉर्ड से स्थायी रूप से हटाई जा सकती हैं।",
          gu: "સંકલન પૂર્ણ થયા પછી અથવા તમારી લેખિત વિનંતી પર, ભારતીય ડિજિટલ ડેટા સુરક્ષા નિયમો અનુસાર કેસ ફાઇલો અમારા રેકોર્ડમાંથી કાયમ માટે દૂર કરી શકાય છે.",
        },
      },
    ],
  },

  /* ============================= TERMS ============================= */
  terms: {
    type: "terms",
    href: "/terms-and-conditions",
    title: { en: "Terms & Conditions", hi: "नियम और शर्तें", gu: "નિયમો અને શરતો" },
    kicker: { en: "Operational Agreement", hi: "परिचालन समझौता", gu: "કાર્યકારી કરાર" },
    sections: [
      {
        id: "scope",
        h: {
          en: "1. Nature of Platform & Scope",
          hi: "१. मंच का स्वरूप एवं कार्यक्षेत्र",
          gu: "૧. પ્લેટફોર્મનું સ્વરૂપ અને કાર્યક્ષેત્ર",
        },
        p: {
          en: "CASE SUNO operates as an advisory coordination, documentation structuring, and process liaison service. Engaging CASE SUNO does not constitute an attorney-client or statutory auditor relationship until and unless an independent advocate or chartered accountant is formally retained by you.",
          hi: "CASE SUNO एक सलाहकार समन्वय, दस्तावेज संरचना और प्रक्रिया सेतु सेवा के रूप में कार्य करता है। जब तक आप किसी स्वतंत्र अधिवक्ता या सीए से औपचारिक अनुबंध नहीं करते, तब तक CASE SUNO से संपर्क अधिवक्ता-क्लाइंट संबंध स्थापित नहीं करता।",
          gu: "CASE SUNO એક સલાહકાર સંકલન, દસ્તાવેજ માળખું અને પ્રક્રિયા સેતુ સેવા તરીકે કાર્ય કરે છે. જ્યાં સુધી તમે કોઈ સ્વતંત્ર વકીલ કે સીએ સાથે ઔપચારિક રીતે કરાર ન કરો ત્યાં સુધી CASE SUNO સાથેનું જોડાણ વકીલ-ક્લાયન્ટ સંબંધ સ્થાપિત કરતું નથી.",
        },
      },
      {
        id: "appointments",
        h: {
          en: "2. Appointment & Cancellation Policy",
          hi: "२. अपॉइंटमेंट एवं रद्दीकरण नीति",
          gu: "૨. એપોઇન્ટમેન્ટ અને રદ્દીકરણ નીતિ",
        },
        p: {
          en: "Appointments are reserved strictly for registered parties. Rescheduling or cancellations must be communicated at least 4 hours prior to the scheduled time to ensure available slots for other clients.",
          hi: "अन्य ग्राहकों के समय की उपलब्धता सुनिश्चित करने के लिए, पुनर्निर्धारण या रद्दीकरण की सूचना निर्धारित समय से कम से कम ४ घंटे पूर्व दी जानी चाहिए।",
          gu: "સમય અન્ય ક્લાયન્ટ્સ માટે પણ ઉપલબ્ધ રહે તે માટે પુનઃનિર્ધારણ અથવા રદ્દીકરણ નિર્ધારિત સમયના ઓછામાં ઓછા ૪ કલાક પહેલાં જણાવવું જરૂરી છે.",
        },
      },
      {
        id: "liability",
        h: {
          en: "3. Limitation of Liability",
          hi: "३. दायित्व की सीमा",
          gu: "૩. જવાબદારીની મર્યાદા",
        },
        p: {
          en: "While CASE SUNO exercises highest professional care in vetting independent professionals and organizing dossiers, outcomes in judicial, quasi-judicial, or arbitral forums depend on statutory merits and judicial discretion.",
          hi: "यद्यपि CASE SUNO स्वतंत्र विशेषज्ञों की समीक्षा और फाइल तैयार करने में उच्चतम पेशेवर सावधानी बरतता है, न्यायिक या मध्यस्थता मंचों में परिणाम केस के कानूनी गुण-दोष और पीठासीन अधिकारी के विवेक पर निर्भर करते हैं।",
          gu: "CASE SUNO વ્યાવસાયિકોની પસંદગી અને ફાઇલ તૈયાર કરવામાં ઉચ્ચતમ કાળજી રાખે છે, પરંતુ કોઈપણ ન્યાયિક કે લવાદ મંચમાં પરિણામ કેસની કાયદાકીય યોગ્યતા અને ન્યાયાધીશના વિવેક પર નિર્ભર રહે છે.",
        },
      },
    ],
  },

  /* =========================== DISCLAIMER =========================== */
  disclaimer: {
    type: "disclaimer",
    href: "/disclaimer",
    title: {
      en: "Regulatory Disclaimer",
      hi: "नियामकीय अस्वीकरण (Disclaimer)",
      gu: "નિયમનકારી ડિસ્ક્લેમર",
    },
    kicker: {
      en: "Bar Council & Regulatory Compliance",
      hi: "बार काउंसिल एवं विधिक अनुपालन",
      gu: "બાર કાઉન્સિલ અને કાનૂની પાલન",
    },
    sections: [
      {
        id: "bar-council",
        h: {
          en: "1. Compliance with Bar Council of India Rules",
          hi: "१. बार काउंसिल ऑफ इंडिया के नियमों का अनुपालन",
          gu: "૧. બાર કાઉન્સિલ ઓફ ઈન્ડિયા નિયમોનું પાલન",
        },
        p: {
          en: "As per the rules of the Bar Council of India, advocates are strictly prohibited from soliciting work or advertising in any form or manner. CASE SUNO is an independent case management and administrative coordination organization.",
          hi: "बार काउंसिल ऑफ इंडिया के नियमों के अनुसार अधिवक्ताओं द्वारा किसी भी रूप में कार्य या विज्ञापन का प्रचार करना पूर्णतः प्रतिबंधित है। CASE SUNO एक स्वतंत्र केस प्रबंधन एवं प्रशासनिक समन्वय संस्था है।",
          gu: "બાર કાઉન્સિલ ઓફ ઈન્ડિયાના નિયમો મુજબ વકીલો માટે જાહેરાત કે પ્રચાર કરવો સખત પ્રતિબંધિત છે. CASE SUNO એ સ્વતંત્ર કેસ મેનેજમેન્ટ અને વહીવટી સંકલન સંસ્થા છે.",
        },
      },
      {
        id: "no-representation",
        h: {
          en: "2. No Direct Legal Representation",
          hi: "२. न्यायालय में सीधा प्रतिनिधित्व नहीं",
          gu: "૨. અદાલતમાં સીધું પ્રતિનિધિત્વ નહીં",
        },
        p: {
          en: "This website is not intended to be a source of legal advertising or solicitation. The information provided herein is for informational and educational purposes only and should not be construed as legal advice.",
          hi: "यह वेबसाइट कानूनी विज्ञापन या वकालत प्रचार का स्रोत नहीं है। यहां दी गई जानकारी केवल सूचनात्मक और मार्गदर्शक उद्देश्यों के लिए है और इसे अंतिम विधिक सलाह न समझा जाए।",
          gu: "આ વેબસાઇટ કાનૂની જાહેરાત અથવા ક્લાયન્ટ શોધવાનો સ્ત્રોત નથી. અહીં પૂરી પાડવામાં આવેલ માહિતી ફક્ત જાણકારી માટે છે અને તેને કાયદાકીય સલાહ તરીકે ગણવી નહીં.",
        },
      },
      {
        id: "independent-professionals",
        h: {
          en: "3. Independent Professional Relationship",
          hi: "३. स्वतंत्र पेशेवर संबंध",
          gu: "૩. સ્વતંત્ર વ્યાવસાયિક સંબંધ",
        },
        p: {
          en: "Any independent advocate, CA, or surveyor to whom a client is introduced operates in their independent professional capacity and enters into a direct, privileged client relationship under their respective statutory bar or institute rules.",
          hi: "कोई भी स्वतंत्र अधिवक्ता, सीए या सर्वेक्षक जिनसे क्लाइंट का परिचय कराया जाता है, वे अपनी स्वतंत्र पेशेवर क्षमता में कार्य करते हैं और संबंधित सांविधिक संस्था के नियमों के तहत सीधा संबंध स्थापित करते हैं।",
          gu: "ક્લાયન્ટ જે કોઈપણ સ્વતંત્ર વકીલ કે સીએ સાથે જોડાય છે, તેઓ પોતાની સ્વતંત્ર ક્ષમતામાં કામ કરે છે અને સંબંધિત સંસ્થાના નિયમો મુજબ સીધો સંબંધ સ્થાપિત કરે છે.",
        },
      },
    ],
  },
};