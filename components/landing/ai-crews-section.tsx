"use client";

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { aiCrewsData } from "@/lib/mock-data/landing-data";

export function AiCrewsSection() {
  return (
    <section
      id="solutions"
      className="z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-glow-center section-glow-bottom"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl tracking-tight mb-10 sm:mb-16 text-center font-space-grotesk font-semibold text-foreground">
          AI Crews for Healthcare & Business
        </h2>

        {/* Crew Cards Grid - 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiCrewsData.map((crew, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-linear-to-br from-foreground/[0.05] dark:from-white/5 to-transparent bg-white/[0.02] border border-white/[0.06] shadow-lg shadow-black/20 relative overflow-hidden group hover:border-[#FF6B35]/30 transition-all duration-300 flex flex-col"
            >
              {/* Medical Pulse Decoration for Healthcare Card */}
              {index === 0 && (
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none opacity-20">
                    <svg className="w-full h-full text-[#FF6B35]" viewBox="0 0 100 100">
                        <path d="M0 50 L 20 50 L 30 20 L 50 80 L 70 50 L 100 50" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
              )}
            
              <div className="relative z-10 flex-1 flex flex-col">
                {/* Badge */}
                <div className="inline-flex items-center self-start gap-2 px-3 py-1 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35] text-xs font-medium mb-6 font-geist">
                  {crew.badge}
                </div>

                {/* Title */}
                <h3 className="text-2xl mb-4 font-space-grotesk font-semibold text-foreground">
                  {crew.title}
                </h3>

                {/* Description */}
                <p className="mb-8 leading-relaxed font-geist text-muted-foreground text-sm flex-grow">
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
                <Link href={crew.ctaHref || "#"} className="mt-auto">
                    <button
                    disabled={crew.ctaDisabled}
                    className={`w-full py-3 px-4 rounded-xl border transition-all font-medium font-geist text-sm flex items-center justify-center gap-2 ${
                        crew.ctaDisabled
                        ? "border-transparent bg-white/[0.04] text-muted-foreground opacity-50 cursor-not-allowed"
                        : "border-transparent bg-white/[0.05] hover:bg-[#FF6B35] hover:text-white text-foreground"
                    }`}
                    >
                    {crew.ctaText}
                    {!crew.ctaDisabled && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
