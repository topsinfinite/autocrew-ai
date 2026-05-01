"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function buildToc(): TocItem[] {
  if (typeof document === "undefined") return [];
  const headings = Array.from(
    document.querySelectorAll(".prose-blog h2, .prose-blog h3"),
  );
  return headings.map((h) => ({
    id: h.id,
    text: h.textContent?.replace(/^#\s*/, "") ?? "",
    level: parseInt(h.tagName[1]),
  }));
}

export function StickyTOC() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    setItems(buildToc());
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px" },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="hidden xl:block">
      <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[hsl(25,10%,45%)] font-sans mb-4">
        On this page
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : "0" }}>
            <a
              href={`#${item.id}`}
              className={`block text-[13px] font-sans py-0.5 transition-colors leading-snug ${
                active === item.id
                  ? "text-[hsl(16,100%,50%)] font-medium"
                  : "text-[hsl(25,10%,45%)] hover:text-[hsl(20,26%,8%)]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
