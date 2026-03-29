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
import { APP_CONFIG } from "@/lib/constants";

const title = "AutoCrew – AI Voice Agents for Healthcare & Customer Support";
const description =
  "Deploy HIPAA-aware healthcare agents and intelligent customer support crews that work 24/7. Voice, chat, and multi-channel AI automation. Start free.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_CONFIG.url,
    siteName: "AutoCrew",
    title,
    description,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoCrew – AI-Powered Crews That Work 24/7",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.png"],
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
