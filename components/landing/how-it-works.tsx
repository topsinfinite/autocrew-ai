"use client";

import { howItWorksData } from "@/lib/mock-data/landing-data";

export function HowItWorks() {
  const delays = ["0s", "1.5s", "3s", "4.5s"];

  return (
    <section id="how-it-works" className="z-10 pt-40 pb-40 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl tracking-tight mb-4 font-space-grotesk font-semibold text-white">
            How It Works
          </h2>
          <p className="text-lg font-geist text-white/60">
            Get started with AutoCrew in four simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Moving Beam Line */}
          <div className="hidden lg:block absolute top-[25.5px] left-0 w-full h-px overflow-hidden rounded-full pointer-events-none bg-white/5">
            <div className="absolute top-0 left-0 w-[300px] h-full bg-linear-to-r from-transparent via-[#FF6B35] to-transparent blur-[1px] animate-beam-travel" />
          </div>

          {/* Step Cards */}
          {howItWorksData.map((step, index) => {
            const delay = delays[index];

            return (
              <div
                key={index}
                className="pt-6 relative animate-step-card"
                style={{ animationDelay: delay }}
              >
                {/* Dot Indicator */}
                <div
                  className="w-3 h-3 rounded-full ring-4 ring-[#03060e] absolute top-5 left-0 lg:-mt-0.5 z-10 animate-dot-pulse transition-all duration-300 bg-white/10"
                  style={{ animationDelay: delay }}
                />

                {/* Step Number */}
                <div
                  className="text-7xl font-semibold font-space-grotesk mb-4 animate-num-pulse transition-colors duration-300 text-white/5"
                  style={{ animationDelay: delay }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h4 className="text-lg font-medium mb-3 font-geist text-white">
                  {step.title}
                </h4>

                {/* Description */}
                <p className="text-sm leading-relaxed font-geist text-white/50">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
