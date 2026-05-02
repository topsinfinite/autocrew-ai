"use client";

import { RoiCalculatorCore } from "./roi-calculator";

/**
 * Inline blog-embed variant of the ROI calculator. Stacks the inputs and
 * results cards in a single column so it fits inside the 720px article body.
 * Mounted as the `<RoiCalculator />` MDX shortcode in components/blog/post-body.tsx.
 */
export function RoiCalculatorEmbed() {
  return (
    <div className="my-10 not-prose">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[hsl(16,100%,50%)]">
        Run your own numbers
      </div>
      <RoiCalculatorCore layout="stacked" />
    </div>
  );
}
