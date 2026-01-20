"use client";

import { howItWorksData } from "@/lib/mock-data/landing-data";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header - Left aligned */}
        <div className="mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/10 bg-white/[0.03] text-white/60 mb-6">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            Get started in
            <span className="block text-white/40">minutes, not days.</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Traveling Beam Line */}
          <div className="hidden lg:block absolute top-0 left-0 right-0 h-px bg-white/[0.06]">
            <div className="beam-travel absolute top-0 left-0 h-full" />
          </div>

          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {howItWorksData.map((step, index) => {
              // Animation delays for staggered effect
              const delays = ["0s", "1.5s", "3s", "4.5s"];
              const delay = delays[index];

              return (
                <div
                  key={index}
                  className="step-card group relative lg:border-r lg:border-white/[0.06] last:border-r-0 lg:px-8 lg:pt-8 lg:pb-4"
                  style={{ animationDelay: delay }}
                >
                  {/* Dot Indicator */}
                  <div className="hidden lg:block absolute top-0 left-8 -translate-y-1/2">
                    <div
                      className="dot-pulse w-3 h-3 rounded-full bg-white/20 border border-white/20"
                      style={{ animationDelay: delay }}
                    />
                  </div>

                  {/* Step Number */}
                  <div
                    className="num-pulse text-5xl md:text-6xl font-light text-white/10 mb-4 tabular-nums"
                    style={{ animationDelay: delay }}
                  >
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-medium text-white mb-3 group-hover:text-[#FF6B35] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Mobile connector */}
                  {index < howItWorksData.length - 1 && (
                    <div className="lg:hidden flex justify-start my-6">
                      <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent ml-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
