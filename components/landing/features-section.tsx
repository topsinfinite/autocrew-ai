"use client";

import {
  MessageCircle,
  Target,
  Network,
  BarChart3,
  Settings,
  Shield
} from "lucide-react";
import { featuresData } from "@/lib/mock-data/landing-data";

// Icon map to convert string names to components
const iconMap = {
  MessageCircle,
  Target,
  Network,
  BarChart3,
  Settings,
  Shield,
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 via-background to-background" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
            Features
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Everything you need to
            <span className="gradient-text"> scale</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Powerful features designed for modern businesses. Deploy AI crews that handle
            customer interactions while you focus on growth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {featuresData.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];

            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-border transition-all duration-500 hover-lift"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon container */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  {Icon && <Icon className="h-6 w-6" strokeWidth={1.5} />}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle corner accent on hover */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
