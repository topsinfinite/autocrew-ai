import type { FAQItem } from "@/lib/mock-data/docs-content";

/**
 * Content for the Home Services industry page (HVAC, plumbing, electrical).
 *
 * Voice: builder-to-builder, no marketing fluff. Outcome-focused for the
 * three people who decide whether to deploy this — the shop owner, the
 * dispatcher, and the multi-location operator. Sourced figures: missed-
 * call rate (27%) and voicemail hangup rate (85%) from the
 * Suzee AI / RevSquared industry data referenced in the launch post.
 */

export const homeServicesHeroData = {
  status: {
    location: "On every call, dispatch, and after-hours emergency",
    role: "Sarah · AI Dispatch Coordinator",
    coverage: "24/7",
    standard: "Tech-aware",
  },
  badges: [
    { label: "Always on · 24/7", icon: "phone" as const },
    { label: "Tech-aware · Live dispatch", icon: "wrench" as const },
    { label: "Emergency triage · First 15 seconds", icon: "shield" as const },
  ],
  headline: {
    prefix: "Stop missing the call.",
    accent: "Start dispatching it.",
  },
  subheadline:
    "Autocrew answers every inbound call, triages emergencies from routine intake in the first 15 seconds, and dispatches the right tech live in ServiceTitan, Housecall Pro, Jobber, or Workiz — so the burst pipe at 9pm reaches your on-call tech in 90 seconds, not next-day voicemail.",
  spec: {
    label: "On every shift · By default",
    figure: "27% recovered",
    figureSub: "missed-call rate cut to under 2% inside the first month",
    cells: [
      { label: "Coverage", value: "24/7 · 168hr/wk" },
      { label: "Triage", value: "Emergency vs routine" },
      { label: "Dispatch", value: "Live to on-call tech" },
      { label: "Tenant", value: "Fully isolated" },
    ],
    footer: "Live, unscripted · No PII in app logs",
  },
  primaryCta: { text: "Talk to Sarah live" },
  secondaryCta: { text: "Book a demo", href: "/contact" },
} as const;

export const homeServicesSqueeze = {
  eyebrow: "Where the call leak lands",
  heading: "Three patterns we hear from every kind of home services shop.",
  intro:
    "The work is in the truck. The leak is in the phone line. Here is the squeeze, framed for the three roles we see most. The 27% missed-call rate and the 85% voicemail-hangup figures are from published home-services industry data; everything else is descriptive, not statistical.",
  citation: {
    label: "Source",
    text: "Suzee AI / RevSquared home-services industry data",
    href: "https://suzeeai.com/home-services-why-plumbers-lose-50k-year-to-missed-calls/",
  },
  items: [
    {
      audience: "For the shop owner",
      headline: "27% of calls go to voicemail. 85% of those callers don't call back.",
      body: "Industry-wide, HVAC, plumbing, and electrical shops miss roughly a quarter of inbound calls — and the homeowner who hits voicemail doesn't leave a message. They dial the next plumber on the search results page within 30 seconds. The funnel works; the answer time doesn't.",
      citationRef: true,
    },
    {
      audience: "For the dispatcher",
      headline: "The phone rings while you're routing the morning's jobs.",
      body: "By the time you finish dispatching the 8am roll-out, four calls have stacked up. Two are emergencies. One is a homeowner wanting a quote. The fourth hung up. You're a single point of failure for every conversation between a customer and a tech — and you only cover business hours.",
    },
    {
      audience: "For the multi-location operator",
      headline: "Every market has its own call leak — and you can't see it.",
      body: "Twelve locations, twelve dispatchers, and the only shared metric is total tickets booked. Which markets are dropping calls? Which are routing emergencies wrong? Which are losing the after-hours tier of customers altogether? You can't fix what you can't see, and the dispatch software won't tell you.",
    },
  ],
} as const;

