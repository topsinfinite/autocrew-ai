import type { Metadata } from "next";
import { RestaurantHero } from "@/components/industry/restaurant/restaurant-hero";
import { RestaurantSqueeze } from "@/components/industry/restaurant/restaurant-squeeze";
import { RestaurantOutcomes } from "@/components/industry/restaurant/restaurant-outcomes";
import { RestaurantAskStrip } from "@/components/industry/restaurant/restaurant-ask-strip";
import { RestaurantHandoff } from "@/components/industry/restaurant/restaurant-handoff";
import { RestaurantIntegrations } from "@/components/industry/restaurant/restaurant-integrations";
import { RestaurantByRole } from "@/components/industry/restaurant/restaurant-by-role";
import { RestaurantFaq } from "@/components/industry/restaurant/restaurant-faq";
import { RestaurantCta } from "@/components/industry/restaurant/restaurant-cta";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo/schemas";
import { APP_CONFIG } from "@/lib/constants";
import { restaurantFaqItems } from "@/lib/mock-data/restaurant-data";

const baseUrl = APP_CONFIG.url;

export const metadata: Metadata = {
  title: "AI Automation for Restaurants",
  description:
    "Autocrew answers your reservation line during the dinner rush, books the table, sends the confirmation, and flags the VIP — so your team stays in the room. Plugs into OpenTable, Resy, Toast, and Google.",
  alternates: {
    canonical: "/industry/restaurant",
  },
  openGraph: {
    title: "AI Automation for Restaurants",
    description:
      "AI host that handles reservations, no-show recovery, VIP capture, and review responses across the booking, POS, and review tools you already use.",
    url: "/industry/restaurant",
  },
};

export default function RestaurantPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "Industries", url: `${baseUrl}/#industries` },
          { name: "Restaurant", url: `${baseUrl}/industry/restaurant` },
        ])}
      />
      <JsonLd
        data={webPageSchema(
          `${baseUrl}/industry/restaurant`,
          "AI Automation for Restaurants",
          "2026-03-10",
          "2026-03-10",
        )}
      />
      <JsonLd data={faqPageSchema(restaurantFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "Autocrew for Restaurants",
          "AI host for restaurants — handles reservations, confirmations, no-show recovery, VIP and allergy capture, and review responses across the booking, POS, and review tools you already use (OpenTable, Resy, SevenRooms, Toast, Square, Google, Yelp, TripAdvisor).",
          "Restaurant Automation",
        )}
      />
      <RestaurantHero />
      <RestaurantSqueeze />
      <RestaurantOutcomes />
      <RestaurantAskStrip />
      <RestaurantHandoff />
      <RestaurantIntegrations />
      <RestaurantByRole />
      <RestaurantFaq />
      <CrossIndustryLinks currentIndustry="Restaurants" />
      <RestaurantCta />
    </>
  );
}
