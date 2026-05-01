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
import {
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo/schemas";
import { APP_CONFIG } from "@/lib/constants";
import {
  aiReceptionistFaqItems,
  aiReceptionistMetadata,
  aiReceptionistRolloutSteps,
} from "@/lib/mock-data/ai-receptionist-data";

const baseUrl = APP_CONFIG.url;

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
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "AI Receptionist", url: `${baseUrl}/ai-receptionist` },
        ])}
      />
      <JsonLd
        data={webPageSchema(
          `${baseUrl}/ai-receptionist`,
          aiReceptionistMetadata.title,
          "2026-04-16",
          "2026-04-16",
        )}
      />
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
