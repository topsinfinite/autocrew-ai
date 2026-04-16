import type { Metadata } from "next";
import {
  AiReceptionistHero,
  AiReceptionistProductStack,
  AiReceptionistPersonas,
  AiReceptionistPainStrip,
  AiReceptionistFlow,
  AiReceptionistOutcomes,
  AiReceptionistRollout,
  AiReceptionistDemo,
  AiReceptionistFaq,
  AiReceptionistIndustryBridge,
  AiReceptionistCta,
} from "@/components/product/ai-receptionist";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageSchema, serviceSchema, howToSchema } from "@/lib/seo/schemas";
import {
  aiReceptionistFaqItems,
  aiReceptionistMetadata,
  aiReceptionistRolloutSteps,
} from "@/lib/mock-data/ai-receptionist-data";

export const metadata: Metadata = {
  title: aiReceptionistMetadata.title,
  description: aiReceptionistMetadata.description,
  alternates: {
    canonical: "/ai-receptionist",
  },
  openGraph: {
    title: aiReceptionistMetadata.ogTitle,
    description: aiReceptionistMetadata.ogDescription,
    url: "/ai-receptionist",
    images: [
      {
        url: "/ai-receptionist/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Autocrew AI Receptionist — Sarah",
      },
    ],
  },
  other: {
    "article:published_time": "2026-04-16",
    "article:modified_time": "2026-04-16",
  },
};

const howToSteps = aiReceptionistRolloutSteps.map((s) => ({
  title: s.title,
  description: s.description,
}));

export default function AiReceptionistPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(aiReceptionistFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "Autocrew AI Receptionist (Sarah)",
          "AI receptionist for inbound calls: knowledge-grounded answers, scheduling, overflow coverage, and human handoff with context. HIPAA-aware options for healthcare customers.",
          "AI Receptionist",
        )}
      />
      <JsonLd data={howToSchema(howToSteps)} />
      <AiReceptionistHero />
      <AiReceptionistProductStack />
      <AiReceptionistPersonas />
      <AiReceptionistPainStrip />
      <AiReceptionistFlow />
      <AiReceptionistOutcomes />
      <AiReceptionistRollout />
      <AiReceptionistDemo />
      <AiReceptionistFaq />
      <AiReceptionistIndustryBridge />
      <AiReceptionistCta />
    </>
  );
}
