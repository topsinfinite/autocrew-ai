import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getAllCategories } from "@/lib/blog/loader";
import { getCategory } from "@/lib/blog/categories";
import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { PostCard } from "@/components/blog/post-card";
import { CategoryChips } from "@/components/blog/category-chips";
import { BlogNewsletter } from "@/components/blog/blog-newsletter";
import Link from "next/link";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const cats = getAllCategories();
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};

  return {
    title: `${cat.label} — Autocrew Journal`,
    description: cat.description,
    openGraph: {
      title: `${cat.label} | Autocrew Journal`,
      description: cat.description,
      url: `${APP_CONFIG.url}/blog/category/${category}`,
      type: "website",
    },
    alternates: { canonical: `${APP_CONFIG.url}/blog/category/${category}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const posts = getAllPosts({ category });

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      {/* Header */}
      <div className="pt-16 pb-12 border-b border-[rgba(26,20,16,0.12)]">
        <Link
          href={ROUTES.BLOG}
          className="text-sm font-sans text-[hsl(16,100%,50%)] hover:text-[hsl(16,100%,40%)] transition-colors mb-4 inline-block"
        >
          ← All posts
        </Link>
        <h1 className="font-display text-4xl lg:text-6xl font-semibold tracking-tight text-[hsl(20,26%,8%)] leading-tight mb-3">
          {cat.label}
        </h1>
        <p className="font-newsreader text-lg text-[hsl(25,10%,32%)] max-w-xl">
          {cat.description}
        </p>
        {cat.industryRoute && (
          <Link
            href={cat.industryRoute}
            className="mt-4 inline-flex text-sm font-sans font-medium text-[hsl(16,100%,50%)] hover:text-[hsl(16,100%,40%)] transition-colors"
          >
            See how Autocrew works for {cat.label.toLowerCase()} →
          </Link>
        )}
      </div>

      {/* Chips */}
      <div className="py-6 border-b border-[rgba(26,20,16,0.12)]">
        <CategoryChips active={category} />
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-newsreader text-lg text-[hsl(25,10%,45%)]">
            No posts yet in this category. Check back soon.
          </p>
        </div>
      ) : (
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      <BlogNewsletter />
    </div>
  );
}
