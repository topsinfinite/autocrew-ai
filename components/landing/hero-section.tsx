"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "@/components/landing/audio-player";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { SuggestedPills } from "@/components/landing/suggested-pills";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";

const SUGGESTED_QUESTIONS = [
  "How does it learn my business?",
  "Can it escalate to a human?",
  "What does a deploy look like?",
] as const;

// Flip to true to re-enable the DashboardPreview proof artifact below the hero.
// Currently hidden while we evaluate whether it earns its keep above the fold.
const SHOW_DASHBOARD_PREVIEW = false;

/**
 * Conversational / Live Stream hero.
 *
 * Left column: pitch + search CTA.
 * Right column: live-stream card (Visitor/AutoCrew exchange) + suggested
 * follow-up pills + audio demo paired with a primary Book a Demo CTA.
 */
export function HeroSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      {/* Film-grain noise overlay — print-like texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-5 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-32 lg:pt-20">
        {/* LEFT column: pitch + search */}
        <div className="lg:col-span-7">
          {/* Status line */}
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
            <span>Crew &middot; Online</span>
          </div>

          <h1
            className={cn(
              "mt-6 font-space-grotesk font-semibold text-foreground",
              "text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] tracking-[-0.02em]",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            AI crews, wired into your
            <span className="text-[#FF6B35]"> operations</span>.
          </h1>

          <p
            className={cn(
              "mt-6 max-w-[56ch] font-geist text-[17px] leading-[1.65] text-foreground/75",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Pick a role, deploy an agent, watch it work. Voice, chat,
            scheduling, and escalations&mdash;live in days, not quarters,
            each one trained on your actual workflows.
          </p>

          {/* Search */}
          <div
            className={cn("mt-10 max-w-[620px]", "animate-fade-up opacity-0")}
            style={{ animationDelay: "320ms", animationFillMode: "forwards" }}
          >
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              <span>&gt; Ask Sarah</span>
            </div>
            <div>
              <autocrew-search
                placeholder="Ask anything…"
                button-label="Ask Sarah"
                primary-color="#FF6B35"
              />
              <p className="mt-3 font-geist text-[12px] italic text-foreground/45">
                She answers in real time &mdash; trained on your operations.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT column: dialog stream + pills + audio */}
        <aside
          className={cn("lg:col-span-5", "animate-fade-up opacity-0")}
          style={{ animationDelay: "260ms", animationFillMode: "forwards" }}
          aria-label="Live conversation stream"
        >
          {/* Stream card */}
          <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white/[0.015]">
            {/* Stream header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35]/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                </span>
                <span>Live stream</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
                Now
              </span>
            </div>

            {/* Visitor turn */}
            <div className="grid grid-cols-[76px_1fr] items-start gap-x-4 px-5 py-4">
              <span className="pt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                Visitor
              </span>
              <p className="font-space-grotesk text-[18px] font-medium leading-[1.4] tracking-[-0.005em] text-foreground/85">
                What could your crew handle today?
              </p>
            </div>

            <div className="mx-5 border-t border-[var(--border-subtle)]" />

            {/* AutoCrew turn */}
            <div className="grid grid-cols-[76px_1fr] items-start gap-x-4 px-5 py-4">
              <span className="pt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6B35]">
                AutoCrew
              </span>
              <p className="font-space-grotesk text-[18px] font-medium leading-[1.4] tracking-[-0.005em] text-foreground">
                Calls. Appointments. Intake. Lead qualification. Escalations.
                <span className="text-foreground/65">
                  {" "}
                  All trained on your operations, and live within days.
                </span>
              </p>
            </div>
          </div>

          {/* Pills */}
          <div className="mt-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
              Or ask
            </div>
            <SuggestedPills
              questions={SUGGESTED_QUESTIONS}
              variant="architectural"
            />
          </div>

          {/* Audio player + Book a Demo — same row */}
          <div className="mt-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
              Or hear
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex-1 min-w-0">
                <AudioPlayer fullWidth autoPlay />
              </div>
              <Button
                variant="pill"
                size="pill-md"
                asChild
                className="group shrink-0 shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)]"
              >
                <Link href={heroData.primaryCta.href}>
                  {heroData.primaryCta.text}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
            <p className="mt-2 font-geist text-[12px] italic text-foreground/45">
              A real call, handled by Sarah &mdash; no script.
            </p>
          </div>
        </aside>
      </div>

      {/* Dashboard preview — proof artifact, forced dark context.
          Toggle via SHOW_DASHBOARD_PREVIEW above. */}
      {SHOW_DASHBOARD_PREVIEW && (
        <div
          id="demo"
          className={cn(
            "relative z-20 mx-auto max-w-[1200px] px-4 pb-20 scroll-mt-24",
            "animate-scale-in opacity-0",
          )}
          style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
          data-theme="dark"
        >
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]/20 blur-[100px]" />
            <DashboardPreview />
          </div>
        </div>
      )}
    </section>
  );
}
