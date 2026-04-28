import type { FAQItem } from "@/lib/mock-data/docs-content";

/**
 * Content for the Legal industry page.
 *
 * Voice mirrors the new healthcare and coaching pages: outcome-focused
 * sentences for the people who decide whether to deploy this — managing
 * partners, legal ops leads, and legal aid directors. No fabricated
 * metrics. The one real citation that survives is the LSC Justice Gap
 * Study figure for legal aid; everything else is descriptive.
 */

export const legalHeroData = {
  status: {
    location: "On every intake, conflict, and status request",
    role: "Sarah · AI Legal Coordinator",
    coverage: "24/7",
    standard: "Privilege-respecting",
  },
  badges: [
    { label: "Confidential", icon: "shield" as const },
    { label: "Conflicts-aware · pre-intake", icon: "scale" as const },
    { label: "Privilege-respecting · scope-limited", icon: "lock" as const },
  ],
  headline: {
    prefix: "Less admin.",
    accent: "More counsel.",
  },
  subheadline:
    "Autocrew handles intake, conflict screening, document collection, and routine client communication — so your attorneys stay on the matters clients pay for, and your legal aid coordinators stop turning away eligible cases for capacity.",
  spec: {
    label: "Built-in · By default",
    figure: "Privilege-safe",
    figureSub: "intake and screening, before a lawyer touches the file",
    cells: [
      { label: "Confidentiality", value: "AES-256 at rest" },
      { label: "Conflicts", value: "Pre-intake check" },
      { label: "Privilege", value: "Scope-limited" },
      { label: "Tenant", value: "Fully isolated" },
    ],
    footer: "Live, unscripted · No PII in app logs",
  },
  primaryCta: { text: "Talk to Sarah live" },
  secondaryCta: { text: "Book a demo", href: "/contact" },
} as const;

export const legalSqueeze = {
  eyebrow: "Where the throughput wall lands",
  heading: "Three patterns we hear from every kind of legal team.",
  intro:
    "Demand grows, headcount doesn't, and every delayed response kills throughput. Here is the squeeze, framed for the three kinds of practice we see most. The legal aid figure is from the LSC Justice Gap Study — every other observation is descriptive, not statistical.",
  citation: {
    label: "Source",
    text: "LSC Justice Gap Measurement Survey",
    href: "https://justicegap.lsc.gov/",
  },
  items: [
    {
      audience: "For the firm partner",
      headline: "Intake calls land mid-deposition.",
      body: "A potential client reaches out at 2:14pm. The intake coordinator is in a deposition prep until 4. By the time someone runs the conflict check and calls back, the lead has retained the firm two blocks over. The funnel works — the response time doesn't.",
    },
    {
      audience: "For the legal ops lead",
      headline: "Status pings eat the day before the work begins.",
      body: "Three associates, twelve open matters, every business stakeholder asking \"any update?\" by 9:30am. The substantive work starts at 11 — if you're lucky. The bottleneck isn't the legal work; it's the loop around it.",
    },
    {
      audience: "For the legal aid director",
      headline: "92% of substantial civil legal needs go unmet.",
      body: "The LSC Justice Gap Study put a number on it: most low-income Americans with a substantial civil legal problem get inadequate or no help. Your team isn't refusing work — you're capacity-bound at intake. Every hour spent screening eligibility is an hour not spent representing.",
      citationRef: true,
    },
  ],
} as const;

