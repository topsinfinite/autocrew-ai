"use client";

import {
  HelpCircle,
  Layers,
  Mail,
  Search,
  Smartphone,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { askSarah, openVoice } from "@/lib/widget/ask-helpers";

interface UseCase {
  id: string;
  surface: string;
  Icon: LucideIcon;
  title: string;
  outcome: string;
  /** Optional — runs the surface for that use case if visitor wants to feel it. */
  fire?: () => void;
  fireLabel?: string;
}

const USE_CASES: UseCase[] = [
  {
    id: "faq",
    surface: "Declarative",
    Icon: HelpCircle,
    title: "Every FAQ row, a trigger",
    outcome:
      "Each question becomes a button. Visitors click; the agent answers in their own context — no scrolling through marketing copy.",
    fire: () => askSarah("What are your office hours?"),
    fireLabel: "Try the FAQ pattern",
  },
  {
    id: "pricing",
    surface: "Declarative",
    Icon: Layers,
    title: "Pricing tier CTAs that sell",
    outcome:
      "\"Get started\" buttons fire plan-specific qualifying questions. Sales conversations begin pre-targeted by tier.",
    fire: () => askSarah("I'm comparing the Starter and Professional plans — what's right for me?"),
    fireLabel: "Try the pricing pattern",
  },
  {
    id: "email",
    surface: "URL parameter",
    Icon: Mail,
    title: "Email links that land in conversation",
    outcome:
      "Bake ?autocrew_q=… into your campaign URLs. Recipients click; the page opens with the conversation already started. UTM tags carry attribution.",
    fire: () => askSarah("I clicked through from your email — show me what's new."),
    fireLabel: "Simulate an email click",
  },
  {
    id: "search",
    surface: "<autocrew-search>",
    Icon: Search,
    title: "Search box that actually answers",
    outcome:
      "Replace the static help-center search with a drop-in shadow-DOM element. Same agent, same intelligence — just disguised as the search box your visitors expect.",
  },
  {
    id: "mobile",
    surface: "Voice mode",
    Icon: Smartphone,
    title: "Mobile CTAs people will use",
    outcome:
      "Typing on a phone is friction. \"Tap to talk\" replaces a tiny-keyboard form with a voice agent. Six visible states; barge-in supported.",
    fire: () => openVoice(),
    fireLabel: "Start a voice call",
  },
  {
    id: "form-handoff",
    surface: "JavaScript API",
    Icon: Workflow,
    title: "Pick up where forms leave off",
    outcome:
      "After a form submits, call AutoCrew.ask() with the submitted context. The conversation continues immediately — no \"check your email for a reply.\"",
    fire: () => askSarah("I just submitted a contact form — can you help me right now?"),
    fireLabel: "Trigger a post-form ask",
  },
];

/**
 * Section 5 — Use case gallery.
 *
 * Six places the widget shines, framed by the surface type that powers
 * each one. Cards are visually compact (icon + title + outcome) and
 * clickable where firing the surface makes sense.
 */
export function WidgetSectionUseCases() {
  return (
    <section
      id="use-cases"
      className="relative z-10 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
        {/* Header */}
        <div className="mb-16 max-w-[60ch] lg:mb-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
            In the wild
          </div>
          <h2
            className={cn(
              "mt-4 font-space-grotesk font-semibold text-foreground",
              "text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.1] tracking-[-0.02em]",
            )}
          >
            Six places this earns its keep.
          </h2>
          <p className="mt-5 max-w-[55ch] font-geist text-[16px] leading-[1.65] text-foreground/70">
            Each surface from the previous section maps to specific moments
            on real sites. Pick the ones that match yours &mdash; ship one,
            ship them all.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map(
            ({ id, surface, Icon, title, outcome, fire, fireLabel }) => {
              const isInteractive = typeof fire === "function";
              const Component = isInteractive ? "button" : "article";
              return (
                <Component
                  key={id}
                  type={isInteractive ? "button" : undefined}
                  onClick={fire}
                  className={cn(
                    "group relative flex flex-col gap-4 overflow-hidden rounded-xl",
                    "border border-[var(--border-subtle)] bg-white/[0.015]",
                    "p-5 text-left transition-all sm:p-6",
                    isInteractive &&
                      "hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60",
                  )}
                >
                  {/* Top — surface tag + icon */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-card text-[#FF6B35]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">
                      {surface}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-space-grotesk text-[18px] font-semibold leading-[1.25] tracking-tight text-foreground">
                    {title}
                  </h3>

                  {/* Outcome */}
                  <p className="font-geist text-[14px] leading-[1.6] text-foreground/70">
                    {outcome}
                  </p>

                  {/* Fire-it footer */}
                  {fire && (
                    <div className="mt-auto pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40 group-hover:text-[#FF6B35]">
                      {fireLabel ?? "Try it"} &nbsp;&rarr;
                    </div>
                  )}
                </Component>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
