"use client";

import Link from "next/link";
import Script from "next/script";
import { CircleDot, ArrowRight } from "lucide-react";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { heroData } from "@/lib/mock-data/landing-data";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative z-10 section-glow-bottom">
      {/* Unicorn Studio Animated Background */}
      <div
        data-us-project="CyihYkcOkCwqGEIyVwWb"
        className="absolute inset-0 w-full h-full -z-10 overflow-hidden blur-md"
        style={{
          minHeight: "100vh",
          opacity: 0.48,
        }}
      />
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
      <div className="md:px-6 md:pt-16 max-w-7xl mx-auto pt-16 px-4 pb-8">
        <div className="text-center max-w-3xl mt-20 mx-auto">
          {/* Announcement Badge */}
          <p
            className={cn(
              "inline-flex items-center gap-2 text-xs font-medium text-[#FF6B35] font-geist",
              "bg-foreground/10 dark:bg-white/5 border border-[#FF6B35]/20 rounded-full",
              "mb-4 py-1 px-3 backdrop-blur-lg",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <CircleDot className="w-3 h-3 text-[#FF6B35]" />
            {heroData.announcement.text}
          </p>

          {/* Main Headline */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight font-space-grotesk text-foreground",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            {heroData.headline.prefix}{" "}
            <span className="whitespace-nowrap relative text-foreground">
              {/* Accent underline */}
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FF6B35]/20 -skew-x-6 -z-10" />
              {heroData.headline.accent}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "md:text-xl text-base text-muted-foreground font-geist mt-5",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            {heroData.subheadline}
          </p>

          {/* CTA */}
          <div
            className={cn(
              "flex mt-8 items-center justify-center",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <Link href={heroData.primaryCta.href}>
              <button
                className={cn(
                  "group inline-flex items-center gap-2 text-base font-medium text-black font-space",
                  "rounded-full py-3 px-8",
                  "bg-[#FF6B35] hover:bg-[#FF6B35]/90",
                  "shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)]",
                  "transition-all duration-200"
                )}
              >
                {heroData.primaryCta.text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Trust Indicator */}
          <div
            className={cn(
              "flex text-sm mt-6 items-center justify-center text-muted-foreground",
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
        className="animate-scale-in opacity-0"
        style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
        data-theme="dark"
      >
        <div>
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
