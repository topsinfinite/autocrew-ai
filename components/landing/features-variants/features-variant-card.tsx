"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeaturesShell, ICON_MAP } from "./features-shell";
import { askSarah } from "./ask-helpers";
import { questionsFor } from "./feature-questions";

/**
 * Variant 3 — Whole-card trigger.
 * The entire card is clickable. Hover reveals an arrow affordance in the
 * top-right corner. Card becomes a single-click interaction.
 */
export function FeaturesVariantCard() {
  return (
    <FeaturesShell
      renderCard={(feature, index, borderCls) => {
        const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
        const { main } = questionsFor(feature.title);
        return (
          <button
            type="button"
            key={index}
            onClick={() => askSarah(main)}
            aria-label={`Ask Sarah about ${feature.title}`}
            className={cn(
              "group relative p-8 md:p-10 text-left w-full",
              "bg-foreground/[0.03] dark:bg-white/[0.02]",
              "hover:bg-foreground/[0.06] dark:hover:bg-white/[0.04]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60 focus-visible:ring-inset",
              "transition-colors duration-500 cursor-pointer",
              borderCls,
            )}
          >
            {/* Top-right hover affordance */}
            <div
              className={cn(
                "absolute top-6 right-6 flex items-center gap-1.5",
                "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0",
                "transition-all duration-300",
              )}
              aria-hidden="true"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#FF6B35]">
                Ask Sarah
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6B35]" />
            </div>

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
          </button>
        );
      }}
    />
  );
}
