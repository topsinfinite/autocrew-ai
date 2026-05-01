import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function getMdxFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));
}

function parsePost(fileName: string): PostMeta | null {
  const filePath = path.join(BLOG_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (!data.title || !data.publishedAt) return null;

  const slug = data.slug ?? fileName.replace(/\.mdx$/, "");
  const rt = readingTime(content);

  return {
    ...data,
    slug,
    filePath,
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    faqs: data.faqs ?? [],
    related: data.related ?? [],
    readingTime: rt.text,
    draft: data.draft ?? false,
    featured: data.featured ?? false,
    updatedAt: data.updatedAt ?? data.publishedAt,
  } as PostMeta;
}

function sortByDate(posts: PostMeta[]): PostMeta[] {
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getAllPosts(opts?: {
  includeDrafts?: boolean;
  category?: string;
  tag?: string;
  author?: string;
  limit?: number;
}): PostMeta[] {
  const files = getMdxFiles();
  const posts = files
    .map(parsePost)
    .filter((p): p is PostMeta => p !== null)
    .filter((p) => opts?.includeDrafts || !p.draft)
    .filter((p) => !opts?.category || p.categories.includes(opts.category))
    .filter((p) => !opts?.tag || (p.tags ?? []).includes(opts.tag))
    .filter((p) => !opts?.author || p.author === opts.author);

  const sorted = sortByDate(posts);
  return opts?.limit ? sorted.slice(0, opts.limit) : sorted;
}

export function getPostBySlug(slug: string): Post | null {
  const files = getMdxFiles();
  for (const fileName of files) {
    const filePath = path.join(BLOG_DIR, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const fileSlug = data.slug ?? fileName.replace(/\.mdx$/, "");
    if (fileSlug !== slug) continue;

    const rt = readingTime(content);
    return {
      ...data,
      slug: fileSlug,
      filePath,
      content,
      categories: data.categories ?? [],
      tags: data.tags ?? [],
      faqs: data.faqs ?? [],
      related: data.related ?? [],
      readingTime: rt.text,
      draft: data.draft ?? false,
      featured: data.featured ?? false,
      updatedAt: data.updatedAt ?? data.publishedAt,
    } as Post;
  }
  return null;
}

export function getAllCategories(): { slug: string; count: number }[] {
  const posts = getAllPosts();
  const counts: Record<string, number> = {};
  for (const post of posts) {
    for (const cat of post.categories) {
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const post = getPostBySlug(slug);
  if (!post) return [];

  const all = getAllPosts().filter((p) => p.slug !== slug);

  // 1. explicit related list
  const explicit = (post.related ?? [])
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is PostMeta => p !== undefined);

  if (explicit.length >= limit) return explicit.slice(0, limit);

  // 2. same category
  const byCat = all.filter((p) =>
    p.categories.some((c) => post.categories.includes(c)),
  );

  const combined = [
    ...explicit,
    ...byCat.filter((p) => !explicit.find((e) => e.slug === p.slug)),
  ];

  return combined.slice(0, limit);
}

export function getFeaturedPost(): PostMeta | null {
  const featured = getAllPosts().filter((p) => p.featured);
  if (featured.length) return featured[0];
  return getAllPosts({ limit: 1 })[0] ?? null;
}
