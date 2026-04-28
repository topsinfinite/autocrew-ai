import type { FAQItem } from "@/lib/mock-data/docs-content";

/**
 * Content for the Restaurant industry page.
 *
 * Voice mirrors the new healthcare, coaching, and legal pages: outcome-
 * focused sentences for the people who decide whether to deploy this —
 * independent owners, multi-location operators, and fine-dining GMs. No
 * fabricated metrics, no stock testimonials. Concrete nouns over generic
 * percentages.
 */

export const restaurantHeroData = {
  status: {
    location: "On every reservation, walk-in, and review",
    role: "Sarah · AI Host",
    coverage: "24/7",
    standard: "30+ integrations",
  },
  badges: [
    { label: "OpenTable · Resy · Toast", icon: "plug" as const },
    { label: "Setup in days", icon: "shield" as const },
  ],
  headline: {
    prefix: "Fill every seat,",
    accent: "without picking up the phone.",
  },
  subheadline:
    "Autocrew answers the line during your dinner rush, books the table, sends the confirmation, and flags the VIP — so your hostess stays at the door, not on hold, and your kitchen gets a clean cover count.",
  spec: {
    label: "Connected · By default",
    figure: "Your stack",
    figureSub: "we plug into the booking, POS, and review tools you use",
    cells: [
      { label: "Reservations", value: "OpenTable · Resy" },
      { label: "POS", value: "Toast · Square" },
      { label: "Reviews", value: "Google · Yelp" },
      { label: "Comms", value: "SMS · Email" },
    ],
    footer: "No-code setup · Live in days",
  },
  primaryCta: { text: "Talk to Sarah live" },
  secondaryCta: { text: "Book a demo", href: "/contact" },
} as const;

export const restaurantSqueeze = {
  eyebrow: "Where the phone takes a bite out of service",
  heading: "Three patterns we hear from every kind of restaurant.",
  intro:
    "It's not that the calls are hard. It's that they ring during the worst possible moments — Friday at 6:47pm, mid-rush, with a line at the door. Here is the squeeze, framed for the three kinds of operation we see most.",
  items: [
    {
      audience: "For the owner-operator",
      headline: "The phone rings during the dinner rush.",
      body: "It's 7:12pm. The hostess is seating a four-top, the line stretches to the bar, and the phone has rung four times. The fourth caller hangs up. They wanted Saturday at 8 — they're booking somewhere else now. The funnel works; the answer rate doesn't.",
    },
    {
      audience: "For the multi-location operator",
      headline: "Five hostesses, five answering styles, no shared playbook.",
      body: "Each location has its own approach to phone reservations, waitlists, no-show policies, and VIP handling. Nothing is consistent, nothing is reportable, and the loyalty guest at one venue is a stranger at the next.",
    },
    {
      audience: "For the fine-dining GM",
      headline: "VIP requests get lost between the host stand and the kitchen.",
      body: "The 7-top wants the back booth. Two are vegan, one is celebrating a 25th anniversary, the host took the call on the floor and meant to write it down. The kitchen finds out at order time — too late to do the thing that would've made it the meal of the year.",
    },
  ],
} as const;

