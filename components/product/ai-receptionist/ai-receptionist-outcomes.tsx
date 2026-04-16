import { Shield, Sparkles } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import {
  aiReceptionistOutcomes,
  aiReceptionistTrustPoints,
} from "@/lib/mock-data/ai-receptionist-data";

export function AiReceptionistOutcomes() {
  return (
    <section className="relative z-10 py-16 sm:py-24 section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <SectionBadge
            icon={<Sparkles className="w-3.5 h-3.5" />}
            className="mb-6"
          >
            Outcomes
          </SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight font-space-grotesk text-foreground mb-4">
            What changes when coverage is consistent
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {aiReceptionistOutcomes.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-foreground/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] dark:bg-white/[0.02] p-6 text-center sm:text-left"
            >
              <p className="text-2xl sm:text-3xl font-bold font-space-grotesk text-[#FF6B35] mb-1">
                {item.value}
              </p>
              <p className="text-sm font-semibold text-foreground font-space-grotesk mb-2">
                {item.label}
              </p>
              <p className="text-sm text-muted-foreground font-geist leading-relaxed">
                {item.sublabel}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-foreground/[0.08] dark:border-white/[0.08] bg-card/30 backdrop-blur-sm p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-5 h-5 text-[#FF6B35]" aria-hidden="true" />
            <h3 className="text-xl font-semibold font-space-grotesk text-foreground">
              Trust, compliance, and escalation
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiReceptionistTrustPoints.map((t) => (
              <div key={t.title}>
                <h4 className="text-base font-semibold text-foreground font-space-grotesk mb-2">
                  {t.title}
                </h4>
                <p className="text-sm text-muted-foreground font-geist leading-relaxed">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
