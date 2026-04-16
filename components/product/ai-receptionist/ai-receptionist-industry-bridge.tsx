import Link from "next/link";
import { Building2 } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { aiReceptionistIndustryBridge } from "@/lib/mock-data/ai-receptionist-data";

export function AiReceptionistIndustryBridge() {
  return (
    <section className="relative z-10 py-16 sm:py-24 section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <SectionBadge
            icon={<Building2 className="w-3.5 h-3.5" />}
            className="mb-6"
          >
            Industries
          </SectionBadge>
          <h2 className="text-2xl sm:text-3xl font-semibold font-space-grotesk text-foreground mb-3">
            {aiReceptionistIndustryBridge.headline}
          </h2>
          <p className="text-muted-foreground font-geist">
            {aiReceptionistIndustryBridge.subheadline}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiReceptionistIndustryBridge.industries.map((industry) => (
            <Link
              key={industry.href}
              href={industry.href}
              className="p-6 rounded-2xl border border-foreground/[0.08] dark:border-white/[0.08] bg-foreground/[0.03] dark:bg-white/[0.02] hover:border-[#FF6B35]/20 motion-safe:transition-colors motion-safe:duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <h3 className="text-lg font-semibold font-space-grotesk text-foreground mb-2">
                {industry.name}
              </h3>
              <p className="text-sm text-muted-foreground font-geist">
                {industry.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
