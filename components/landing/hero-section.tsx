"use client";

import Link from "next/link";
import Script from "next/script";
import { ShieldCheck, ArrowRight, PlayCircle } from "lucide-react";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { heroData } from "@/lib/mock-data/landing-data";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/hooks/use-theme";

export function HeroSection() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  return (
    <section className="relative z-10 section-glow-bottom overflow-hidden">
      {/* Unicorn Studio Animated Background */}
      <div
        data-us-project="CyihYkcOkCwqGEIyVwWb"
        className="absolute inset-0 w-full h-full -z-10 overflow-hidden blur-md transition-opacity duration-500"
        style={{
          minHeight: "100vh",
          opacity: isDark ? 0.48 : 0,
        }}
      />
      
      {/* Medical/Tech Vector Grid Background */}
      <div className="absolute inset-0 pointer-events-none -z-5 overflow-hidden">
         {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Decorative Crosses */}
        <div className="absolute top-1/4 left-10 w-4 h-4 text-[#FF6B35]/20 animate-pulse">+</div>
        <div className="absolute top-1/3 right-20 w-4 h-4 text-[#FF6B35]/20 animate-pulse delay-700">+</div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 text-[#FF6B35]/20 animate-pulse delay-300">+</div>
        
        {/* Waveform Line */}
        <svg className="absolute top-1/2 left-0 w-full h-24 stroke-[#FF6B35]/10 fill-none opacity-50" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0 50 Q 300 100 600 50 T 1200 50" vectorEffect="non-scaling-stroke" strokeWidth="2" />
        </svg>
      </div>

      <Script
        src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.2/dist/unicornStudio.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init?.();
            window.UnicornStudio.isInitialized = true;
          }
        }}
      />
      <div className="md:px-6 md:pt-16 max-w-7xl mx-auto pt-12 px-4 pb-8 relative z-10">
        <div className="text-center max-w-4xl mt-14 sm:mt-20 mx-auto">
          {/* Announcement Badge */}
          <p
            className={cn(
              "inline-flex items-center gap-2 text-xs font-medium text-[#FF6B35] font-geist",
              "bg-foreground/10 dark:bg-white/5 border border-[#FF6B35]/20 rounded-full",
              "mb-6 py-1.5 px-4 backdrop-blur-lg",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B35]" />
            {heroData.announcement.text}
          </p>

          {/* Main Headline */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-space-grotesk text-foreground mb-6 leading-[1.1]",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            {heroData.headline.prefix}{" "}
            <span className="whitespace-nowrap relative text-foreground inline-block">
              {/* Accent underline/highlight */}
              <span className="absolute bottom-2 left-0 w-full h-4 bg-[#FF6B35]/10 -skew-x-6 -z-10 rounded-sm" />
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
            <Link href={heroData.primaryCta.href} className="w-full sm:w-auto">
              <button
                className={cn(
                  "w-full sm:w-auto group inline-flex items-center justify-center gap-2 text-base font-medium text-black font-space",
                  "rounded-full py-3.5 px-8",
                  "bg-[#FF6B35] hover:bg-[#FF6B35]/90",
                  "shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)]",
                  "transition-all duration-200"
                )}
              >
                {heroData.primaryCta.text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            
             <Link href={heroData.secondaryCta.href} className="w-full sm:w-auto">
              <button
                className={cn(
                  "w-full sm:w-auto group inline-flex items-center justify-center gap-2 text-base font-medium text-foreground font-space",
                  "rounded-full py-3.5 px-8",
                  "bg-foreground/[0.05] hover:bg-foreground/[0.1] border border-foreground/[0.1]",
                  "transition-all duration-200"
                )}
              >
                <PlayCircle className="w-4 h-4 text-[#FF6B35]" />
                {heroData.secondaryCta.text}
              </button>
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
        className="animate-scale-in opacity-0 max-w-[1200px] mx-auto px-4 mt-8 mb-[-100px] relative z-20"
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
