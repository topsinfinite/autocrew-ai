import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { AiCrewsSection } from "@/components/landing/ai-crews-section";
import { ContactSalesSection } from "@/components/landing/contact-sales-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import {
  softwareApplicationSchema,
  faqPageSchema,
  howToSchema,
} from "@/lib/seo/schemas";
import { faqData } from "@/lib/mock-data/docs-content";
import { howItWorksData } from "@/lib/mock-data/landing-data";

export const metadata: Metadata = {
  title: "AutoCrew – AI Voice Agents for Healthcare & Customer Support",
  description:
    "Deploy HIPAA-aware healthcare agents and intelligent customer support crews that work 24/7. Voice, chat, and multi-channel AI automation. Start free.",
  alternates: {
    canonical: "/",
  },
  other: {
    "article:published_time": "2025-01-15",
    "article:modified_time": "2026-03-10",
  },
};

const landingFaqItems = faqData.slice(0, 6);

export default function LandingPage() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqPageSchema(landingFaqItems)} />
      <JsonLd data={howToSchema(howItWorksData)} />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <AiCrewsSection />
      <ContactSalesSection />
      <HowItWorks />
      <FaqSection />
      <CtaSection />
    </>
  );
}
