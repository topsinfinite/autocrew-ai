import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homeServicesIntegrations } from "@/lib/mock-data/home-services-data";

export function HomeServicesIntegrations() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)] bg-foreground/[0.015]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
              {homeServicesIntegrations.eyebrow}
            </div>
            <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
              {homeServicesIntegrations.heading}
            </h2>
            <p className="mt-5 max-w-[44ch] font-geist text-[15px] leading-[1.7] text-foreground/70">
              {homeServicesIntegrations.body}
            </p>
            <Link
              href={homeServicesIntegrations.docsLink.href}
              className="group mt-6 inline-flex items-center gap-1.5 font-geist text-[14px] text-foreground/75 transition-colors hover:text-[#FF6B35]"
            >
              {homeServicesIntegrations.docsLink.text}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-card">
              <div className="hidden grid-cols-12 gap-4 border-b border-[var(--border-subtle)] bg-foreground/[0.025] px-5 py-3 lg:grid">
                <div className="col-span-4 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                  Dispatch software
                </div>
                <div className="col-span-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                  Read availability
                </div>
                <div className="col-span-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                  Write jobs
                </div>
                <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                  Sync
                </div>
              </div>

              <ul className="divide-y divide-[var(--border-subtle)]">
                {homeServicesIntegrations.matrix.map((row) => (
                  <li
                    key={row.name}
                    className="grid gap-2 px-5 py-5 sm:py-6 lg:grid-cols-12 lg:gap-4"
                  >
                    <div className="lg:col-span-4">
                      <p className="font-space-grotesk text-[15px] font-semibold tracking-[-0.005em] text-foreground">
                        {row.name}
                      </p>
                    </div>
                    <div className="lg:col-span-3">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/40 lg:hidden">
                        Read
                      </div>
                      <p className="mt-1 font-mono text-[12.5px] leading-[1.55] text-foreground/75 lg:mt-0">
                        {row.reads}
                      </p>
                    </div>
                    <div className="lg:col-span-3">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/40 lg:hidden">
                        Write
                      </div>
                      <p className="mt-1 font-mono text-[12.5px] leading-[1.55] text-foreground/75 lg:mt-0">
                        {row.writes}
                      </p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/40 lg:hidden">
                        Sync
                      </div>
                      <p className="mt-1 font-mono text-[12.5px] leading-[1.55] text-foreground/65 lg:mt-0">
                        {row.sync}
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
