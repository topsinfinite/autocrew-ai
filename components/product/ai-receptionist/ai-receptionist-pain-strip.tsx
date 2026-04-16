import { Zap } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { aiReceptionistPainStrip } from "@/lib/mock-data/ai-receptionist-data";

export function AiReceptionistPainStrip() {
  return (
    <section className="relative z-10 py-14 sm:py-20 border-y border-foreground/[0.06] dark:border-white/[0.06] bg-foreground/[0.02] dark:bg-white/[0.02]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <SectionBadge icon={<Zap className="w-3.5 h-3.5" />} className="mb-6">
          The bottleneck
        </SectionBadge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight font-space-grotesk text-foreground mb-4">
          {aiReceptionistPainStrip.headline}
        </h2>
        <p className="text-lg text-muted-foreground font-geist leading-relaxed max-w-2xl mx-auto">
          {aiReceptionistPainStrip.subheadline}
        </p>
      </div>
    </section>
  );
}
