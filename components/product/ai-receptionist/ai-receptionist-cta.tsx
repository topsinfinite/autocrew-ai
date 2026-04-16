import Link from "next/link";
import { ArrowRight, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiReceptionistCtaData } from "@/lib/mock-data/ai-receptionist-data";
import { APP_CONFIG } from "@/lib/constants";

export function AiReceptionistCta() {
  return (
    <section className="pt-8 pb-20 sm:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[40px] border border-border bg-card p-8 sm:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_100%_100%,rgba(255,107,53,0.12),transparent_100%)]" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-space-grotesk text-foreground mb-4">
              <span className="block">
                {aiReceptionistCtaData.headline.line1}
              </span>
              <span className="block text-muted-foreground">
                {aiReceptionistCtaData.headline.line2}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground font-geist mb-10 leading-relaxed">
              {aiReceptionistCtaData.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Button
                variant="pill"
                size="pill-lg"
                className="group w-full sm:w-auto shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)] motion-safe:transition-shadow"
                asChild
              >
                <Link href={aiReceptionistCtaData.primaryCta.href}>
                  {aiReceptionistCtaData.primaryCta.text}
                  <ArrowRight className="w-4 h-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                variant="pill-outline"
                size="pill-lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href={aiReceptionistCtaData.secondaryCta.href}>
                  <Calendar className="w-4 h-4" />
                  {aiReceptionistCtaData.secondaryCta.text}
                </Link>
              </Button>
              <Button
                variant="pill-outline"
                size="pill-lg"
                className="w-full sm:w-auto"
                asChild
              >
                <a
                  href={APP_CONFIG.supportPhoneTel}
                  aria-label={`Call ${APP_CONFIG.supportPhoneDisplay}`}
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Speak to Sarah
                </a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-geist">
              {APP_CONFIG.speakToSarahSubtitle} ·{" "}
              {APP_CONFIG.supportPhoneDisplay} · {APP_CONFIG.supportPhoneHours}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
