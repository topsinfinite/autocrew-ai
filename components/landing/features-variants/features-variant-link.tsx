"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeaturesShell, ICON_MAP } from "./features-shell";
import { askSarah } from "./ask-helpers";
import { questionsFor } from "./feature-questions";

/**
 * Variant 1 — Per-card "Ask about this" link.
 * Subtle secondary CTA at the bottom of each card.
 */
export function FeaturesVariantLink() {
  return (
    <FeaturesShell
      renderCard={(feature, index, borderCls) => {
        const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
        const { main } = questionsFor(feature.title);
        return (
          <article
            key={index}
            className={cn(
              "group relative p-8 md:p-10 bg-foreground/[0.03] dark:bg-white/[0.02] hover:bg-foreground/[0.06] dark:hover:bg-white/[0.04] transition-colors duration-500",
              borderCls,
            )}
          >
            <div className="relative z-10 flex flex-col h-full">
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

              {/* Ask action */}
              <div className="mt-6 pt-5 border-t border-foreground/[0.06] dark:border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => askSarah(main)}
                  className={cn(
                    "group/ask inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]",
                    "text-foreground/55 hover:text-[#FF6B35] transition-colors",
                  )}
                  aria-label={`Ask Sarah about ${feature.title}`}
                >
                  <span
                    className="h-1 w-1 rounded-full bg-[#FF6B35]/70 group-hover/ask:bg-[#FF6B35]"
                    aria-hidden="true"
                  />
                  <span>Ask Sarah how this fits</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover/ask:translate-x-0.5" />
                </button>
              </div>
            </div>
          </article>
        );
      }}
    />
  );
}
