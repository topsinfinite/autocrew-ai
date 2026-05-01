export interface FAQItem {
  q: string;
  a: string;
}

export interface PostFrontmatter {
  title: string;
  slug?: string;
  description: string;
  aeoSummary?: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  categories: string[];
  tags?: string[];
  coverImage?: string;
  coverAlt?: string;
  featured?: boolean;
  draft?: boolean;
  canonical?: string;
  faqs?: FAQItem[];
  related?: string[];
  readingTime?: string;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: string;
  filePath: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface Author {
  key: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Category {
  slug: string;
  label: string;
  description: string;
  industryRoute?: string;
  count?: number;
}
