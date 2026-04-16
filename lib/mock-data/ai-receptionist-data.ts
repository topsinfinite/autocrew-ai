import type { StatItem, Step } from "@/lib/mock-data/landing-data";
import type { FAQItem } from "@/lib/mock-data/docs-content";

export type AiReceptionistHeroWorkflowIcon = "PhoneCall" | "Database" | "UserCheck";

export interface AiReceptionistHeroWorkflowStep {
  label: string;
  icon: AiReceptionistHeroWorkflowIcon;
  caption: string;
}

export const aiReceptionistHeroData = {
  badge: "AI receptionist",
  headline: {
    prefix: "Answer every call.",
    accent: "Skip the Monday spike.",
  },
  subheadline:
    "Sarah, Autocrew’s AI receptionist, handles routine calls 24/7 — bookings, FAQs, and smart handoff to your team with full context. Built for practices and businesses that can’t afford another missed ring.",
  primaryCta: {
    text: "Book a Demo",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "Hear Sarah",
    href: "#demo",
  },
  trustText:
    "HIPAA-aware options  ·  Human escalation ·  Knowledge-grounded answers",
  workflowSteps: [
    {
      label: "Call answered",
      icon: "PhoneCall",
      caption: "Every ring gets a calm, branded greeting—no voicemail roulette.",
    },
    {
      label: "Intent & KB",
      icon: "Database",
      caption: "Answers grounded in your FAQs and policies, not generic small talk.",
    },
    {
      label: "Book or hand off",
      icon: "UserCheck",
      caption: "Schedules when it can; warm transfer with context when it can’t.",
    },
  ] satisfies AiReceptionistHeroWorkflowStep[],
};

export type AiReceptionistProductStackIcon =
  | "PhoneCall"
  | "Database"
  | "UserCheck";

export interface AiReceptionistProductStackBackPanel {
  title: string;
  subtitle: string;
  icon: AiReceptionistProductStackIcon;
}

export const aiReceptionistProductStack = {
  badge: "Inside the stack",
  headline: "One receptionist layer your callers actually feel.",
  subheadline:
    "Sarah isn’t a flat chatbot bolted onto your phone—she’s a composed voice surface with your knowledge, your tone, and a clean path to humans when it matters.",
  panels: [
    {
      title: "Voice-first coverage",
      subtitle: "Peaks, after hours, overflow—without burning out the desk.",
      icon: "PhoneCall",
    },
    {
      title: "Grounded answers",
      subtitle: "Policies and FAQs your team already trusts.",
      icon: "Database",
    },
    {
      title: "Escalation with context",
      subtitle: "Warm handoff, briefing attached—no “start over.”",
      icon: "UserCheck",
    },
  ] satisfies [
    AiReceptionistProductStackBackPanel,
    AiReceptionistProductStackBackPanel,
    AiReceptionistProductStackBackPanel,
  ],
  focusCard: {
    title: "Sarah in the middle",
    body: "Callers get consistency; your team gets signal. HIPAA-aware options when you need them—deploy with playbooks you approve, not a black box.",
    primaryCta: {
      text: "Book a Demo",
      href: "https://app.autocrew-ai.com/signup",
    },
    secondaryLink: {
      text: "Hear the sample",
      href: "#demo",
    },
  },
};

export interface AiReceptionistPersona {
  id: string;
  tabLabel: string;
  headline: string;
  bullets: string[];
  quote: string;
  attribution: string;
  role: string;
}

