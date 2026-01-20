"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

        {/* Radial glow behind hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Announcement badge */}
          <div
            className="animate-fade-up opacity-0 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm mb-10 hover:border-primary/50 transition-colors cursor-default"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-muted-foreground">Introducing AutoCrew</span>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>

          {/* Main headline with display font */}
          <h1
            className="animate-fade-up opacity-0 font-display text-5xl md:text-7xl lg:text-8xl tracking-tight mb-8 leading-[0.95]"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <span className="block text-foreground">AI-Powered</span>
            <span className="block mt-2 gradient-text">Automation</span>
            <span className="block mt-2 text-foreground">for Business</span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-up opacity-0 text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {heroData.subheadline}
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up opacity-0 flex flex-col sm:flex-row gap-4 mb-20"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <Link href={heroData.primaryCta.href}>
              <Button size="lg" className="group h-12 px-8 text-base font-medium rounded-full">
                {heroData.primaryCta.text}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href={heroData.secondaryCta.href}>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-medium rounded-full border-border/60 hover:bg-card hover:border-primary/50"
              >
                {heroData.secondaryCta.text}
              </Button>
            </Link>
          </div>

          {/* Premium dashboard preview */}
          <div
            className="animate-scale-in opacity-0 relative w-full max-w-5xl mx-auto"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 rounded-3xl blur-2xl opacity-50" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Browser-like header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full max-w-xs mx-auto h-6 rounded-md bg-muted/50 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">app.autocrew.ai</span>
                  </div>
                </div>
              </div>

              {/* Dashboard content preview */}
              <div className="aspect-[16/9] p-6 md:p-8">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-muted/50 via-muted/30 to-transparent flex items-center justify-center border border-border/30">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Your AI Crews Dashboard</p>
                      <p className="text-xs text-muted-foreground">Manage, monitor, and optimize your crews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div
            className="animate-fade-up opacity-0 mt-16 flex flex-col items-center"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <p className="text-sm text-muted-foreground mb-6">Trusted by forward-thinking teams</p>
            <div className="flex items-center gap-8 md:gap-12 opacity-40">
              {/* Placeholder company logos - replace with actual logos */}
              {['Acme Corp', 'TechFlow', 'Innovate', 'Scale AI'].map((company, i) => (
                <div key={i} className="text-sm font-medium tracking-wide uppercase text-muted-foreground/80">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
