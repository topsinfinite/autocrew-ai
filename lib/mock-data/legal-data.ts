import type { StatItem, Step } from "@/lib/mock-data/landing-data";
import type { FAQItem } from "@/lib/mock-data/docs-content";

export const legalHeroData = {
  badge: "For Legal Professionals",
  headline: {
    prefix: "Less admin.",
    accent: "More counsel.",
  },
  subheadline:
    "Autocrew handles intake, conflicts, and client comms — so your team stays on strategy, deals, and advocacy. Works for firms, legal ops, and in-house; legal aid teams get the same relief on eligibility and volume.",
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
    { label: "Matter intake", icon: "FileText" },
    { label: "AI handles routine", icon: "BotMessageSquare" },
    { label: "You deliver counsel", icon: "Scale" },
  ],
};

export interface LegalPainPoint {
  title: string;
  description: string;
  icon: string;
}

export const legalPainPointsData = {
  badge: "The Legal Operations Challenge",
  headline: "Great Lawyers Shouldn't Be Buried in Intake and Admin",
  subheadline:
    "From AmLaw firms to solo practice and legal aid — the pattern repeats: demand grows, headcount doesn’t, and every delayed response kills throughput. Legal aid programs also turn away many eligible matters when capacity runs short; the bottleneck is universal.",
  items: [
    {
      title: "Intake Overload",
      description:
        "Calls, walk-ins, portals, and referrals pile up. Prospects and clients wait while staff manually qualify, triage, and chase documents — whether you’re fee-for-service, corporate, or pro bono.",
      icon: "Users",
    },
    {
      title: "Missed Deadlines & Conflicts",
      description:
        "Statutes, court dates, and filing windows don’t negotiate. Conflict checks stall when data sits in inboxes or spreadsheets instead of your matter system.",
      icon: "CalendarX2",
    },
    {
      title: "Administrative Burnout",
      description:
        "Document prep, status pings, billing admin, and compliance reporting eat the hours you need for real legal work — including grant and funder reporting where it applies.",
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
        "An AI intake layer that qualifies new matters, runs conflict checks, collects documents, and routes work — before a human has to touch the file. Legal aid teams can still apply eligibility rules; firms can match intake to practice areas and fee structures.",
      icon: "UserCheck",
      bullets: [
        "Configurable screening (including legal aid eligibility)",
        "Conflict check integration",
        "Document collection & verification",
        "Sync to your CMS (Clio, LegalServer, MyCase, PracticePanther, and similar)",
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
        "AI that tracks deadlines, automates document assembly, surfaces metrics, and keeps your team focused on high-impact work.",
      icon: "ClipboardList",
      bullets: [
        "Deadline & statute tracking",
        "Document assembly automation",
        "Matter reporting & KPIs (including grant metrics where you use them)",
        "Calendar & scheduling sync",
      ],
    },
  ] as LegalFeature[],
};

export const legalMetrics: StatItem[] = [
  {
    value: "More time",
    label: "For substantive work",
    sublabel:
      "Shift effort from intake and admin to matters clients pay for — or to cases legal aid can actually open",
  },
  {
    value: "Smoother",
    label: "Intake flow",
    sublabel: "Qualify, gather documents, and route matters with less backlog",
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
      "Share practice areas, matter types, SLAs, and workflows — including eligibility rules for legal aid. We configure your AI crew to match how you work.",
  },
  {
    number: "02",
    title: "Connect Your Tools",
    description:
      "Link your case management system (Clio, LegalServer, MyCase, PracticePanther, or others), calendar, email, and documents. Autocrew also integrates with Microsoft 365, Google Workspace, and common firm stacks.",
  },
  {
    number: "03",
    title: "Go Live in Days",
    description:
      "Your AI crew starts handling intake, client communication, and routine case ops. Your lawyers focus on judgment-driven work.",
  },
  {
    number: "04",
    title: "Scale With Confidence",
    description:
      "Use analytics to track intake, throughput, and outcomes — including grant or sponsor metrics for legal aid and nonprofit programs.",
  },
];

export interface LegalJusticeGapStat {
  value: string;
  description: string;
  sourceNote: string;
}

export const legalJusticeGapData = {
  badge: "The Efficiency Gap",
  headline: "Every Legal Team Hits the Same Ceiling",
  subheadline:
    "Law firms, in-house teams, and legal aid programs all lose hours to routine work. Industry benchmarks and access-to-justice data tell the same story: capacity is the constraint.",
  closing:
    "Automation won’t replace judgment, but it buys back time for work only humans should do — from trials and transactions to legal aid intake.",
  sourceUrl: "https://justicegap.lsc.gov/",
  sourceLinkText: "LSC Justice Gap Study",
  items: [
    {
      value: "Majority",
      description:
        "of lawyer and paralegal time still goes to email, calendaring, intake, and status updates — not to drafting, deals, or courtroom-ready work.",
      sourceNote: "Legal ops & utilization literature",
    },
    {
      value: "92%",
      description:
        "of low-income Americans’ substantial civil legal problems receive inadequate or no legal help — a stark reminder for the whole industry, with legal aid on the front line of that gap.",
      sourceNote: "LSC Justice Gap Measurement Survey",
    },
    {
      value: "Every",
      description:
        "segment of the bar — BigLaw to legal aid — runs into the same throughput wall when repeatable workflows aren’t automated.",
      sourceNote: "ABA, in-house, and access-to-justice surveys",
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
    question: "How does it integrate with our case management system?",
    answer:
      "Autocrew connects via APIs to major practice management platforms — including Clio, LegalServer, MyCase, PracticePanther, and similar tools — to create or update matters, run conflict checks aligned with your workflows, sync calendars, and pull reporting where your tenant allows. Setup is handled by our team — no coding required on your side.",
  },
  {
    question: "Is client data secure and confidential?",
    answer:
      "We use encryption in transit and at rest and design around legal-industry expectations for sensitive data. We don’t use your client data to train public models. Your org controls access and retention policies.",
  },
  {
    question: "Can we customize intake and screening criteria?",
    answer:
      "Yes. Configure by practice area, geography, case type, fee or pro bono rules, income thresholds for legal aid, and more — and adjust without engineering.",
  },
  {
    question: "What about attorney–client privilege?",
    answer:
      "Automation can be scoped to pre‑relationship screening and routing so privileged communications stay in your existing channels once a matter is opened. Final architecture should be reviewed with your counsel.",
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
    line2: "Focus on the Work That Matters.",
  },
  subheadline:
    "Spend less energy on intake and ops and more on matters your clients — and your mission — depend on. Start your free trial today.",
  primaryCta: {
    text: "Start Free Trial",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "Book a Demo",
    href: "/contact",
  },
};
