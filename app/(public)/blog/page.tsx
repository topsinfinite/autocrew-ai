import type { Metadata } from "next";
import { getAllPosts, getFeaturedPost, getAllCategories } from "@/lib/blog/loader";
import { CATEGORIES } from "@/lib/blog/categories";
import { FeaturedPost } from "@/components/blog/featured-post";
import { PostCard } from "@/components/blog/post-card";
import { CategoryStrip } from "@/components/blog/category-strip";
import { CategoryChips } from "@/components/blog/category-chips";
import { BlogNewsletter } from "@/components/blog/blog-newsletter";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Autocrew Journal — AI Automation & Voice Agent Insights",
  description:
    "Field notes on AI automation, voice agents, and industry-specific workflows for healthcare, coaching, legal, and restaurants.",
  openGraph: {
    title: "Autocrew Journal",
    description: "AI automation insights for healthcare, coaching, legal, and restaurants.",
    url: `${APP_CONFIG.url}/blog`,
    type: "website",
  },
  alternates: {
    canonical: `${APP_CONFIG.url}/blog`,
    types: { "application/rss+xml": `${APP_CONFIG.url}/blog/rss.xml` },
  },
};

export default function BlogIndexPage() {
  const featured = getFeaturedPost();
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 6);
  const activeCats = getAllCategories().map((c) => c.slug);

  const industryCategories = CATEGORIES.filter(
    (c) => ["healthcare", "coaching", "legal", "restaurants"].includes(c.slug) && activeCats.includes(c.slug),
  );

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      {/* Hero */}
      <div className="pt-16 pb-12 border-b border-[rgba(26,20,16,0.12)]">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[hsl(16,100%,50%)] font-sans mb-4">
          Autocrew Journal
        </p>
        <h1 className="font-display text-5xl lg:text-7xl font-semibold tracking-tight text-[hsl(20,26%,8%)] leading-[1.05] mb-4 max-w-3xl">
          Field notes from AI's first crew of agents.
        </h1>
        <p className="font-newsreader text-xl text-[hsl(25,10%,32%)] max-w-xl leading-relaxed">
          Practical guides on AI automation, voice agents, and industry-specific workflows.
        </p>
      </div>

      {/* Category chips */}
      <div className="py-6 border-b border-[rgba(26,20,16,0.12)]">
        <CategoryChips />
      </div>

      {/* Featured post */}
      {featured && (
        <div className="py-12">
          <FeaturedPost post={featured} />
        </div>
      )}

      {/* Recent grid */}
      {recentPosts.length > 0 && (
        <section className="py-12 border-t border-[rgba(26,20,16,0.12)]">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[hsl(20,26%,8%)] mb-8">
            Recent posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Category strips */}
      {industryCategories.map((cat) => {
        const posts = getAllPosts({ category: cat.slug });
        if (!posts.length) return null;
        return (
          <CategoryStrip key={cat.slug} categorySlug={cat.slug} posts={posts} />
        );
      })}

      {/* Newsletter */}
      <BlogNewsletter />
    </div>
  );
}
