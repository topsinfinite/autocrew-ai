"use client";

import {
  Activity,
  BarChart3,
  Database,
  PhoneCall,
  Shield,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/landing/section-badge";
import { featuresData, type Feature } from "@/lib/mock-data/landing-data";

export const ICON_MAP = {
  Activity,
  PhoneCall,
  Database,
  UserCheck,
  BarChart3,
  Shield,
} as const;

/** Per-card border classes — handles mobile stacking + desktop 3×2 grid. */
export function cardBorderClasses(index: number) {
  const isSecondRow = index >= 3;
  return cn(
    "border-b md:border-b-0 border-foreground/[0.08] dark:border-white/[0.05]",
    index === featuresData.length - 1 && "border-b-0",
    isSecondRow &&
      "lg:border-t border-foreground/[0.08] dark:border-white/[0.05]",
    index >= 2 &&
      "md:border-t border-foreground/[0.08] dark:border-white/[0.05]",
  );
}

export interface FeaturesShellProps {
  /**
   * Render one feature card. Variants own the wrapping element so they can
   * swap <article> for <button>, apply hover affordances, etc. The `borderCls`
   * helper returns the position-aware border classes; apply them to your
   * outer element to keep the grid dividers intact.
   */
  renderCard: (
    feature: Feature,
    index: number,
    borderCls: string,
  ) => React.ReactNode;
  /** Optional module rendered below the grid (used by variant 5). */
  footer?: React.ReactNode;
}

/**
 * Shared shell for all Features variants — section header, grid container,
 * background beams. Variant-specific card rendering is delegated to
 * `renderCard`; everything else stays identical across variants.
 */
export function FeaturesShell({ renderCard, footer }: FeaturesShellProps) {
  return (
    <section
      id="features"
      className="z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-glow-top"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 font-sans">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-transparent to-transparent -translate-y-full via-foreground/10" />
          <SectionBadge className="mb-8">System Capabilities</SectionBadge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 font-space-grotesk font-semibold text-foreground">
            Powerful Features for{" "}
            <span className="font-semibold font-space-grotesk text-foreground">
              Modern Businesses
            </span>
          </h2>
          <p className="text-lg font-light leading-relaxed font-geist text-muted-foreground">
            Everything you need to automate customer interactions and scale
            your operations efficiently.
          </p>
        </div>

        {/* Grid */}
        <div className="relative rounded-3xl overflow-visible">
          {/* Grid Lines & Beams Background */}
          <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden border border-foreground/[0.08] dark:border-border shadow-sm dark:shadow-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,53,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute left-1/3 top-0 w-px h-full bg-foreground/[0.08] dark:bg-white/[0.05] hidden md:block">
              <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-transparent via-[#FF6B35]/50 to-transparent animate-beam-v" />
            </div>
            <div className="absolute right-1/3 top-0 w-px h-full bg-foreground/[0.08] dark:bg-white/[0.05] hidden md:block">
              <div
                className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-transparent via-[#FF6B35]/50 to-transparent animate-beam-v"
                style={{ animationDelay: "2s" }}
              />
            </div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-foreground/[0.08] dark:bg-white/[0.05] hidden md:block">
              <div
                className="absolute top-0 left-0 h-full w-24 bg-linear-to-r from-transparent via-[#FF6B35]/50 to-transparent animate-beam-h"
                style={{ animationDuration: "5s" }}
              />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-foreground/[0.03] dark:bg-white/[0.02] backdrop-blur-sm rounded-3xl overflow-hidden relative z-10 divide-y md:divide-y-0 md:divide-x divide-foreground/[0.08] dark:divide-white/[0.05]">
            {featuresData.map((feature, index) =>
              renderCard(feature, index, cardBorderClasses(index)),
            )}
          </div>
        </div>

        {footer}
      </div>
    </section>
  );
}

/** Re-exported so variants can render the same icon map without importing twice. */
export { featuresData };
export type { Feature };
