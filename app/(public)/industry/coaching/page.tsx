import type { Metadata } from "next";
import { CoachingHero } from "@/components/industry/coaching/coaching-hero";
import { CoachingPainPoints } from "@/components/industry/coaching/coaching-pain-points";
import { CoachingFeatures } from "@/components/industry/coaching/coaching-features";
import { CoachingMetrics } from "@/components/industry/coaching/coaching-metrics";
import { CoachingHowItWorks } from "@/components/industry/coaching/coaching-how-it-works";
import { CoachingTestimonials } from "@/components/industry/coaching/coaching-testimonials";
import { CoachingFaq } from "@/components/industry/coaching/coaching-faq";
import { CoachingCta } from "@/components/industry/coaching/coaching-cta";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { JsonLd } from "@/components/seo/json-ld";
import {
  faqPageSchema,
  serviceSchema,
  reviewSchema,
  howToSchema,
} from "@/lib/seo/schemas";
import {
  coachingFaqItems,
  coachingTestimonialsData,
  coachingSteps,
} from "@/lib/mock-data/coaching-data";

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
    images: [
      {
        url: "/industry/coaching/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AI Automation for Coaches – AutoCrew",
      },
    ],
  },
  other: {
    "article:published_time": "2025-11-01",
    "article:modified_time": "2026-03-10",
  },
};

export default function CoachingPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(coachingFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "AutoCrew for Coaches",
          "AI-powered automation platform for coaching professionals. Handles scheduling, client intake, follow-ups, and admin tasks 24/7.",
          "AI Automation",
        )}
      />
      <JsonLd data={reviewSchema(coachingTestimonialsData.items)} />
      <JsonLd data={howToSchema(coachingSteps)} />
      <CoachingHero />
      <CoachingPainPoints />
      <CoachingFeatures />
      <CoachingMetrics />
      <CoachingHowItWorks />
      <CoachingTestimonials />
      <CoachingFaq />
      <CrossIndustryLinks currentIndustry="Coaching" />
      <CoachingCta />
    </>
  );
}
