import { Headphones } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { AudioPlayer } from "@/components/landing/audio-player";
import { aiReceptionistDemo } from "@/lib/mock-data/ai-receptionist-data";

export function AiReceptionistDemo() {
  return (
    <section
      id="demo"
      className="relative z-10 py-16 sm:py-24 section-glow-bottom section-divider scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionBadge
              icon={<Headphones className="w-3.5 h-3.5" />}
              className="mb-6"
            >
              {aiReceptionistDemo.badge}
            </SectionBadge>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight font-space-grotesk text-foreground mb-4">
              {aiReceptionistDemo.headline}
            </h2>
            <p className="text-lg text-muted-foreground font-geist leading-relaxed mb-6">
              {aiReceptionistDemo.subheadline}
            </p>
            <p className="text-sm text-muted-foreground font-geist leading-relaxed max-w-md">
              Sample recording for marketing purposes. Your production voice and
              scripts are configured for your brand and policies.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <AudioPlayer
              label={aiReceptionistDemo.audioLabel}
              duration={aiReceptionistDemo.duration}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
