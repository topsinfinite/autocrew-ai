"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeaturesShell, ICON_MAP } from "./features-shell";
import { askSarah } from "./ask-helpers";

const UNIFIED_QUESTION =
  "Help me figure out which AutoCrew features fit my business. Start by asking me what we do.";

/**
 * Variant 5 — Single unified CTA below the grid.
 * Cards render unchanged. A single "Let Sarah walk you through it" module
 * sits below the grid for visitors who scrolled the features without
 * clicking anything specific.
 */
export function FeaturesVariantCta() {
  return (
    <FeaturesShell
      renderCard={(feature, index, borderCls) => {
        const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
        return (
          <article
            key={index}
            className={cn(
              "group relative p-8 md:p-10 bg-foreground/[0.03] dark:bg-white/[0.02] hover:bg-foreground/[0.06] dark:hover:bg-white/[0.04] transition-colors duration-500",
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
            </div>
          </article>
        );
      }}
      footer={
        <div className="mt-10 md:mt-14">
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl",
              "border border-foreground/[0.08] dark:border-white/[0.06]",
              "bg-foreground/[0.02] dark:bg-white/[0.015]",
              "px-6 py-8 sm:px-10 sm:py-10",
              "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between",
            )}
          >
            <div className="max-w-xl">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35]/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                </span>
                <span>Not sure where to start?</span>
              </div>
              <h3 className="mt-3 font-space-grotesk text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
                Let Sarah walk you through the right features for your team.
              </h3>
              <p className="mt-2 font-geist text-[15px] leading-relaxed text-foreground/65">
                Tell her what you do. She&rsquo;ll tell you which crew, which
                features, and what a rollout looks like.
              </p>
            </div>
            <button
              type="button"
              onClick={() => askSarah(UNIFIED_QUESTION)}
              className={cn(
                "group/cta inline-flex items-center justify-center gap-2 self-start sm:self-center",
                "rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-medium text-white",
                "shadow-[0_0_18px_rgba(255,107,53,0.35)]",
                "hover:shadow-[0_0_22px_rgba(255,107,53,0.45)] hover:bg-[#ff7a45]",
                "transition-all",
              )}
            >
              Walk me through it
              <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" />
            </button>
          </div>
        </div>
      }
    />
  );
}
