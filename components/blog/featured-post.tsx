import Link from "next/link";
import { getCategoryLabel } from "@/lib/blog/categories";
import { ROUTES } from "@/lib/constants";
import type { PostMeta } from "@/lib/blog/types";
import { PostCover } from "./post-cover";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function FeaturedPost({ post }: { post: PostMeta }) {
  const primaryCategory = post.categories[0];
  const href = ROUTES.BLOG_POST(post.slug);

  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[rgba(26,20,16,0.12)]">
      {/* Image */}
      <Link href={href} className="block overflow-hidden aspect-[16/10] lg:aspect-auto min-h-[280px]">
        <PostCover
          src={post.coverImage}
          alt={post.coverAlt ?? post.title}
          width={800}
          height={530}
          priority
          category={primaryCategory}
          placeholderLabel={
            getCategoryLabel(primaryCategory) ?? "Featured"
          }
          className="transition-transform duration-500 hover:scale-[1.02]"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-[rgba(26,20,16,0.12)]">
        <div className="mb-4">
          {primaryCategory && (
            <Link
              href={ROUTES.BLOG_CATEGORY(primaryCategory)}
              className="text-[11px] font-medium tracking-[0.1em] uppercase text-[hsl(16,100%,50%)] font-sans hover:text-[hsl(16,100%,40%)] transition-colors"
            >
              {getCategoryLabel(primaryCategory)}
            </Link>
          )}
        </div>

        <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-[hsl(20,26%,8%)] leading-tight mb-4">
          <Link href={href} className="hover:text-[hsl(16,100%,50%)] transition-colors">
            {post.title}
          </Link>
        </h2>

        <p className="font-newsreader text-lg text-[hsl(25,10%,32%)] leading-relaxed mb-6">
          {post.description}
        </p>

        <div className="flex items-center gap-3 text-sm text-[hsl(25,10%,45%)] font-sans border-t border-[rgba(26,20,16,0.08)] pt-5">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
