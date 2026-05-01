import { PostCard } from "./post-card";
import type { PostMeta } from "@/lib/blog/types";

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) return null;

  return (
    <section className="mt-16 pt-10 border-t border-[rgba(26,20,16,0.12)]">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-[hsl(20,26%,8%)] mb-8">
        Keep reading
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post.slug} post={post} compact />
        ))}
      </div>
    </section>
  );
}
