/**
 * Content for the Healthcare industry page.
 *
 * The voice is written for the people who decide whether to deploy this — CFOs,
 * CMOs, practice owners, and operations managers — not for the engineers who
 * will integrate it. The technical FHIR / HIPAA / SMART-Backend-Services
 * material lives in `app/docs/healthcare-crew`; here we translate outcomes.
 */

export const healthcareHeroData = {
  status: {
    location: "On every clinic line",
    role: "Sarah · AI Receptionist",
    coverage: "24/7",
    standard: "FHIR R4",
  },
  headline: {
    prefix: "The front desk that",
    accent: "never sends a patient to voicemail.",
  },
  subheadline:
    "Autocrew answers your clinic line at 9pm, on Saturdays, and through every lunch break — books appointments, triages refill questions, completes intake, and hands the rare exception cleanly to your team.",
  badges: [
    { label: "HIPAA-aware", icon: "shield" as const },
    { label: "EHR-integrated · FHIR R4", icon: "plug" as const },
  ],
  audio: {
    label: "Hear Sarah handle a real clinic call",
    duration: "4:32",
    src: "/audio/Demo Call with Sarah.mp3",
    eyebrow: "Listen now",
  },
  shift: {
    label: "Built-in · By default",
    figure: "24/7",
    figureSub: "voice agent, every clinic line",
    cells: [
      { label: "EHR API", value: "FHIR R4" },
      { label: "ID verify", value: "2-step" },
      { label: "Encryption", value: "AES-256" },
      { label: "Audit log", value: "Per access" },
    ],
    footer: "Live, unscripted · HIPAA-aware",
  },
  primaryCta: { text: "Talk to Sarah live" },
  secondaryCta: { text: "Book a demo", href: "/contact" },
} as const;

/**
 * In-context widget prompts for the mid-page Ask strip. Each chip fires
 * `askSarah` with a healthcare-specific question — visitors get a feel for
 * the product on the page without having to open a separate tab.
 */
export const healthcareAskStrip = {
  eyebrow: "Ask Sarah anything a patient would",
  heading: "She's already on the line. Try a real question.",
  body: "These are the kinds of questions Sarah handles for healthcare practices every day. Tap one — the live widget will open and answer in your browser.",
  prompts: [
    {
      label: "How do I refill my prescription?",
      prompt: "How do I get my prescription refilled?",
    },
    {
      label: "Can I book an appointment for next week?",
      prompt: "Can I book an appointment with Dr. Patel for next Tuesday afternoon?",
    },
    {
      label: "What did the doctor say about my labs?",
      prompt: "I had bloodwork done last week — can you tell me my results?",
    },
    {
      label: "Does my insurance cover this visit?",
      prompt: "I have Blue Cross PPO — does that cover an annual physical?",
    },
  ],
  voiceCta: "Or call her live",
} as const;

export const healthcareLeaks = {
  eyebrow: "What slips through every week",
  heading: "Three numbers your front desk can't see at the same time.",
  intro:
    "The bottleneck isn't your team — it's that the phone rings during the worst possible moments of a clinical day. Here is the bleed, framed for the three people who feel it.",
  items: [
    {
      audience: "For the CFO",
      figure: "23%",
      label: "of inbound calls go unanswered",
      body: "Most clinics lose roughly a quarter of their calls to voicemail, hold abandonment, or simultaneous ring-out. At a $185 average new-patient lifetime value, a single under-staffed shift bleeds four figures a week — invisible on the P&L.",
    },
    {
      audience: "For the CMO",
      figure: "1 in 5",
      label: "new patients gives up after one missed call",
      body: "Acquisition spend is wasted at the last mile. The campaign worked, the patient called, the line was busy — they searched again. Answer rate is the conversion rate nobody puts on the marketing dashboard.",
    },
    {
      audience: "For the practice owner",
      figure: "11 hrs",
      label: "of clinical time eaten by the phone, per week, per provider",
      body: "Refills, scheduling, intake, insurance pre-checks. The work has to happen — the question is whether it happens between exam rooms, or before the patient ever reaches one.",
    },
  ],
} as const;

