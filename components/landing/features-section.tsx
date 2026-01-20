"use client";

import {
  MessageSquare,
  Zap,
  LayoutGrid,
  TrendingUp,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { featuresData } from "@/lib/mock-data/landing-data";

// Icon map to convert string names to components
const iconMap = {
  MessageSquare,
  Zap,
  LayoutGrid,
  TrendingUp,
  Settings2,
  ShieldCheck,
};

export function FeaturesSection() {
  return (
    <section id="features" className="z-10 py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10 font-sans">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-20 relative">
          {/* Vertical line decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-transparent -translate-y-full via-white/10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B35]/5 border border-[#FF6B35]/20 mb-8 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse shadow-[0_0_8px_rgba(255,107,53,0.4)]" />
            <span className="text-[11px] font-medium text-[#FF6B35] tracking-wider uppercase font-geist">
              System Capabilities
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl tracking-tight mb-6 font-space-grotesk font-semibold text-white">
            Powerful Features for{" "}
            <span className="font-semibold font-space-grotesk text-slate-50">
              Modern Businesses
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-lg font-light leading-relaxed font-geist text-white/50">
            Everything you need to automate customer interactions and scale your
            operations efficiently with our autonomous crews.
          </p>
        </div>

        {/* Grid Section */}
        <div className="relative rounded-3xl overflow-visible">
          {/* Grid Lines & Beams Background */}
          <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden border border-white/[0.08]">
            {/* Vertical Lines */}
            <div className="absolute left-1/3 top-0 w-px h-full bg-white/[0.05] hidden md:block">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#FF6B35]/50 to-transparent animate-beam-v" />
            </div>
            <div className="absolute right-1/3 top-0 w-px h-full bg-white/[0.05] hidden md:block">
              <div
                className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#FF6B35]/50 to-transparent animate-beam-v"
                style={{ animationDelay: "2s" }}
              />
            </div>
            {/* Horizontal Lines */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/[0.05] hidden md:block">
              <div
                className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-transparent via-[#FF6B35]/50 to-transparent animate-beam-h"
                style={{ animationDuration: "5s" }}
              />
            </div>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white/[0.02] backdrop-blur-sm rounded-3xl overflow-hidden relative z-10 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
            {featuresData.map((feature, index) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              const isFirstRow = index < 3;
              const isSecondRow = index >= 3;

              return (
                <div
                  key={index}
                  className={cn(
                    "group relative p-8 md:p-10 hover:bg-white/[0.02] transition-colors duration-500",
                    // Mobile: all cards have bottom border except last
                    "border-b md:border-b-0 border-white/[0.05]",
                    // Last card in mobile: no bottom border
                    index === featuresData.length - 1 && "border-b-0",
                    // Desktop second row: top border
                    isSecondRow && "lg:border-t border-white/[0.05]",
                    // Tablet: border adjustments
                    index >= 2 && "md:border-t border-white/[0.05]"
                  )}
                >
                  <div className="relative z-10">
                    {/* Icon Box */}
                    <div className="mb-6 relative inline-block">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg bg-[#0A0C14] border border-white/[0.1]",
                          "flex items-center justify-center text-[#FF6B35]",
                          "group-hover:border-[#FF6B35]/30 group-hover:shadow-[0_0_15px_-3px_rgba(255,107,53,0.3)]",
                          "transition-all duration-300"
                        )}
                      >
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-medium mb-3 font-geist tracking-tight text-white">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed font-light font-geist text-white/50">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
