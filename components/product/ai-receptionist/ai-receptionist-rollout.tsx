import { Rocket } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { aiReceptionistRolloutSteps } from "@/lib/mock-data/ai-receptionist-data";

export function AiReceptionistRollout() {
  return (
    <section className="relative z-10 py-16 sm:py-24 md:py-28 section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <SectionBadge
            icon={<Rocket className="w-3.5 h-3.5" />}
            className="mb-6"
          >
            Rollout
          </SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight font-space-grotesk text-foreground mb-4">
            Go live with guardrails, then widen traffic
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aiReceptionistRolloutSteps.map((step) => (
            <div
              key={step.number}
              className="flex gap-5 rounded-2xl border border-foreground/[0.08] dark:border-white/[0.08] p-6 bg-foreground/[0.02] dark:bg-white/[0.02]"
            >
              <span className="text-2xl font-mono font-bold text-[#FF6B35] shrink-0">
                {step.number}
              </span>
              <div>
                <h3 className="text-lg font-semibold font-space-grotesk text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground font-geist leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
