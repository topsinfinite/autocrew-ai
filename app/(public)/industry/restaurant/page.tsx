import type { Metadata } from "next";
import { RestaurantHero } from "@/components/industry/restaurant/restaurant-hero";
import { RestaurantPainPoints } from "@/components/industry/restaurant/restaurant-pain-points";
import { RestaurantFeatures } from "@/components/industry/restaurant/restaurant-features";
import { RestaurantMetrics } from "@/components/industry/restaurant/restaurant-metrics";
import { RestaurantHowItWorks } from "@/components/industry/restaurant/restaurant-how-it-works";
import { RestaurantTestimonials } from "@/components/industry/restaurant/restaurant-testimonials";
import { RestaurantFaq } from "@/components/industry/restaurant/restaurant-faq";
import { RestaurantCta } from "@/components/industry/restaurant/restaurant-cta";
import { CrossIndustryLinks } from "@/components/seo/cross-industry-links";
import { JsonLd } from "@/components/seo/json-ld";
import {
  faqPageSchema,
  serviceSchema,
  reviewSchema,
  howToSchema,
} from "@/lib/seo/schemas";
import {
  restaurantFaqItems,
  restaurantTestimonialsData,
  restaurantSteps,
} from "@/lib/mock-data/restaurant-data";

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
    images: [
      {
        url: "/industry/restaurant/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AI Automation for Restaurants – AutoCrew",
      },
    ],
  },
  other: {
    "article:published_time": "2025-12-01",
    "article:modified_time": "2026-03-10",
  },
};

export default function RestaurantPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(restaurantFaqItems)} />
      <JsonLd
        data={serviceSchema(
          "AutoCrew for Restaurants",
          "AI-powered automation platform for restaurant professionals. Handles reservations, guest communication, review management, and operations 24/7.",
          "AI Automation",
        )}
      />
      <JsonLd data={reviewSchema(restaurantTestimonialsData.items)} />
      <JsonLd data={howToSchema(restaurantSteps)} />
      <RestaurantHero />
      <RestaurantPainPoints />
      <RestaurantFeatures />
      <RestaurantMetrics />
      <RestaurantHowItWorks />
      <RestaurantTestimonials />
      <RestaurantFaq />
      <CrossIndustryLinks currentIndustry="Restaurants" />
      <RestaurantCta />
    </>
  );
}
