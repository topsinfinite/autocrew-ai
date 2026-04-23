"use client";

import { cn } from "@/lib/utils";
import { FeaturesShell, ICON_MAP } from "./features-shell";
import { askSarah } from "./ask-helpers";
import { questionsFor } from "./feature-questions";

/**
 * Variant 2 — Per-card FAQ pills.
 * Two common, specific questions rendered as chip buttons under each
 * description. Each chip fires `AutoCrew.ask(...)` with the question text.
 */
export function FeaturesVariantPills() {
  return (
    <FeaturesShell
      renderCard={(feature, index, borderCls) => {
        const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
        const { pills } = questionsFor(feature.title);
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

              {/* FAQ pill buttons */}
              <div className="mt-6 pt-5 border-t border-foreground/[0.06] dark:border-white/[0.05] flex flex-wrap gap-2">
                {pills.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => askSarah(q)}
                    className={cn(
                      "group/pill inline-flex items-center gap-2 rounded-md",
                      "border border-foreground/[0.08] dark:border-white/[0.06]",
                      "bg-foreground/[0.02] dark:bg-white/[0.015]",
                      "hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/[0.04]",
                      "px-2.5 py-1.5 transition-colors",
                    )}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]/60 group-hover/pill:bg-[#FF6B35]"
                      aria-hidden="true"
                    />
                    <span className="font-geist text-[12px] text-foreground/75 group-hover/pill:text-foreground">
                      {q}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </article>
        );
      }}
    />
  );
}
