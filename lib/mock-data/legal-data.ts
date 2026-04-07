import type { StatItem, Step } from "@/lib/mock-data/landing-data";
import type { FAQItem } from "@/lib/mock-data/docs-content";

export const legalHeroData = {
  badge: "For Legal Professionals",
  headline: {
    prefix: "Close the Justice Gap",
    accent: "Without Burning Out Your Team",
  },
  subheadline:
    "AI-powered automation handles client intake, conflict checks, and case communication — so your team can focus on the advocacy only humans can deliver.",
  primaryCta: {
    text: "Start Free Trial",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "See how it works",
    href: "#how-it-works",
  },
  trustText:
    "Less routine intake work  ·  Fewer status-update loops  ·  Guided setup with your team",
  workflowSteps: [
    { label: "Client Applies", icon: "FileText" },
    { label: "AI Screens", icon: "BotMessageSquare" },
    { label: "You Advocate", icon: "Scale" },
  ],
};

export interface LegalPainPoint {
  title: string;
  description: string;
  icon: string;
}

export const legalPainPointsData = {
  badge: "The Legal Aid Challenge",
  headline: "Great Advocates Shouldn't Be Buried in Intake Queues",
  subheadline:
    "Legal aid organizations routinely turn away about half of eligible requests when capacity runs short — every delayed response is access to justice on hold.",
  items: [
    {
      title: "Intake Overload",
      description:
        "High volumes of calls, walk-ins, and online applications overwhelm your team. Eligible clients wait while staff manually screens and re-screens.",
      icon: "Users",
    },
    {
      title: "Missed Deadlines & Conflicts",
      description:
        "Statute of limitations, court dates, and filing deadlines slip through the cracks. Conflict checks happen late or get skipped under pressure.",
      icon: "CalendarX2",
    },
    {
      title: "Administrative Burnout",
      description:
        "Document assembly, status updates, grant reporting, and data entry consume the hours your team needs for actual legal work.",
      icon: "Clock",
    },
  ] as LegalPainPoint[],
};

export interface LegalFeature {
  title: string;
  description: string;
  icon: string;
  bullets: string[];
}

export const legalFeaturesData = {
  badge: "Your AI-Powered Crew",
  headline: {
    prefix: "Automation That Understands",
    accent: "the Legal Practice",
  },
  items: [
    {
      title: "24/7 Smart Intake & Screening",
      description:
        "An AI intake agent that screens applicants, checks eligibility, collects documents, and runs conflict checks — before a human ever touches the case.",
      icon: "UserCheck",
      bullets: [
        "Automated eligibility screening",
        "Conflict check integration",
        "Document collection & verification",
        "LegalServer case creation",
      ],
    },
    {
      title: "Automated Client Communication",
      description:
        "AI that sends case status updates, appointment reminders, document requests, and follow-ups in plain language across SMS, email, and web.",
      icon: "MessageSquare",
      bullets: [
        "Multilingual client updates",
        "Appointment reminders & rescheduling",
        "Document request follow-ups",
        "Smart escalation to attorneys",
      ],
    },
    {
      title: "Intelligent Case Operations",
      description:
        "AI that tracks deadlines, automates document assembly, surfaces reporting metrics, and keeps your team focused on high-impact work.",
      icon: "ClipboardList",
      bullets: [
        "Deadline & statute tracking",
        "Document assembly automation",
        "Grant reporting metrics",
        "Calendar & scheduling sync",
      ],
    },
  ] as LegalFeature[],
};

export const legalMetrics: StatItem[] = [
  {
    value: "More time",
    label: "For advocacy",
    sublabel: "Shift effort from intake and admin to client-facing work",
  },
  {
    value: "Smoother",
    label: "Intake flow",
    sublabel: "Screen, gather documents, and route cases with less backlog",
  },
  {
    value: "Less",
    label: "Manual drag",
    sublabel: "Automate follow-ups, reminders, and repeatable legal ops",
  },
  {
    value: "Guided",
    label: "Rollout",
    sublabel: "We help connect your stack and go live with your team",
  },
];

