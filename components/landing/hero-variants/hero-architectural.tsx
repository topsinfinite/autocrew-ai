"use client";

import { cn } from "@/lib/utils";
import { AudioPlayer } from "@/components/landing/audio-player";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { SuggestedPills } from "./suggested-pills";

const SUGGESTED_QUESTIONS = [
  "Answer inbound calls",
  "Run the front desk",
  "Chase unclaimed leads",
] as const;

interface CrewRow {
  name: string;
  role: string;
  action: string;
  pulseDelay: string;
}

const CREW_ROWS: CrewRow[] = [
  {
    name: "Sarah",
    role: "Front desk",
    action: "Answered call · 14s ago",
    pulseDelay: "0ms",
  },
  {
    name: "Max",
    role: "Lead qualifier",
    action: "Booked demo · 1m ago",
    pulseDelay: "900ms",
  },
  {
    name: "Lena",
    role: "Support",
    action: "Escalated ticket · 3m ago",
    pulseDelay: "1800ms",
  },
];

export function HeroArchitectural() {
  return (
    <section className="relative z-10 overflow-hidden">
      {/* Architectural grid + soft dividers */}
      <div className="pointer-events-none absolute inset-0 -z-5">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 60% at 20% 30%, #000 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 20% 30%, #000 50%, transparent 100%)",
          }}
        />
        <div className="absolute left-0 right-0 top-[22%] h-px bg-[var(--border-subtle)]" />
        <div className="absolute left-0 right-0 top-[82%] h-px bg-[var(--border-subtle)]" />
      </div>

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
            <span>3 Crews &middot; 24/7 &middot; Live</span>
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
            scheduling, and escalations&mdash;live in days, not quarters, each
            one trained on your actual workflows.
          </p>

          {/* Search */}
          <div
            className={cn("mt-10 max-w-[620px]", "animate-fade-up opacity-0")}
            style={{ animationDelay: "320ms", animationFillMode: "forwards" }}
          >
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              <span>&gt; Ask the crew</span>
            </div>
            <div className="hero-search-architectural">
              <autocrew-search
                placeholder="What should your crew handle?"
                button-label="Ask Sarah"
                primary-color="#FF6B35"
              />
            </div>
          </div>

          <div
            className={cn("mt-5 max-w-[620px]", "animate-fade-up opacity-0")}
            style={{ animationDelay: "440ms", animationFillMode: "forwards" }}
          >
            <SuggestedPills
              questions={SUGGESTED_QUESTIONS}
              variant="architectural"
            />
          </div>
        </div>

        {/* RIGHT column: live-looking crew panel */}
        <aside
          className={cn("lg:col-span-5", "animate-fade-up opacity-0")}
          style={{ animationDelay: "260ms", animationFillMode: "forwards" }}
          aria-label="Crew status panel"
        >
          <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white/[0.015]">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35]/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                </span>
                <span>Crew &middot; Online</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
                3 agents
              </span>
            </div>

            {/* Crew rows */}
            <ul className="divide-y divide-[var(--border-subtle)]">
              {CREW_ROWS.map((row) => (
                <li
                  key={row.name}
                  className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <span
                    className="relative inline-flex h-1.5 w-1.5"
                    style={{ animationDelay: row.pulseDelay }}
                  >
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35]/60"
                      style={{ animationDelay: row.pulseDelay }}
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-space-grotesk font-medium text-foreground">
                        {row.name}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                        {row.role}
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-foreground/55">
                      {row.action}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Panel footer — play Sarah's last call, blended into the panel */}
            <div className="border-t border-[var(--border-subtle)] bg-white/[0.015] px-4 py-4">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
                <span>&rarr; Hear Sarah&rsquo;s last call</span>
                <span className="hidden sm:inline">4:32</span>
              </div>
              <AudioPlayer fullWidth autoPlay />
            </div>
          </div>
        </aside>
      </div>

      {/* Dashboard preview — proof artifact, forced dark context */}
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
    </section>
  );
}
