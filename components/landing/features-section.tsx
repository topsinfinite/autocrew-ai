"use client";

import {
  MessageSquare,
  Zap,
  LayoutGrid,
  TrendingUp,
  Settings2,
  ShieldCheck,
} from "lucide-react";
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
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/10 bg-white/[0.03] text-white/60 mb-6">
            System Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            Everything you need to
            <span className="block text-white/40">scale your operations.</span>
          </h2>
        </div>

        {/* Features Grid with Animated Beams */}
        <div className="relative">
          {/* Grid Lines Background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical lines */}
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/[0.06]">
              <div className="beam-v absolute top-0 w-full" />
            </div>
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/[0.06]">
              <div className="beam-v absolute top-0 w-full" style={{ animationDelay: "2s" }} />
            </div>
            {/* Horizontal line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.06]">
              <div className="beam-h absolute left-0 h-full" style={{ animationDelay: "1s" }} />
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
            {featuresData.map((feature, index) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              const isLastInRow = (index + 1) % 3 === 0;
              const isTopRow = index < 3;

              return (
                <div
                  key={index}
                  className={`
                    group p-8 md:p-10 relative
                    ${!isLastInRow ? "lg:border-r lg:border-white/[0.06]" : ""}
                    ${isTopRow ? "border-b border-white/[0.06]" : ""}
                    ${index % 2 === 0 && index < 3 ? "md:border-r md:border-white/[0.06]" : ""}
                    ${index < 4 ? "md:border-b md:border-white/[0.06]" : ""}
                  `}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#0A0C14] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:border-[#FF6B35]/30 group-hover:shadow-[0_0_20px_-5px_rgba(255,107,53,0.3)] transition-all duration-300">
                    {Icon && (
                      <Icon className="w-5 h-5 text-white/60 group-hover:text-[#FF6B35] transition-colors duration-300" />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-medium text-white mb-3 group-hover:text-[#FF6B35] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
