import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { restaurantIntegrations } from "@/lib/mock-data/restaurant-data";

/** Integrations ledger — restaurant's trust signal. Six-cell mono grid. */
export function RestaurantIntegrations() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)] bg-foreground/[0.015]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
              {restaurantIntegrations.eyebrow}
            </div>
            <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
              {restaurantIntegrations.heading}
            </h2>
            <p className="mt-5 max-w-[44ch] font-geist text-[15px] leading-[1.7] text-foreground/70">
              {restaurantIntegrations.body}
            </p>
            <Link
              href={restaurantIntegrations.docsLink.href}
              className="group mt-6 inline-flex items-center gap-1.5 font-geist text-[14px] text-foreground/75 transition-colors hover:text-[#FF6B35]"
            >
              {restaurantIntegrations.docsLink.text}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <dl className="grid grid-cols-2 divide-x divide-y divide-[var(--border-subtle)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-card md:grid-cols-3">
              {restaurantIntegrations.ledger.map((cell) => (
                <div key={cell.label} className="px-5 py-6 sm:px-6 sm:py-7">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                    {cell.label}
                  </dt>
                  <dd className="mt-2 font-space-grotesk text-[clamp(1rem,1.4vw,1.25rem)] font-semibold leading-[1.25] tracking-[-0.005em] text-foreground">
                    {cell.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
