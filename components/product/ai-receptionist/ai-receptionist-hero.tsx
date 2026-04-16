"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { Button } from "@/components/ui/button";
import { AiReceptionistHeroFlow } from "./ai-receptionist-hero-flow";
import { aiReceptionistHeroData } from "@/lib/mock-data/ai-receptionist-data";
import { cn } from "@/lib/utils";

export function AiReceptionistHero() {
  return (
    <section className="relative z-10 section-glow-bottom overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-5 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div
          className="absolute top-1/4 left-10 w-4 h-4 text-[#FF6B35]/20 animate-pulse motion-reduce:animate-none"
          aria-hidden="true"
        >
          +
        </div>
        <div
          className="absolute top-1/3 right-20 w-4 h-4 text-[#FF6B35]/20 animate-pulse delay-700 motion-reduce:animate-none"
          aria-hidden="true"
        >
          +
        </div>
        <div
          className="absolute bottom-1/3 left-1/4 w-4 h-4 text-[#FF6B35]/20 animate-pulse delay-300 motion-reduce:animate-none"
          aria-hidden="true"
        >
          +
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-6 relative z-10">
        <div className="text-center max-w-4xl mt-4 sm:mt-6 mx-auto">
          <div
            className="mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <SectionBadge>{aiReceptionistHeroData.badge}</SectionBadge>
          </div>

          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-space-grotesk text-foreground mb-6 leading-[1.1]",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            <span className="block">
              {aiReceptionistHeroData.headline.prefix}
            </span>
            <span className="lg:whitespace-nowrap relative block">
              <span className="hidden lg:block absolute bottom-2 left-0 w-full h-4 bg-[#FF6B35]/10 -skew-x-6 -z-10 rounded-sm" />
              <span className="text-[#FF6B35]">
                {aiReceptionistHeroData.headline.accent}
              </span>
            </span>
          </h1>

          <p
            className={cn(
              "md:text-xl text-lg text-muted-foreground font-geist max-w-2xl mx-auto leading-relaxed",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            {aiReceptionistHeroData.subheadline}
          </p>

          <div
            className={cn(
              "flex flex-col mt-10 items-center justify-center gap-4",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <Button
              variant="pill"
              size="pill-lg"
              className="w-full sm:w-auto group shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)] motion-safe:transition-shadow"
              asChild
            >
              <Link href={aiReceptionistHeroData.primaryCta.href}>
                {aiReceptionistHeroData.primaryCta.text}
                <ArrowRight className="w-4 h-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Link
              href={aiReceptionistHeroData.secondaryCta.href}
              className="inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-11 sm:min-h-0"
            >
              <PlayCircle
                className="w-4 h-4 shrink-0 text-[#FF6B35]"
                aria-hidden="true"
              />
              {aiReceptionistHeroData.secondaryCta.text}
            </Link>
          </div>

          <div
            className={cn(
              "flex text-sm mt-8 items-center justify-center text-muted-foreground",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <span className="font-geist">
              {aiReceptionistHeroData.trustText}
            </span>
          </div>
        </div>
      </div>

      <div
        className="animate-scale-in opacity-0 max-w-4xl mx-auto px-4 mt-12 pb-20 relative z-20 scroll-mt-24"
        style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
      >
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#FF6B35]/15 blur-[100px] -z-10 rounded-full" />

          <AiReceptionistHeroFlow steps={aiReceptionistHeroData.workflowSteps} />
        </div>
      </div>
    </section>
  );
}