export const restaurantOutcomes = {
  eyebrow: "What it actually does",
  heading: "Four jobs your team stops doing on Monday.",
  intro:
    "No new tablet on the host stand, no new platform for guests to learn. Sarah answers your existing line, books into the reservation system you already use, and writes notes back to the same POS your team already trusts.",
  rows: [
    {
      index: "01",
      title: "Answers reservation calls 24/7 — every one of them.",
      body: "During the rush, after-hours, on the day the manager is out sick. Sarah picks up before the third ring, finds the seating that fits party and time, books it directly into your reservation system, and sends the confirmation. Walk-ins still go to the host — the phone stops competing.",
      footnote: "OpenTable · Resy · SevenRooms · Tock · Yelp Reservations",
    },
    {
      index: "02",
      title: "Confirms, reminds, and rebooks no-shows without anyone calling.",
      body: "Confirmation texts go out the day before, reminders the day of, and a soft outreach if the table goes empty. Cancellations open the slot back up to the waitlist automatically. Your team stops being a confirmation desk; covers stop disappearing into thin air.",
      footnote: "SMS · Email · Waitlist re-offer · Cancellation handling",
    },
    {
      index: "03",
      title: "Captures the VIPs, dietary needs, and special occasions.",
      body: "Allergy callouts, anniversary mentions, regulars by name — Sarah catches them in conversation and writes them straight into the reservation note. The kitchen and the captain see them at the same time, before service starts. Hospitality stops depending on someone remembering to write it down.",
      footnote: "Notes write-back · Allergy flags · Special occasion tags",
    },
    {
      index: "04",
      title: "Drafts review responses in your voice across every platform.",
      body: "Google, Yelp, OpenTable, TripAdvisor — Sarah drafts a thoughtful, on-brand reply for each new review and queues it for your approval. You stop letting weeks of reviews pile up; you stop posting boilerplate. One tap, on-brand, every time.",
      footnote: "Google · Yelp · OpenTable · TripAdvisor · Approval queue",
    },
  ],
} as const;

export const restaurantHandoff = {
  eyebrow: "Where Sarah stops",
  heading: "Some calls are still a host's job. Sarah knows which.",
  intro:
    "Reservations, confirmations, hours, and basic questions are safe to automate. The moments that need a human voice — large parties, special requests, complaints, payment disputes — get handed to a manager or host with the chart already pulled.",
  columns: ["When this happens", "Sarah does this", "Your team gets"],
  rows: [
    {
      condition: "Party of 10+ or full buyout request",
      action: "Captures the brief, hands to your private events lead",
      handoff: "A briefing with date, party size, occasion, and budget cues",
    },
    {
      condition: "Guest complaint about a recent visit",
      action: "Listens, acknowledges, routes immediately to a manager",
      handoff: "An immediate ping with the guest's name, visit, and the issue",
    },
    {
      condition: "Allergy or dietary need beyond your standard menu",
      action: "Captures the detail, routes to the chef before booking confirms",
      handoff: "A flagged reservation note with the specific request",
    },
    {
      condition: "Payment, refund, or gift-card dispute",
      action: "Pauses, logs the issue, hands to your billing contact",
      handoff: "A ticket with guest, amount, date, and the dispute",
    },
  ],
} as const;

export const restaurantIntegrations = {
  eyebrow: "Plugs into the stack you already pay for",
  heading: "No new tablet on the host stand. No new platform for guests.",
  body: "Autocrew connects to the booking, POS, review, and comms tools you've already chosen and works through them — guests keep using the same OpenTable link, the same SMS thread, the same Google listing. We're additive, not a replacement.",
  ledger: [
    { label: "Reservations", value: "OpenTable · Resy · SevenRooms" },
    { label: "POS", value: "Toast · Square · Lightspeed" },
    { label: "Reviews", value: "Google · Yelp · TripAdvisor" },
    { label: "Comms", value: "SMS · Email · Voice" },
    { label: "Waitlist", value: "Yelp · OpenTable · Tock" },
    { label: "Calendar", value: "Google · Outlook" },
  ],
  docsLink: { text: "See the full integration list", href: "/docs" },
} as const;

export const restaurantByRole = {
  eyebrow: "Built for the kind of restaurant you actually run",
  heading: "Three answers, in the language of three operations.",
  roles: [
    {
      title: "For the owner-operator",
      body: "Stop losing the Friday-night reservation because your hostess was at the door. Sarah picks up before the third ring, books the table in your existing system, and sends the confirmation. Your team stays in the room, with the guests who are already there.",
      metric: "Phone answer rate · 100%, 24/7",
    },
    {
      title: "For the multi-location operator",
      body: "One shared answering layer across every venue. Same booking flow, same waitlist policy, same VIP handling — configurable per location, reportable across the group. The loyalty guest at venue A is recognized at venue B.",
      metric: "Consistency · across the whole group",
    },
    {
      title: "For the fine-dining GM",
      body: "VIPs, allergies, special occasions — captured in the reservation note before service starts. Your captain and kitchen see the brief at the same time, every time. Hospitality stops depending on whether the host wrote it down.",
      metric: "VIP brief · in the note before the door",
    },
  ],
} as const;

