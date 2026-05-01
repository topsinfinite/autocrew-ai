import type { Metadata } from "next";
import { WidgetHero } from "@/components/widget-landing/widget-hero";
import { WidgetSectionProblem } from "@/components/widget-landing/widget-section-problem";
import { WidgetSectionSurfaces } from "@/components/widget-landing/widget-section-surfaces";
import { WidgetSectionVoice } from "@/components/widget-landing/widget-section-voice";
import { WidgetSectionUseCases } from "@/components/widget-landing/widget-section-use-cases";
import { WidgetSectionProduction } from "@/components/widget-landing/widget-section-production";
import { WidgetSectionConfigure } from "@/components/widget-landing/widget-section-configure";
import { WidgetSectionInstall } from "@/components/widget-landing/widget-section-install";
import { WidgetSectionCompare } from "@/components/widget-landing/widget-section-compare";
import { WidgetSectionCta } from "@/components/widget-landing/widget-section-cta";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo/schemas";
import { APP_CONFIG } from "@/lib/constants";

const baseUrl = APP_CONFIG.url;

export const metadata: Metadata = {
  title: "AutoCrew Widget — Turn every button into a live conversation",
  description:
    "Five trigger surfaces. Zero forms. Embed AutoCrew on any site and let visitors reach your AI crew from any page, button, or link.",
  alternates: {
    canonical: "/widget",
  },
  openGraph: {
    title: "AutoCrew Widget — Turn every button into a live conversation",
    description:
      "Five trigger surfaces. Zero forms. Embed AutoCrew on any site and let visitors reach your AI crew from any page, button, or link.",
    url: "/widget",
  },
};

export default function WidgetLandingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "Widget", url: `${baseUrl}/widget` },
        ])}
      />
      <JsonLd
        data={webPageSchema(
          `${baseUrl}/widget`,
          "AutoCrew Widget",
          "2026-04-16",
          "2026-04-16",
        )}
      />
      <JsonLd
        data={serviceSchema(
          "AutoCrew Widget",
          "Embeddable AI conversation widget with five trigger surfaces (button, link, page, intent, intent-with-data). Turns any page or button into a live AI-driven conversation — no forms, no friction.",
          "Embeddable Widget",
        )}
      />
      <WidgetHero />
      <WidgetSectionProblem />
      <WidgetSectionSurfaces />
      <WidgetSectionVoice />
      <WidgetSectionUseCases />
      <WidgetSectionProduction />
      <WidgetSectionConfigure />
      <WidgetSectionInstall />
      <WidgetSectionCompare />
      <WidgetSectionCta />
    </>
  );
}
