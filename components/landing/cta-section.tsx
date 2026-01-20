"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ctaData } from "@/lib/mock-data/landing-data";

export function CtaSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="relative max-w-5xl mx-auto">
          {/* Background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 rounded-[2.5rem] blur-3xl opacity-30" />

          {/* Main CTA card */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-secondary/80" />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }} />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Content */}
            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Start your free trial today</span>
              </div>

              {/* Headline */}
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {ctaData.headline}
              </h2>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                {ctaData.subheadline}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href={ctaData.primaryCta.href}>
                  <Button
                    size="lg"
                    className="group h-12 px-8 text-base font-medium rounded-full bg-white text-primary hover:bg-white/90"
                  >
                    {ctaData.primaryCta.text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href={ctaData.secondaryCta.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base font-medium rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    {ctaData.secondaryCta.text}
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                {ctaData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/70">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}
