import { GitBranch } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { aiReceptionistCallFlow } from "@/lib/mock-data/ai-receptionist-data";

export function AiReceptionistFlow() {
  return (
    <section
      id="how-it-works"
      className="relative z-10 py-16 sm:py-24 md:py-28 section-glow-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <SectionBadge
            icon={<GitBranch className="w-3.5 h-3.5" />}
            className="mb-6"
          >
            Call flow
          </SectionBadge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-space-grotesk text-foreground mb-4">
            From ring to resolution — transparent by design
          </h2>
          <p className="text-lg text-muted-foreground font-geist leading-relaxed">
            No black box. Each step is observable, tunable, and bounded by the
            playbooks you approve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiReceptionistCallFlow.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl border border-foreground/[0.08] dark:border-white/[0.08] bg-card/40 backdrop-blur-sm p-6 cursor-default motion-safe:transition-colors motion-safe:duration-300 hover:border-[#FF6B35]/25"
            >
              <p className="text-xs font-mono font-semibold text-[#FF6B35] mb-3">
                {step.step}
              </p>
              <h3 className="text-lg font-semibold font-space-grotesk text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground font-geist leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
