"use client";

import { howItWorksData } from "@/lib/mock-data/landing-data";
import { cn } from "@/lib/utils/cn";

export function HowItWorks() {
  const delays = ["0s", "1.5s", "3s", "4.5s"];

  return (
    <section id="how-it-works" className="z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-glow-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl tracking-tight mb-4 font-space-grotesk font-semibold text-foreground">
            How It Works
          </h2>
          <p className="text-lg font-geist text-muted-foreground">
            Get started with AutoCrew in four simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Desktop Horizontal Beam Line */}
          <div className="hidden lg:block absolute top-[29px] left-0 w-full h-[2px] overflow-hidden rounded-full pointer-events-none bg-foreground/[0.08] dark:bg-white/[0.08]">
            <div className="absolute top-0 left-0 w-[300px] h-full bg-linear-to-r from-transparent via-[#FF6B35] to-transparent blur-[1px] animate-beam-travel" />
          </div>

          {/* Step Cards */}
          {howItWorksData.map((step, index) => {
            const delay = delays[index];
            const isLastCard = index === howItWorksData.length - 1;

            return (
              <div
                key={index}
                className="pt-6 relative animate-step-card"
                style={{ animationDelay: delay }}
              >
                {/* Dot Indicator — enlarged with glow ring */}
                <div className="absolute top-5 left-0 z-10 flex items-center justify-center">
                  <div
                    className="absolute w-9 h-9 rounded-full animate-dot-glow-ring"
                    style={{ animationDelay: delay }}
                  />
                  <div
                    className="w-5 h-5 rounded-full ring-4 ring-background animate-dot-pulse transition-all duration-300 bg-foreground/10 dark:bg-white/10"
                    style={{ animationDelay: delay }}
                  />
                </div>

                {/* Vertical connector line — mobile & tablet only */}
                {!isLastCard && (
                  <div
                    className={cn(
                      "absolute left-[9px] top-[49px] w-[2px] pointer-events-none lg:hidden",
                      "bg-foreground/[0.08] dark:bg-white/[0.08]",
                      index >= 2 && "md:hidden"
                    )}
                    style={{ height: "calc(100% + 2rem)" }}
                  >
                    <div
                      className="absolute left-0 top-0 w-full h-16 bg-linear-to-b from-transparent via-[#FF6B35]/60 to-transparent blur-[1px] animate-beam-vertical"
                      style={{ animationDelay: delay }}
                    />
                  </div>
                )}

                {/* Step Number with background glow */}
                <div className="relative mb-4">
                  <div
                    className="absolute inset-0 flex items-start justify-start animate-num-glow pointer-events-none"
                    style={{ animationDelay: delay }}
                  >
                    <div className="w-20 h-20 rounded-full blur-xl bg-[var(--animation-num-glow)]" />
                  </div>
                  <div
                    className="relative text-5xl sm:text-7xl md:text-8xl font-semibold font-space-grotesk animate-num-pulse transition-colors duration-300 text-foreground/[0.05] dark:text-white/5"
                    style={{ animationDelay: delay }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-medium mb-3 font-geist text-foreground">
                  {step.title}
                </h4>

                {/* Description */}
                <p className="text-sm leading-relaxed font-geist text-muted-foreground">
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
