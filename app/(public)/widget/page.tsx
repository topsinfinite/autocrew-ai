import type { Metadata } from "next";
import { WidgetHeroVariantSwitcher } from "@/components/widget-landing/widget-hero-variant-switcher";

export const metadata: Metadata = {
  title: "AutoCrew Widget — Turn every button into a live conversation",
  description:
    "Five trigger surfaces. Zero forms. Embed AutoCrew on any site and let visitors reach your AI crew from any page, button, or link.",
  alternates: {
    canonical: "/widget",
  },
};

export default function WidgetLandingPage() {
  return <WidgetHeroVariantSwitcher />;
}
