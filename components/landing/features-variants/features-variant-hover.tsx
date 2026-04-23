"use client";

import { ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeaturesShell, ICON_MAP } from "./features-shell";
import { askSarah, openVoice } from "./ask-helpers";
import { questionsFor } from "./feature-questions";

/**
 * Variant 4 — Hover-reveal action bar.
 * Idle card looks like the default; on hover a two-button action bar slides
 * in from the bottom. "Ask" (chat) always shown; "Hear a demo" (voice) shown
 * only where voice is a sensible demo (Healthcare, Voice Access, Escalation).
 */
const VOICE_READY_TITLES = new Set([
  "HIPAA-Aware Healthcare Agents",
  "Multi-Channel Voice Access",
  "Smart Escalation",
]);

export function FeaturesVariantHover() {
  return (
    <FeaturesShell
      renderCard={(feature, index, borderCls) => {
        const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
        const { main } = questionsFor(feature.title);
        const showVoice = VOICE_READY_TITLES.has(feature.title);
        return (
          <article
            key={index}
            className={cn(
              "group relative p-8 md:p-10 overflow-hidden",
              "bg-foreground/[0.03] dark:bg-white/[0.02]",
              "hover:bg-foreground/[0.06] dark:hover:bg-white/[0.04]",
              "transition-colors duration-500",
              borderCls,
            )}
          >
            <div className="relative z-10">
              <div className="mb-6 relative inline-block">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg bg-card border border-border",
                    "flex items-center justify-center text-[#FF6B35]",
                    "group-hover:border-[#FF6B35]/30 group-hover:shadow-[0_0_15px_-3px_rgba(255,107,53,0.3)]",
                    "transition-all duration-300",
                  )}
                >
                  {Icon ? <Icon className="w-6 h-6" /> : null}
                </div>
              </div>

              <h3 className="text-lg font-medium mb-3 font-geist tracking-tight text-foreground">
                {feature.title}
              </h3>

              <p className="text-sm leading-relaxed font-light font-geist text-muted-foreground">
                {feature.description}
              </p>

              {feature.extendedDescription && (
                <p className="text-xs leading-relaxed font-light font-geist text-muted-foreground/70 mt-2">
                  {feature.extendedDescription}
                </p>
              )}

              {/* Reserved space so hover bar doesn't push layout */}
              <div className="h-10 mt-5" aria-hidden="true" />
            </div>

            {/* Hover-reveal action bar */}
            <div
              className={cn(
                "absolute left-6 right-6 bottom-6 flex items-center gap-2",
                "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                "transition-all duration-300",
              )}
            >
              <button
                type="button"
                onClick={() => askSarah(main)}
                className={cn(
                  "group/ask inline-flex items-center gap-1.5 rounded-full",
                  "border border-[#FF6B35]/40 bg-[#FF6B35]/[0.06]",
                  "hover:bg-[#FF6B35]/[0.12] hover:border-[#FF6B35]/60",
                  "px-3 py-1.5 transition-colors",
                )}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#FF6B35]">
                  Ask Sarah
                </span>
                <ArrowRight className="w-3 h-3 text-[#FF6B35] transition-transform group-hover/ask:translate-x-0.5" />
              </button>

              {showVoice && (
                <button
                  type="button"
                  onClick={() => openVoice()}
                  className={cn(
                    "group/voice inline-flex items-center gap-1.5 rounded-full",
                    "border border-foreground/[0.1] dark:border-white/[0.1]",
                    "bg-foreground/[0.02] dark:bg-white/[0.02]",
                    "hover:border-foreground/30 dark:hover:border-white/30",
                    "px-3 py-1.5 transition-colors",
                  )}
                >
                  <Phone className="w-3 h-3 text-foreground/70" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/70">
                    Hear it live
                  </span>
                </button>
              )}
            </div>
          </article>
        );
      }}
    />
  );
}