export const legalSteps: Step[] = [
  {
    number: "01",
    title: "Tell Us About Your Practice",
    description:
      "Share your practice areas, eligibility criteria, and workflows. We configure your AI crew to match your organization's needs.",
  },
  {
    number: "02",
    title: "Connect Your Tools",
    description:
      "Link LegalServer, your calendar, email, and document systems. AutoCrew integrates with LegalServer, Microsoft 365, Google Workspace, and more.",
  },
  {
    number: "03",
    title: "Go Live in Days",
    description:
      "Your AI crew starts handling intake screening, client communication, and case operations. Your team focuses on advocacy.",
  },
  {
    number: "04",
    title: "Scale With Confidence",
    description:
      "Use analytics to track intake volume, case outcomes, and grant metrics. Serve more clients without adding more staff.",
  },
];

export interface LegalJusticeGapStat {
  value: string;
  description: string;
  sourceNote: string;
}

export const legalJusticeGapData = {
  badge: "The Justice Gap",
  headline: "The Numbers Speak for Themselves",
  subheadline:
    "Data from the Legal Services Corporation’s Justice Gap Study and related LSC research.",
  closing:
    "Technology won't close this gap alone — but it can free your team to help the people who need it most.",
  sourceUrl: "https://justicegap.lsc.gov/",
  sourceLinkText: "justicegap.lsc.gov",
  items: [
    {
      value: "92%",
      description:
        "of low-income Americans’ substantial civil legal problems receive inadequate or no legal help.",
      sourceNote: "LSC Justice Gap Measurement Survey",
    },
    {
      value: "1 in 2",
      description:
        "requests to LSC-funded legal aid organizations are turned away due to limited resources. LSC estimates roughly 1.4 million brought problems go without adequate help each year.",
      sourceNote: "LSC Intake Census (eligible problems)",
    },
    {
      value: "50M",
      description:
        "people have household income below 125% of the federal poverty line. In LSC’s survey, 74% of low-income households experienced one or more civil legal problems in the prior year.",
      sourceNote: "U.S. Census / LSC Justice Gap Study",
    },
  ] as LegalJusticeGapStat[],
};

export const legalFaqItems: FAQItem[] = [
  {
    question: "Will AI replace the human judgment in our legal work?",
    answer:
      "No. AI handles screening, scheduling, and admin. Legal decisions, case acceptance, and advice stay with your attorneys. AI is a force multiplier, not a replacement.",
  },
  {
    question: "How does it integrate with LegalServer?",
    answer:
      "AutoCrew connects via LegalServer’s API to create and search matters, run conflict checks aligned with your workflows, sync calendars, and pull reporting data where your site allows. Setup is handled by our team — no coding required on your side.",
  },
  {
    question: "Is client data secure and confidential?",
    answer:
      "We use encryption in transit and at rest and design around legal-industry expectations for sensitive data. We don’t use your client data to train public models. Your org controls access and retention policies.",
  },
  {
    question: "Can we customize intake screening criteria?",
    answer:
      "Yes. Configure eligibility by practice area, income thresholds, geography, case type, and more — and adjust without engineering.",
  },
  {
    question: "What about attorney–client privilege?",
    answer:
      "Intake automation can be scoped to pre‑relationship screening and routing so privileged communications stay in your existing channels once a matter is opened. Final architecture should be reviewed with your counsel.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. We offer a 14-day free trial with full feature access. No credit card required.",
  },
];

export const legalCtaData = {
  headline: {
    line1: "Stop Drowning in Admin.",
    line2: "Start Advocating More.",
  },
  subheadline:
    "Spend less energy on admin and more on the cases that matter. Start your free trial today.",
  primaryCta: {
    text: "Start Free Trial",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "Book a Demo",
    href: "/contact",
  },
};
