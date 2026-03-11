"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight, PlayCircle } from "lucide-react";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { SectionBadge } from "@/components/landing/section-badge";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";
import { cn } from "@/lib/utils";

export function HeroSection() {

  return (
    <section className="relative z-10 section-glow-bottom overflow-hidden">
      {/* Medical/Tech Vector Grid Background */}
      <div className="absolute inset-0 pointer-events-none -z-5 overflow-hidden">
         {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Decorative Crosses */}
        <div className="absolute top-1/4 left-10 w-4 h-4 text-[#FF6B35]/20 animate-pulse" aria-hidden="true">+</div>
        <div className="absolute top-1/3 right-20 w-4 h-4 text-[#FF6B35]/20 animate-pulse delay-700" aria-hidden="true">+</div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 text-[#FF6B35]/20 animate-pulse delay-300" aria-hidden="true">+</div>
        
        {/* Waveform Line */}
        <svg className="absolute top-1/2 left-0 w-full h-24 stroke-[#FF6B35]/10 fill-none opacity-50" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0 50 Q 300 100 600 50 T 1200 50" vectorEffect="non-scaling-stroke" strokeWidth="2" />
        </svg>
      </div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-6 relative z-10">
        <div className="text-center max-w-4xl mt-4 sm:mt-6 mx-auto">
          {/* Announcement Badge */}
          <div
            className={cn(
              "mb-6 animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <SectionBadge icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {heroData.announcement.text}
            </SectionBadge>
          </div>

          {/* Main Headline */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-space-grotesk text-foreground mb-6 leading-[1.1]",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            <span className="block">{heroData.headline.prefix}</span>
            <span className="lg:whitespace-nowrap relative block">
              {/* Accent underline/highlight - hidden when text wraps on small screens */}
              <span className="hidden lg:block absolute bottom-2 left-0 w-full h-4 bg-[#FF6B35]/10 -skew-x-6 -z-10 rounded-sm" />
              <span className="text-[#FF6B35]">{heroData.headline.accent}</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "md:text-xl text-lg text-muted-foreground font-geist max-w-2xl mx-auto leading-relaxed",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            {heroData.subheadline}
          </p>

          {/* CTA */}
          <div
            className={cn(
              "flex flex-col sm:flex-row mt-10 items-center justify-center gap-4",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <Button
              variant="pill"
              size="pill-lg"
              className="w-full sm:w-auto group"
              asChild
            >
              <Link href={heroData.primaryCta.href}>
                {heroData.primaryCta.text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>

            <Link
              href={heroData.secondaryCta.href}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <PlayCircle className="w-4 h-4 text-[#FF6B35]" />
              {heroData.secondaryCta.text}
            </Link>
          </div>

          {/* Trust Indicator */}
          <div
            className={cn(
              "flex text-sm mt-8 items-center justify-center text-muted-foreground",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <span className="font-geist">{heroData.trustText}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Preview - forced dark context (product mockup) */}
      <div
        className="animate-scale-in opacity-0 max-w-[1200px] mx-auto px-4 mt-12 pb-20 relative z-20"
        style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
        data-theme="dark"
      >
        <div className="relative">
             {/* Glow behind dashboard */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#FF6B35]/20 blur-[100px] -z-10 rounded-full" />
            <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