export const aiReceptionistPersonas: AiReceptionistPersona[] = [
  {
    id: "callers",
    tabLabel: "Callers & guests",
    headline: "They reach a person instantly — without the hold music.",
    bullets: [
      "Calls picked up consistently, including peaks and after hours where you enable it",
      "Clear answers from your policies and FAQs, not generic scripts",
      "Handoff to staff when the request needs a human, with context attached",
    ],
    quote:
      "I finally get through on the first try. The voice feels professional, not like a maze of menus.",
    attribution: "Operations lead",
    role: "Multi-location services",
  },
  {
    id: "front-desk",
    tabLabel: "Front desk & intake",
    headline: "Less phone jail. More time for the people in front of you.",
    bullets: [
      "Routine scheduling and triage handled before your team picks up",
      "Fewer interruptions during in-person moments that matter",
      "Escalations arrive with summary and intent so the first human response is informed",
    ],
    quote:
      "We’re not toggling between a ringing phone and someone standing at the desk anymore.",
    attribution: "Office manager",
    role: "Healthcare practice",
  },
  {
    id: "owners",
    tabLabel: "Owners & GMs",
    headline: "Protect revenue and reputation without stacking headcount.",
    bullets: [
      "Reduce dropped calls and voicemail loops that cost bookings",
      "One receptionist layer across locations and peak seasons",
      "Analytics on volume, outcomes, and handoff reasons",
    ],
    quote:
      "We treated phone coverage as a growth problem, not just a staffing problem.",
    attribution: "General manager",
    role: "Hospitality group",
  },
  {
    id: "ops",
    tabLabel: "Ops & IT",
    headline: "Deploy with guardrails your security team can review.",
    bullets: [
      "Integrations and data handling aligned to your stack and compliance needs",
      "Audit-friendly workflows; you control knowledge sources and escalation rules",
      "Roll out in phases — start with narrow intents, expand as you learn",
    ],
    quote:
      "We needed voice AI that didn’t become a black box. Playbooks and escalation made it shippable.",
    attribution: "IT director",
    role: "Regional operator",
  },
];

export const aiReceptionistPainStrip = {
  headline: "The Monday-morning spike doesn’t have to define your week.",
  subheadline:
    "When every line lights at once, humans burn out and callers bail. Sarah absorbs the surge so your team answers what actually needs them.",
};

export interface AiReceptionistFlowStep {
  step: string;
  title: string;
  description: string;
}

export const aiReceptionistCallFlow: AiReceptionistFlowStep[] = [
  {
    step: "01",
    title: "Ring",
    description:
      "Inbound call hits your number or SIP trunk; Sarah answers with your greeting and brand voice.",
  },
  {
    step: "02",
    title: "Understand",
    description:
      "Natural language intent detection — appointment, billing question, directions, or custom flows you define.",
  },
  {
    step: "03",
    title: "Ground",
    description:
      "Answers pull from your knowledge base and policies (RAG), reducing guesswork and keeping responses on-script.",
  },
  {
    step: "04",
    title: "Act",
    description:
      "Book, reschedule, capture details, or trigger workflows in connected systems where you’ve enabled integration.",
  },
  {
    step: "05",
    title: "Hand off",
    description:
      "When empathy, judgment, or policy exceptions apply, callers transfer to staff with a concise summary.",
  },
];

export const aiReceptionistOutcomes: StatItem[] = [
  {
    value: "Always on",
    label: "Coverage",
    sublabel:
      "Configurable hours and overflow so peaks don’t become dropped calls",
  },
  {
    value: "Faster",
    label: "First response",
    sublabel: "Consistent pickup and routing instead of queue buildup",
  },
  {
    value: "Grounded",
    label: "Answers",
    sublabel:
      "Responses tied to your content — with escalation when confidence is low",
  },
  {
    value: "Measured",
    label: "Operations",
    sublabel:
      "Visibility into volumes, handoffs, and outcomes for continuous tuning",
  },
];

export const aiReceptionistTrustPoints: {
  title: string;
  description: string;
}[] = [
  {
    title: "HIPAA-aware deployments",
    description:
      "Healthcare customers can run configurations designed around HIPAA expectations — scope and BAAs with your legal review.",
  },
  {
    title: "Human in the loop",
    description:
      "Sarah is built to escalate clinical, legal, or high-stakes requests — not to impersonate a licensed professional.",
  },
  {
    title: "Security-minded design",
    description:
      "Encryption in transit and at rest, tenant isolation, and access controls aligned to enterprise rollout patterns.",
  },
];

