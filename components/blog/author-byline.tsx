import Link from "next/link";
import Image from "next/image";
import { getAuthor } from "@/lib/blog/authors";
import { ROUTES } from "@/lib/constants";

interface AuthorBylineProps {
  authorKey: string;
  date: string;
  readingTime: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function AuthorByline({ authorKey, date, readingTime }: AuthorBylineProps) {
  const author = getAuthor(authorKey);
  if (!author) return null;

  return (
    <div className="flex items-center gap-3 py-5 border-b border-[rgba(26,20,16,0.12)]">
      {author.avatar && (
        <Link href={ROUTES.BLOG_AUTHOR(author.key)}>
          <Image
            src={author.avatar}
            alt={author.name}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover"
          />
        </Link>
      )}
      <div className="flex-1 min-w-0">
        <Link
          href={ROUTES.BLOG_AUTHOR(author.key)}
          className="text-[14px] font-medium font-sans text-[hsl(20,26%,8%)] hover:text-[hsl(16,100%,50%)] transition-colors"
        >
          {author.name}
        </Link>
        <div className="text-xs text-[hsl(25,10%,45%)] font-sans mt-0.5">
          <time dateTime={date}>{formatDate(date)}</time>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>{readingTime}</span>
        </div>
      </div>
    </div>
  );
}
