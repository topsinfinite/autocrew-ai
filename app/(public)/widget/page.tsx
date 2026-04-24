import type { Metadata } from "next";
import { WidgetHero } from "@/components/widget-landing/widget-hero";
import { WidgetSectionProblem } from "@/components/widget-landing/widget-section-problem";
import { WidgetSectionSurfaces } from "@/components/widget-landing/widget-section-surfaces";
import { WidgetSectionVoice } from "@/components/widget-landing/widget-section-voice";
import { WidgetSectionUseCases } from "@/components/widget-landing/widget-section-use-cases";
import { WidgetSectionProduction } from "@/components/widget-landing/widget-section-production";
import { WidgetSectionConfigure } from "@/components/widget-landing/widget-section-configure";

export const metadata: Metadata = {
  title: "AutoCrew Widget — Turn every button into a live conversation",
  description:
    "Five trigger surfaces. Zero forms. Embed AutoCrew on any site and let visitors reach your AI crew from any page, button, or link.",
  alternates: {
    canonical: "/widget",
  },
};

export default function WidgetLandingPage() {
  return (
    <>
      <WidgetHero />
      <WidgetSectionProblem />
      <WidgetSectionSurfaces />
      <WidgetSectionVoice />
      <WidgetSectionUseCases />
      <WidgetSectionProduction />
      <WidgetSectionConfigure />
    </>
  );
}
