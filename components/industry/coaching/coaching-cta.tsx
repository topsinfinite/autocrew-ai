import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coachingCtaData } from "@/lib/mock-data/coaching-data";

export function CoachingCta() {
  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 font-space-grotesk">
        <div className="group overflow-hidden sm:p-10 transition-colors duration-500 text-card-foreground bg-card border-border border rounded-[40px] p-6 relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_0%_0%,rgba(0,0,0,0.02),transparent_100%)] dark:bg-[radial-gradient(1000px_800px_at_0%_0%,rgba(255,255,255,0.02),transparent_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_100%_100%,rgba(255,107,53,0.12),transparent_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.2]" />
          </div>

          <div className="relative z-10">
            {/* Headline */}
            <h2 className="text-[clamp(2rem,10vw,7rem)] sm:text-[clamp(2.5rem,9vw,7rem)] lg:text-[clamp(3rem,7vw,7rem)] leading-[0.9] font-semibold tracking-tighter font-geist mb-6 sm:mb-8">
              <span className="block font-space-grotesk text-foreground">
                {coachingCtaData.headline.line1}
              </span>
              <span className="block text-muted-foreground transition-colors duration-700 font-space-grotesk">
                {coachingCtaData.headline.line2}
              </span>
            </h2>

            <p className="text-xl text-muted-foreground font-geist mb-12 max-w-2xl">
              {coachingCtaData.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="pill"
                size="pill-lg"
                className="group/btn"
                asChild
              >
                <Link href={coachingCtaData.primaryCta.href}>
                  {coachingCtaData.primaryCta.text}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </Button>

              <Button
                variant="pill-outline"
                size="pill-lg"
                className="group/btn"
                asChild
              >
                <Link href={coachingCtaData.secondaryCta.href}>
                  <Calendar className="w-4 h-4" />
                  {coachingCtaData.secondaryCta.text}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
