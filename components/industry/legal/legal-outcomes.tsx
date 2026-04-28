import { legalOutcomes } from "@/lib/mock-data/legal-data";

/** Four numbered outcome rows. Editorial layout with mono integration footnote. */
export function LegalOutcomes() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)] bg-foreground/[0.015]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="max-w-[44ch]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
            {legalOutcomes.eyebrow}
          </div>
          <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
            {legalOutcomes.heading}
          </h2>
          <p className="mt-5 font-geist text-[15px] leading-[1.65] text-foreground/65">
            {legalOutcomes.intro}
          </p>
        </div>

        <ol className="mt-12 grid divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
          {legalOutcomes.rows.map((row) => (
            <li
              key={row.index}
              className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-2">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/40">
                  {row.index} /{" "}
                  {legalOutcomes.rows.length.toString().padStart(2, "0")}
                </div>
              </div>
              <div className="lg:col-span-6">
                <h3 className="font-space-grotesk text-[clamp(1.375rem,2.1vw,1.875rem)] font-semibold leading-[1.2] tracking-[-0.015em] text-foreground">
                  {row.title}
                </h3>
                <p className="mt-4 max-w-[60ch] font-geist text-[15px] leading-[1.7] text-foreground/70">
                  {row.body}
                </p>
              </div>
              <div className="lg:col-span-4 lg:border-l lg:border-[var(--border-subtle)] lg:pl-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                  Works with
                </div>
                <p className="mt-2 font-mono text-[12.5px] leading-[1.6] text-foreground/70">
                  {row.footnote}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
