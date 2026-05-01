import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog/loader";
import { getAuthor, AUTHORS } from "@/lib/blog/authors";
import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { PostCard } from "@/components/blog/post-card";
import { BlogNewsletter } from "@/components/blog/blog-newsletter";
import Link from "next/link";

interface Props {
  params: Promise<{ author: string }>;
}

export async function generateStaticParams() {
  return AUTHORS.map((a) => ({ author: a.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author: authorKey } = await params;
  const author = getAuthor(authorKey);
  if (!author) return {};

  return {
    title: `${author.name} — Autocrew Journal`,
    description: author.bio,
    openGraph: {
      title: `${author.name} | Autocrew Journal`,
      description: author.bio,
      url: `${APP_CONFIG.url}/blog/author/${authorKey}`,
      type: "profile",
    },
    alternates: { canonical: `${APP_CONFIG.url}/blog/author/${authorKey}` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { author: authorKey } = await params;
  const author = getAuthor(authorKey);
  if (!author) notFound();

  const posts = getAllPosts({ author: authorKey });

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      {/* Header */}
      <div className="pt-16 pb-12 border-b border-[rgba(26,20,16,0.12)]">
        <Link
          href={ROUTES.BLOG}
          className="text-sm font-sans text-[hsl(16,100%,50%)] hover:text-[hsl(16,100%,40%)] transition-colors mb-6 inline-block"
        >
          ← All posts
        </Link>
        <div className="flex items-start gap-6">
          {author.avatar && (
            <Image
              src={author.avatar}
              alt={author.name}
              width={80}
              height={80}
              className="rounded-full w-20 h-20 object-cover flex-shrink-0"
            />
          )}
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-[hsl(20,26%,8%)] mb-1">
              {author.name}
            </h1>
            <p className="text-sm font-sans text-[hsl(25,10%,45%)] mb-3">{author.role}</p>
            <p className="font-newsreader text-lg text-[hsl(25,10%,32%)] max-w-xl leading-relaxed">
              {author.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-newsreader text-lg text-[hsl(25,10%,45%)]">
            No published posts yet.
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
