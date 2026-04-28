import { restaurantHandoff } from "@/lib/mock-data/restaurant-data";

/** Handoff rules ledger — when a host or manager takes over from Sarah. */
export function RestaurantHandoff() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
              {restaurantHandoff.eyebrow}
            </div>
            <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
              {restaurantHandoff.heading}
            </h2>
            <p className="mt-5 max-w-[44ch] font-geist text-[15px] leading-[1.65] text-foreground/65">
              {restaurantHandoff.intro}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-card">
              <div className="hidden grid-cols-12 gap-4 border-b border-[var(--border-subtle)] bg-foreground/[0.025] px-5 py-3 lg:grid">
                {restaurantHandoff.columns.map((col, i) => (
                  <div
                    key={col}
                    className={
                      "font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55 " +
                      (i === 0
                        ? "col-span-5"
                        : i === 1
                          ? "col-span-4"
                          : "col-span-3")
                    }
                  >
                    {col}
                  </div>
                ))}
              </div>

              <ul className="divide-y divide-[var(--border-subtle)]">
                {restaurantHandoff.rows.map((row, i) => (
                  <li
                    key={row.condition}
                    className="grid gap-3 px-5 py-5 sm:py-6 lg:grid-cols-12 lg:gap-4"
                  >
                    <div className="lg:col-span-5">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/40 lg:hidden">
                        {restaurantHandoff.columns[0]}
                      </div>
                      <p className="mt-1 font-geist text-[14.5px] leading-[1.55] text-foreground lg:mt-0">
                        <span className="mr-2 font-mono text-[11px] tabular-nums text-foreground/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {row.condition}
                      </p>
                    </div>
                    <div className="lg:col-span-4">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/40 lg:hidden">
                        {restaurantHandoff.columns[1]}
                      </div>
                      <p className="mt-1 font-geist text-[14px] leading-[1.55] text-foreground/75 lg:mt-0">
                        {row.action}
                      </p>
                    </div>
                    <div className="lg:col-span-3">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/40 lg:hidden">
                        {restaurantHandoff.columns[2]}
                      </div>
                      <p className="mt-1 font-geist text-[14px] leading-[1.55] text-foreground/65 lg:mt-0">
                        {row.handoff}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
