"use client";

import { Check, Zap, Rocket, Crown } from "lucide-react";
import { pricingData } from "@/lib/mock-data/landing-data";

// Icon map for pricing tiers
const iconMap = {
  Zap,
  Rocket,
  Crown,
};

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/10 bg-white/[0.03] text-white/60 mb-6">
            {pricingData.badge}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            {pricingData.title}
            <span className="block text-white/40">{pricingData.subtitle}</span>
          </h2>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingData.tiers.map((tier, index) => {
            const Icon = iconMap[tier.icon as keyof typeof iconMap];
            const isHighlighted = tier.highlighted;

            return (
              <div
                key={index}
                className={`
                  group relative rounded-3xl border transition-all duration-500
                  ${
                    isHighlighted
                      ? "border-[#FF6B35]/30 bg-gradient-to-b from-[#FF6B35]/10 to-transparent"
                      : "border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/[0.12]"
                  }
                `}
              >
                {/* Highlighted Top Border Gradient */}
                {isHighlighted && (
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent" />
                )}

                {/* Popular Badge */}
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-medium tracking-wide bg-[#FF6B35] text-white">
                    POPULAR
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center mb-6
                      ${
                        isHighlighted
                          ? "bg-[#FF6B35]/20 border border-[#FF6B35]/30"
                          : "bg-white/[0.03] border border-white/[0.06]"
                      }
                    `}
                  >
                    {Icon && (
                      <Icon
                        className={`w-5 h-5 ${isHighlighted ? "text-[#FF6B35]" : "text-white/60"}`}
                      />
                    )}
                  </div>

                  {/* Tier Name */}
                  <h3 className="text-xl font-medium text-white mb-2">{tier.name}</h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-white/40 text-sm">/month</span>
                  </div>

                  {/* Description */}
                  <p className="text-white/50 text-sm leading-relaxed mb-8">
                    {tier.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div
                          className={`
                            w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                            ${isHighlighted ? "bg-[#FF6B35]/10" : "bg-white/[0.06]"}
                          `}
                        >
                          <Check
                            className={`w-3 h-3 ${isHighlighted ? "text-[#FF6B35]" : "text-white/60"}`}
                          />
                        </div>
                        <span className="text-white/70 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`
                      w-full py-3 rounded-full text-sm font-medium transition-all duration-300
                      ${
                        isHighlighted
                          ? "bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 shadow-[0_0_20px_-5px_rgba(255,107,53,0.5)]"
                          : "bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20"
                      }
                    `}
                  >
                    {tier.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
