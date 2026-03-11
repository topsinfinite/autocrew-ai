import type { Metadata } from "next";
import { CoachingHero } from "@/components/industry/coaching/coaching-hero";
import { CoachingPainPoints } from "@/components/industry/coaching/coaching-pain-points";
import { CoachingFeatures } from "@/components/industry/coaching/coaching-features";
import { CoachingMetrics } from "@/components/industry/coaching/coaching-metrics";
import { CoachingHowItWorks } from "@/components/industry/coaching/coaching-how-it-works";
import { CoachingTestimonials } from "@/components/industry/coaching/coaching-testimonials";
import { CoachingFaq } from "@/components/industry/coaching/coaching-faq";
import { CoachingCta } from "@/components/industry/coaching/coaching-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageSchema } from "@/lib/seo/schemas";
import { coachingFaqItems } from "@/lib/mock-data/coaching-data";

export const metadata: Metadata = {
  title: "AI Automation for Coaches – AutoCrew",
  description:
    "Scale your coaching practice with AI-powered scheduling, client intake, and intelligent follow-ups. Save 10+ hours per week on admin. Start your free trial.",
  alternates: {
    canonical: "/industry/coaching",
  },
  openGraph: {
    title: "AI Automation for Coaches – AutoCrew",
    description:
      "Scale your coaching practice with AI-powered scheduling, client intake, and intelligent follow-ups. Save 10+ hours per week on admin.",
    url: "/industry/coaching",
  },
};

export default function CoachingPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(coachingFaqItems)} />
      <CoachingHero />
      <CoachingPainPoints />
      <CoachingFeatures />
      <CoachingMetrics />
      <CoachingHowItWorks />
      <CoachingTestimonials />
      <CoachingFaq />
      <CoachingCta />
    </>
  );
}
