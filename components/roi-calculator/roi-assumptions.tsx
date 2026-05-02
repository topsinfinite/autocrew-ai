import {
  AUTOCREW_DEFLECTION_RATE,
  LEAD_CONVERSION_RATE,
} from "@/lib/roi/calculate";
import { roiAssumptionsContent } from "@/lib/mock-data/roi-calculator-data";

const formatPct = (n: number) => `${Math.round(n * 100)}%`;

/**
 * Methodology disclosure. Reads its percentages directly from the calculate
 * lib so the on-page numbers and the math can never drift apart.
 */
export function RoiAssumptions() {
  const { eyebrow, heading, intro, notes } = roiAssumptionsContent;

  const ledger = [
    {
      label: "Deflection rate",
      value: formatPct(AUTOCREW_DEFLECTION_RATE),
      sub: "Calls Autocrew handles end-to-end without a human.",
    },
    {
      label: "Lead conversion",
      value: formatPct(LEAD_CONVERSION_RATE),
      sub: "Captured after-hours inquiries that become customers.",
    },
    {
      label: "Time horizon",
      value: "12 months",
      sub: "All annual figures use a flat 12-month projection.",
    },
    {
      label: "Currency",
      value: "USD",
      sub: "Pre-tax, undiscounted, gross of Autocrew's own fee.",
    },
  ];

  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
              {eyebrow}
            </div>
            <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
              {heading}
            </h2>
            <p className="mt-5 max-w-[44ch] font-geist text-[15px] leading-[1.65] text-foreground/65">
              {intro}
            </p>
            <ul className="mt-7 flex flex-col gap-3">
              {notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-3 font-geist text-[14px] leading-[1.55] text-foreground/75"
                >
                  <span
                    aria-hidden
                    className="mt-[9px] inline-block h-1 w-1 shrink-0 rounded-full bg-[#FF6B35]"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <dl className="grid grid-cols-1 divide-y divide-[var(--border-subtle)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-foreground/[0.02] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {ledger.slice(0, 2).map((cell) => (
                <div key={cell.label} className="px-6 py-6">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                    {cell.label}
                  </dt>
                  <dd className="mt-2 font-space-grotesk text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-foreground">
                    {cell.value}
                  </dd>
                  <p className="mt-2 font-geist text-[13px] leading-[1.55] text-foreground/55">
                    {cell.sub}
                  </p>
                </div>
              ))}
            </dl>
            <dl className="mt-3 grid grid-cols-1 divide-y divide-[var(--border-subtle)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-foreground/[0.02] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {ledger.slice(2).map((cell) => (
                <div key={cell.label} className="px-6 py-5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                    {cell.label}
                  </dt>
                  <dd className="mt-2 font-space-grotesk text-[16px] font-semibold leading-[1.2] tracking-[-0.005em] text-foreground">
                    {cell.value}
                  </dd>
                  <p className="mt-1.5 font-geist text-[12.5px] leading-[1.5] text-foreground/55">
                    {cell.sub}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
