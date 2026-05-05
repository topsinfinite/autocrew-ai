import type { Metadata } from "next";
import { HomeServicesHero } from "@/components/industry/home-services/home-services-hero";
import { HomeServicesSqueeze } from "@/components/industry/home-services/home-services-squeeze";
import { HomeServicesOutcomes } from "@/components/industry/home-services/home-services-outcomes";
import { HomeServicesAskStrip } from "@/components/industry/home-services/home-services-ask-strip";
import { HomeServicesHandoff } from "@/components/industry/home-services/home-services-handoff";
import { HomeServicesIntegrations } from "@/components/industry/home-services/home-services-integrations";
import { HomeServicesByRole } from "@/components/industry/home-services/home-services-by-role";
import { HomeServicesFaq } from "@/components/industry/home-services/home-services-faq";
import { HomeServicesCta } from "@/components/industry/home-services/home-services-cta";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo/schemas";
import { APP_CONFIG } from "@/lib/constants";
import { homeServicesFaqItems } from "@/lib/mock-data/home-services-data";

const baseUrl = APP_CONFIG.url;

export const metadata: Metadata = {
  title: "AI Receptionist for Home Services: HVAC, Plumbing & Electrical",
  description:
    "AI dispatch coordinator for HVAC, plumbing, and electrical shops. 24/7 call coverage, emergency triage, and live dispatch into ServiceTitan, Housecall Pro, Jobber, and Workiz.",
  alternates: {
    canonical: "/industry/home-services",
  },
  openGraph: {
    title: "AI Receptionist for Home Services: HVAC, Plumbing & Electrical",
    description:
      "AI dispatch coordinator that triages emergencies, books routine intake, and dispatches live in your CRM — 24/7, across HVAC, plumbing, and electrical.",
    url: "/industry/home-services",
  },
};

export default function HomeServicesIndustryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "Industries", url: `${baseUrl}/#industries` },
          { name: "Home Services", url: `${baseUrl}/industry/home-services` },
        ])}
      />
      <JsonLd
        data={webPageSchema(
          `${baseUrl}/industry/home-services`,
          "AI Receptionist for Home Services: HVAC, Plumbing & Electrical",
          "2026-05-05",
          "2026-05-05",
        )}
      />
      <JsonLd data={faqPageSchema(homeServicesFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "Autocrew for Home Services",
          "AI dispatch coordinator for HVAC, plumbing, and electrical shops. Handles emergency triage, after-hours coverage, routine intake, and live dispatch — integrated with ServiceTitan, Housecall Pro, Jobber, Workiz, FieldEdge, and custom CRMs via webhook.",
          "Home Services Automation",
        )}
      />
      <HomeServicesHero />
      <HomeServicesSqueeze />
      <HomeServicesOutcomes />
      <HomeServicesAskStrip />
      <HomeServicesHandoff />
      <HomeServicesIntegrations />
      <HomeServicesByRole />
      <HomeServicesFaq />
      <CrossIndustryLinks currentIndustry="Home Services" />
      <HomeServicesCta />
    </>
  );
}
