"use client";

import Link from "next/link";
import { ArrowRight, Code2, Link2, Mic, MousePointerClick, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";
import { askSarah, openVoice } from "@/lib/widget/ask-helpers";
import { LiveEventLog } from "./live-event-log";

interface TriggerTile {
  id: string;
  label: string;
  Icon: LucideIcon;
  description: string;
  snippet: string;
  fire: () => void;
}

const TILES: TriggerTile[] = [
  {
    id: "declarative",
    label: "Declarative",
    Icon: MousePointerClick,
    description: "HTML attribute. No JS.",
    snippet: 'data-autocrew-question="Pricing?"',
    fire: () => askSarah("What's your pricing for the support crew?"),
  },
  {
    id: "url",
    label: "URL param",
    Icon: Link2,
    description: "Email-friendly. Self-cleaning.",
    snippet: "?autocrew_q=Show%20me%20a%20demo",
    fire: () => askSarah("Show me a demo of the widget on a real site."),
  },
  {
    id: "api",
    label: "JS API",
    Icon: Code2,
    description: "For programmatic triggers.",
    snippet: 'AutoCrew.ask("Hello")',
    fire: () => askSarah("How would I trigger the widget after a form submit?"),
  },
  {
    id: "search",
    label: "Search element",
    Icon: Search,
    description: "Drop-in shadow-DOM box.",
    snippet: "<autocrew-search />",
    fire: () => askSarah("Tell me about the autocrew-search custom element."),
  },
  {
    id: "voice",
    label: "Voice mode",
    Icon: Mic,
    description: "Tap-to-talk on any tile.",
    snippet: 'data-autocrew-mode="voice"',
    fire: () => openVoice(),
  },
];

/**
 * Concept C — Five-Tile Preview.
 *
 * Editorial headline + an immediate horizontal row of five working
 * trigger-surface tiles. Below the tiles, the live event log fills with
 * what the visitor just fired. The whole feature surface in 30 seconds.
 */
export function WidgetHeroCTiles() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-5"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_50%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-6 pb-24 pt-16 lg:pb-32 lg:pt-20">
        {/* Status / masthead */}
        <div
          className={cn(
            "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/60",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6B35]" />
          </span>
          <span>Five surfaces &middot; one widget &middot; live</span>
        </div>

        {/* Asymmetric two-column headline */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h1
            className={cn(
              "lg:col-span-8 font-space-grotesk font-semibold text-foreground",
              "text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] tracking-[-0.02em]",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Turn every button into a
            <span className="text-[#FF6B35]"> live conversation</span>.
          </h1>

          <p
            className={cn(
              "lg:col-span-4 max-w-[40ch] self-end font-geist text-[16px] leading-[1.6] text-foreground/70",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "220ms", animationFillMode: "forwards" }}
          >
            Five trigger surfaces. Zero forms. One AI agent your visitors
            can reach from any page, button, or link &mdash; without
            re-embedding.
          </p>
        </div>

        {/* Five tiles */}
        <div
          className={cn(
            "mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "340ms", animationFillMode: "forwards" }}
        >
          {TILES.map(({ id, label, Icon, description, snippet, fire }) => (
            <button
              key={id}
              type="button"
              onClick={fire}
              className={cn(
                "group relative flex flex-col items-start gap-3 overflow-hidden rounded-xl",
                "border border-[var(--border-subtle)] bg-white/[0.015]",
                "p-4 text-left transition-all",
                "hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/[0.03]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-card text-[#FF6B35]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40 group-hover:text-[#FF6B35]">
                  Run &rarr;
                </span>
              </div>
              <div>
                <div className="font-space-grotesk text-[14px] font-medium tracking-tight text-foreground">
                  {label}
                </div>
                <div className="mt-1 font-geist text-[12px] text-foreground/60">
                  {description}
                </div>
              </div>
              <code className="mt-auto block w-full overflow-x-auto rounded-md border border-[var(--border-subtle)] bg-[#06070b]/95 px-2.5 py-1.5 font-mono text-[10.5px] leading-snug text-foreground/75">
                {snippet}
              </code>
            </button>
          ))}
        </div>

        {/* Live console + CTA row */}
        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <div
            className={cn(
              "lg:col-span-8 animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "460ms", animationFillMode: "forwards" }}
          >
            <LiveEventLog max={6} title="Live console" />
          </div>

          <div
            className={cn(
              "lg:col-span-4 flex flex-col gap-3 self-stretch rounded-xl",
              "border border-[var(--border-subtle)] bg-white/[0.015] p-5",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "560ms", animationFillMode: "forwards" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
              Talk to a human
            </span>
            <p className="font-geist text-[14px] leading-[1.55] text-foreground/75">
              Want a 20-min walkthrough of the widget on your site?
            </p>
            <Button
              variant="pill"
              size="pill-md"
              asChild
              className="group mt-auto self-start shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)]"
            >
              <Link href={heroData.primaryCta.href}>
                {heroData.primaryCta.text}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