export const homeServicesOutcomes = {
  eyebrow: "What it actually does",
  heading: "Four jobs your dispatch team stops doing on Monday.",
  intro:
    "No new dispatch software to roll out, no new portal for your techs. Sarah works your existing inbound line, the dispatch system you already use, and the on-call rotation your team already trusts. The handoff to a tech happens on the call, not after a 15-minute callback.",
  rows: [
    {
      index: "01",
      title: "Triages emergency calls from routine intake in 15 seconds.",
      body: "Sarah listens for lexical cues ('water everywhere,' 'no heat,' 'sparks,' 'gas smell') and tonal urgency in the opening seconds of the call. When both signals match, she switches to the emergency dispatch flow — confirms the address, asks one safety-relevant question, and routes to the on-call tech. When they don't, she runs the routine booking flow. Same agent, same call, two completely different outcomes.",
      footnote: "Configurable lexicon · English + Spanish · Per-trade tuning",
    },
    {
      index: "02",
      title: "Dispatches live to the right tech in your existing software.",
      body: "Sarah reads tech roster, service zones, and certifications live from your dispatch system. She assigns the closest qualified tech, books the job in your CRM, and pushes a job notification to the tech's mobile app — all on the call, before the customer hangs up. No manual transcription, no game of telephone, no 'we'll call you back.'",
      footnote: "ServiceTitan · Housecall Pro · Jobber · Workiz · FieldEdge · Webhooks",
    },
    {
      index: "03",
      title: "Owns after-hours coverage end-to-end.",
      body: "After-hours is where the AI earns its keep. Sarah handles the call exactly as she would in business hours — diagnoses urgency, books the right tech, and texts the on-call rotation with the address, issue, and safety status already populated. Premium after-hours surcharges land where they should: in your shop, not the competitor's.",
      footnote: "On-call rotation aware · SMS + voice escalation · No shift gaps",
    },
    {
      index: "04",
      title: "Turns the morning surge into a steady stream.",
      body: "Monday at 8:14am, every shop in your zip code gets the same wave — the weekend's small problems calling all at once. Sarah absorbs the surge in parallel, books each job at the right slot, and pre-populates the dispatcher's morning queue. Your dispatcher walks in and the day is already organized.",
      footnote: "Parallel call handling · No hold music · Real-time CRM write-back",
    },
  ],
} as const;

export const homeServicesHandoff = {
  eyebrow: "Where Sarah hands the wrench back",
  heading: "Sarah stops at the line where a tech's judgment begins.",
  intro:
    "Intake, triage, dispatch, and routine status updates are safe to automate. Anything that requires a tech's eyes on the problem — a quote dispute, a complex commercial bid, a callback after a finished job — gets handed back with full context and zero ambiguity.",
  columns: ["When this happens", "Sarah does this", "Your tech / dispatcher gets"],
  rows: [
    {
      condition: "Caller wants a firm quote without a site visit",
      action: "Captures the scope, schedules a quote visit, books a window",
      handoff: "A pre-populated quote request and the customer's exact words",
    },
    {
      condition: "Emergency triage signals are ambiguous",
      action: "Defaults toward emergency, books the on-call tech, flags for review",
      handoff: "An immediate SMS with the call recording and triage rationale",
    },
    {
      condition: "Job is multi-day or commercial scope",
      action: "Acknowledges the complexity, schedules a discovery call",
      handoff: "A logged opportunity in your CRM with the full call transcript",
    },
    {
      condition: "Customer demands to speak to a human",
      action: "Transfers cleanly with full context, no cold hold",
      handoff: "The call already on the line — name, issue, history briefed",
    },
  ],
} as const;

export const homeServicesIntegrations = {
  eyebrow: "Wires into the dispatch software you already run",
  heading: "Direct integrations with the systems your shop already lives in.",
  body: "Sarah reads tech availability, service zones, and certifications live — and writes new jobs back to your CRM as the call ends. No middleware, no double-entry, no exporting CSVs at the end of the week. If you run a homegrown system, webhooks cover it.",
  matrix: [
    {
      name: "ServiceTitan",
      reads: "Native API",
      writes: "Native API",
      sync: "Two-way",
    },
    {
      name: "Housecall Pro",
      reads: "Native API",
      writes: "Native API",
      sync: "Two-way",
    },
    {
      name: "Jobber",
      reads: "Native API",
      writes: "Native API",
      sync: "Two-way",
    },
    {
      name: "Workiz",
      reads: "Native API",
      writes: "Native API",
      sync: "Two-way",
    },
    {
      name: "FieldEdge",
      reads: "API",
      writes: "API",
      sync: "Partial",
    },
    {
      name: "Custom / homegrown",
      reads: "Webhook",
      writes: "Webhook",
      sync: "Configurable",
    },
  ],
  docsLink: { text: "See the full integration overview", href: "/docs" },
} as const;

export const homeServicesByRole = {
  eyebrow: "Built for the shop you actually run",
  heading: "Three answers, in the language of three operations.",
  roles: [
    {
      title: "For the shop owner",
      body: "Stop losing the after-hours emergency to the plumber down the street because nobody picked up. Sarah triages, dispatches, and books — your on-call tech's phone rings within 90 seconds of the customer hanging up, with the address and the issue already pulled.",
      metric: "Missed-call rate · 27% → under 2%",
    },
    {
      title: "For the dispatcher",
      body: "Reclaim your morning. Routine intake, quote requests, and reschedules happen in parallel without you in the loop — your day starts on the complex commercial work and the close customer relationships, not the inbox.",
      metric: "Inbound surge · absorbed before you arrive",
    },
    {
      title: "For the multi-location operator",
      body: "Standardize call handling across every market. One dispatcher per location, one AI handling the rest of the volume — same triage rules, same lexicon, same booking flow, with every call logged and reviewable per market.",
      metric: "Coverage · 168 hours/week per market",
    },
  ],
} as const;

