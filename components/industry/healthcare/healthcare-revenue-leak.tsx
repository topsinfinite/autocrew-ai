import { healthcareLeaks } from "@/lib/mock-data/healthcare-data";

/**
 * Three audience-framed leakage figures (CFO / CMO / Practice owner).
 * Editorial three-column layout — no icon cards, no sparklines.
 */
export function HealthcareRevenueLeak() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
              {healthcareLeaks.eyebrow}
            </div>
            <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
              {healthcareLeaks.heading}
            </h2>
            <p className="mt-5 max-w-[42ch] font-geist text-[15px] leading-[1.65] text-foreground/65">
              {healthcareLeaks.intro}
            </p>
          </div>

          <div className="lg:col-span-7">
            <ol className="grid divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
              {healthcareLeaks.items.map((item) => (
                <li
                  key={item.audience}
                  className="grid gap-3 py-7 sm:grid-cols-12 sm:gap-6"
                >
                  <div className="sm:col-span-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                      {item.audience}
                    </div>
                    <div className="mt-3 font-space-grotesk text-[clamp(2.25rem,3.5vw,3.25rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-foreground tabular-nums">
                      {item.figure}
                    </div>
                  </div>
                  <div className="sm:col-span-9">
                    <p className="font-space-grotesk text-[17px] font-medium leading-[1.35] text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 max-w-[60ch] font-geist text-[14.5px] leading-[1.65] text-foreground/65">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
