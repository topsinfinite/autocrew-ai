import type { FAQItem } from "@/lib/mock-data/docs-content";

/**
 * Content for the Coaching industry page.
 *
 * Voice mirrors the new healthcare page: outcome-focused sentences for the
 * people who decide to deploy this — solo coaches, cohort/group leads, and
 * coaching agency owners. No fabricated metrics, no stock testimonials.
 * Concrete nouns over generic numbers.
 */

export const coachingHeroData = {
  status: {
    location: "On every booking, intake, and follow-up",
    role: "Sarah · AI Coordinator",
    coverage: "24/7",
    standard: "30+ integrations",
  },
  badges: [
    { label: "Calendly · Stripe · Notion", icon: "plug" as const },
    { label: "Setup in days", icon: "shield" as const },
  ],
  headline: {
    prefix: "Your coaching practice,",
    accent: "with the admin already done.",
  },
  subheadline:
    "Autocrew handles discovery calls, intake, scheduling, payments, and follow-ups in the background — so the work you actually trained for stops getting interrupted.",
  spec: {
    label: "Connected · By default",
    figure: "Your stack",
    figureSub: "we plug into the tools you already use",
    cells: [
      { label: "Booking", value: "Calendly · Cal.com" },
      { label: "Payments", value: "Stripe · Square" },
      { label: "Workspace", value: "Notion · Airtable" },
      { label: "Comms", value: "Slack · Email" },
    ],
    footer: "No-code setup · Live in days",
  },
  primaryCta: { text: "Talk to Sarah live" },
  secondaryCta: { text: "Book a demo", href: "/contact" },
} as const;

export const coachingSqueeze = {
  eyebrow: "What gets in the way of the work that matters",
  heading: "Three patterns we hear weekly from coaches.",
  intro:
    "It's not that the admin is hard. It's that it lands in the worst possible moments — between a session and the next one, after dinner, on Sunday night. Here is the squeeze, framed for the three kinds of practice we see most.",
  items: [
    {
      audience: "For the solo coach",
      headline: "Discovery calls land mid-session.",
      body: "The lead reaches out at 10:42am. You're in a session until 11:30. By the time you call back, they've booked someone who picked up. The funnel works — the response time doesn't.",
    },
    {
      audience: "For the cohort lead",
      headline: "Launch week is a mailbox, not a curriculum.",
      body: "Forty applications, forty intake threads, forty rescheduling DMs. The week you should be tightening the program is the week you're answering the same five questions in five different inboxes.",
    },
    {
      audience: "For the agency owner",
      headline: "Five coaches, five calendars, five no-show policies.",
      body: "Each coach has their own scheduling rules, their own intake form, their own follow-up rhythm. Nothing is shared, nothing is reportable, and onboarding a new coach means rebuilding the whole stack from scratch.",
    },
  ],
} as const;

export const coachingOutcomes = {
  eyebrow: "What it actually does",
  heading: "Four jobs your team stops doing on Monday.",
  intro:
    "No new dashboard to learn, no new client portal to launch. Sarah works with the booking, intake, and payment tools you've already chosen — clients don't see a handoff, you just stop being the bottleneck.",
  rows: [
    {
      index: "01",
      title: "Books discovery calls and sessions without a back-and-forth.",
      body: "Sarah qualifies the lead, finds a slot that fits both calendars, books it, sends the calendar invite, and collects payment if the package is paid. Reschedules and cancellations are handled inline.",
      footnote: "Calendly · Cal.com · Google Cal · Outlook · Stripe",
    },
    {
      index: "02",
      title: "Runs intake end-to-end before the first session.",
      body: "Custom intake questionnaires that match your methodology, signed agreements, contact details, and payment captured before kickoff. The first session starts with the chart already up, not a clipboard.",
      footnote: "Notion · Airtable · DocuSign · Stripe",
    },
    {
      index: "03",
      title: "Sends the follow-ups that always slip.",
      body: "Post-session check-ins, milestone nudges, homework reminders — sent in your voice, on your cadence, only when the moment calls for it. Clients feel held; you stop carrying the list in your head.",
      footnote: "Email · Slack · SMS · Loom",
    },
    {
      index: "04",
      title: "Re-engages dormant clients without ghosting them.",
      body: "Sarah notices when a client hasn't booked in a while, drafts a check-in in your voice, and sends it on your behalf. You approve once, the cadence runs on its own. No more \"meant to message them weeks ago\" guilt.",
      footnote: "CRM-aware · Configurable cadence · Approve before send",
    },
  ],
} as const;

export const coachingHandoff = {
  eyebrow: "Where Sarah hands the conversation back",
  heading: "Sarah is built to know when she's not the right answer.",
  intro:
    "Coaching is relational work. Every Coaching Crew ships with handoff rules baked in so the AI quietly steps aside the moment the conversation needs you — not after a confused exchange that wastes your client's time.",
  columns: ["When this happens", "Sarah does this", "You get"],
  rows: [
    {
      condition: "Client describes a personal crisis or safety concern",
      action: "Stops the workflow, acknowledges, opens a direct line to you",
      handoff: "An immediate notification with the client's words, in full",
    },
    {
      condition: "Lead asks a methodology question only you can answer",
      action: "Captures the question and the context, books an exploratory call",
      handoff: "A briefing with the lead's history and exact wording",
    },
    {
      condition: "Refund, dispute, or contract change request",
      action: "Pauses, logs the request, routes to your billing inbox",
      handoff: "A ticket with client, plan, payment history, and the ask",
    },
    {
      condition: "Anything outside the configured scope",
      action: "Acknowledges honestly, queues a callback rather than guessing",
      handoff: "A task in your inbox with the conversation up to that point",
    },
  ],
} as const;

