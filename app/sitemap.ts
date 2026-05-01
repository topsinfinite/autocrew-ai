import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/constants";
import { getAllPosts, getAllCategories } from "@/lib/blog/loader";

const base = APP_CONFIG.url;

type Entry = MetadataRoute.Sitemap[number];

const route = (
  pathname: string,
  lastModified: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"] = "monthly",
): Entry => ({
  url: pathname === "/" ? base : `${base}${pathname}`,
  lastModified: new Date(lastModified),
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllPosts();
  const blogCats = getAllCategories();

  const blogEntries: MetadataRoute.Sitemap = [
    route("/blog", new Date().toISOString().split("T")[0], 0.9, "weekly"),
    ...blogPosts.map((p) =>
      route(`/blog/${p.slug}`, p.updatedAt ?? p.publishedAt, 0.8, "monthly"),
    ),
    ...blogCats.map((c) =>
      route(`/blog/category/${c.slug}`, new Date().toISOString().split("T")[0], 0.7, "weekly"),
    ),
  ];

  return [
    ...blogEntries,
    // Marketing pillars
    route("/", "2026-05-01", 1, "weekly"),
    route("/ai-receptionist", "2026-04-16", 0.9, "weekly"),
    route("/widget", "2026-04-16", 0.9, "weekly"),

    // Industry pages
    route("/industry/coaching", "2026-03-10", 0.8),
    route("/industry/healthcare", "2026-04-07", 0.8),
    route("/industry/legal", "2026-04-07", 0.8),
    route("/industry/restaurant", "2026-03-10", 0.8),

    // Company
    route("/about", "2026-02-15", 0.7),
    route("/contact", "2026-05-01", 0.7),
    route("/contact-support", "2026-05-01", 0.6),

    // Documentation
    route("/docs", "2026-03-04", 0.9, "weekly"),
    route("/docs/getting-started", "2026-02-15", 0.8),
    route("/docs/user-guide", "2026-02-15", 0.8),
    route("/docs/support-crew", "2026-02-15", 0.8),
    route("/docs/leadgen-crew", "2026-02-15", 0.8),
    route("/docs/healthcare-crew", "2026-02-15", 0.8),
    route("/docs/faq", "2026-02-15", 0.7),

    // Legal & policy
    route("/docs/privacy", "2026-01-15", 0.5, "yearly"),
    route("/docs/terms", "2026-01-15", 0.5, "yearly"),
    route("/docs/security", "2026-01-15", 0.5, "yearly"),
    route("/docs/compliance", "2026-01-15", 0.5, "yearly"),

    // AI / LLM corpus
    route("/llms.txt", "2026-05-01", 0.4, "weekly"),
    route("/llms-full.txt", "2026-05-01", 0.4, "weekly"),
  ];
}
