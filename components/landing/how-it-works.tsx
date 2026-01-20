"use client";

import { Plus, Brain, Rocket, TrendingUp } from "lucide-react";
import { howItWorksData } from "@/lib/mock-data/landing-data";

// Icon map
const iconMap = {
  Plus,
  Brain,
  Rocket,
  TrendingUp,
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
            How It Works
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Get started in
            <span className="gradient-text"> minutes</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Four simple steps to automate your business operations.
            No technical expertise required.
          </p>
        </div>

        {/* Steps - Horizontal on desktop, vertical on mobile */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
            {/* Connecting line - desktop only */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {howItWorksData.map((step, index) => {
              const Icon = iconMap[step.icon as keyof typeof iconMap];

              return (
                <div key={index} className="relative group">
                  {/* Step card */}
                  <div className="flex flex-col items-center text-center">
                    {/* Number circle */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-card border border-border/60 flex items-center justify-center group-hover:border-primary/50 transition-colors duration-300">
                        <span className="text-3xl font-display text-foreground group-hover:text-primary transition-colors duration-300">
                          {step.number}
                        </span>
                      </div>
                      {/* Glow on hover */}
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    </div>

                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      {Icon && <Icon className="h-6 w-6" strokeWidth={1.5} />}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>

                  {/* Mobile connector */}
                  {index < howItWorksData.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
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
