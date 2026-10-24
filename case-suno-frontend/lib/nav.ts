import type { Translations } from "../context/LanguageContext";

export type NavKey = "home" | "how" | "services" | "about" | "resources" | "faq" | "contact" | "track";

export interface NavItem {
  key: NavKey;
  href: string;
  /** If set, this item scrolls to a section on the home page */
  section?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/", section: "home" },
  { key: "services", href: "/#services", section: "services" },
  { key: "how", href: "/#how-it-works", section: "how-it-works" },
  { key: "about", href: "/about" },
  { key: "resources", href: "/resources" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
  { key: "track", href: "/track" },
];

export const navLabel = (t: Translations, key: NavKey): string =>
  ({
    home: t.nav.home,
    how: t.nav.howItWorks,
    services: t.nav.services,
    about: t.nav.about,
    resources: t.nav.resources,
    faq: t.nav.faq,
    contact: t.nav.contact,
    track: t.nav.trackRequest,
  })[key];

/** Which page-type nav item matches the current URL (null on home / legal pages) */
export const pageKeyFromPath = (pathname: string): NavKey | null =>
  NAV_ITEMS.find((i) => !i.section && pathname.startsWith(i.href))?.key ?? null;

/** Smooth-scroll to a home-page section */
export const scrollToSection = (section: string) => {
  if (section === "home") window.scrollTo({ top: 0, behavior: "smooth" });
  else document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
};