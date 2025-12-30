import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ctaData } from "@/lib/mock-data/landing-data";

export function CtaSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="relative max-w-5xl mx-auto">
          {/* Card */}
          <div className="relative bg-gradient-to-br from-primary to-primary/80 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-16 overflow-hidden">
            {/* Light mode overlay for better contrast */}
            <div className="absolute inset-0 bg-slate-900/30 dark:bg-transparent rounded-3xl" />

            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

            {/* Content */}
            <div className="relative text-center">
              {/* Headline */}
              <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--cta-heading-color) !important' }}>
                {ctaData.headline}
              </h2>

              {/* Subheadline */}
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--cta-text-color) !important' }}>
                {ctaData.subheadline}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href={ctaData.primaryCta.href}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group bg-white text-primary dark:text-slate-900 hover:bg-white/90"
                  >
                    {ctaData.primaryCta.text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href={ctaData.secondaryCta.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-800/30 dark:border-white/30 text-slate-900 dark:text-white hover:bg-slate-900/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                  >
                    {ctaData.secondaryCta.text}
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-6" style={{ color: 'var(--cta-features-color)' }}>
                {ctaData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 dark:bg-primary/30 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