export const healthcareOutcomes = {
  eyebrow: "What it actually does",
  heading: "Four jobs your team stops doing on Monday.",
  intro:
    "No new dashboard to learn. Sarah works your existing clinic line and your existing EHR — patients can't tell it isn't a person, except that nobody is ever on hold.",
  rows: [
    {
      index: "01",
      title: "Books and reschedules without a call-back queue.",
      body: "Sarah finds an appointment that fits the patient's window and the provider's panel, books it directly into the EHR, and sends the confirmation. Reschedules and cancellations are handled inline — no sticky notes, no callback list.",
      footnote: "Works with Athena, Epic, eClinicalWorks, NextGen, DrChrono · FHIR R4",
    },
    {
      index: "02",
      title: "Handles refill requests and result follow-ups end-to-end.",
      body: "Patients get a verified answer to \"is my refill ready?\" or \"what did the doctor say about my labs?\" without paging the back office. Anything that requires a clinician's judgment gets routed — with the patient identified and the chart pulled.",
      footnote: "Two-step caller verification · PHI never leaves your tenant",
    },
    {
      index: "03",
      title: "Completes intake before the patient walks in.",
      body: "Insurance, demographics, reason for visit, and prior history captured during the booking call — typed back into the chart, ready for the rooming MA. Zero clipboards, zero typing during the visit.",
      footnote: "Forms map to your existing EHR fields · audit-logged per access",
    },
    {
      index: "04",
      title: "Covers after-hours and overflow without paying for after-hours staff.",
      body: "Nights, weekends, and the 11:30am rush are answered the same way. Triage protocol you set: book it, answer it, or escalate it. Your team starts the day with a clean ledger instead of 36 voicemails.",
      footnote: "Configurable by hour, line, and triage rule · per-clinic",
    },
  ],
} as const;

export const healthcareHandoff = {
  eyebrow: "Where the AI stops",
  heading: "We designed Sarah to know when she's not the right answer.",
  intro:
    "A clinical practice can't afford a confident-sounding wrong answer. Every Healthcare Crew ships with handoff rules baked in — the patient hears a calm transfer, not an apology.",
  columns: ["When this happens", "Sarah does this", "Your team gets"],
  rows: [
    {
      condition: "Patient describes a clinical symptom requiring triage",
      action: "Pauses, applies your triage protocol, calls the on-call line",
      handoff: "A page with the patient's identity, callback number, and verbatim symptom",
    },
    {
      condition: "Caller fails two-step identity verification",
      action: "Stops the chart access, asks the caller to call back from their on-file number",
      handoff: "An audit log entry — no PHI exposed, no cross-tenant access",
    },
    {
      condition: "Question requires a clinician's judgment (dosing, results interpretation)",
      action: "Acknowledges, queues a clinical callback, sends the chart context",
      handoff: "A task in the inbox with the question, identity, and relevant chart fields",
    },
    {
      condition: "Insurance or billing dispute",
      action: "Hands to your billing line during business hours; logs the issue overnight",
      handoff: "A ticket with caller, plan, claim number, and the disputed line",
    },
  ],
} as const;

export const healthcareCompliance = {
  eyebrow: "Compliance, in plain language",
  heading: "Built for the conversation with your security officer.",
  body: "Autocrew's Healthcare Crew is HIPAA-aware end-to-end: PHI is encrypted at rest, every chart access is logged, no patient data appears in application logs, and your tenant is fully isolated from every other practice we serve. We sign BAAs.",
  ledger: [
    { label: "HIPAA-aware", value: "End-to-end" },
    { label: "BAA", value: "Signed on request" },
    { label: "PHI scope", value: "Tenant-isolated" },
    { label: "Audit log", value: "Every access" },
    { label: "EHR standard", value: "FHIR R4" },
    { label: "ID verification", value: "Two-step required" },
  ],
  docsLink: { text: "Read the full technical detail", href: "/docs/healthcare-crew" },
} as const;

