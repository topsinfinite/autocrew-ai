"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";
import { askSarah } from "@/lib/widget/ask-helpers";

/**
 * Section 10 — Closing CTA.
 *
 * Centered, declarative, low-chrome. Two paths: book a demo (primary)
 * and ask the widget itself (secondary, the most on-brand fallback).
 * Anchor link to §8 install snippet for visitors who skipped ahead.
 */
export function WidgetSectionCta() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[920px] px-6 pb-32 pt-24 text-center sm:pt-32">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
          Last button
        </div>

        <h2
          className={cn(
            "mt-6 font-space-grotesk font-semibold text-foreground",
            "text-[clamp(2rem,5vw,4.25rem)] leading-[1.04] tracking-[-0.025em]",
          )}
        >
          Ship a widget that<br className="hidden sm:block" />{" "}
          <span className="text-[#FF6B35]">talks back</span>.
        </h2>

        <p className="mx-auto mt-6 max-w-[52ch] font-geist text-[16px] leading-[1.65] text-foreground/70">
          Twenty minutes with a human, or thirty seconds with the widget
          itself. Either way you&rsquo;ll know whether this fits your site
          before you commit a line of code.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="pill"
            size="pill-lg"
            asChild
            className="group shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)]"
          >
            <Link href={heroData.primaryCta.href}>
              {heroData.primaryCta.text}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          <button
            type="button"
            onClick={() =>
              askSarah(
                "Help me decide if AutoCrew is the right fit for my site.",
              )
            }
            className={cn(
              "group inline-flex items-center gap-2 rounded-full",
              "border border-[var(--border-subtle)] bg-white/[0.02]",
              "hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/[0.04]",
              "px-5 py-3 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60",
            )}
          >
            <span className="font-geist text-[14px] font-medium text-foreground/85 group-hover:text-foreground">
              Or ask the widget itself
            </span>
            <ArrowRight className="h-4 w-4 text-foreground/55 transition-transform group-hover:translate-x-0.5 group-hover:text-[#FF6B35]" />
          </button>
        </div>

        <div className="mt-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
          <span>Or grab the embed</span>
          <Link
            href="#install"
            className="inline-flex items-center gap-1 text-foreground/65 hover:text-[#FF6B35]"
          >
            <span>three-line snippet</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
