import {
  CalendarCheck,
  MessageSquare,
  ClipboardList,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/landing/section-badge";
import { restaurantFeaturesData } from "@/lib/mock-data/restaurant-data";

const iconMap = {
  CalendarCheck,
  MessageSquare,
  ClipboardList,
};

export function RestaurantFeatures() {
  return (
    <section className="z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-glow-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <SectionBadge className="mb-8">
            {restaurantFeaturesData.badge}
          </SectionBadge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 font-space-grotesk font-semibold text-foreground">
            {restaurantFeaturesData.headline.prefix}{" "}
            <span className="text-[#FF6B35]">
              {restaurantFeaturesData.headline.accent}
            </span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurantFeaturesData.items.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];

            return (
              <article
                key={feature.title}
                className={cn(
                  "p-6 sm:p-8 rounded-2xl sm:rounded-3xl",
                  "bg-linear-to-br from-foreground/[0.05] dark:from-white/5 to-transparent bg-white/[0.02]",
                  "border border-white/[0.06] shadow-lg shadow-black/20",
                  "hover:border-[#FF6B35]/30 transition-all duration-300",
                  "group flex flex-col",
                  "animate-fade-up opacity-0",
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex-1 flex flex-col">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg bg-card border border-border mb-6",
                      "flex items-center justify-center text-[#FF6B35]",
                      "group-hover:border-[#FF6B35]/30 group-hover:shadow-[0_0_15px_-3px_rgba(255,107,53,0.3)]",
                      "transition-all duration-300",
                    )}
                  >
                    {Icon ? <Icon className="w-6 h-6" /> : null}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 font-space-grotesk text-foreground">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed font-geist text-muted-foreground mb-8 flex-grow">
                    {feature.description}
                  </p>

                  {/* Bullet List */}
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-sm font-geist text-foreground/80"
                      >
                        <Check className="w-4 h-4 text-[#FF6B35] mt-0.5 shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
