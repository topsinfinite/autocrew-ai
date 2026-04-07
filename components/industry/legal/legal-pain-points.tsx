import { Users, CalendarX2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/landing/section-badge";
import { legalPainPointsData } from "@/lib/mock-data/legal-data";

const iconMap = {
  Users,
  CalendarX2,
  Clock,
};

export function LegalPainPoints() {
  return (
    <section className="z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-glow-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <SectionBadge className="mb-8">
            {legalPainPointsData.badge}
          </SectionBadge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 font-space-grotesk font-semibold text-foreground">
            {legalPainPointsData.headline}
          </h2>

          <p className="text-lg font-light leading-relaxed font-geist text-muted-foreground">
            {legalPainPointsData.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legalPainPointsData.items.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];

            return (
              <div
                key={item.title}
                className={cn(
                  "p-6 sm:p-8 rounded-2xl sm:rounded-3xl",
                  "bg-linear-to-br from-foreground/[0.05] dark:from-white/5 to-transparent bg-white/[0.02]",
                  "border border-white/[0.06] shadow-lg shadow-black/20",
                  "hover:border-[#FF6B35]/30 transition-all duration-300",
                  "animate-fade-up opacity-0",
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg bg-card border border-border mb-6",
                    "flex items-center justify-center text-[#FF6B35]",
                  )}
                >
                  {Icon ? <Icon className="w-6 h-6" /> : null}
                </div>

                <h3 className="text-xl font-semibold mb-3 font-space-grotesk text-foreground">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed font-geist text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
