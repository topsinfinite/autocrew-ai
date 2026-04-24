"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";
import { askSarah } from "@/lib/widget/ask-helpers";
import { LiveEventLog } from "./live-event-log";

const SUGGESTED_QUESTIONS = [
  "What can it handle on a pricing page?",
  "Show me the embed code",
  "How does it work in email campaigns?",
];

/**
 * Concept B — Search-Bar Editorial.
 *
 * Magazine-style hero with a generous <autocrew-search> as the dominant
 * interaction. Subtle code line beneath the search hints at depth. A
 * persistent floating event log docks bottom-left so the visitor sees
 * their own activity stream as they scroll.
 */
export function WidgetHeroBSearch() {
  return (
    <section className="relative z-10 overflow-hidden">
      {/* Soft glow + horizontal rules — editorial stationery feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-5"
      >
        <div className="absolute left-1/2 top-1/3 h-[40%] w-[60%] -translate-x-1/2 rounded-full bg-[#FF6B35]/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1100px] px-6 pb-24 pt-16 sm:pt-24 lg:pb-32">
        {/* Masthead rule */}
        <div
          className={cn(
            "flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/45",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
        >
          <span>AutoCrew &nbsp;/&nbsp; Widget Triggers</span>
          <span className="hidden sm:inline">v1.1 &middot; Live</span>
        </div>

        {/* Headline */}
        <h1
          className={cn(
            "mt-12 font-space-grotesk font-semibold text-foreground",
            "text-[clamp(2.75rem,6vw,5.75rem)] leading-[1.02] tracking-[-0.02em]",
            "max-w-[18ch]",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "120ms", animationFillMode: "forwards" }}
        >
          Turn every button into a
          <span className="text-[#FF6B35]"> live conversation</span>.
        </h1>

        <p
          className={cn(
            "mt-6 max-w-[56ch] font-geist text-[18px] leading-[1.65] text-foreground/75",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "220ms", animationFillMode: "forwards" }}
        >
          Five trigger surfaces. Zero forms. One AI agent your visitors can
          reach from any page, button, or link &mdash; without re-embedding.
        </p>

        {/* Search — center-stage */}
        <div
          className={cn(
            "mt-12 max-w-[680px]",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "340ms", animationFillMode: "forwards" }}
        >
          <autocrew-search
            placeholder="Ask anything about the widget…"
            button-label="Ask Sarah"
            primary-color="#FF6B35"
          />
          <code className="mt-3 block font-mono text-[11px] text-foreground/45">
            &lt;script src=&quot;https://app.autocrew-ai.com/widget.js&quot;&gt;&lt;/script&gt;
            <span className="ml-3 text-foreground/30">// embed in 3 lines &darr;</span>
          </code>
        </div>

        {/* Suggested question pills */}
        <div
          className={cn(
            "mt-6 flex max-w-[680px] flex-wrap items-center gap-2",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "440ms", animationFillMode: "forwards" }}
        >
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => askSarah(q)}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full",
                "border border-[var(--border-subtle)] bg-white/[0.02]",
                "hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/[0.04]",
                "px-3 py-1.5 transition-colors",
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]/60 group-hover:bg-[#FF6B35]"
                aria-hidden
              />
              <span className="font-geist text-[13px] text-foreground/75 group-hover:text-foreground">
                {q}
              </span>
            </button>
          ))}
        </div>

        {/* Primary CTA */}
        <div
          className={cn(
            "mt-10 flex flex-wrap items-center gap-3",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "560ms", animationFillMode: "forwards" }}
        >
          <Button
            variant="pill"
            size="pill-md"
            asChild
            className="group shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)]"
          >
            <Link href={heroData.primaryCta.href}>
              {heroData.primaryCta.text}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Link
            href="#install"
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55 hover:text-foreground"
          >
            Or grab the embed snippet
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Closing rule */}
        <div className="mt-20 border-t border-[var(--border-subtle)] pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
          <span>
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-[#FF6B35]" />
            Live &mdash; every trigger fires through the same widget you embed
          </span>
        </div>
      </div>

      {/* Floating live log — bottom-left, persistent */}
      <div
        className={cn(
          "fixed bottom-6 left-6 z-[55] hidden w-[280px] sm:block",
          "animate-fade-up opacity-0",
        )}
        style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
        data-contextual-ai="off"
      >
        <LiveEventLog max={5} title="Triggers · live" />
      </div>
    </section>
  );
}
