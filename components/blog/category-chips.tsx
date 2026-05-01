"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/blog/categories";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryChips({ active }: { active?: string }) {
  const displayCategories = CATEGORIES.filter((c) =>
    ["ai-automation", "customer-service", "healthcare", "coaching", "legal", "restaurants", "playbooks"].includes(c.slug),
  );

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={ROUTES.BLOG}
        className={cn(
          "text-xs font-medium font-sans tracking-wide px-3 py-1.5 border transition-colors",
          !active
            ? "bg-[hsl(20,26%,8%)] text-[hsl(40,35%,94%)] border-[hsl(20,26%,8%)]"
            : "text-[hsl(20,26%,8%)] border-[rgba(26,20,16,0.2)] hover:border-[rgba(26,20,16,0.5)]",
        )}
      >
        All
      </Link>
      {displayCategories.map((cat) => (
        <Link
          key={cat.slug}
          href={ROUTES.BLOG_CATEGORY(cat.slug)}
          className={cn(
            "text-xs font-medium font-sans tracking-wide px-3 py-1.5 border transition-colors",
            active === cat.slug
              ? "bg-[hsl(20,26%,8%)] text-[hsl(40,35%,94%)] border-[hsl(20,26%,8%)]"
              : "text-[hsl(20,26%,8%)] border-[rgba(26,20,16,0.2)] hover:border-[rgba(26,20,16,0.5)]",
          )}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
