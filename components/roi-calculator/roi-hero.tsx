import { Calculator, Plug, ShieldCheck } from "lucide-react";
import { roiCalculatorHero } from "@/lib/mock-data/roi-calculator-data";

const badgeIcon = { plug: Plug, shield: ShieldCheck };

/**
 * ROI calculator hero — same masthead + asymmetric headline pattern as
 * the coaching/healthcare hero, no spec card on the right (the calculator
 * itself is the next section, so the hero stays a single column of copy).
 */
export function RoiHero() {
  const { status, badges, headline, subheadline } = roiCalculatorHero;

  return (
    <section className="relative z-10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_55%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pb-12 pt-12 lg:pb-16 lg:pt-16">
        {/* Status masthead */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live calculator
          </span>
          <span className="text-foreground/30">·</span>
          <span>{status.location}</span>
          <span className="text-foreground/30">·</span>
          <span>{status.role}</span>
          <span className="text-foreground/30">·</span>
          <span className="tabular-nums">{status.coverage}</span>
          <span className="text-foreground/30">·</span>
          <span>{status.standard}</span>
        </div>

        {/* Asymmetric headline */}
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-16">
          <h1 className="font-space-grotesk font-semibold text-foreground text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.04] tracking-[-0.02em] lg:col-span-8">
            {headline.prefix}{" "}
            <span className="text-[#FF6B35]">{headline.accent}</span>
          </h1>
          <p className="self-end max-w-[44ch] font-geist text-[15px] leading-[1.6] text-foreground/70 lg:col-span-4">
            {subheadline}
          </p>
        </div>

        {/* Badge row */}
        <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 lg:mt-7">
          <li className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/[0.06] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#FF6B35]">
            <Calculator className="h-3.5 w-3.5" aria-hidden />
            Built for AI receptionist deployments
          </li>
          {badges.map((b) => {
            const Icon = badgeIcon[b.icon];
            return (
              <li
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/[0.06] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#FF6B35]"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {b.label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
