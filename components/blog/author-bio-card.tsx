import Image from "next/image";
import Link from "next/link";
import { getAuthor } from "@/lib/blog/authors";
import { ROUTES } from "@/lib/constants";

export function AuthorBioCard({ authorKey }: { authorKey: string }) {
  const author = getAuthor(authorKey);
  if (!author) return null;

  return (
    <section className="mt-16 pt-10 border-t border-[rgba(26,20,16,0.12)]">
      <div className="flex items-start gap-5">
        {author.avatar && (
          <Link href={ROUTES.BLOG_AUTHOR(author.key)} className="flex-shrink-0">
            <Image
              src={author.avatar}
              alt={author.name}
              width={64}
              height={64}
              className="rounded-full w-16 h-16 object-cover"
            />
          </Link>
        )}
        <div>
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[hsl(25,10%,45%)] font-sans mb-1">
            Written by
          </p>
          <Link
            href={ROUTES.BLOG_AUTHOR(author.key)}
            className="font-display font-semibold text-lg text-[hsl(20,26%,8%)] hover:text-[hsl(16,100%,50%)] transition-colors"
          >
            {author.name}
          </Link>
          <p className="text-sm text-[hsl(25,10%,45%)] font-sans mb-2">{author.role}</p>
          <p className="font-newsreader text-base text-[hsl(25,10%,28%)] leading-relaxed max-w-xl">
            {author.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