export const homeServicesAskStrip = {
  eyebrow: "Ask Sarah anything a homeowner would",
  heading: "She's already on the line. Try a real call.",
  body: "These are the kinds of calls Sarah handles for HVAC, plumbing, and electrical shops every day. Tap one — the live widget will open and answer in your browser, the same way it would for one of your customers.",
  prompts: [
    {
      label: "I have water everywhere — can someone come now?",
      prompt:
        "Hi, I have water gushing from a pipe under my kitchen sink and I've shut off the main — can someone come out tonight?",
    },
    {
      label: "My AC stopped working — what's your soonest opening?",
      prompt:
        "Hi, my central AC stopped cooling this afternoon and the house is at 84 degrees. What's your soonest opening for a service call?",
    },
    {
      label: "Can I get a quote for a panel upgrade?",
      prompt:
        "Hi, I'd like to get a quote for upgrading my electrical panel from 100A to 200A — can someone come out and take a look?",
    },
    {
      label: "Do you do tune-ups before the heating season?",
      prompt:
        "Hi, I want to schedule a furnace tune-up before the cold weather hits — what's available in the next two weeks?",
    },
  ],
  voiceCta: "Or call her live",
} as const;

export const homeServicesFaqItems: FAQItem[] = [
  {
    question: "Will the AI replace my dispatcher?",
    answer:
      "Most shops don't replace their dispatcher — they pair the AI with one. The AI absorbs routine intake, after-hours coverage, and the morning surge so the human dispatcher can focus on complex commercial bids, multi-day jobs, and customer relationships. Combined cost is lower than two human dispatchers and coverage is wider.",
  },
  {
    question: "How does it integrate with ServiceTitan, Housecall Pro, or Jobber?",
    answer:
      "Direct API integration with all four of the major home-services dispatch systems — ServiceTitan, Housecall Pro, Jobber, and Workiz. Sarah reads tech roster, service zones, and certifications live, and writes new jobs back to your CRM as the call ends. Setup typically takes under an hour for the major platforms, handled by our team.",
  },
  {
    question: "Can the AI tell an emergency from a routine call?",
    answer:
      "Yes — and this is the most important difference between a generic AI receptionist and one configured for home services. Sarah listens for emergency keywords ('water everywhere,' 'no heat,' 'sparks,' 'gas smell') and tonal urgency in the first 15 seconds, then switches to the emergency dispatch flow. Each shop defines its own emergency lexicon during setup.",
  },
  {
    question: "What about after-hours emergency calls?",
    answer:
      "After-hours is the highest-ROI use case. Sarah handles the call exactly as she would in business hours — diagnoses urgency, books the right tech, and texts your on-call rotation with the address, issue, and safety status already populated. Two recovered emergency calls a week at $450 each is roughly $46,000 a year in revenue.",
  },
  {
    question: "How does pricing compare to a dispatcher or answering service?",
    answer:
      "A full-time dispatcher costs $40,000–$55,000 in salary, business hours only. A traditional answering service costs $300–$800 a month and takes messages but doesn't dispatch. Autocrew runs $300–$800 a month, covers 24/7, and dispatches live with full context. Most shops hit ROI inside the first week of after-hours bookings.",
  },
  {
    question: "Is customer data secure?",
    answer:
      "Encrypted in transit and at rest (AES-256), tenant-isolated per shop, audit-logged on every access. We never use your customer data to train public models, and PII never appears in application logs. We sign NDAs and DPAs on request.",
  },
  {
    question: "Can I try it before I commit?",
    answer:
      "Yes. Every primary CTA on this page opens the live AutoCrew widget — voice or chat — so you can hear Sarah handle a real call before you book a demo. No sign-up required.",
  },
];

export const homeServicesCta = {
  eyebrow: "Try her, then talk to us",
  badges: [
    { label: "Always on", value: "24/7 · No shift gaps" },
    { label: "Tech-aware", value: "Live dispatch in your CRM" },
  ],
  headline: {
    line1: "Stop Missing the Call.",
    line2: "Start Dispatching It.",
  },
  subheadline:
    "Pick up the line and ask Sarah a real call — she'll triage and dispatch the same way she would for one of your customers. When you're ready to wire her into your shop, book a demo and we'll walk through your dispatch software, on-call rotation, and emergency lexicon.",
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
      "AI dispatch coordinator for HVAC, plumbing, and electrical shops. Handles triage, dispatch, after-hours coverage, and routine intake — wired live into ServiceTitan, Housecall Pro, Jobber, and Workiz.",
  },
  spotlight: {
    eyebrow: "Built for the conversation with your operations lead",
    body: "Tech-aware dispatch, emergency triage, and 24/7 coverage — wired live into the dispatch software you already run. Customer data is never used to train public models. We sign NDAs and DPAs.",
  },
} as const;
