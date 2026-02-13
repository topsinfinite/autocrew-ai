"use client";

import { Check } from "lucide-react";
import { aiCrewsData } from "@/lib/mock-data/landing-data";

export function AiCrewsSection() {
  return (
    <section id="solutions" className="z-10 pt-40 pb-40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl tracking-tight mb-16 text-center font-space-grotesk font-semibold text-foreground">
          AI Crews for Every Need
        </h2>

        {/* Crew Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {aiCrewsData.map((crew, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-linear-to-br from-foreground/[0.05] dark:from-white/5 to-transparent border border-border relative overflow-hidden group hover:border-[#FF6B35]/30 transition-all duration-300"
            >
              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35] text-xs font-medium mb-6 font-geist">
                  {crew.badge}
                </div>

                {/* Title */}
                <h3 className="text-2xl mb-4 font-space-grotesk font-semibold text-foreground">
                  {crew.title}
                </h3>

                {/* Description */}
                <p className="mb-8 leading-relaxed font-geist text-muted-foreground">
                  {crew.description}
                </p>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {crew.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-sm font-geist text-foreground/80"
                    >
                      <Check className="w-4 h-4 text-[#FF6B35] mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  disabled={crew.ctaDisabled}
                  className={`w-full py-3 rounded-xl border transition-all font-medium font-geist text-foreground ${
                    crew.ctaDisabled
                      ? "border-border opacity-50 cursor-not-allowed"
                      : "bg-foreground/[0.05] dark:bg-white/5 border-border hover:bg-[#FF6B35] hover:border-[#FF6B35] hover:text-primary-foreground"
                  }`}
                >
                  {crew.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
