import type { Metadata } from "next";
import { LegalHero } from "@/components/industry/legal/legal-hero";
import { LegalPainPoints } from "@/components/industry/legal/legal-pain-points";
import { LegalFeatures } from "@/components/industry/legal/legal-features";
import { LegalMetrics } from "@/components/industry/legal/legal-metrics";
import { LegalHowItWorks } from "@/components/industry/legal/legal-how-it-works";
import { LegalJusticeGap } from "@/components/industry/legal/legal-justice-gap";
import { LegalFaq } from "@/components/industry/legal/legal-faq";
import { LegalCta } from "@/components/industry/legal/legal-cta";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageSchema, serviceSchema, howToSchema } from "@/lib/seo/schemas";
import { legalFaqItems, legalSteps } from "@/lib/mock-data/legal-data";

export const metadata: Metadata = {
  title: "AI Automation for Legal Aid & Legal Operations",
  description:
    "Automate intake, client communication, and case operations for legal teams. Built to work with tools like LegalServer — so staff spend less time on admin and more on advocacy.",
  alternates: {
    canonical: "/industry/legal",
  },
  openGraph: {
    title: "AI Automation for Legal Aid & Legal Operations",
    description:
      "Automate intake, conflict checks, and client communication so your team can focus on advocacy.",
    url: "/industry/legal",
    images: [
      {
        url: "/industry/legal/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AutoCrew for Legal Professionals",
      },
    ],
  },
  other: {
    "article:published_time": "2026-04-07",
    "article:modified_time": "2026-04-07",
  },
};

export default function LegalIndustryPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(legalFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "AutoCrew for Legal",
          "AI-powered automation for legal aid, public interest, and legal operations. Intake screening, client communication, deadline and reporting workflows with LegalServer and Microsoft 365 integrations.",
          "AI Automation",
        )}
      />
      <JsonLd data={howToSchema(legalSteps)} />
      <LegalHero />
      <LegalPainPoints />
      <LegalFeatures />
      <LegalMetrics />
      <LegalHowItWorks />
      <LegalJusticeGap />
      <LegalFaq />
      <CrossIndustryLinks currentIndustry="Legal" />
      <LegalCta />
    </>
  );
}
