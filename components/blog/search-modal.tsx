"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { getCategoryLabel } from "@/lib/blog/categories";
import type { SearchIndexEntry } from "@/lib/blog/loader";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  index: SearchIndexEntry[];
}

interface ScoredPost extends SearchIndexEntry {
  score: number;
}

/** Case-insensitive scoring: title (3) > description (2) > tags/categories (1). */
function scorePost(post: SearchIndexEntry, tokens: string[]): number {
  const title = post.title.toLowerCase();
  const description = post.description.toLowerCase();
  const categoriesText = post.categories.join(" ").toLowerCase();
  const tagsText = post.tags.join(" ").toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (title.includes(token)) score += 3;
    if (description.includes(token)) score += 2;
    if (categoriesText.includes(token)) score += 1;
    if (tagsText.includes(token)) score += 1;
  }
  return score;
}

function highlight(text: string, tokens: string[]) {
  if (!tokens.length) return text;
  const pattern = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark
        key={i}
        className="bg-[hsl(30,100%,92%)] text-[hsl(20,26%,8%)] px-0.5 rounded-sm"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SearchModal({ open, onClose, index }: SearchModalProps) {
  // Mount/unmount the inner panel based on `open` so each open starts with fresh state.
  if (!open) return null;
  return <SearchModalPanel onClose={onClose} index={index} />;
}

function SearchModalPanel({
  onClose,
  index,
}: {
  onClose: () => void;
  index: SearchIndexEntry[];
}) {
  const [query, setQuery] = useState("");
  const [rawActiveIndex, setRawActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input on mount + lock body scroll
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = original;
    };
  }, []);

  const tokens = useMemo(
    () =>
      query
        .toLowerCase()
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    [query],
  );

  const results: ScoredPost[] = useMemo(() => {
    if (!tokens.length) {
      // Empty query — show recent posts as default
      return index.slice(0, 8).map((p) => ({ ...p, score: 0 }));
    }
    return index
      .map((post) => ({ ...post, score: scorePost(post, tokens) }))
      .filter((p) => p.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, 12);
  }, [index, tokens]);

  // Derive a clamped active index — avoids state-resync effects when results shrink.
  const activeIndex =
    results.length === 0 ? 0 : Math.min(rawActiveIndex, results.length - 1);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setRawActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setRawActiveIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        const link = resultsRef.current?.querySelectorAll("a")[activeIndex] as
          | HTMLAnchorElement
          | undefined;
        link?.click();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [results, activeIndex, onClose]);

  // Scroll active result into view
  useEffect(() => {
    const link = resultsRef.current?.querySelectorAll("a")[activeIndex] as
      | HTMLAnchorElement
      | undefined;
    link?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const setActiveIndex = setRawActiveIndex;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search the Autocrew Journal"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(26,20,16,0.4)] backdrop-blur-sm cursor-default"
        aria-label="Close search"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-[hsl(40,50%,97%)] border border-[rgba(26,20,16,0.18)] rounded-2xl shadow-[0_24px_48px_-16px_rgba(26,20,16,0.32)] overflow-hidden">
        {/* Search input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(26,20,16,0.12)]">
          <Search
            className="w-5 h-5 text-[hsl(25,10%,45%)] flex-shrink-0"
            strokeWidth={2}
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search posts by title, topic, or industry..."
            className="flex-1 bg-transparent outline-none border-none text-[15px] font-sans text-[hsl(20,26%,8%)] placeholder:text-[hsl(25,10%,55%)]"
            aria-label="Search query"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-[rgba(26,20,16,0.06)] text-[hsl(25,10%,45%)] hover:text-[hsl(20,26%,8%)] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2} aria-hidden />
          </button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-sans text-sm text-[hsl(25,10%,45%)]">
                No posts match{" "}
                <span className="text-[hsl(20,26%,8%)] font-medium">
                  &ldquo;{query}&rdquo;
                </span>
                .
              </p>
              <p className="font-sans text-xs text-[hsl(25,10%,55%)] mt-2">
                Try a broader term, an industry name, or a topic.
              </p>
            </div>
          ) : (
            <ul className="py-2">
              {!tokens.length && (
                <li className="px-5 pb-2 pt-1 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-[hsl(25,10%,55%)]">
                  Recent posts
                </li>
              )}
              {results.map((post, i) => {
                const isActive = i === activeIndex;
                const primaryCategory = post.categories[0];
                const categoryLabel = primaryCategory
                  ? getCategoryLabel(primaryCategory)
                  : undefined;
                return (
                  <li key={post.slug}>
                    <Link
                      href={ROUTES.BLOG_POST(post.slug)}
                      onClick={onClose}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        "block px-5 py-3 transition-colors group",
                        isActive
                          ? "bg-[rgba(26,20,16,0.04)]"
                          : "hover:bg-[rgba(26,20,16,0.04)]",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {categoryLabel && (
                            <div className="text-[10px] font-sans font-medium uppercase tracking-[0.08em] text-[hsl(16,100%,50%)] mb-1">
                              {categoryLabel}
                            </div>
                          )}
                          <div className="font-display text-[15px] font-semibold text-[hsl(20,26%,8%)] leading-snug">
                            {highlight(post.title, tokens)}
                          </div>
                          <div className="font-sans text-[13px] text-[hsl(25,10%,45%)] mt-1 line-clamp-2">
                            {highlight(post.description, tokens)}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] font-sans text-[hsl(25,10%,55%)]">
                            <time dateTime={post.publishedAt}>
                              {formatDate(post.publishedAt)}
                            </time>
                            <span aria-hidden>·</span>
                            <span>{post.readingTime}</span>
                          </div>
                        </div>
                        <ArrowRight
                          className={cn(
                            "w-4 h-4 flex-shrink-0 mt-1 transition-all",
                            isActive
                              ? "text-[hsl(16,100%,50%)] translate-x-0.5"
                              : "text-[hsl(25,10%,55%)] opacity-0 group-hover:opacity-100",
                          )}
                          aria-hidden
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer with hints */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[rgba(26,20,16,0.12)] bg-[hsl(40,35%,94%)]">
          <div className="flex items-center gap-3 text-[11px] font-sans text-[hsl(25,10%,45%)]">
            <span className="flex items-center gap-1.5">
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 border border-[rgba(26,20,16,0.18)] rounded text-[10px] bg-[hsl(40,50%,97%)] font-sans">
                ↑↓
              </kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 border border-[rgba(26,20,16,0.18)] rounded text-[10px] bg-[hsl(40,50%,97%)] font-sans">
                ↵
              </kbd>
              <span>open</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 border border-[rgba(26,20,16,0.18)] rounded text-[10px] bg-[hsl(40,50%,97%)] font-sans">
                esc
              </kbd>
              <span>close</span>
            </span>
          </div>
          <span className="text-[11px] font-sans text-[hsl(25,10%,55%)]">
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
