"use client";

import { Check } from "lucide-react";
import { aiCrewsData } from "@/lib/mock-data/landing-data";

export function AiCrewsSection() {
  return (
    <section id="solutions" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/10 bg-white/[0.03] text-white/60 mb-6">
            AI Crews
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            Purpose-built AI teams for
            <span className="block text-white/40">your business needs.</span>
          </h2>
        </div>

        {/* Crew Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {aiCrewsData.map((crew, index) => (
            <div
              key={index}
              className="group relative p-8 md:p-10 rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-transparent hover:border-[#FF6B35]/30 transition-all duration-500"
            >
              {/* Badge */}
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium tracking-wide border border-white/10 bg-white/[0.03] text-white/60 mb-6">
                {crew.badge}
              </span>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-medium text-white mb-4">
                {crew.title}
              </h3>

              {/* Description */}
              <p className="text-white/50 text-base leading-relaxed mb-8">
                {crew.description}
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {crew.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#FF6B35]" />
                    </div>
                    <span className="text-white/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                disabled={crew.ctaDisabled}
                className={`
                  px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    crew.ctaDisabled
                      ? "bg-white/[0.03] border border-white/10 text-white/40 cursor-not-allowed"
                      : "bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.08] hover:border-[#FF6B35]/30"
                  }
                `}
              >
                {crew.ctaText}
              </button>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF6B35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
