import type { Metadata } from "next";
import { LegalHero } from "@/components/industry/legal/legal-hero";
import { LegalSqueeze } from "@/components/industry/legal/legal-squeeze";
import { LegalOutcomes } from "@/components/industry/legal/legal-outcomes";
import { LegalAskStrip } from "@/components/industry/legal/legal-ask-strip";
import { LegalHandoff } from "@/components/industry/legal/legal-handoff";
import { LegalCompliance } from "@/components/industry/legal/legal-compliance";
import { LegalByRole } from "@/components/industry/legal/legal-by-role";
import { LegalFaq } from "@/components/industry/legal/legal-faq";
import { LegalCta } from "@/components/industry/legal/legal-cta";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageSchema, serviceSchema } from "@/lib/seo/schemas";
import { legalFaqItems } from "@/lib/mock-data/legal-data";

export const metadata: Metadata = {
  title: "AI Automation for Law Firms, Legal Ops & Legal Aid",
  description:
    "Autocrew handles intake, conflict screening, document collection, and routine client communication — so your attorneys stay on substantive work. Privilege-respecting, conflicts-aware, integrated with Clio / LegalServer / MyCase.",
  alternates: {
    canonical: "/industry/legal",
  },
  openGraph: {
    title: "AI Automation for Law Firms, Legal Ops & Legal Aid",
    description:
      "AI legal coordinator that handles intake, conflicts, and routine client comms — built around confidentiality and attorney-client privilege.",
    url: "/industry/legal",
  },
};

export default function LegalIndustryPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(legalFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "Autocrew for Legal",
          "AI legal coordinator for law firms, in-house teams, and legal aid programs. Handles pre-relationship intake, conflict screening, eligibility screening, document collection, and routine client communication — privilege-respecting, conflicts-aware, integrated with Clio, LegalServer, MyCase, PracticePanther, NetDocuments, and similar.",
          "Legal Automation",
        )}
      />
      <LegalHero />
      <LegalSqueeze />
      <LegalOutcomes />
      <LegalAskStrip />
      <LegalHandoff />
      <LegalCompliance />
      <LegalByRole />
      <LegalFaq />
      <CrossIndustryLinks currentIndustry="Legal" />
      <LegalCta />
    </>
  );
}
