"use client";

import { Headphones, Sparkles, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicesData } from "@/lib/mock-data/landing-data";
import Link from "next/link";

// Icon map
const iconMap = {
  Headphones,
  Sparkles,
};

export function ServicesSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
            AI Crews
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Purpose-built for
            <span className="gradient-text"> every need</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Deploy specialized AI crews that work around the clock. From customer support
            to lead generation, we've got you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {servicesData.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            const isSupport = service.type === 'Support';

            return (
              <div
                key={index}
                className="group relative rounded-3xl overflow-hidden"
              >
                {/* Card background with gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative h-full p-8 md:p-10 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-border/80 transition-all duration-500">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      {/* Type badge */}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                        isSupport
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {service.type} Crew
                      </span>

                      <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed max-w-md">
                        {service.description}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className={`hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl ${
                      isSupport
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-primary/10 text-primary'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      {Icon && <Icon className="h-8 w-8" strokeWidth={1.5} />}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          isSupport
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          <Check className="h-3 w-3" strokeWidth={2.5} />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link href={`/docs/${service.type.toLowerCase()}-crew`}>
                    <Button
                      variant="outline"
                      className="group/btn w-full sm:w-auto rounded-full border-border/60 hover:bg-card hover:border-primary/50"
                    >
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
