"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { ctaData } from "@/lib/mock-data/landing-data";

export function CtaSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main CTA Card */}
        <div className="relative rounded-[40px] overflow-hidden bg-[#0A0C14] border border-white/[0.06]">
          {/* Background Effects */}
          {/* Radial gradient top-left (white) */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />
          {/* Radial gradient bottom-right (orange) */}
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,107,53,0.15),transparent_60%)] pointer-events-none" />
          {/* Dot texture grid */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Content */}
          <div className="relative px-8 py-16 md:px-16 md:py-24 lg:px-24 lg:py-32">
            {/* Large Typography Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-[1.1] mb-16 md:mb-24">
              {ctaData.headline.line1}
              <br />
              <span className="text-white/40">{ctaData.headline.line2}</span>
            </h2>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {/* Email */}
              <div className="space-y-3">
                <span className="text-[10px] font-medium tracking-widest text-white/40 uppercase">
                  {ctaData.email.label}
                </span>
                <a
                  href={`mailto:${ctaData.email.address}`}
                  className="flex items-center gap-2 text-white hover:text-[#FF6B35] transition-colors duration-300 group"
                >
                  <Mail className="w-4 h-4 text-white/40 group-hover:text-[#FF6B35] transition-colors" />
                  <span className="text-lg font-light">{ctaData.email.address}</span>
                </a>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <span className="text-[10px] font-medium tracking-widest text-white/40 uppercase">
                  {ctaData.schedule.label}
                </span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,107,53,0.5)]"
                >
                  {ctaData.schedule.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Try AutoCrew */}
              <div className="space-y-3">
                <span className="text-[10px] font-medium tracking-widest text-white/40 uppercase">
                  {ctaData.tryIt.label}
                </span>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-white text-[#03060e] hover:bg-white/90 transition-all duration-300"
                >
                  {ctaData.tryIt.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
