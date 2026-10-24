export const STATUSES = [
  "NEW",
  "IN_REVIEW",
  "AWAITING_PAYMENT",
  "PAID",
  "IN_PROGRESS",
  "FORWARDED",
  "RESOLVED",
  "CLOSED",
  "REJECTED",
] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const HANDLING = ["UNDECIDED", "IN_HOUSE", "LAWYER"] as const;
export type Handling = (typeof HANDLING)[number];

export const STATUS_META: Record<Status, { label: string; className: string }> = {
  NEW: { label: "New", className: "bg-sky-50 text-sky-700 ring-sky-200" },
  IN_REVIEW: { label: "In review", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  AWAITING_PAYMENT: { label: "Awaiting payment", className: "bg-orange-50 text-orange-700 ring-orange-200" },
  PAID: { label: "Fee paid", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  IN_PROGRESS: { label: "In progress (in-house)", className: "bg-teal-50 text-teal-700 ring-teal-200" },
  FORWARDED: { label: "Forwarded to lawyer", className: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  RESOLVED: { label: "Resolved", className: "bg-green-100 text-green-800 ring-green-300" },
  CLOSED: { label: "Closed", className: "bg-stone-100 text-stone-600 ring-stone-200" },
  REJECTED: { label: "Not serviceable", className: "bg-rose-50 text-rose-700 ring-rose-200" },
};

export const PRIORITY_META: Record<Priority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "bg-stone-50 text-stone-500 ring-stone-200" },
  NORMAL: { label: "Normal", className: "bg-slate-50 text-slate-600 ring-slate-200" },
  HIGH: { label: "High", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  URGENT: { label: "Urgent", className: "bg-rose-50 text-rose-700 ring-rose-200" },
};

export const EVENT_LABELS: Record<string, string> = {
  CREATED: "Request submitted",
  STATUS_CHANGED: "Status changed",
  PRIORITY_CHANGED: "Priority changed",
  HANDLING_CHANGED: "Handling changed",
  LAWYER_ASSIGNED: "Lawyer assigned",
  LAWYER_REMOVED: "Lawyer removed",
  SHARE_CHANGED: "Lawyer visibility changed",
  ADMIN_REPLY: "Reply sent to client",
  CLIENT_MESSAGE: "Client replied",
  NOTE_ADDED: "Internal note added",
  PAYMENT_REQUESTED: "Platform fee requested",
  PAYMENT_RECEIVED: "Payment received",
  PAYMENT_FAILED: "Payment failed",
};

type L3 = { en: string; hi: string; gu: string };

/** Client-facing status labels (tracking page) */
export const CLIENT_STATUS: Record<Status, L3> = {
  NEW: { en: "Submitted", hi: "सबमिट किया गया", gu: "સબમિટ થયું" },
  IN_REVIEW: { en: "Under review", hi: "समीक्षा में", gu: "સમીક્ષા હેઠળ" },
  AWAITING_PAYMENT: { en: "Platform fee pending", hi: "प्लेटफ़ॉर्म शुल्क लंबित", gu: "પ્લેટફોર્મ ફી બાકી" },
  PAID: { en: "Fee received", hi: "शुल्क प्राप्त", gu: "ફી પ્રાપ્ત" },
  IN_PROGRESS: { en: "In progress", hi: "प्रगति पर", gu: "પ્રગતિમાં" },
  FORWARDED: { en: "Connected with a professional", hi: "पेशेवर से जोड़ा गया", gu: "વ્યાવસાયિક સાથે જોડાયેલ" },
  RESOLVED: { en: "Resolved", hi: "हल हो गया", gu: "ઉકેલાયું" },
  CLOSED: { en: "Closed", hi: "बंद", gu: "બંધ" },
  REJECTED: { en: "Unable to assist", hi: "सहायता संभव नहीं", gu: "સહાય શક્ય નથી" },
};

export const formatINR = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(paise / 100);

export const toWaNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
};

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(text)}`;