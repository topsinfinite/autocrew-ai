import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog/loader";
import { getAuthor } from "@/lib/blog/authors";
import { getCategoryLabel } from "@/lib/blog/categories";
import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { JsonLd } from "@/components/seo/json-ld";
import { blogPostingSchema, blogBreadcrumbSchema, blogFaqSchema } from "@/lib/seo/schemas";
import { AEOSummary } from "@/components/blog/aeo-summary";
import { AuthorByline } from "@/components/blog/author-byline";
import { AuthorBioCard } from "@/components/blog/author-bio-card";
import { PostBody } from "@/components/blog/post-body";
import { PostFAQ } from "@/components/blog/post-faq";
import { RelatedPosts } from "@/components/blog/related-posts";
import { IndustryCTA } from "@/components/blog/industry-cta";
import { BlogNewsletter } from "@/components/blog/blog-newsletter";
import { StickyTOC } from "@/components/blog/sticky-toc";
import { PostCover } from "@/components/blog/post-cover";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const author = getAuthor(post.author);
  const ogImageUrl = post.coverImage ?? `/images/og-image.png`;
  const canonical = post.canonical || `${APP_CONFIG.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [...(post.tags ?? []), ...post.categories],
    authors: author ? [{ name: author.name }] : [],
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: author ? [author.name] : [],
      tags: post.tags,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.coverAlt ?? post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical,
      types: { "application/rss+xml": `${APP_CONFIG.url}/blog/rss.xml` },
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const related = getRelatedPosts(slug, 3);
  const primaryCategory = post.categories[0];
  const categoryLabel = primaryCategory ? getCategoryLabel(primaryCategory) : undefined;

  const jsonLd = [
    blogPostingSchema({
      title: post.title,
      description: post.description,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      authorName: author?.name ?? "Autocrew Team",
      categories: post.categories,
      tags: post.tags,
      coverImage: post.coverImage,
      slug: post.slug,
    }),
    blogBreadcrumbSchema(post, categoryLabel),
    ...(post.faqs?.length ? [blogFaqSchema(post.faqs)] : []),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="py-5 text-xs font-sans text-[hsl(25,10%,45%)] flex items-center gap-1.5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[hsl(16,100%,50%)] transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={ROUTES.BLOG} className="hover:text-[hsl(16,100%,50%)] transition-colors">Blog</Link>
          {primaryCategory && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={ROUTES.BLOG_CATEGORY(primaryCategory)} className="hover:text-[hsl(16,100%,50%)] transition-colors">
                {categoryLabel}
              </Link>
            </>
          )}
        </nav>

        {/* Post header */}
        <header className="border-t border-[rgba(26,20,16,0.12)] pt-10 pb-8">
          {primaryCategory && (
            <Link
              href={ROUTES.BLOG_CATEGORY(primaryCategory)}
              className="text-[11px] font-medium tracking-[0.1em] uppercase text-[hsl(16,100%,50%)] font-sans hover:text-[hsl(16,100%,40%)] transition-colors block mb-4"
            >
              {categoryLabel}
            </Link>
          )}
          <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-[hsl(20,26%,8%)] leading-[1.08] mb-5 max-w-4xl">
            {post.title}
          </h1>
          <p className="font-newsreader text-xl text-[hsl(25,10%,32%)] leading-relaxed max-w-2xl italic mb-6">
            {post.description}
          </p>

          <AuthorByline
            authorKey={post.author}
            date={post.publishedAt}
            readingTime={post.readingTime}
          />
        </header>

        {/* Cover image (always render — falls back to branded placeholder) */}
        <div className="mb-10 aspect-[16/7] overflow-hidden">
          <PostCover
            src={post.coverImage}
            alt={post.coverAlt ?? post.title}
            width={1280}
            height={560}
            priority
            category={primaryCategory}
            placeholderLabel={categoryLabel ?? "Autocrew Journal"}
          />
        </div>


        {/* Two-column: TOC left, article right (on xl screens) */}
        <div className="flex gap-16">
          {/* TOC — sticky left rail on xl */}
          <aside className="hidden xl:block w-52 flex-shrink-0">
            <div className="sticky top-24 pt-2">
              <StickyTOC />
            </div>
          </aside>

          {/* Article body */}
          <main className="flex-1 min-w-0 max-w-[720px]">
            {post.aeoSummary && <AEOSummary summary={post.aeoSummary} />}
            <PostBody content={post.content} />
            <PostFAQ faqs={post.faqs ?? []} />
            <AuthorBioCard authorKey={post.author} />
          </main>
        </div>

        {/* Below-article sections — full width */}
        <RelatedPosts posts={related} />
        <IndustryCTA categories={post.categories} />
        <BlogNewsletter />
      </div>
    </>
  );
}
