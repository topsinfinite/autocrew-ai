"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Mic, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { askSarah, openVoice } from "@/lib/widget/ask-helpers";
import {
  PROMPT_CHIPS,
  SARAH_TRANSCRIPT,
  SHIFT_STATS,
} from "@/lib/mock-data/ai-receptionist-hero-fixtures";
import { aiReceptionistHeroData } from "@/lib/mock-data/ai-receptionist-data";
import { cn } from "@/lib/utils";
import { useTypedTranscript } from "./use-typewriter";

/**
 * AI Receptionist hero — Switchboard.
 *
 * The hero behaves like an operator's console: status masthead, asymmetric
 * editorial headline, a live transcript that types itself out in a fixed
 * scroll region, a persistent input that fires the real AutoCrew widget,
 * and a shift card with running stats anchored above the fold.
 */
export function AiReceptionistHero() {
  const [paused, setPaused] = useState(false);
  const transcript = useTypedTranscript(SARAH_TRANSCRIPT, paused);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const visibleTurns = SARAH_TRANSCRIPT.slice(0, transcript.index + 1);

  // Pin the latest turn to the bottom of the scroll region so the outer
  // card height never reflows as the transcript types itself out.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (transcript.index === 0 && transcript.rendered.length === 0) {
      el.scrollTop = 0;
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [transcript.index, transcript.rendered]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const value = String(data.get("q") ?? "").trim();
    if (!value) return;
    askSarah(value);
    formEl.reset();
  };

  return (
    <section className="relative z-10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_55%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pb-20 pt-14 lg:pb-28 lg:pt-20">
        {/* Status masthead */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            On-shift
          </span>
          <span className="text-foreground/40">·</span>
          <span>Sarah · Receptionist</span>
          <span className="text-foreground/40">·</span>
          <span className="tabular-nums">
            {SHIFT_STATS.callsToday} calls today
          </span>
          <span className="text-foreground/40">·</span>
          <span className="tabular-nums">
            avg handle {SHIFT_STATS.avgHandle}
          </span>
        </div>

        {/* Asymmetric headline */}
        <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h1 className="lg:col-span-8 font-space-grotesk font-semibold text-foreground text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] tracking-[-0.02em]">
            {aiReceptionistHeroData.headline.prefix}{" "}
            <span className="text-[#FF6B35]">
              {aiReceptionistHeroData.headline.accent}
            </span>
          </h1>
          <p className="lg:col-span-4 max-w-[42ch] self-end font-geist text-[16px] leading-[1.6] text-foreground/70">
            {aiReceptionistHeroData.subheadline}
          </p>
        </div>

        {/* Console */}
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* Live transcript */}
          <div className="min-w-0 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#06070b]/95">
              {/* Console header */}
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-white/[0.015] px-5 py-3">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                  <Phone className="h-3.5 w-3.5 text-[#FF6B35]" aria-hidden />
                  Line 01 · Live
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                  <span>00:42</span>
                  <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    className="rounded-md border border-[var(--border-subtle)] px-2 py-1 transition-colors hover:border-[#FF6B35]/40 hover:text-[#FF6B35]"
                  >
                    {paused ? "Resume" : "Pause"}
                  </button>
                </div>
              </div>

              {/* Transcript body — fixed height so the card never reflows */}
              <div
                ref={scrollRef}
                className="h-[280px] overflow-y-auto px-5 py-6 sm:px-7 sm:py-8 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]"
              >
                <ol className="space-y-5">
                  {visibleTurns.map((turn, i) => {
                    const isCurrent = i === transcript.index;
                    const text = isCurrent ? transcript.rendered : turn.text;
                    const showCaret =
                      isCurrent && turn.who === "sarah" && !transcript.done;
                    return (
                      <li
                        key={`${turn.who}-${i}-${turn.text.slice(0, 8)}`}
                        className="flex gap-4"
                      >
                        <span
                          className={cn(
                            "mt-1 inline-flex shrink-0 items-center justify-center font-mono text-[10px] uppercase tracking-[0.18em]",
                            "rounded-full px-2.5 py-1",
                            turn.who === "sarah"
                              ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                              : "bg-white/[0.04] text-foreground/55",
                          )}
                        >
                          {turn.who === "sarah" ? "Sarah" : "Caller"}
                        </span>
                        <p
                          className={cn(
                            "min-w-0 font-geist text-[15px] leading-[1.6]",
                            turn.who === "sarah"
                              ? "text-foreground"
                              : "text-foreground/70",
                          )}
                        >
                          {text}
                          {showCaret && (
                            <span
                              aria-hidden
                              className="ml-1 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-[#FF6B35] motion-safe:animate-pulse"
                            />
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Prompt chips + input */}
              <div className="border-t border-[var(--border-subtle)] bg-white/[0.015] px-5 py-4 sm:px-7">
                <div className="flex flex-wrap gap-2">
                  {PROMPT_CHIPS.slice(0, 4).map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => askSarah(chip.prompt)}
                      className="rounded-full border border-[var(--border-subtle)] bg-card px-3 py-1.5 font-geist text-[12.5px] text-foreground/75 transition-colors hover:border-[#FF6B35]/40 hover:text-[#FF6B35] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    name="q"
                    autoComplete="off"
                    placeholder="Ask Sarah anything a caller would…"
                    className="min-w-0 flex-1 rounded-lg border border-[var(--border-subtle)] bg-[#04060c] px-4 py-3 font-geist text-[14.5px] text-foreground placeholder:text-foreground/35 focus:border-[#FF6B35]/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B35] px-4 py-3 font-geist text-[13px] font-medium text-[#0a0a0a] shadow-[0_0_18px_rgba(255,107,53,0.35)] transition-shadow hover:shadow-[0_0_22px_rgba(255,107,53,0.5)]"
                  >
                    Send
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Shift card */}
          <aside className="min-w-0 lg:col-span-4">
            <div className="flex h-full flex-col gap-5 rounded-2xl border border-[var(--border-subtle)] bg-[#06070b]/95 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                    Today · so far
                  </div>
                  <div className="mt-2 font-space-grotesk text-[40px] font-semibold leading-none tracking-tight text-foreground tabular-nums">
                    {SHIFT_STATS.callsToday}
                  </div>
                  <div className="mt-1 font-geist text-[13px] text-foreground/55">
                    calls handled
                  </div>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FF6B35]/40 bg-[#FF6B35]/10 text-[#FF6B35]">
                  <Mic className="h-4 w-4" aria-hidden />
                </span>
              </div>

              <dl className="grid grid-cols-3 gap-3 text-left">
                {[
                  ["Booked", SHIFT_STATS.booked],
                  ["Avg", SHIFT_STATS.avgHandle],
                  ["Escalated", SHIFT_STATS.escalated],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-lg border border-[var(--border-subtle)] bg-white/[0.015] px-3 py-2.5"
                  >
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-foreground/45">
                      {label}
                    </dt>
                    <dd className="mt-1 font-space-grotesk text-[18px] font-semibold tabular-nums text-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-auto flex flex-col gap-2.5">
                <Button
                  variant="pill"
                  size="pill-md"
                  onClick={() => openVoice()}
                  className="group justify-center shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)]"
                >
                  <Mic className="h-4 w-4" aria-hidden />
                  Talk to Sarah live
                </Button>
                <Button
                  variant="pill-outline"
                  size="pill-md"
                  asChild
                  className="group justify-center"
                >
                  <Link href={aiReceptionistHeroData.primaryCta.href}>
                    {aiReceptionistHeroData.primaryCta.text}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>

              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-foreground/40">
                Live, unscripted · widget loads on click
              </p>
            </div>
          </aside>
        </div>

        <p className="mt-7 font-geist text-[13px] text-foreground/50">
          {aiReceptionistHeroData.trustText}
        </p>
      </div>
    </section>
  );
}