export const legalOutcomes = {
  eyebrow: "What it actually does",
  heading: "Four jobs your team stops doing on Monday.",
  intro:
    "No new case management system to roll out, no new portal for clients. Sarah works your existing intake line, the matter system you already use, and the document tools your team already trusts. Privileged communications stay in your existing channels.",
  rows: [
    {
      index: "01",
      title: "Triages new matters before a lawyer touches the file.",
      body: "Sarah qualifies the inquiry, runs the conflict check against your matter system, captures the basics, collects the right intake documents, and only routes to an attorney when the matter is real, in-scope, and conflict-free. Pre-relationship screening — designed to keep privilege out of the AI layer entirely.",
      footnote: "Clio · LegalServer · MyCase · PracticePanther · NetDocuments",
    },
    {
      index: "02",
      title: "Handles eligibility screening end-to-end for legal aid.",
      body: "Income thresholds, geography, case type, statute of limitations — all screened in conversation, not on a paper form. Eligible matters land in your CMS with the documentation already attached; ineligible callers get a clear referral, not a busy signal.",
      footnote: "Configurable per program · Income, geography, case-type rules",
    },
    {
      index: "03",
      title: "Sends the status updates that nobody has time to send.",
      body: "Court dates, filing windows, document requests, scheduling changes — sent in plain language, in the client's preferred channel, at the right cadence. Your associates stop being a help desk; your clients stop calling for the same update twice.",
      footnote: "Email · SMS · Web · Multilingual",
    },
    {
      index: "04",
      title: "Tracks deadlines, statutes, and filing windows.",
      body: "Statutes don't negotiate. Sarah watches the calendar, surfaces conflicts before they become a missed window, and routes anything time-critical to the responsible attorney with the docket already pulled.",
      footnote: "Calendar-aware · CMS-aware · Escalates to responsible attorney",
    },
  ],
} as const;

export const legalHandoff = {
  eyebrow: "Where Sarah hands the file back",
  heading: "Sarah stops at the line where attorney judgment begins.",
  intro:
    "Pre-relationship screening, scheduling, and routine status updates are safe to automate. Anything past that line — legal advice, scope decisions, fee structures, privileged communication — gets handed back to an attorney with full context and zero ambiguity.",
  columns: ["When this happens", "Sarah does this", "Your attorney gets"],
  rows: [
    {
      condition: "Caller asks for legal advice or strategy",
      action: "Stops, acknowledges scope, schedules an attorney consult",
      handoff: "A briefing with the caller's exact words and the matter context",
    },
    {
      condition: "Conflict check returns a possible match",
      action: "Pauses intake, escalates to the conflicts attorney",
      handoff: "The flagged record plus the new caller's identifying info",
    },
    {
      condition: "Matter falls outside configured scope or fee structure",
      action: "Acknowledges honestly, gives a clean referral or wait-list path",
      handoff: "A logged record with the reason, in case you want to follow up",
    },
    {
      condition: "Communication enters privileged territory",
      action: "Quietly steps aside, opens a direct attorney channel",
      handoff: "An immediate notification — privileged comms stay out of the AI layer",
    },
  ],
} as const;

export const legalCompliance = {
  eyebrow: "Built for the conversation with your ethics counsel",
  heading: "The bar association language, in plain English.",
  body: "Autocrew is designed around the rules that already govern your practice: confidentiality, conflicts of interest, attorney-client privilege, and data residency. PHI/PII is encrypted at rest, every access is logged, your tenant is fully isolated, and we don't use your client data to train public models. We sign NDAs and DPAs.",
  ledger: [
    { label: "Confidentiality", value: "AES-256 at rest" },
    { label: "Conflicts check", value: "Pre-intake, CMS-integrated" },
    { label: "Privilege", value: "Scope-limited to pre-relationship" },
    { label: "Tenant", value: "Fully isolated per firm" },
    { label: "Training data", value: "Your data, never used" },
    { label: "Audit log", value: "Per access" },
  ],
  docsLink: { text: "Read the full security overview", href: "/docs" },
} as const;

export const legalByRole = {
  eyebrow: "Built for the practice you actually run",
  heading: "Three answers, in the language of three practices.",
  roles: [
    {
      title: "For the firm partner",
      body: "Stop losing the lead to the firm down the street because nobody picked up. Sarah qualifies, conflicts-checks, and books the consult — your associates show up to the first meeting with the chart already pulled, not a clipboard.",
      metric: "Lead response · within seconds, 24/7",
    },
    {
      title: "For the legal ops lead",
      body: "Reclaim the morning. Routine status pings, scheduling, and document collection happen without an associate in the loop — your team starts the day on substantive work, not on the inbox.",
      metric: "Status loop · handled in the background",
    },
    {
      title: "For the legal aid director",
      body: "Open more cases without adding headcount. Eligibility screening runs in conversation, not on paper. Ineligible callers get clear referrals, eligible matters land in your CMS ready to assign — capacity goes back to the people who do the representing.",
      metric: "Intake · capacity returned to attorneys",
    },
  ],
} as const;

