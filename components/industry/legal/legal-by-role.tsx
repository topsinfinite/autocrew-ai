import { legalByRole } from "@/lib/mock-data/legal-data";

/** Three editorial columns — Firm partner / Legal ops / Legal aid director. */
export function LegalByRole() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="max-w-[44ch]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
            {legalByRole.eyebrow}
          </div>
          <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
            {legalByRole.heading}
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-3">
          {legalByRole.roles.map((role) => (
            <article
              key={role.title}
              className="flex flex-col gap-5 bg-card p-7 sm:p-8"
            >
              <h3 className="font-space-grotesk text-[20px] font-semibold tracking-[-0.01em] text-foreground">
                {role.title}
              </h3>
              <p className="font-geist text-[15px] leading-[1.7] text-foreground/70">
                {role.body}
              </p>
              <div className="mt-auto border-t border-[var(--border-subtle)] pt-4">
                <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/45">
                  Outcome
                </div>
                <p className="mt-1 font-mono text-[12.5px] uppercase tracking-[0.12em] text-[#FF6B35]">
                  {role.metric}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
