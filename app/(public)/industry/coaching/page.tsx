import type { Metadata } from "next";
import { CoachingHero } from "@/components/industry/coaching/coaching-hero";
import { CoachingSqueeze } from "@/components/industry/coaching/coaching-squeeze";
import { CoachingOutcomes } from "@/components/industry/coaching/coaching-outcomes";
import { CoachingAskStrip } from "@/components/industry/coaching/coaching-ask-strip";
import { CoachingHandoff } from "@/components/industry/coaching/coaching-handoff";
import { CoachingIntegrations } from "@/components/industry/coaching/coaching-integrations";
import { CoachingByRole } from "@/components/industry/coaching/coaching-by-role";
import { CoachingFaq } from "@/components/industry/coaching/coaching-faq";
import { CoachingCta } from "@/components/industry/coaching/coaching-cta";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo/schemas";
import { APP_CONFIG } from "@/lib/constants";
import { coachingFaqItems } from "@/lib/mock-data/coaching-data";

const baseUrl = APP_CONFIG.url;

export const metadata: Metadata = {
  title: "AI Automation for Coaches",
  description:
    "AI coordinator that handles discovery calls, intake, scheduling, payments, and follow-ups — across Calendly, Stripe, Notion, and Slack.",
  alternates: {
    canonical: "/industry/coaching",
  },
  openGraph: {
    title: "AI Automation for Coaches",
    description:
      "AI coordinator for coaching practices. Handles intake, scheduling, payments, and follow-ups across the tools you already use.",
    url: "/industry/coaching",
  },
};

export default function CoachingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "Industries", url: `${baseUrl}/#industries` },
          { name: "Coaching", url: `${baseUrl}/industry/coaching` },
        ])}
      />
      <JsonLd
        data={webPageSchema(
          `${baseUrl}/industry/coaching`,
          "AI Automation for Coaches",
          "2026-03-10",
          "2026-03-10",
        )}
      />
      <JsonLd data={faqPageSchema(coachingFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "Autocrew for Coaches",
          "AI coordinator for coaching practices. Handles discovery calls, intake, scheduling, payments, and follow-ups across the tools you already use — Calendly, Stripe, Notion, Slack, Zoom, and more.",
          "Coaching Automation",
        )}
      />
      <CoachingHero />
      <CoachingSqueeze />
      <CoachingOutcomes />
      <CoachingAskStrip />
      <CoachingHandoff />
      <CoachingIntegrations />
      <CoachingByRole />
      <CoachingFaq />
      <CrossIndustryLinks currentIndustry="Coaching" />
      <CoachingCta />
    </>
  );
}
