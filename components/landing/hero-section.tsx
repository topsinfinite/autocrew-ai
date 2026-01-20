"use client";

import Link from "next/link";
import { CircleDot, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShineButton } from "@/components/landing/effects";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { heroData } from "@/lib/mock-data/landing-data";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative z-10">
      <div className="md:px-6 md:pt-16 max-w-7xl mx-auto pt-16 px-4 pb-8">
        <div className="text-center max-w-3xl mt-20 mx-auto">
          {/* Announcement Badge */}
          <p
            className={cn(
              "inline-flex items-center gap-2 text-xs font-medium text-primary",
              "bg-muted/50 border border-primary/20 rounded-full",
              "mb-4 py-1 px-3 backdrop-blur-lg",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <CircleDot className="w-3 h-3" />
            {heroData.announcement.text}
          </p>

          {/* Main Headline */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight font-display text-foreground",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            {heroData.headline.prefix}{" "}
            <span className="whitespace-nowrap relative text-foreground">
              {/* Accent underline */}
              <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -skew-x-6 -z-10" />
              {heroData.headline.accent}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "md:text-xl text-base text-muted-foreground mt-5",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            {heroData.subheadline}
          </p>

          {/* CTAs */}
          <div
            className={cn(
              "flex flex-col gap-3 sm:flex-row mt-8 items-center justify-center",
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <Link href={heroData.primaryCta.href}>
              <ShineButton className="text-base font-medium rounded-full py-3 px-8">
                {heroData.primaryCta.text}
              </ShineButton>
            </Link>
            <Link href={heroData.secondaryCta.href}>
              <Button
                variant="ghost"
                className={cn(
                  "group flex items-center gap-2 text-base font-medium rounded-full py-3 px-8",
                  "border border-border/20 hover:border-border/40",
                  "bg-foreground/5 hover:bg-foreground/10",
                  "text-muted-foreground hover:text-foreground",
                  "transition-all duration-300"
                )}
              >
                <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {heroData.secondaryCta.text}
              </Button>
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
            <span>{heroData.trustText}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div
        className="animate-scale-in opacity-0"
        style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
      >
        <DashboardPreview />
      </div>
    </section>
  );
}