export const aiReceptionistRolloutSteps: Step[] = [
  {
    number: "01",
    title: "Map your calls",
    description:
      "We review peak times, top intents, and compliance constraints — then define what Sarah handles vs. your team.",
  },
  {
    number: "02",
    title: "Connect knowledge & tools",
    description:
      "Load FAQs, policies, and calendars; connect telephony and the systems you want Sarah to update or read from.",
  },
  {
    number: "03",
    title: "Pilot with guardrails",
    description:
      "Start with a bounded scope, monitor handoffs, and tune prompts and routing before widening traffic.",
  },
  {
    number: "04",
    title: "Scale & optimize",
    description:
      "Expand languages, locations, or intents using analytics — without losing the escalation paths your staff trusts.",
  },
];

export const aiReceptionistDemo = {
  badge: "Sarah in action",
  headline: "Hear what callers experience",
  subheadline:
    "Real sample of Autocrew’s AI receptionist voice — professional, calm, and focused on getting callers to the right outcome.",
  audioLabel: "Demo call with Sarah",
  duration: "4:32",
};

export const aiReceptionistFaqItems: FAQItem[] = [
  {
    question: "Does Sarah replace our front desk?",
    answer:
      "No. Sarah handles repetitive, high-volume call patterns so your team spends time on exceptions, in-person service, and judgment-heavy conversations. Most teams use it as overflow and after-hours coverage first, then expand.",
  },
  {
    question: "Will the AI give medical or legal advice?",
    answer:
      "No. Sarah is designed to schedule, answer administrative questions from your knowledge base, and route callers. Clinical, legal, or emergency situations should escalate to qualified humans or appropriate emergency services per your policies.",
  },
  {
    question: "How does escalation work?",
    answer:
      "When intent is unclear, sentiment is negative, or a request matches your escalation rules, the call can transfer to a live agent with a structured summary. Your playbooks define what always goes to a human.",
  },
  {
    question: "What integrations are supported?",
    answer:
      "Autocrew connects to common calendars, CRMs, telephony, and industry systems depending on your plan. We scope integrations during onboarding so data flows match your compliance requirements.",
  },
  {
    question: "Is this suitable for HIPAA-regulated organizations?",
    answer:
      "We offer HIPAA-aware configurations for healthcare customers, including BAA and workflow patterns designed for PHI. Final compliance is a shared responsibility — your team reviews use cases and policies.",
  },
  {
    question: "How fast can we go live?",
    answer:
      "Many teams start with a focused pilot in days to weeks, depending on telephony setup, content readiness, and integration depth. We’ll give you a timeline after a short discovery call.",
  },
];

export const aiReceptionistCtaData = {
  headline: {
    line1: "Put Sarah on your front line.",
    line2: "Keep your best people for the hardest moments.",
  },
  subheadline:
    "Book a demo to see routing, knowledge grounding, and escalation — or call the number below to hear Autocrew’s AI receptionist today.",
  primaryCta: {
    text: "Book a Demo",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "Contact Sales",
    href: "/contact",
  },
};

export const aiReceptionistIndustryBridge = {
  headline: "Receptionist playbooks by industry",
  subheadline:
    "Same Sarah backbone — tuned examples and language for how your sector answers the phone.",
  industries: [
    {
      name: "Healthcare",
      href: "/industry/healthcare",
      description: "Patient access, scheduling, and front-office relief",
    },
    {
      name: "Legal",
      href: "/industry/legal",
      description: "Intake, screening, and client-first impressions",
    },
    {
      name: "Coaching",
      href: "/industry/coaching",
      description: "Booking sessions and handling routine client questions",
    },
    {
      name: "Restaurant",
      href: "/industry/restaurant",
      description: "Reservations, hours, and high-volume guest calls",
    },
  ],
};

export const aiReceptionistMetadata = {
  title: "AI Receptionist (Sarah) — Autocrew",
  description:
    "Answer every call with Autocrew’s AI receptionist: voice coverage, knowledge-grounded answers, smart handoff, and HIPAA-aware options for healthcare. Book a demo.",
  ogTitle: "AI Receptionist — Never miss a call | Autocrew",
  ogDescription:
    "Sarah handles routine calls, peaks, and after-hours — with human escalation and integrations your ops team can trust.",
};