export const legalAskStrip = {
  eyebrow: "Ask Sarah anything a caller would",
  heading: "She's already on the line. Try a real question.",
  body: "These are the kinds of questions Sarah handles for legal teams every day. Tap one — the live widget will open and answer in your browser.",
  prompts: [
    {
      label: "Do you handle workers' comp cases?",
      prompt:
        "Hi, I was injured at work last month — do you handle workers' compensation cases?",
    },
    {
      label: "Could I qualify for legal aid?",
      prompt:
        "I'm having trouble paying rent and I got an eviction notice — could I qualify for legal aid?",
    },
    {
      label: "What's the status of my case?",
      prompt:
        "I'm a current client — can you tell me what's happening with my case and when I'll hear from my lawyer?",
    },
    {
      label: "Can I schedule a consultation?",
      prompt:
        "Hi, I'd like to schedule a consultation about a small business contract dispute — what's available next week?",
    },
  ],
  voiceCta: "Or call her live",
} as const;

export const legalFaqItems: FAQItem[] = [
  {
    question: "Will AI replace attorney judgment?",
    answer:
      "No. Sarah handles pre-relationship screening, scheduling, document collection, and routine status updates. Legal advice, case acceptance decisions, scope of representation, and any privileged communication are routed to an attorney — with full context and zero ambiguity.",
  },
  {
    question: "How does it integrate with our case management system?",
    answer:
      "Direct API integration with the major practice systems — Clio, LegalServer, MyCase, PracticePanther, NetDocuments, and similar. Sarah creates and updates matters, runs conflict checks against your existing data, syncs calendars, and writes back the intake documents. Setup is handled by our team — no engineering required on your side.",
  },
  {
    question: "What about attorney-client privilege?",
    answer:
      "Sarah is scoped to pre-relationship intake and routine post-engagement comms. Privileged communications stay in your existing channels once a matter is opened. We design around this expectation — but the final architecture should always be reviewed with your ethics counsel.",
  },
  {
    question: "Is client data secure and confidential?",
    answer:
      "Encrypted in transit and at rest (AES-256), tenant-isolated per firm, audit-logged on every access, and we never use your client data to train public models. We sign NDAs and DPAs on request. PII never appears in application logs.",
  },
  {
    question: "Can we customize intake and screening criteria?",
    answer:
      "Yes — by practice area, geography, case type, fee structure, eligibility rules for legal aid (income thresholds, citizenship requirements, jurisdictional limits), and more. Configurable without engineering, adjustable as your program evolves.",
  },
  {
    question: "Can I try it before I commit?",
    answer:
      "Yes. Every primary CTA on this page opens the live AutoCrew widget — voice or chat — so you can hear Sarah handle a real intake question before you book a demo. No sign-up required.",
  },
];

export const legalCta = {
  eyebrow: "Try her, then talk to us",
  badges: [
    { label: "Confidential", value: "AES-256 · Tenant-isolated" },
    { label: "Privilege-safe", value: "Scope-limited to pre-relationship" },
  ],
  headline: {
    line1: "Stop Drowning in Admin.",
    line2: "Focus on the Work That Matters.",
  },
  subheadline:
    "Pick up the line and ask Sarah a real intake question — she'll answer the same way she would for one of your callers. When you're ready to wire her into your practice, book a demo and we'll walk through your CMS, conflicts setup, and handoff rules.",
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
      "AI legal coordinator for firms, in-house teams, and legal aid programs. Handles intake, conflicts, eligibility screening, document collection, and routine client communication — with privilege and confidentiality designed in from the start.",
  },
} as const;
