import { getAllPosts } from "@/lib/blog/loader";
import { getAuthor } from "@/lib/blog/authors";
import { APP_CONFIG } from "@/lib/constants";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts({ limit: 25 });
  const baseUrl = APP_CONFIG.url;
  const now = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const author = getAuthor(post.author);
      const pubDate = new Date(post.publishedAt).toUTCString();
      const url = `${baseUrl}/blog/${post.slug}`;
      const categories = post.categories
        .map((c) => `<category>${escapeXml(c)}</category>`)
        .join("");

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${categories}
      ${author ? `<author>${escapeXml(author.name)}</author>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(APP_CONFIG.name)} Journal</title>
    <link>${baseUrl}/blog</link>
    <description>Field notes on AI automation, voice agents, and industry-specific workflows.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
