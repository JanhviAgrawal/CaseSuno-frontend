import type { MetadataRoute } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://casesuno.in").replace(/\/$/, "");

const PAGES = ["", "/about", "/resources", "/faq", "/contact", "/track", "/privacy-policy", "/terms-and-conditions", "/disclaimer"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.map((path) => ({
    url: `${SITE}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
