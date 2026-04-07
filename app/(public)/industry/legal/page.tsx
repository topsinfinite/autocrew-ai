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
  title: "AI Automation for Law Firms, Legal Ops & Legal Aid",
  description:
    "Automate intake, client communication, and case operations across the legal industry. Works with Clio, LegalServer, MyCase, PracticePanther, and similar CMS platforms — less admin, more substantive legal work.",
  alternates: {
    canonical: "/industry/legal",
  },
  openGraph: {
    title: "AI Automation for Law Firms, Legal Ops & Legal Aid",
    description:
      "Automate intake, conflict checks, and client communication for firms, in-house teams, and legal aid — more time for real legal work.",
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
          "AI-powered automation for law firms, corporate legal, and legal aid. Intake screening, client communication, deadlines, and reporting — integrated with leading case management platforms (Clio, LegalServer, MyCase, PracticePanther, and similar) plus Microsoft 365 and Google Workspace.",
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
