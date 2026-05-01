import Link from "next/link";
import { PostCard } from "./post-card";
import { getCategory } from "@/lib/blog/categories";
import { ROUTES } from "@/lib/constants";
import type { PostMeta } from "@/lib/blog/types";

interface CategoryStripProps {
  categorySlug: string;
  posts: PostMeta[];
}

export function CategoryStrip({ categorySlug, posts }: CategoryStripProps) {
  const cat = getCategory(categorySlug);
  if (!posts.length || !cat) return null;

  return (
    <section className="py-16 border-t border-[rgba(26,20,16,0.12)]">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[hsl(20,26%,8%)]">
          {cat.label}
        </h2>
        <Link
          href={ROUTES.BLOG_CATEGORY(categorySlug)}
          className="text-sm font-sans font-medium text-[hsl(16,100%,50%)] hover:text-[hsl(16,100%,40%)] transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
