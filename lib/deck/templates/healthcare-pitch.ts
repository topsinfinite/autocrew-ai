import type { SlideContent } from "../slide-content-types";

/**
 * Healthcare Pitch deck — content mined from `app/(public)/industry/healthcare/page.tsx`
 * and `lib/mock-data/healthcare-data.ts`. Default accent: green, displayStyle: serif-italic.
 */
export const HEALTHCARE_PITCH_SLIDES: SlideContent[] = [
  // 1. Cover — hero headline
  { template: "Cover", content: {
      eyebrow: "SARAH · AI RECEPTIONIST · 24/7",
      headlineParts: [
        { text: "The front desk that " },
        { text: "never sends a patient to voicemail.", accent: true },
      ],
      sub: "Autocrew answers your clinic line at 9pm, on Saturdays, and through every lunch break — books appointments, triages refill questions, completes intake, and hands the rare exception cleanly to your team.",
      footerLeft: "autocrew-ai.com / healthcare",
  }},
  // 2. Problem — revenue leak / squeeze
  { template: "Problem", content: {
      number: "01", label: "THE PROBLEM",
      headlineParts: [
        { text: "Three numbers your front desk " },
        { text: "can't see at the same time", accent: true },
        { text: "." },
      ],
      body: "The bottleneck isn't your team — it's that the phone rings during the worst possible moments of a clinical day. Calls go to voicemail, new patients give up after one missed call, and clinical time is eaten by refills and scheduling.",
      comparison: {
        leftLabel: "TODAY",
        leftValues: ["23% of calls unanswered", "1 in 5 new patients gives up", "11 hrs/wk lost to phones"],
        rightLabel: "WITH SARAH",
        rightValues: ["100% answer rate, 24/7", "Every campaign lands on a line that picks up", "Providers stop being interrupted"],
      },
  }},
  // 3. Solution
  { template: "Solution", content: {
      number: "02", label: "THE SOLUTION",
      headlineParts: [
        { text: "An AI receptionist that runs on your " },
        { text: "existing line and EHR", accent: true },
        { text: "." },
      ],
      body: "No new dashboard to learn. Sarah works your existing clinic line and your existing EHR — patients can't tell it isn't a person, except that nobody is ever on hold.",
      bullets: ["BOOK", "REFILL", "INTAKE", "AFTER-HOURS", "TRIAGE"],
  }},
  // 4. BigStat — coverage
  { template: "BigStat", content: {
      number: "03", label: "COVERAGE",
      stat: "24/7",
      statLabel: "VOICE AGENT, EVERY CLINIC LINE",
      context: "Nights, weekends, and the 11:30am rush are answered the same way. Your team starts the day with a clean ledger instead of 36 voicemails.",
  }},
  // 5. FiveCardGrid — what it does (4 jobs from page; we add the after-hours pattern as a 5th)
  { template: "FiveCardGrid", content: {
      number: "04", label: "WHAT IT ACTUALLY DOES",
      headline: "Four jobs your team stops doing on Monday.",
      sub: "Sarah works your existing clinic line and your existing EHR.",
      cards: [
        { number: "01", title: "Books & reschedules", body: "Direct-to-EHR. No callback queue." },
        { number: "02", title: "Refills & results", body: "Verified answers. Clinical questions routed." },
        { number: "03", title: "Intake before the visit", body: "Insurance, demographics, history captured." },
        { number: "04", title: "After-hours overflow", body: "Nights, weekends, lunch rush." },
        { number: "05", title: "Identity verification", body: "Two-step, before any chart access." },
      ],
  }},
  // 6. HeadlineWithScreenshot — Built-in defaults (kv from hero shift block)
  { template: "HeadlineWithScreenshot", content: {
      number: "05", label: "BUILT-IN BY DEFAULT",
      headlineParts: [
        { text: "HIPAA-aware end-to-end. " },
        { text: "EHR-integrated by default.", accent: true },
      ],
      body: "PHI is encrypted at rest, every chart access is logged, no patient data appears in application logs, and your tenant is fully isolated from every other practice we serve. We sign BAAs.",
      bullets: [
        "PHI never leaves your tenant",
        "Two-step caller verification",
        "Audit log per chart access",
      ],
      screenshot: { kind: "kv", title: "healthcare-crew / defaults", rightLabel: "● ENABLED", rows: [
        { label: "EHR API", value: "FHIR R4" },
        { label: "ID VERIFY", value: "2-step" },
        { label: "ENCRYPTION", value: "AES-256" },
        { label: "AUDIT LOG", value: "Per access" },
        { label: "BAA", value: "Signed on request" },
      ]},
  }},
  // 7. NumberedPoints — Compliance ledger (6 items from healthcareCompliance)
  { template: "NumberedPoints", content: {
      number: "06", label: "COMPLIANCE, IN PLAIN LANGUAGE",
      headline: "Built for the conversation with your security officer.",
      points: [
        { number: "01", title: "HIPAA-aware",      body: "End-to-end across the call." },
        { number: "02", title: "BAA",              body: "Signed on request." },
        { number: "03", title: "PHI scope",        body: "Tenant-isolated." },
        { number: "04", title: "Audit log",        body: "Every chart access." },
        { number: "05", title: "EHR standard",     body: "FHIR R4." },
        { number: "06", title: "ID verification",  body: "Two-step required." },
      ],
  }},
  // 8. ComparisonTable — Handoff matrix
  { template: "ComparisonTable", content: {
      number: "07", label: "WHERE THE AI STOPS",
      headlineParts: [
        { text: "We designed Sarah to know " },
        { text: "when she's not the right answer.", accent: true },
      ],
      columns: ["WHEN THIS HAPPENS", "SARAH DOES THIS", "YOUR TEAM GETS"],
      rows: [
        ["Clinical symptom requiring triage",          "Pauses, applies your triage protocol, calls on-call", "Page with identity, callback, verbatim symptom"],
        ["Caller fails two-step ID verification",      "Stops chart access, asks them to call from on-file #",  "Audit entry — no PHI exposed"],
        ["Question needs clinician judgment",          "Acknowledges, queues callback, sends chart context",    "Inbox task with question + chart fields"],
        ["Insurance or billing dispute",               "Hands to billing line; logs overnight",                 "Ticket with caller, plan, claim, line"],
      ],
  }},
  // 9. SixCardGrid — By role (3 from page, paired with the metric chip — we surface 6 specific value beats)
  { template: "SixCardGrid", content: {
      number: "08", label: "FOR THE PEOPLE SIGNING THE CHECK",
      headline: "Three answers, in the language of three jobs.",
      cards: [
        { cornerLabel: "CFO",            title: "Replace 1.5 FTE cost", body: "Fixed monthly line item; recover voicemail bookings." },
        { cornerLabel: "CFO",            title: "Payback in 6–10 weeks",  body: "Stop paying for after-hours coverage you weren't getting." },
        { cornerLabel: "CMO",            title: "100% answer rate",       body: "Every campaign dollar lands on a line that picks up." },
        { cornerLabel: "CMO",            title: "Answer rate on the dash",body: "A metric you can put next to booking conversion." },
        { cornerLabel: "PRACTICE OWNER", title: "~11 hrs/provider/week",  body: "Phone time recovered for clinical work." },
        { cornerLabel: "PRACTICE OWNER", title: "Clean Monday schedule",  body: "No backlog of voicemails to triage." },
      ],
  }},
  // 10. Quote — synthesized as a positioning quote sourced from the page's brand voice (no testimonial on page)
  // Skipped — page contains no real testimonial, and we will not invent one.

  // 10. ClosingCTA
  { template: "ClosingCTA", content: {
      headlineParts: [
        { text: "Stop answering phones. " },
        { text: "Start seeing patients.", accent: true },
      ],
      sub: "Hear Sarah handle a real clinic call, then pick the path that fits your practice. Every interaction is HIPAA-aware and runs against your existing EHR.",
      primaryCta: { label: "Book a demo", href: "https://autocrew-ai.com/contact" },
      secondaryCta: { label: "Talk to Sarah live", href: "https://autocrew-ai.com/industry/healthcare" },
  }},
];
