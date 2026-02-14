import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/constants";

const base = APP_CONFIG.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact-support`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/docs/getting-started`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/user-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/support-crew`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/leadgen-crew`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/docs/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}
