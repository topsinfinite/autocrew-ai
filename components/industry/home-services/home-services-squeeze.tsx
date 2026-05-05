import { ArrowUpRight } from "lucide-react";
import { homeServicesSqueeze } from "@/lib/mock-data/home-services-data";

export function HomeServicesSqueeze() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
              {homeServicesSqueeze.eyebrow}
            </div>
            <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
              {homeServicesSqueeze.heading}
            </h2>
            <p className="mt-5 max-w-[44ch] font-geist text-[15px] leading-[1.65] text-foreground/65">
              {homeServicesSqueeze.intro}
            </p>
          </div>

          <div className="lg:col-span-7">
            <ol className="grid divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
              {homeServicesSqueeze.items.map((item) => (
                <li
                  key={item.audience}
                  className="grid gap-3 py-7 sm:grid-cols-12 sm:gap-6"
                >
                  <div className="sm:col-span-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                      {item.audience}
                    </div>
                  </div>
                  <div className="sm:col-span-9">
                    <p className="font-space-grotesk text-[clamp(1.125rem,1.6vw,1.375rem)] font-semibold leading-[1.3] tracking-[-0.012em] text-foreground">
                      {item.headline}
                    </p>
                    <p className="mt-3 max-w-[60ch] font-geist text-[14.5px] leading-[1.7] text-foreground/65">
                      {item.body}
                    </p>
                    {(item as { citationRef?: boolean }).citationRef ? (
                      <a
                        href={homeServicesSqueeze.citation.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 transition-colors hover:text-[#FF6B35]"
                      >
                        {homeServicesSqueeze.citation.label}:{" "}
                        {homeServicesSqueeze.citation.text}
                        <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ) : null}
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
