import type { StatItem, Step } from "@/lib/mock-data/landing-data";
import type { FAQItem } from "@/lib/mock-data/docs-content";

// Restaurant Hero Data
export const restaurantHeroData = {
  badge: "For Restaurant Professionals",
  headline: {
    prefix: "Fill Every Seat",
    accent: "Without the Phone Tag",
  },
  subheadline:
    "AI-powered automation handles reservations, guest follow-ups, and review management — so you can focus on the experience only you can create.",
  primaryCta: {
    text: "Start Free Trial",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "See how it works",
    href: "#how-it-works",
  },
  trustText: "15+ Hours Saved Weekly  ·  30% Fewer No-Shows  ·  Setup in Days",
  workflowSteps: [
    { label: "Guest Calls", icon: "Phone" },
    { label: "AI Books", icon: "BotMessageSquare" },
    { label: "You Host", icon: "UtensilsCrossed" },
  ],
};

// Pain Points Data
export interface RestaurantPainPoint {
  title: string;
  description: string;
  icon: string;
}

export const restaurantPainPointsData = {
  badge: "The Restaurant Challenge",
  headline: "Great Restaurants Shouldn't Lose Guests to Voicemail",
  subheadline:
    "The average restaurant misses 30% of incoming calls during peak hours — every missed call is a lost reservation, a lost guest, lost revenue.",
  items: [
    {
      title: "Missed Calls, Lost Revenue",
      description:
        "Peak hours mean unanswered phones. Walk-ins get priority while callers hang up and book somewhere else.",
      icon: "PhoneOff",
    },
    {
      title: "No-Show Nightmares",
      description:
        "Empty tables from no-shows cost the average restaurant $1,500/month. Manual confirmation calls eat into prep time.",
      icon: "CalendarX2",
    },
    {
      title: "Review Response Overload",
      description:
        "Dozens of reviews across Google, Yelp, and TripAdvisor pile up. Unanswered reviews hurt your rating and your reputation.",
      icon: "Star",
    },
  ] as RestaurantPainPoint[],
};

// Features Data (3 Pillars)
export interface RestaurantFeature {
  title: string;
  description: string;
  icon: string;
  bullets: string[];
}

export const restaurantFeaturesData = {
  badge: "Your AI-Powered Crew",
  headline: {
    prefix: "Automation That Understands",
    accent: "the Restaurant Business",
  },
  items: [
    {
      title: "24/7 Reservation Management",
      description:
        "An AI booking agent that handles calls, online reservations, waitlist management, and confirmation texts automatically.",
      icon: "CalendarCheck",
      bullets: [
        "Automatic confirmation & reminders",
        "Smart waitlist management",
        "No-show prediction & follow-up",
        "Syncs with OpenTable, Resy & Google",
      ],
    },
    {
      title: "Intelligent Guest Communication",
      description:
        "AI that responds to inquiries, sends personalized follow-ups, and manages review responses across all platforms.",
      icon: "MessageSquare",
      bullets: [
        "Instant inquiry responses",
        "Post-visit thank-you messages",
        "Review response drafting",
        "Birthday & anniversary outreach",
      ],
    },
    {
      title: "Smart Operations Assistant",
      description:
        "AI that tracks orders, manages staff scheduling reminders, and surfaces actionable insights from your guest data.",
      icon: "ClipboardList",
      bullets: [
        "Peak hour staffing alerts",
        "Menu performance insights",
        "Guest preference tracking",
        "Online order coordination",
      ],
    },
  ] as RestaurantFeature[],
};

// Metrics Data
export const restaurantMetrics: StatItem[] = [
  {
    value: "15+",
    label: "Hours Saved",
    sublabel: "Per week on admin tasks",
  },
  {
    value: "30%",
    label: "Fewer No-Shows",
    sublabel: "With automated confirmations",
  },
  {
    value: "$4.20",
    label: "ROI per $1",
    sublabel: "Average return on investment",
  },
  {
    value: "30",
    label: "Day Results",
    sublabel: "See measurable impact fast",
  },
];

// How It Works Steps
export const restaurantSteps: Step[] = [
  {
    number: "01",
    title: "Tell Us About Your Restaurant",
    description:
      "Share your cuisine, service style, and hours. We configure your AI crew to match your brand voice.",
  },
  {
    number: "02",
    title: "Connect Your Tools",
    description:
      "Link your reservation system, POS, and review platforms. Autocrew integrates with OpenTable, Toast, Google, and more.",
  },
  {
    number: "03",
    title: "Go Live in Days",
    description:
      "Your AI crew starts handling reservations, guest communication, and reviews. You focus on hospitality.",
  },
  {
    number: "04",
    title: "Grow With Confidence",
    description:
      "Use analytics to see what's working. Fill more seats without adding more staff.",
  },
];

// Testimonials Data
export interface RestaurantTestimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
}

export const restaurantTestimonialsData = {
  badge: "Trusted by Restaurants",
  headline: "Restaurants That've Made the Shift",
  items: [
    {
      quote:
        "We were missing 40% of dinner reservation calls during Friday rush. Autocrew now handles every call — our covers are up 25%.",
      name: "Marco T.",
      role: "Owner, Italian Bistro",
      initials: "MT",
      avatarColor: "from-[#FF6B35] to-[#FF8C5A]",
    },
    {
      quote:
        "Responding to reviews used to take me an hour every morning. Now it's automated and our Google rating went from 4.1 to 4.5 stars.",
      name: "Lisa W.",
      role: "General Manager, Farm-to-Table",
      initials: "LW",
      avatarColor: "from-blue-500 to-blue-600",
    },
    {
      quote:
        "No-shows dropped from 18% to under 8% in two months. The automated confirmation texts are a game-changer.",
      name: "James O.",
      role: "Restaurant Group Director",
      initials: "JO",
      avatarColor: "from-emerald-500 to-emerald-600",
    },
  ] as RestaurantTestimonial[],
};

// FAQ Data
export const restaurantFaqItems: FAQItem[] = [
  {
    question: "Will guests feel like they're talking to a robot?",
    answer:
      "Not at all. Autocrew uses natural language that matches your restaurant's brand voice. Guests get fast, friendly responses — and the AI seamlessly escalates to your team when a personal touch is needed.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most restaurants are fully live within 3–5 days. Our team handles the configuration, connects your tools, and walks you through everything. No technical expertise required.",
  },
  {
    question: "Does it work with my existing reservation system?",
    answer:
      "Yes. Autocrew integrates with OpenTable, Resy, Yelp Reservations, Google Reserve, Toast, and more. We're adding new integrations regularly.",
  },
  {
    question: "Can it handle special requests and dietary accommodations?",
    answer:
      "Absolutely. The AI captures and flags special requests, allergies, dietary restrictions, and occasions like anniversaries — so your team is prepared before the guest arrives.",
  },
  {
    question: "What about walk-ins and phone orders?",
    answer:
      "AI manages phone reservations and takeout orders while your host handles walk-ins in person. It's designed to complement your FOH team, not replace them.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. We offer a 14-day free trial with full feature access. No credit card required. Start automating your restaurant today and see the difference.",
  },
];

// CTA Data
export const restaurantCtaData = {
  headline: {
    line1: "Stop Missing Calls.",
    line2: "Start Filling Tables.",
  },
  subheadline:
    "Join restaurants that've reclaimed 15+ hours per week. Start your free trial today.",
  primaryCta: {
    text: "Start Free Trial",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "Book a Demo",
    href: "/contact",
  },
};
