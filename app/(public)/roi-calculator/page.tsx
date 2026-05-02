import type { Metadata } from "next";
import { RoiHero } from "@/components/roi-calculator/roi-hero";
import { RoiCalculator } from "@/components/roi-calculator/roi-calculator";
import { RoiAssumptions } from "@/components/roi-calculator/roi-assumptions";
import { RoiFaq } from "@/components/roi-calculator/roi-faq";
import { RoiCta } from "@/components/roi-calculator/roi-cta";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo/schemas";
import { APP_CONFIG } from "@/lib/constants";
import { roiCalculatorFaqItems } from "@/lib/mock-data/roi-calculator-data";

const baseUrl = APP_CONFIG.url;

export const metadata: Metadata = {
  title: "AI Receptionist ROI Calculator",
  description:
    "Plug in your call volume and see what an AI receptionist saves you in hours, labor cost, and after-hours leads — with conservative defaults you can defend.",
  alternates: {
    canonical: "/roi-calculator",
  },
  openGraph: {
    title: "AI Receptionist ROI Calculator",
    description:
      "See what Autocrew saves you in hours, dollars, and leads — live, on-page, with conservative defaults.",
    url: "/roi-calculator",
  },
};

export default function RoiCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "ROI Calculator", url: `${baseUrl}/roi-calculator` },
        ])}
      />
      <JsonLd
        data={webPageSchema(
          `${baseUrl}/roi-calculator`,
          "AI Receptionist ROI Calculator",
          "2026-05-02",
          "2026-05-02",
        )}
      />
      <JsonLd data={faqPageSchema(roiCalculatorFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "Autocrew AI Receptionist",
          "24/7 AI receptionist that answers every call, books meetings, escalates the sensitive ones, and rescues after-hours leads. Live in days on the phone numbers and tools you already use.",
          "AI Receptionist",
        )}
      />
      <RoiHero />
      <RoiCalculator />
      <RoiAssumptions />
      <RoiFaq />
      <RoiCta />
    </>
  );
}
