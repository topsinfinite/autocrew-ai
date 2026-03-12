import type { Metadata } from "next";
import { RestaurantHero } from "@/components/industry/restaurant/restaurant-hero";
import { RestaurantPainPoints } from "@/components/industry/restaurant/restaurant-pain-points";
import { RestaurantFeatures } from "@/components/industry/restaurant/restaurant-features";
import { RestaurantMetrics } from "@/components/industry/restaurant/restaurant-metrics";
import { RestaurantHowItWorks } from "@/components/industry/restaurant/restaurant-how-it-works";
import { RestaurantTestimonials } from "@/components/industry/restaurant/restaurant-testimonials";
import { RestaurantFaq } from "@/components/industry/restaurant/restaurant-faq";
import { RestaurantCta } from "@/components/industry/restaurant/restaurant-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageSchema } from "@/lib/seo/schemas";
import { restaurantFaqItems } from "@/lib/mock-data/restaurant-data";

export const metadata: Metadata = {
  title: "AI Automation for Restaurants – AutoCrew",
  description:
    "Fill every seat with AI-powered reservations, guest communication, and review management. Save 15+ hours per week on admin. Start your free trial.",
  alternates: {
    canonical: "/industry/restaurant",
  },
  openGraph: {
    title: "AI Automation for Restaurants – AutoCrew",
    description:
      "Fill every seat with AI-powered reservations, guest communication, and review management. Save 15+ hours per week on admin.",
    url: "/industry/restaurant",
  },
};

export default function RestaurantPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(restaurantFaqItems)} />
      <RestaurantHero />
      <RestaurantPainPoints />
      <RestaurantFeatures />
      <RestaurantMetrics />
      <RestaurantHowItWorks />
      <RestaurantTestimonials />
      <RestaurantFaq />
      <RestaurantCta />
    </>
  );
}
