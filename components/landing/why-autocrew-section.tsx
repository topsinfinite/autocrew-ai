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
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Content */}
          <div className="lg:col-span-5">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/10 bg-white/[0.03] text-white/60 mb-6">
              {whyAutocrewData.badge}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-light text-white leading-tight mb-6">
              {whyAutocrewData.title.split("&")[0]}
              <span className="text-white/40">&amp;{whyAutocrewData.title.split("&")[1]}</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              {whyAutocrewData.description}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,107,53,0.5)]">
              {whyAutocrewData.ctaText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column - Features Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyAutocrewData.features.map((feature, index) => {
                const Icon = iconMap[feature.icon as keyof typeof iconMap];
                // Last item spans full width on larger screens when there's an odd number
                const isLastAndOdd =
                  index === whyAutocrewData.features.length - 1 &&
                  whyAutocrewData.features.length % 2 !== 0;

                return (
                  <div
                    key={index}
                    className={`
                      group p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent
                      hover:border-[#FF6B35]/30 transition-all duration-500
                      ${isLastAndOdd ? "sm:col-span-2 sm:max-w-[calc(50%-12px)]" : ""}
                    `}
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-[#0A0C14] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-[#FF6B35]/30 group-hover:shadow-[0_0_15px_-5px_rgba(255,107,53,0.3)] transition-all duration-300">
                      {Icon && (
                        <Icon className="w-4 h-4 text-white/60 group-hover:text-[#FF6B35] transition-colors duration-300" />
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-medium text-white mb-2 group-hover:text-[#FF6B35] transition-colors duration-300">
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
      </div>
    </section>
  );
}
