import type { Metadata } from "next";
import Link from "next/link";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Automation for Healthcare",
  description:
    "AI scheduling, patient communication, and front-office operations for healthcare providers. Tell us about your practice — we’ll help you automate the busywork.",
  alternates: {
    canonical: "/industry/healthcare",
  },
  openGraph: {
    title: "AI Automation for Healthcare",
    description:
      "Patient communication, scheduling, and operations automation built for healthcare teams.",
    url: "/industry/healthcare",
  },
};

export default function HealthcareIndustryPage() {
  return (
    <>
      <section className="relative z-10 pt-24 pb-16 sm:pt-32 sm:pb-24 md:pt-40 md:pb-32 section-glow-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#FF6B35] font-space-grotesk mb-6">
            For healthcare providers
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-space-grotesk text-foreground mb-6">
            AutoCrew for Healthcare
          </h1>
          <p className="text-lg text-muted-foreground font-geist leading-relaxed mb-10">
            We&apos;re building industry-specific automation for scheduling,
            reminders, intake, and patient communications — so your staff spends
            less time on the phone and more time on care. Reach out to see what
            fits your clinic or practice today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="pill" size="pill-md" className="group" asChild>
              <Link href="/contact">
                Talk to us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            <Button variant="pill-outline" size="pill-md" asChild>
              <Link href="https://app.autocrew-ai.com/signup">
                Start free trial
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <CrossIndustryLinks currentIndustry="Healthcare" />
    </>
  );
}
