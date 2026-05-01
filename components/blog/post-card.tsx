import Link from "next/link";
import { getCategoryLabel } from "@/lib/blog/categories";
import { ROUTES } from "@/lib/constants";
import type { PostMeta } from "@/lib/blog/types";
import { cn } from "@/lib/utils";
import { PostCover } from "./post-cover";

interface PostCardProps {
  post: PostMeta;
  className?: string;
  compact?: boolean;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post, className, compact = false }: PostCardProps) {
  const primaryCategory = post.categories[0];
  const href = ROUTES.BLOG_POST(post.slug);

  return (
    <article
      className={cn(
        "group flex flex-col border-b border-[rgba(26,20,16,0.12)] pb-8",
        className,
      )}
    >
      {!compact && (
        <Link href={href} className="block overflow-hidden mb-5 aspect-[3/2]">
          <PostCover
            src={post.coverImage}
            alt={post.coverAlt ?? post.title}
            width={640}
            height={427}
            category={primaryCategory}
            placeholderLabel={getCategoryLabel(primaryCategory) ?? "Autocrew Journal"}
            className="transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1">
        {primaryCategory && (
          <Link
            href={ROUTES.BLOG_CATEGORY(primaryCategory)}
            className="text-[11px] font-medium tracking-[0.1em] uppercase text-[hsl(16,100%,50%)] mb-3 font-sans hover:text-[hsl(16,100%,40%)] transition-colors"
          >
            {getCategoryLabel(primaryCategory)}
          </Link>
        )}

        <h2
          className={cn(
            "font-display font-semibold tracking-tight text-[hsl(20,26%,8%)] leading-tight mb-3",
            compact ? "text-xl" : "text-2xl",
          )}
        >
          <Link href={href} className="hover:text-[hsl(16,100%,50%)] transition-colors">
            {post.title}
          </Link>
        </h2>

        {!compact && (
          <p className="font-newsreader text-base text-[hsl(25,10%,32%)] leading-relaxed mb-4 flex-1 line-clamp-3">
            {post.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-[hsl(25,10%,45%)] font-sans">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
