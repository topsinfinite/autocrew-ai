import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { AiCrewsSection } from "@/components/landing/ai-crews-section";
import { ContactSalesSection } from "@/components/landing/contact-sales-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "AutoCrew – HIPAA-Aware AI Voice Agents",
  description:
    "Deploy HIPAA-aware healthcare agents and intelligent customer support crews that work 24/7. Trusted by healthcare providers and businesses worldwide.",
};

export default function LandingPage() {
  return (
    <>
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
