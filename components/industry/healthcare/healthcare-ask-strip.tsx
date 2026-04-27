"use client";

import { Mic, Sparkles } from "lucide-react";
import { askSarah, openVoice } from "@/lib/widget/ask-helpers";
import { Button } from "@/components/ui/button";
import { healthcareAskStrip } from "@/lib/mock-data/healthcare-data";

/**
 * In-context "Ask Sarah" strip — a sparing mid-page surface that lets the
 * visitor poke the live widget with a healthcare-flavoured question without
 * leaving the page. Each chip fires `askSarah` (chat mode); the trailing
 * voice CTA opens the live voice widget. We only mount one of these on the
 * page so it stays special, not noisy.
 */
export function HealthcareAskStrip() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
              <Sparkles className="h-3 w-3" aria-hidden />
              {healthcareAskStrip.eyebrow}
            </div>
            <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
              {healthcareAskStrip.heading}
            </h2>
            <p className="mt-5 max-w-[44ch] font-geist text-[15px] leading-[1.7] text-foreground/65">
              {healthcareAskStrip.body}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-foreground/[0.02] p-5 sm:p-7">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {healthcareAskStrip.prompts.map((p) => (
                  <li key={p.label}>
                    <button
                      type="button"
                      onClick={() => askSarah(p.prompt)}
                      className="group relative flex w-full items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-card px-4 py-3.5 text-left font-geist text-[14px] leading-[1.45] text-foreground/80 transition-colors hover:border-[#FF6B35]/40 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60"
                    >
                      <span
                        aria-hidden
                        className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35]/70 transition-colors group-hover:bg-[#FF6B35]"
                      />
                      <span className="min-w-0 flex-1">
                        {p.label}
                      </span>
                      <span
                        aria-hidden
                        className="ml-1 mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/35 transition-colors group-hover:text-[#FF6B35]"
                      >
                        Ask
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                  Live, unscripted · widget loads on click
                </p>
                <Button
                  variant="pill-outline"
                  size="pill-md"
                  onClick={() => openVoice()}
                  className="group"
                >
                  <Mic className="h-4 w-4" aria-hidden />
                  {healthcareAskStrip.voiceCta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
