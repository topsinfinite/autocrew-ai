"use client";

import { useState } from "react";
import {
  ArrowRight,
  Code2,
  Link2,
  Mic,
  MousePointerClick,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { askSarah, openVoice } from "@/lib/widget/ask-helpers";

interface Surface {
  id: string;
  index: string;
  label: string;
  Icon: LucideIcon;
  headline: string;
  description: string;
  /** Plain-text code shown to the visitor. Multi-line OK. */
  code: string;
  /** What happens when they press "Try it". */
  fire: () => void;
  /** Caption on the Try-it button. */
  fireLabel?: string;
  /** Three short "best for" bullets. */
  bestFor: [string, string, string];
}

const SURFACES: Surface[] = [
  {
    id: "declarative",
    index: "01",
    label: "Declarative",
    Icon: MousePointerClick,
    headline: "HTML, no JavaScript.",
    description:
      "Add data-autocrew-question to any button or link. Marketing edits the CMS; the widget handles the rest. Works on <button>, <a> (without navigating away), and bubbles through nested click targets.",
    code: `<button data-autocrew-question="What are your hours?">
  See our hours
</button>`,
    fire: () => askSarah("What are your office hours?"),
    fireLabel: "See our hours",
    bestFor: [
      "FAQ pages — every question becomes a trigger",
      "Pricing tier CTAs — pre-filled qualifying questions",
      "Footer quick-links — turn dead ends into conversations",
    ],
  },
  {
    id: "url",
    index: "02",
    label: "URL parameter",
    Icon: Link2,
    headline: "Email-friendly. Self-cleaning.",
    description:
      "Append ?autocrew_q=… to any URL. The widget opens on landing and sends the question, then strips the param so a refresh doesn't re-fire. Pair with UTM tags for full campaign attribution.",
    code: `https://yoursite.com/?autocrew_q=Show%20me%20a%20demo
  &utm_source=email&utm_campaign=spring`,
    fire: () => askSarah("Show me a demo of the widget on a real site."),
    fireLabel: "Try the deep link",
    bestFor: [
      "Email campaigns — link straight into a conversation",
      "Paid-ad landing URLs — per-audience question text",
      "Chatbot handoffs from other apps",
    ],
  },
  {
    id: "api",
    index: "03",
    label: "JavaScript API",
    Icon: Code2,
    headline: "Programmatic control.",
    description:
      "window.AutoCrew.ask(), .open(), .close(), .isReady(), .onReady(). Calls before widget.js loads queue safely via the GA-style stub. Single-event dispatch keeps your analytics clean.",
    code: `// Wire to any in-page event
window.AutoCrew.ask("Help me with my account");

// Or check ready state first
window.AutoCrew.onReady(() => {
  console.log("widget v" + window.AutoCrew.version);
});`,
    fire: () => askSarah("How would I trigger the widget after a form submit?"),
    fireLabel: "Run AutoCrew.ask()",
    bestFor: [
      "Post-form-submit handoff with prefilled context",
      "Idle-detection — recover before they bounce",
      "Scroll-depth or exit-intent triggers",
    ],
  },
  {
    id: "search",
    index: "04",
    label: "Search element",
    Icon: Search,
    headline: "Drop-in shadow-DOM box.",
    description:
      "<autocrew-search> is a custom element with closed shadow DOM — no CSS conflicts, no host access to internals. Configure with placeholder, button-label, primary-color, mode, auto-send. Submit calls ask(), so length caps and event dispatch are reused automatically.",
    code: `<autocrew-search
  placeholder="Search docs…"
  button-label="Ask"
  primary-color="#FF6B35"
></autocrew-search>`,
    fire: () => askSarah("Tell me how the autocrew-search element works."),
    fireLabel: "Ask about <autocrew-search>",
    bestFor: [
      "Help-center search box — one element, real answers",
      "Hero \"Ask anything\" CTA above the fold",
      "Docs site search replacement (closed shadow DOM, zero CSS conflicts)",
    ],
  },
  {
    id: "voice",
    index: "05",
    label: "Voice mode",
    Icon: Mic,
    headline: "Tap to talk.",
    description:
      "Add data-autocrew-mode=\"voice\" to any trigger. Falls back to chat if voice is disabled. Six visible states (Connecting / Listening / Thinking / Speaking / Muted / Error). Barge-in is supported — the visitor interrupts the agent mid-response and it stops cleanly.",
    code: `<button data-autocrew-open data-autocrew-mode="voice">
  Start a voice call
</button>`,
    fire: () => openVoice(),
    fireLabel: "Start a voice call",
    bestFor: [
      "Mobile CTAs — voice beats typing on a phone",
      "Healthcare intake / triage flows",
      "Hands-free contexts (warehouse, drive-through, kitchen)",
    ],
  },
];

/**
 * Section 3 — Surface deep-dives.
 *
 * Each of the five trigger surfaces gets its own block with: descriptor,
 * full code sample, working "Try it" button, and three "best for"
 * use-case bullets. Alternates left/right for reading rhythm.
 */
export function WidgetSectionSurfaces() {
  return (
    <section
      id="surfaces"
      className="relative z-10 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
        {/* Section header */}
        <div className="mb-16 max-w-[60ch] lg:mb-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
            Five surfaces &middot; one widget
          </div>
          <h2
            className={cn(
              "mt-4 font-space-grotesk font-semibold text-foreground",
              "text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.1] tracking-[-0.02em]",
            )}
          >
            Five ways to start a conversation. The same agent answers
            every one.
          </h2>
        </div>

        {/* Surface blocks — alternating left/right */}
        <div className="space-y-24 lg:space-y-32">
          {SURFACES.map((surface, i) => (
            <SurfaceBlock key={surface.id} surface={surface} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SurfaceBlock({
  surface,
  reverse,
}: {
  surface: Surface;
  reverse: boolean;
}) {
  const [fired, setFired] = useState(false);
  const { Icon } = surface;

  const handleFire = () => {
    surface.fire();
    setFired(true);
    window.setTimeout(() => setFired(false), 2200);
  };

  return (
    <div
      className={cn(
        "grid items-start gap-10 lg:grid-cols-12 lg:gap-16",
        reverse && "lg:[&>*:first-child]:order-2",
      )}
    >
      {/* Copy column */}
      <div className="lg:col-span-5">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/45">
          <span className="tabular-nums text-[#FF6B35]">{surface.index}</span>
          <span className="h-px w-6 bg-foreground/20" aria-hidden />
          <span>{surface.label}</span>
        </div>

        <h3
          className={cn(
            "mt-4 font-space-grotesk font-semibold text-foreground",
            "text-[clamp(1.625rem,2.6vw,2.25rem)] leading-[1.15] tracking-[-0.015em]",
          )}
        >
          {surface.headline}
        </h3>

        <p className="mt-4 max-w-[52ch] font-geist text-[15px] leading-[1.65] text-foreground/70">
          {surface.description}
        </p>

        {/* Best for */}
        <div className="mt-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
            Best for
          </div>
          <ul className="mt-3 space-y-2">
            {surface.bestFor.map((bullet) => (
              <li
                key={bullet}
                className="flex items-baseline gap-3 font-geist text-[14px] leading-[1.55] text-foreground/75"
              >
                <span
                  className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#FF6B35]"
                  aria-hidden
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Code + try-it column */}
      <div className="lg:col-span-7">
        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[#06070b]/95">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-white/[0.015] px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-card text-[#FF6B35]">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                {surface.label}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/30">
              {surface.index} / 05
            </span>
          </div>

          {/* Code */}
          <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-foreground/85">
            <code>{surface.code}</code>
          </pre>

          {/* Try it footer */}
          <div className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] bg-white/[0.01] px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
              {fired ? "↗ Triggered — check the widget" : "Try it on this page"}
            </span>
            <button
              type="button"
              onClick={handleFire}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full",
                "border border-[#FF6B35]/40 bg-[#FF6B35]/[0.08]",
                "hover:border-[#FF6B35]/60 hover:bg-[#FF6B35]/[0.16]",
                "px-3 py-1.5 transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60",
              )}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#FF6B35]">
                {surface.fireLabel ?? "Try it"}
              </span>
              <ArrowRight className="h-3 w-3 text-[#FF6B35] transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
