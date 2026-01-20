"use client";

import { statsData } from "@/lib/mock-data/landing-data";

export function StatsSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
            By The Numbers
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Trusted by teams
            <span className="gradient-text"> worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of companies already using AutoCrew to transform their operations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="group relative text-center p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-500"
            >
              {/* Value */}
              <div className="font-display text-4xl md:text-5xl lg:text-6xl mb-3 gradient-text">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-base font-medium text-foreground mb-1">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>

              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
