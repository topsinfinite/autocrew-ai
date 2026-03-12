"use client";

import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  Phone,
  BotMessageSquare,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { Button } from "@/components/ui/button";
import { restaurantHeroData } from "@/lib/mock-data/restaurant-data";
import { cn } from "@/lib/utils";

const workflowIcons = {
  Phone,
  BotMessageSquare,
  UtensilsCrossed,
};

export function RestaurantHero() {
  return (
    <section className="relative z-10 section-glow-bottom overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none -z-5 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Decorative Crosses */}
        <div
          className="absolute top-1/4 left-10 w-4 h-4 text-[#FF6B35]/20 animate-pulse"
          aria-hidden="true"
        >
          +
        </div>
        <div
          className="absolute top-1/3 right-20 w-4 h-4 text-[#FF6B35]/20 animate-pulse delay-700"
          aria-hidden="true"
        >
          +
        </div>
        <div
          className="absolute bottom-1/3 left-1/4 w-4 h-4 text-[#FF6B35]/20 animate-pulse delay-300"
          aria-hidden="true"
        >
          +
        </div>

        {/* Waveform Line */}
        <svg
          className="absolute top-1/2 left-0 w-full h-24 stroke-[#FF6B35]/10 fill-none opacity-50"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50 Q 300 100 600 50 T 1200 50"
            vectorEffect="non-scaling-stroke"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-6 relative z-10">
        <div className="text-center max-w-4xl mt-4 sm:mt-6 mx-auto">
          {/* Badge */}
          <div
            className="mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <SectionBadge>{restaurantHeroData.badge}</SectionBadge>
          </div>

          {/* Headline */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-space-grotesk text-foreground mb-6 leading-[1.1]",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            <span className="block">{restaurantHeroData.headline.prefix}</span>
            <span className="lg:whitespace-nowrap relative block">
              <span className="hidden lg:block absolute bottom-2 left-0 w-full h-4 bg-[#FF6B35]/10 -skew-x-6 -z-10 rounded-sm" />
              <span className="text-[#FF6B35]">
                {restaurantHeroData.headline.accent}
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "md:text-xl text-lg text-muted-foreground font-geist max-w-2xl mx-auto leading-relaxed",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            {restaurantHeroData.subheadline}
          </p>

          {/* CTAs */}
          <div
            className={cn(
              "flex flex-col sm:flex-row mt-10 items-center justify-center gap-4",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <Button
              variant="pill"
              size="pill-lg"
              className="w-full sm:w-auto group"
              asChild
            >
              <Link href={restaurantHeroData.primaryCta.href}>
                {restaurantHeroData.primaryCta.text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>

            <Link
              href={restaurantHeroData.secondaryCta.href}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <PlayCircle className="w-4 h-4 text-[#FF6B35]" />
              {restaurantHeroData.secondaryCta.text}
            </Link>
          </div>

          {/* Trust Text */}
          <div
            className={cn(
              "flex text-sm mt-8 items-center justify-center text-muted-foreground",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <span className="font-geist">{restaurantHeroData.trustText}</span>
          </div>
        </div>
      </div>

      {/* Workflow Cascade Visual */}
      <div
        className="animate-scale-in opacity-0 max-w-[800px] mx-auto px-4 mt-12 pb-20 relative z-20"
        style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
      >
        <div className="relative">
          {/* Glow behind workflow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#FF6B35]/15 blur-[100px] -z-10 rounded-full" />

          {/* Workflow Steps */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {restaurantHeroData.workflowSteps.map((step, index) => {
              const Icon =
                workflowIcons[step.icon as keyof typeof workflowIcons];
              const isLast =
                index === restaurantHeroData.workflowSteps.length - 1;

              return (
                <div
                  key={step.label}
                  className="flex items-center gap-4 sm:gap-0"
                >
                  {/* Step Card */}
                  <div
                    className={cn(
                      "flex items-center gap-3 px-6 py-4 rounded-2xl",
                      "bg-card/80 border border-white/[0.08] backdrop-blur-sm",
                      "hover:border-[#FF6B35]/30 hover:shadow-[0_0_20px_-5px_rgba(255,107,53,0.2)]",
                      "transition-all duration-300",
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35]">
                      {Icon ? <Icon className="w-5 h-5" /> : null}
                    </div>
                    <span className="text-sm font-medium font-space-grotesk text-foreground whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>

                  {/* Connector Arrow */}
                  {!isLast && (
                    <div className="hidden sm:flex items-center px-3">
                      <div className="w-8 h-px bg-gradient-to-r from-[#FF6B35]/40 to-[#FF6B35]/10" />
                      <ChevronRight className="w-4 h-4 text-[#FF6B35]/40 -ml-1" />
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
