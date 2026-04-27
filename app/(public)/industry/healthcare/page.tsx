import type { Metadata } from "next";
import { HealthcareHero } from "@/components/industry/healthcare/healthcare-hero";
import { HealthcareRevenueLeak } from "@/components/industry/healthcare/healthcare-revenue-leak";
import { HealthcareOutcomes } from "@/components/industry/healthcare/healthcare-outcomes";
import { HealthcareAskStrip } from "@/components/industry/healthcare/healthcare-ask-strip";
import { HealthcareHandoff } from "@/components/industry/healthcare/healthcare-handoff";
import { HealthcareCompliance } from "@/components/industry/healthcare/healthcare-compliance";
import { HealthcareByRole } from "@/components/industry/healthcare/healthcare-by-role";
import { HealthcareCta } from "@/components/industry/healthcare/healthcare-cta";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageSchema, serviceSchema } from "@/lib/seo/schemas";
import { healthcareFaqItems } from "@/lib/mock-data/healthcare-data";

export const metadata: Metadata = {
  title: "AI Automation for Healthcare Practices",
  description:
    "Autocrew answers your clinic's calls 24/7 — books appointments, completes intake, triages refills, and hands the rare exception cleanly to your team. HIPAA-aware, EHR-integrated.",
  alternates: {
    canonical: "/industry/healthcare",
  },
  openGraph: {
    title: "AI Automation for Healthcare Practices",
    description:
      "Recover the calls your front desk is sending to voicemail. HIPAA-aware AI receptionist for clinics, built around your EHR.",
    url: "/industry/healthcare",
  },
};

export default function HealthcareIndustryPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(healthcareFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "Autocrew for Healthcare",
          "HIPAA-aware AI receptionist for clinics and healthcare practices. Books appointments, triages refills, completes intake, and integrates with your EHR via FHIR R4.",
          "Healthcare Automation",
        )}
      />
      <HealthcareHero />
      <HealthcareRevenueLeak />
      <HealthcareOutcomes />
      <HealthcareAskStrip />
      <HealthcareHandoff />
      <HealthcareCompliance />
      <HealthcareByRole />
      <HealthcareCta />
      <CrossIndustryLinks currentIndustry="Healthcare" />
    </>
  );
}
