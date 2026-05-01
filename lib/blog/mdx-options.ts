import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import type { PluggableList } from "unified";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  keepBackground: false,
};

export const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm] as PluggableList,
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, prettyCodeOptions],
    ] as PluggableList,
  },
};
