import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    slug: "ai-automation",
    label: "AI & Automation",
    description: "How AI crews are reshaping the way businesses run day-to-day operations.",
  },
  {
    slug: "customer-service",
    label: "Customer Service",
    description: "Strategies, tools, and case studies for delivering exceptional customer experiences.",
  },
  {
    slug: "healthcare",
    label: "Healthcare",
    description: "AI automation for medical practices, dental clinics, and healthcare providers.",
    industryRoute: "/industry/healthcare",
  },
  {
    slug: "coaching",
    label: "Coaching",
    description: "How coaches and consultants use AI to reduce no-shows and grow their practice.",
    industryRoute: "/industry/coaching",
  },
  {
    slug: "legal",
    label: "Legal",
    description: "AI intake, after-hours coverage, and client communication for law firms.",
    industryRoute: "/industry/legal",
  },
  {
    slug: "restaurants",
    label: "Restaurants",
    description: "Reservation management, after-hours calls, and customer follow-ups for restaurants.",
    industryRoute: "/industry/restaurant",
  },
  {
    slug: "playbooks",
    label: "Playbooks",
    description: "Step-by-step automation playbooks you can deploy with Autocrew today.",
  },
  {
    slug: "news",
    label: "News & Updates",
    description: "Product updates and announcements from the Autocrew team.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryLabel(slug: string): string {
  return getCategory(slug)?.label ?? slug;
}
