export const WHATSAPP_NUMBER = "918000784778";
export const PHONE_TEL = "+918000784778";
export const PHONE_DISPLAY = "+91 80007 84778";
export const EMAIL = "help@casesuno.com";

export const DEFAULT_WA_TEXT =
  "Hello CASE SUNO, I would like to make an enquiry.";

export const whatsappLink = (text: string = DEFAULT_WA_TEXT) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const openWhatsApp = (text: string = DEFAULT_WA_TEXT) => {
  if (typeof window === "undefined") return;
  window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
};