export const coachingIntegrations = {
  eyebrow: "Plugs into the stack you already pay for",
  heading: "No new dashboard. No new client portal. No data lock-in.",
  body: "Autocrew connects to the tools you've already chosen and works through them — your clients keep using the same calendar link, the same Stripe checkout, the same Slack channel. We're additive, not a migration.",
  ledger: [
    { label: "Booking", value: "Calendly · Cal.com" },
    { label: "Calendars", value: "Google · Outlook" },
    { label: "Payments", value: "Stripe · Square" },
    { label: "Workspace", value: "Notion · Airtable" },
    { label: "Comms", value: "Slack · Email · SMS" },
    { label: "Sessions", value: "Zoom · Google Meet" },
  ],
  docsLink: { text: "See the full integration list", href: "/docs" },
} as const;

export const coachingByRole = {
  eyebrow: "Built for the practice you actually run",
  heading: "Three answers, in the language of three practices.",
  roles: [
    {
      title: "For the solo coach",
      body: "Get your evenings back. Sarah picks up discovery calls during sessions, runs intake, and handles the rescheduling chains so your calendar stops running you. You stay 1:1 with your clients — and finally have headspace to think about the next program.",
      metric: "The work you trained for · uninterrupted",
    },
    {
      title: "For the cohort lead",
      body: "Launch weeks stop being mailbox weeks. Sarah handles the forty intake threads, payment captures, and pre-cohort logistics in parallel — you spend the week tightening the curriculum, not answering the same five questions five different ways.",
      metric: "Launch ops · handled in the background",
    },
    {
      title: "For the agency owner",
      body: "One shared layer across every coach. Same intake, same booking flow, same follow-up cadence — configurable per coach, reportable across the agency. Onboarding a new coach becomes adding them to the rotation, not rebuilding the stack.",
      metric: "One shared ops layer · per-coach configurable",
    },
  ],
} as const;

export const coachingAskStrip = {
  eyebrow: "Ask Sarah anything a client would",
  heading: "She's already on the line. Try a real question.",
  body: "These are the kinds of questions Sarah handles for coaching practices every day. Tap one — the live widget will open and answer in your browser.",
  prompts: [
    {
      label: "Can I book a discovery call next week?",
      prompt:
        "Hi, I'd like to book a discovery call with you sometime next week — what's available?",
    },
    {
      label: "What does your 12-week program cost?",
      prompt:
        "Hi, can you tell me what your 12-week coaching program includes and how much it costs?",
    },
    {
      label: "Do you have evening availability?",
      prompt:
        "I work 9-to-5 in central time — do you have any coaching slots after 6pm Pacific?",
    },
    {
      label: "Can I reschedule my Thursday session?",
      prompt:
        "Something came up Thursday afternoon — can I reschedule my session to later that week?",
    },
  ],
  voiceCta: "Or call her live",
} as const;

export const coachingFaqItems: FAQItem[] = [
  {
    question: "Will Sarah replace the personal touch in my coaching?",
    answer:
      "No. Sarah handles the administrative side — discovery scheduling, intake, follow-ups, payments — so you're more present during actual sessions. Anything that needs your judgment (methodology questions, sensitive client conversations, scope changes) is escalated immediately with full context.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most coaches are live in days, not weeks. We wire up your existing booking, payment, and workspace tools, tune the intake flow to your methodology, and validate the handoff rules with you. No code, no migration.",
  },
  {
    question: "What tools does it integrate with?",
    answer:
      "The most common stack: Calendly, Cal.com, Google Calendar, Outlook, Stripe, Square, Notion, Airtable, Slack, Zoom, and Google Meet. We add new integrations on request — if it has an API or a webhook, we can usually wire it in.",
  },
  {
    question: "Can I customize the client intake?",
    answer:
      "Yes — fully. Build questionnaires that match your methodology, the agreements you require, and the data you actually need before a first session. Sarah captures it all in your existing workspace tool, not a new portal.",
  },
  {
    question: "What happens if a client needs to reach me directly?",
    answer:
      "Smart escalation. Sensitive topics, methodology questions, and out-of-scope requests are routed to you immediately on whichever channel you prefer — email, Slack, or SMS. You stay in control of what gets through and when.",
  },
  {
    question: "Can I try it before I commit?",
    answer:
      "Yes. Every primary CTA on this page opens the live AutoCrew widget — voice or chat — so you can hear Sarah handle a real question before you book a demo. No sign-up required.",
  },
];

export const coachingCta = {
  eyebrow: "Try her, then talk to us",
  badges: [
    { label: "30+ integrations", value: "Calendly · Stripe · Notion · Slack" },
    { label: "Setup", value: "Days, not weeks" },
  ],
  headline: {
    line1: "Stop Doing Admin.",
    line2: "Start Coaching More.",
  },
  subheadline:
    "Pick up the line and ask Sarah a real question — she'll answer the same way she would for one of your clients. When you're ready to wire her into your practice, book a demo and we'll walk through your stack and intake flow.",
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
      "AI coordinator for coaching practices. Handles discovery calls, intake, scheduling, payments, and follow-ups across the tools you already use — so you stay in the work that matters.",
  },
} as const;
