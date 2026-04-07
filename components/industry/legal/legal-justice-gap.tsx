import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/landing/section-badge";
import { legalJusticeGapData } from "@/lib/mock-data/legal-data";

export function LegalJusticeGap() {
  return (
    <section className="z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-glow-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <SectionBadge className="mb-8">
            {legalJusticeGapData.badge}
          </SectionBadge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 font-space-grotesk font-semibold text-foreground">
            {legalJusticeGapData.headline}
          </h2>

          <p className="text-lg font-geist text-muted-foreground leading-relaxed">
            {legalJusticeGapData.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legalJusticeGapData.items.map((stat, index) => (
            <div
              key={stat.value + stat.sourceNote}
              className={cn(
                "p-6 sm:p-8 rounded-2xl sm:rounded-3xl relative",
                "bg-foreground/[0.03] dark:bg-white/[0.02]",
                "border border-foreground/[0.08] dark:border-white/[0.08]",
                "hover:border-[#FF6B35]/20 transition-all duration-300",
                "animate-fade-up opacity-0",
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <p className="text-4xl sm:text-5xl font-bold font-space-grotesk text-[#FF6B35] mb-4 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm leading-relaxed font-geist text-foreground/90 mb-4">
                {stat.description}
              </p>
              <p className="text-xs text-muted-foreground font-geist border-t border-border pt-4">
                {stat.sourceNote}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-base sm:text-lg font-geist text-foreground/85 max-w-3xl mx-auto mt-12 sm:mt-16 leading-relaxed">
          {legalJusticeGapData.closing}
        </p>

        <p className="text-center text-xs text-muted-foreground font-geist mt-8">
          Source:{" "}
          <Link
            href={legalJusticeGapData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6B35] hover:underline underline-offset-4"
          >
            {legalJusticeGapData.sourceLinkText}
          </Link>
        </p>
      </div>
    </section>
  );
}
