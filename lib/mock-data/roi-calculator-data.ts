import type { FAQItem } from "@/lib/mock-data/docs-content";
import type { RoiInputs } from "@/lib/roi/calculate";

/**
 * Content for the public ROI calculator page.
 *
 * Voice mirrors the coaching/healthcare pages: concrete nouns, no fabricated
 * benchmarks, no stock testimonials. The methodology section reads its
 * percentages directly from `lib/roi/calculate.ts` constants — do not
 * duplicate numbers here.
 */

export const roiCalculatorHero = {
  status: {
    location: "Built on every call you currently miss",
    role: "Sarah · AI Receptionist",
    coverage: "24/7",
    standard: "Live in days",
  },
  badges: [
    { label: "Conservative defaults", icon: "shield" as const },
    { label: "No email required", icon: "plug" as const },
  ],
  headline: {
    prefix: "Your phone, answered.",
    accent: "Your math, settled.",
  },
  subheadline:
    "Plug in your call volume and we'll show you what stops costing you — in hours, dollars, and leads that no longer go to voicemail.",
} as const;

export type RoiInputField = {
  key: keyof RoiInputs;
  label: string;
  helper: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
};

export const roiInputFields: RoiInputField[] = [
  {
    key: "monthlyVolume",
    label: "Monthly inbound calls & inquiries",
    helper:
      "Total calls landing on your line each month — booked, missed, or voicemailed.",
    unit: "calls / mo",
    min: 100,
    max: 10000,
    step: 50,
    suffix: "calls",
  },
  {
    key: "handleTimeMin",
    label: "Average handle time",
    helper:
      "Minutes a person spends per call, including wrap-up notes and CRM entry.",
    unit: "min / call",
    min: 1,
    max: 20,
    step: 1,
    suffix: "min",
  },
  {
    key: "hourlyCost",
    label: "Fully-loaded staff cost",
    helper:
      "Hourly cost of whoever answers the phone today — wage, benefits, and overhead.",
    unit: "$ / hour",
    min: 15,
    max: 80,
    step: 1,
    prefix: "$",
    suffix: "/ hr",
  },
  {
    key: "afterHoursPct",
    label: "Calls outside business hours",
    helper:
      "Share of inquiries that land at night, weekends, or while staff are with customers.",
    unit: "%",
    min: 0,
    max: 60,
    step: 1,
    suffix: "%",
  },
  {
    key: "avgLeadValue",
    label: "Average value of a converted lead",
    helper:
      "First-purchase or first-month value — keep it conservative if your sales cycle is long.",
    unit: "$ / customer",
    min: 0,
    max: 10000,
    step: 50,
    prefix: "$",
  },
];

export const roiCalculatorDefaults: RoiInputs = {
  monthlyVolume: 800,
  handleTimeMin: 4,
  hourlyCost: 28,
  afterHoursPct: 25,
  avgLeadValue: 350,
};

export const roiResultTiles = [
  {
    key: "hoursSavedPerMonth" as const,
    eyebrow: "Time recovered",
    label: "Hours saved / month",
    sublabel: "Routine call work Autocrew handles end-to-end.",
  },
  {
    key: "laborCostSavedPerYear" as const,
    eyebrow: "Labor cost",
    label: "Saved / year",
    sublabel: "Hourly cost × hours recovered, annualized.",
  },
  {
    key: "afterHoursLeadsCapturedPerMonth" as const,
    eyebrow: "Pipeline",
    label: "After-hours leads / month",
    sublabel: "Inquiries that no longer go to voicemail.",
  },
  {
    key: "revenueUpliftPerYear" as const,
    eyebrow: "Revenue lift",
    label: "Captured / year",
    sublabel: "Recovered leads × your conversion × deal value.",
  },
];

export const roiAssumptionsContent = {
  eyebrow: "How we got the number",
  heading: "Two assumptions, both intentionally conservative.",
  intro:
    "We don't want a spreadsheet that overpromises. The model is simple on purpose — two constants do all the heavy lifting, both calibrated below what we actually see in production deployments.",
  notes: [
    "Volume × handle time gives us the labor footprint of your phone today.",
    "After-hours share × deflection × your conversion rate gives us the revenue you're currently leaving on voicemail.",
    "Everything is annualized at 12 months. Currency is USD. No taxes, no discounting.",
  ],
} as const;

export const roiCalculatorFaqItems: FAQItem[] = [
  {
    question: "Where does the 70% deflection assumption come from?",
    answer:
      "It's the conservative end of what we see across live Autocrew deployments handling appointment booking, status checks, FAQs, and intake. Practices with cleaner workflows often run higher; we'd rather under-promise on the page and over-deliver in your account.",
  },
  {
    question: "Why a 25% conversion rate on after-hours leads?",
    answer:
      "Industry benchmarks for inbound phone leads land between 25–40%. We use the bottom of that range so the revenue-uplift number stays defensible even if your sales cycle is messy. Swap your own number once you've seen 30 days of data.",
  },
  {
    question: "Does this include the cost of Autocrew?",
    answer:
      "No. We surface gross savings and gross revenue captured so you can compare them against any quote we send you. Net ROI is a one-line subtraction — happy to walk through it on a demo.",
  },
  {
    question: "What if my call volume is lumpy?",
    answer:
      "The model is monthly-average, which is the right unit for capacity planning. If your volume swings 3× during launch weeks or open enrollment, the savings number is roughly accurate over the year and the after-hours number is conservative — Autocrew absorbs spikes without overtime.",
  },
  {
    question: "How is this different from just hiring a virtual assistant?",
    answer:
      "A VA gives you a person for a fixed window of hours; Autocrew gives you 24/7 coverage that scales with volume. The math here is one-to-one with that comparison: replace fixed hourly cost with always-on capacity, capture the after-hours leads a VA's schedule would still miss.",
  },
  {
    question: "Can I send myself a copy of this calculation?",
    answer:
      "Not yet — v1 keeps everything on-page so there's no friction. Screenshot the results, or open the live widget on this page and ask Sarah to walk a teammate through your numbers.",
  },
];

export const roiCalculatorCta = {
  badges: [
    { label: "Conservative model", value: "70% deflection · 25% conversion" },
    { label: "Setup", value: "Days, not weeks" },
  ],
  headline: {
    line1: "Stop Paying for",
    line2: "Calls You Already Miss.",
  },
  subheadline:
    "Pick up the line and ask Sarah a real question — she'll answer the same way she would for one of your customers. When the math lines up, book a demo and we'll wire her into your stack.",
  contact: {
    email: {
      eyebrow: "Send us an email",
      address: "support@autocrew-ai.com",
    },
    demo: {
      eyebrow: "Schedule a demo",
      cta: { text: "Book a demo", href: "/contact" },
    },
    try: {
      eyebrow: "Talk to Sarah right now",
      voiceCta: { text: "Talk to Sarah live" },
      memberLink: {
        text: "Already a member? Sign in",
        href: "https://app.autocrew-ai.com/login",
      },
    },
  },
  brand: {
    blurb:
      "AI receptionist that answers every call, books the meeting, escalates the sensitive ones, and never sleeps. Live in days on the phone numbers and tools you already use.",
  },
} as const;
