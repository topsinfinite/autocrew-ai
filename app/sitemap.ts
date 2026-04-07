import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/constants";

const base = APP_CONFIG.url;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: base,
      lastModified: new Date("2026-03-04"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contact-support`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/industry/coaching`,
      lastModified: new Date("2026-03-10"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/industry/restaurant`,
      lastModified: new Date("2026-03-10"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/industry/legal`,
      lastModified: new Date("2026-04-07"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/docs`,
      lastModified: new Date("2026-03-04"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/docs/getting-started`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/docs/user-guide`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/docs/support-crew`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/docs/leadgen-crew`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/docs/healthcare-crew`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/docs/faq`,
      lastModified: new Date("2026-02-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/docs/privacy`,
      lastModified: new Date("2026-01-15"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/docs/terms`,
      lastModified: new Date("2026-01-15"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/docs/security`,
      lastModified: new Date("2026-01-15"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/docs/compliance`,
      lastModified: new Date("2026-01-15"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
