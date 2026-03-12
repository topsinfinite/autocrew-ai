import {
  Activity,
  PhoneCall,
  Database,
  UserCheck,
  BarChart3,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/landing/section-badge";
import { featuresData } from "@/lib/mock-data/landing-data";

// Icon map to convert string names to components
const iconMap = {
  Activity,
  PhoneCall,
  Database,
  UserCheck,
  BarChart3,
  Shield,
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-glow-top"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 font-sans">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20 relative">
          {/* Vertical line decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-transparent to-transparent -translate-y-full via-foreground/10" />

          {/* Badge */}
          <SectionBadge className="mb-8">System Capabilities</SectionBadge>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 font-space-grotesk font-semibold text-foreground">
            Powerful Features for{" "}
            <span className="font-semibold font-space-grotesk text-foreground">
              Modern Businesses
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-lg font-light leading-relaxed font-geist text-muted-foreground">
            Everything you need to automate customer interactions and scale your
            operations efficiently.
          </p>
        </div>

        {/* Grid Section */}
        <div className="relative rounded-3xl overflow-visible">
          {/* Grid Lines & Beams Background */}
          <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden border border-foreground/[0.08] dark:border-border shadow-sm dark:shadow-none">
            {/* Tech Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,53,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Vertical Lines */}
            <div className="absolute left-1/3 top-0 w-px h-full bg-foreground/[0.08] dark:bg-white/[0.05] hidden md:block">
              <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-transparent via-[#FF6B35]/50 to-transparent animate-beam-v" />
            </div>
            <div className="absolute right-1/3 top-0 w-px h-full bg-foreground/[0.08] dark:bg-white/[0.05] hidden md:block">
              <div
                className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-transparent via-[#FF6B35]/50 to-transparent animate-beam-v"
                style={{ animationDelay: "2s" }}
              />
            </div>
            {/* Horizontal Lines */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-foreground/[0.08] dark:bg-white/[0.05] hidden md:block">
              <div
                className="absolute top-0 left-0 h-full w-24 bg-linear-to-r from-transparent via-[#FF6B35]/50 to-transparent animate-beam-h"
                style={{ animationDuration: "5s" }}
              />
            </div>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-foreground/[0.03] dark:bg-white/[0.02] backdrop-blur-sm rounded-3xl overflow-hidden relative z-10 divide-y md:divide-y-0 md:divide-x divide-foreground/[0.08] dark:divide-white/[0.05]">
            {featuresData.map((feature, index) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              const isFirstRow = index < 3;
              const isSecondRow = index >= 3;

              return (
                <article
                  key={index}
                  className={cn(
                    "group relative p-8 md:p-10 bg-foreground/[0.03] dark:bg-white/[0.02] hover:bg-foreground/[0.06] dark:hover:bg-white/[0.04] transition-colors duration-500",
                    // Mobile: all cards have bottom border except last
                    "border-b md:border-b-0 border-foreground/[0.08] dark:border-white/[0.05]",
                    // Last card in mobile: no bottom border
                    index === featuresData.length - 1 && "border-b-0",
                    // Desktop second row: top border
                    isSecondRow &&
                      "lg:border-t border-foreground/[0.08] dark:border-white/[0.05]",
                    // Tablet: border adjustments
                    index >= 2 &&
                      "md:border-t border-foreground/[0.08] dark:border-white/[0.05]",
                  )}
                >
                  <div className="relative z-10">
                    {/* Icon Box */}
                    <div className="mb-6 relative inline-block">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg bg-card border border-border",
                          "flex items-center justify-center text-[#FF6B35]",
                          "group-hover:border-[#FF6B35]/30 group-hover:shadow-[0_0_15px_-3px_rgba(255,107,53,0.3)]",
                          "transition-all duration-300",
                        )}
                      >
                        {Icon ? <Icon className="w-6 h-6" /> : null}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-medium mb-3 font-geist tracking-tight text-foreground">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed font-light font-geist text-muted-foreground">
                      {feature.description}
                    </p>

                    {feature.extendedDescription && (
                      <p className="text-xs leading-relaxed font-light font-geist text-muted-foreground/70 mt-2">
                        {feature.extendedDescription}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
