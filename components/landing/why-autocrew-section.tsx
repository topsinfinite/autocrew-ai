"use client";

import { Rocket, ShieldCheck, Maximize, Webhook, Headphones, ArrowRight } from "lucide-react";
import { whyAutocrewData } from "@/lib/mock-data/landing-data";

// Icon map for why features
const iconMap = {
  Rocket,
  ShieldCheck,
  Maximize,
  Webhook,
  Headphones,
};

export function WhyAutocrewSection() {
  return (
    <section className="z-10 pt-32 pb-32 relative section-divider section-glow-center">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Content */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35] text-xs font-medium mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse shadow-[0_0_8px_rgba(255,107,53,0.4)]"></div>
              {whyAutocrewData.badge}
            </div>

            <h2 className="md:text-5xl text-4xl font-semibold text-foreground tracking-tight mb-6">
              {whyAutocrewData.title}
            </h2>

            <p className="text-lg font-light leading-relaxed text-muted-foreground mb-10">
              {whyAutocrewData.description}
            </p>

            <button className="group flex items-center gap-2 text-sm font-medium transition-all duration-300 rounded-full pt-3 pr-6 pb-3 pl-6 border text-muted-foreground hover:text-foreground bg-foreground/[0.05] dark:bg-white/5 hover:bg-foreground/[0.08] dark:hover:bg-white/10 border-border hover:border-border">
              {whyAutocrewData.ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {whyAutocrewData.features.map((feature, index) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];

              return (
                <div key={index} className="group">
                  <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-[#FF6B35] mb-5 group-hover:border-[#FF6B35]/30 group-hover:shadow-[0_0_15px_-3px_rgba(255,107,53,0.3)] transition-all duration-300">
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <h3 className="text-lg font-medium mb-2 tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-light text-muted-foreground">
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