export const restaurantAskStrip = {
  eyebrow: "Ask Sarah anything a guest would",
  heading: "She's already on the line. Try a real question.",
  body: "These are the kinds of questions Sarah handles for restaurants every day. Tap one — the live widget will open and answer in your browser.",
  prompts: [
    {
      label: "Can I book a table for four on Saturday?",
      prompt:
        "Hi, can I book a table for four on Saturday around 7:30pm?",
    },
    {
      label: "Do you do private dining for a group of 20?",
      prompt:
        "I'm planning a birthday dinner for 20 — do you have private dining options?",
    },
    {
      label: "Do you have gluten-free options?",
      prompt:
        "I have a gluten allergy — can the kitchen accommodate that?",
    },
    {
      label: "What time do you close on Sundays?",
      prompt:
        "Hi, what are your hours on Sunday and is the kitchen open the whole time?",
    },
  ],
  voiceCta: "Or call her live",
} as const;

export const restaurantFaqItems: FAQItem[] = [
  {
    question: "Will Sarah replace my host stand?",
    answer:
      "No. Sarah handles the phone — reservations, confirmations, basic questions, review drafts. Your hostess stays at the door, focused on the guests in the room. Anything that needs a human voice (large parties, complaints, special requests) is routed immediately with full context.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most restaurants are live in days, not weeks. We wire up your existing reservation system, POS, and review platforms, tune the call flow to your service style, and validate the handoff rules with your manager. No new tablets, no migration.",
  },
  {
    question: "What tools does it integrate with?",
    answer:
      "OpenTable, Resy, SevenRooms, Tock, Yelp Reservations, Toast, Square, Lightspeed, Google Business Profile, Yelp, TripAdvisor — plus SMS, email, and voice. We add new integrations on request; if it has an API, we can usually wire it in.",
  },
  {
    question: "Can guests still book through OpenTable or Resy directly?",
    answer:
      "Yes — nothing changes for guests who already book online. Sarah handles the phone calls and the inquiries that don't have a clean online path. Bookings made through her flow into the same reservation system, so your team sees one unified diary.",
  },
  {
    question: "What happens if a guest asks for the manager?",
    answer:
      "Smart escalation. Complaints, scope-of-service questions, payment disputes, and any request you flag as 'manager-only' are routed immediately to whoever is on shift, on whichever channel you prefer — phone, SMS, or push notification.",
  },
  {
    question: "Can I try it before I commit?",
    answer:
      "Yes. Every primary CTA on this page opens the live AutoCrew widget — voice or chat — so you can hear Sarah handle a real reservation question before you book a demo. No sign-up required.",
  },
];

export const restaurantCta = {
  eyebrow: "Try her, then talk to us",
  badges: [
    { label: "30+ integrations", value: "OpenTable · Resy · Toast · Google" },
    { label: "Setup", value: "Days, not weeks" },
  ],
  headline: {
    line1: "Stop Missing Calls.",
    line2: "Start Filling Seats.",
  },
  subheadline:
    "Pick up the line and ask Sarah a real reservation question — she'll answer the same way she would for one of your guests. When you're ready to wire her into your venue, book a demo and we'll walk through your booking system, POS, and service flow.",
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
      "AI host for restaurants — reservations, confirmations, no-show recovery, VIP and allergy capture, and review responses, across the booking, POS, and review tools you already use. Your team stays in the room.",
  },
} as const;
