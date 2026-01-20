"use client";

import { useState } from "react";
import { Check, Zap, Rocket, Crown } from "lucide-react";
import { pricingData } from "@/lib/mock-data/landing-data";

// Icon map for pricing tiers
const iconMap = {
  Zap,
  Rocket,
  Crown,
};

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  // Calculate price based on billing period (20% discount for annual)
  const getPrice = (monthlyPrice: number) => {
    return isAnnual ? Math.round(monthlyPrice * 0.8) : monthlyPrice;
  };

  return (
    <section
      id="pricing"
      className="relative z-10 border-t border-gray-200/10 dark:border-white/[0.06] pt-40 pb-40"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gray-400/20 dark:from-white/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B35]/5 blur-[120px] rounded-full pointer-events-none opacity-50" />

        {/* Header */}
        <div className="flex flex-col text-center mb-20 items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35] text-xs font-medium mb-6 font-space">
            {pricingData.badge}
          </div>
          <h2 className="text-4xl md:text-5xl tracking-tight mb-8 font-semibold text-gray-900 dark:text-white font-space-grotesk">
            {pricingData.title}{" "}
            <span className="text-gray-400 dark:text-white/40">
              {pricingData.subtitle}
            </span>
          </h2>

          {/* Toggle */}
          <div className="flex items-center gap-4 text-xs font-medium tracking-wide p-1.5 rounded-full border bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 font-space">
            <span
              className={`px-3 py-1 cursor-pointer transition-colors ${
                !isAnnual
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-white/50"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                isAnnual
                  ? "bg-[#FF6B35]/20 border border-[#FF6B35]/30"
                  : "bg-gray-300 dark:bg-white/20 border border-gray-400 dark:border-white/30"
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full shadow-sm transition-all ${
                  isAnnual
                    ? "right-1 bg-[#FF6B35]"
                    : "left-1 bg-gray-500 dark:bg-white/60"
                }`}
              />
            </button>
            <span
              className={`px-3 py-1 cursor-pointer transition-colors ${
                isAnnual
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-white/50"
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual{" "}
              <span className="text-[#FF6B35] text-[9px] ml-1">-20%</span>
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingData.tiers.map((tier, index) => {
            const Icon = iconMap[tier.icon as keyof typeof iconMap];
            const isHighlighted = tier.highlighted;

            if (isHighlighted) {
              // Growth Plan (Highlighted)
              return (
                <div
                  key={index}
                  className="relative group p-8 rounded-3xl bg-gray-100 dark:bg-[#0A0C14] border border-gray-200 dark:border-white/[0.08] flex flex-col shadow-2xl overflow-hidden shadow-gray-300/50 dark:shadow-black/50"
                >
                  {/* Highlight Gradient */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B35]/[0.03] to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-[#FF6B35] uppercase tracking-wider font-space">
                            {tier.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF6B35] text-black font-space">
                            POPULAR
                          </span>
                        </div>
                        <div className="text-4xl font-semibold text-gray-900 dark:text-white font-space-grotesk">
                          ${getPrice(tier.price)}
                          <span className="text-sm font-normal ml-1 text-gray-500 dark:text-white/40 font-geist">
                            /mo
                          </span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
                        {Icon && <Icon className="w-4 h-4 text-[#FF6B35]" />}
                      </div>
                    </div>

                    <p className="text-sm mb-8 leading-relaxed text-gray-600 dark:text-white/50 font-geist">
                      {tier.description}
                    </p>

                    <div className="space-y-4 mb-10 flex-1">
                      {tier.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3 text-sm text-gray-900 dark:text-white font-geist"
                        >
                          <Check className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-3 rounded-xl bg-[#FF6B35] font-semibold hover:bg-[#FF6B35]/90 transition-all text-sm shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)] text-black font-space">
                      {tier.ctaText}
                    </button>
                  </div>
                </div>
              );
            }

            // Starter & Premium Plans
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-gray-100 dark:from-white/[0.05] to-transparent border border-gray-200 dark:border-white/[0.08] flex flex-col transition-all duration-300 hover:border-gray-300 dark:hover:border-white/20"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#FF6B35] uppercase tracking-wider mb-2 font-space">
                      {tier.name}
                    </span>
                    <div className="text-4xl font-semibold text-gray-900 dark:text-white font-space-grotesk">
                      ${getPrice(tier.price)}
                      <span className="text-sm font-normal ml-1 text-gray-500 dark:text-white/40 font-geist">
                        /mo
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border flex items-center justify-center bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10">
                    {Icon && (
                      <Icon className="w-4 h-4 text-gray-400 dark:text-white/40" />
                    )}
                  </div>
                </div>

                <p className="text-sm mb-8 leading-relaxed text-gray-600 dark:text-white/50 font-geist">
                  {tier.description}
                </p>

                <div className="space-y-4 mb-10 flex-1">
                  {tier.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70 font-geist"
                    >
                      <Check className="w-4 h-4 mt-0.5 text-gray-400 dark:text-white/20 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 rounded-xl bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] transition-all font-medium text-sm text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-gray-900 dark:hover:border-white font-space">
                  {tier.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
