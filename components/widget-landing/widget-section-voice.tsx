"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";
import { openVoice } from "@/lib/widget/ask-helpers";

interface VoiceState {
  id: string;
  label: string;
  description: string;
  /** Tailwind background color for the indicator dot. */
  dotClass: string;
  /** Tailwind text color (for label active state). */
  textClass: string;
  /** Pulse style — affects the ping animation pace. */
  pace: "slow" | "fast" | "off";
}

const STATES: VoiceState[] = [
  {
    id: "connecting",
    label: "Connecting",
    description: "Establishing the audio session",
    dotClass: "bg-foreground/40",
    textClass: "text-foreground/70",
    pace: "slow",
  },
  {
    id: "listening",
    label: "Listening",
    description: "Visitor speaks; agent transcribes",
    dotClass: "bg-emerald-400",
    textClass: "text-emerald-300",
    pace: "slow",
  },
  {
    id: "thinking",
    label: "Thinking",
    description: "Forming a response",
    dotClass: "bg-sky-400",
    textClass: "text-sky-300",
    pace: "fast",
  },
  {
    id: "speaking",
    label: "Speaking",
    description: "Agent voices the answer",
    dotClass: "bg-[#FF6B35]",
    textClass: "text-[#FF6B35]",
    pace: "slow",
  },
  {
    id: "muted",
    label: "Muted",
    description: "Visitor's mic is paused",
    dotClass: "bg-amber-400",
    textClass: "text-amber-300",
    pace: "off",
  },
  {
    id: "error",
    label: "Error",
    description: "Connection lost or denied",
    dotClass: "bg-rose-500",
    textClass: "text-rose-400",
    pace: "off",
  },
];

const CYCLE_MS = 2200;

/**
 * Section 4 — Voice agent deep-dive.
 *
 * The widget's voice mode walks through six visible states. We auto-cycle
 * them in a small visualisation so visitors see what a real call feels
 * like before they trigger one. CTA below opens the live voice agent.
 */
export function WidgetSectionVoice() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % STATES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  const active = STATES[activeIndex];

  return (
    <section
      id="voice"
      className="relative z-10 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — pitch + CTA */}
          <div className="lg:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
              Voice mode
            </div>
            <h2
              className={cn(
                "mt-4 font-space-grotesk font-semibold text-foreground",
                "text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.1] tracking-[-0.02em]",
              )}
            >
              A real voice agent. Six visible states. One tap to start.
            </h2>
            <p className="mt-5 max-w-[52ch] font-geist text-[15px] leading-[1.65] text-foreground/70">
              Most chat widgets stop at text. Voice mode runs a full audio
              session: live transcription, natural-cadence speech, and
              barge-in &mdash; the visitor interrupts the agent mid-response
              and it stops cleanly. Each state is signalled visually so the
              caller never wonders if anyone&rsquo;s there.
            </p>

            <div className="mt-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
                Best for
              </div>
              <ul className="mt-3 space-y-2">
                {[
                  "Mobile CTAs &mdash; voice beats typing on a phone",
                  "Healthcare intake / triage flows (HIPAA-aware)",
                  "Hands-free contexts &mdash; warehouse, drive-through, kitchen",
                ].map((html) => (
                  <li
                    key={html}
                    className="flex items-baseline gap-3 font-geist text-[14px] leading-[1.55] text-foreground/75"
                  >
                    <span
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#FF6B35]"
                      aria-hidden
                    />
                    <span dangerouslySetInnerHTML={{ __html: html }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                variant="pill"
                size="pill-md"
                onClick={() => openVoice()}
                className="group shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)]"
              >
                <Mic className="h-4 w-4" />
                Start a voice call
              </Button>
              <Button
                variant="pill-outline"
                size="pill-md"
                asChild
                className="group"
              >
                <Link href={heroData.primaryCta.href}>
                  Book a demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right — animated state visualisation */}
          <aside
            className="lg:col-span-7"
            aria-label="Voice agent state visualisation"
          >
            <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#06070b]/95">
              {/* Top — large active state */}
              <div className="flex flex-col items-center gap-4 px-8 py-12 text-center sm:px-12 sm:py-16">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  {active.pace !== "off" && (
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full rounded-full opacity-50",
                        active.dotClass,
                        active.pace === "fast"
                          ? "animate-ping [animation-duration:0.9s]"
                          : "animate-ping [animation-duration:1.6s]",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-12 w-12 rounded-full",
                      active.dotClass,
                    )}
                    aria-hidden
                  />
                </div>
                <div>
                  <div
                    className={cn(
                      "font-space-grotesk text-[28px] font-semibold tracking-tight",
                      active.textClass,
                    )}
                  >
                    {active.label}
                  </div>
                  <div className="mt-1 font-geist text-[14px] text-foreground/60">
                    {active.description}
                  </div>
                </div>
              </div>

              {/* Bottom — state strip */}
              <div className="border-t border-[var(--border-subtle)] bg-white/[0.015]">
                <ol className="grid grid-cols-3 sm:grid-cols-6">
                  {STATES.map((state, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <li
                        key={state.id}
                        className={cn(
                          "flex flex-col items-center gap-2 px-2 py-4 transition-colors",
                          i !== STATES.length - 1 &&
                            "border-r border-[var(--border-subtle)]",
                          isActive
                            ? "bg-white/[0.02]"
                            : "bg-transparent",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition-opacity",
                            state.dotClass,
                            isActive ? "opacity-100" : "opacity-35",
                          )}
                          aria-hidden
                        />
                        <span
                          className={cn(
                            "font-mono text-[9px] uppercase tracking-[0.16em] transition-colors",
                            isActive
                              ? state.textClass
                              : "text-foreground/45",
                          )}
                        >
                          {state.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Tiny note */}
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
              Auto-cycling preview &middot; press &ldquo;Start a voice
              call&rdquo; for the real thing
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