export const healthcareByRole = {
  eyebrow: "Built for the people signing the check",
  heading: "Three answers, in the language of three jobs.",
  roles: [
    {
      title: "For the CFO",
      body: "Replace the cost of a 1.5 FTE front desk with a fixed monthly line item, recover the appointments your team is currently sending to voicemail, and stop paying for after-hours coverage you weren't getting anyway.",
      metric: "Typical payback · 6–10 weeks",
    },
    {
      title: "For the CMO",
      body: "Every campaign dollar lands on a line that picks up. Answer rate becomes a metric you can put on the dashboard, alongside booking conversion and reactivation — and actually move.",
      metric: "Answer rate · 100%, 24/7",
    },
    {
      title: "For the practice owner",
      body: "Your providers stop being interrupted between rooms. Your front desk stops triaging the phone instead of the patient at the counter. Mondays start with a clean schedule, not a backlog.",
      metric: "Phone time recovered · ~11 hrs / provider / week",
    },
  ],
} as const;

export const healthcareCta = {
  eyebrow: "Try her, then talk to us",
  badges: [
    { label: "HIPAA-aware", value: "End-to-end" },
    { label: "EHR-integrated", value: "FHIR R4 · SMART" },
  ],
  headline: {
    line1: "Stop Answering Phones.",
    line2: "Start Seeing Patients.",
  },
  subheadline:
    "Hear Sarah handle a real clinic call below — then pick the path that fits your practice. Every interaction is HIPAA-aware and runs against your existing EHR.",
  audio: {
    label: "Listen to a real Sarah call",
    duration: "4:32",
    src: "/audio/Demo Call with Sarah.mp3",
    caption:
      "An actual recording of Sarah answering a clinic line — booking, refill triage, and a clean clinical handoff in under five minutes.",
  },
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
      memberLink: { text: "Already a member? Sign in", href: "https://app.autocrew-ai.com/login" },
    },
  },
  brand: {
    blurb:
      "HIPAA-aware AI receptionist for healthcare practices. Books appointments, triages refills, completes intake, and integrates with your EHR via FHIR R4 — 24/7.",
  },
} as const;

export const healthcareFaqItems = [
  {
    question: "Is this HIPAA compliant?",
    answer:
      "Autocrew's Healthcare Crew is HIPAA-aware end-to-end. PHI is encrypted at rest, application logs never contain patient data, your tenant is isolated from every other practice, and every chart access is recorded in an immutable audit log. We sign BAAs on request.",
  },
  {
    question: "Which EHRs does it work with?",
    answer:
      "Any EHR that exposes a FHIR R4 endpoint with SMART Backend Services, which covers Athena, Epic, eClinicalWorks, NextGen, DrChrono, and most modern practice systems. We can confirm fit during the audit.",
  },
  {
    question: "What happens if Sarah doesn't know the answer?",
    answer:
      "She follows the handoff rules you configure. Clinical questions go to the on-call line with the patient's chart context attached. Failed identity verification stops chart access entirely. Billing disputes go to the billing inbox. Patients hear a calm transfer, not a dead end.",
  },
  {
    question: "How long does it take to deploy?",
    answer:
      "Most clinics are live in two weeks: one week to wire the FHIR connection and validate identity flows, one week to tune the triage protocol with your clinical team. After-hours and overflow can run before your full deployment.",
  },
  {
    question: "Will patients know they're talking to AI?",
    answer:
      "Sarah identifies herself as your clinic's AI receptionist on every call. We've found patients prefer it to voicemail or hold music — they get an answer immediately, and the rare escalation is faster because the chart is already up.",
  },
];
