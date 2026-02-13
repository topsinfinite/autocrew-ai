import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { AiCrewsSection } from "@/components/landing/ai-crews-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhyAutocrewSection } from "@/components/landing/why-autocrew-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AiCrewsSection />
      <PricingSection />
      <HowItWorks />
      <WhyAutocrewSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
