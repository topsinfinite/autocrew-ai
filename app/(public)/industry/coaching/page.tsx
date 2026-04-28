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
import { faqPageSchema, serviceSchema } from "@/lib/seo/schemas";
import { coachingFaqItems } from "@/lib/mock-data/coaching-data";

export const metadata: Metadata = {
  title: "AI Automation for Coaches",
  description:
    "Autocrew handles discovery calls, intake, scheduling, payments, and follow-ups in the background — so the work you actually trained for stops getting interrupted. Plugs into Calendly, Stripe, Notion, Slack.",
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
