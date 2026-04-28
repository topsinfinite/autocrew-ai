import type { SlideContent } from "../slide-content-types";

/**
 * Restaurant Pitch deck — content mined from `app/(public)/industry/restaurant/page.tsx`
 * and `lib/mock-data/restaurant-data.ts`. Default accent: orange, displayStyle: serif-italic.
 */
export const RESTAURANT_PITCH_SLIDES: SlideContent[] = [
  // 1. Cover — hero
  { template: "Cover", content: {
      eyebrow: "SARAH · AI HOST · 24/7",
      headlineParts: [
        { text: "Fill every seat, " },
        { text: "without picking up the phone.", accent: true },
      ],
      sub: "Autocrew answers the line during your dinner rush, books the table, sends the confirmation, and flags the VIP — so your hostess stays at the door, not on hold.",
      footerLeft: "autocrew-ai.com / restaurant",
  }},
  // 2. Problem — squeeze
  { template: "Problem", content: {
      number: "01", label: "THE PROBLEM",
      headlineParts: [
        { text: "The phone rings during the " },
        { text: "dinner rush.", accent: true },
      ],
      body: "It's 7:12pm. The hostess is seating a four-top, the line stretches to the bar, and the phone has rung four times. The fourth caller hangs up. They wanted Saturday at 8 — they're booking somewhere else now. The funnel works; the answer rate doesn't.",
      comparison: {
        leftLabel: "TODAY",
        leftValues: ["Hostess on hold", "Calls drop mid-rush", "VIP notes lost on the floor"],
        rightLabel: "WITH SARAH",
        rightValues: ["Hostess at the door", "Picked up before ring three", "VIP brief in the note before service"],
      },
  }},
  // 3. Solution
  { template: "Solution", content: {
      number: "02", label: "THE SOLUTION",
      headlineParts: [
        { text: "An AI host on the line, " },
        { text: "wired into the stack you already use", accent: true },
        { text: "." },
      ],
      body: "No new tablet on the host stand, no new platform for guests to learn. Sarah answers your existing line, books into the reservation system you already use, and writes notes back to the same POS your team already trusts.",
      bullets: ["RESERVATIONS", "CONFIRMATIONS", "NO-SHOWS", "VIP NOTES", "REVIEWS"],
  }},
  // 4. FiveCardGrid — what it does (4 jobs from page + answer-rate beat)
  { template: "FiveCardGrid", content: {
      number: "03", label: "WHAT IT ACTUALLY DOES",
      headline: "Four jobs your team stops doing on Monday.",
      sub: "Same line, same reservation system, same POS — Sarah just answers.",
      cards: [
        { number: "01", title: "Reservation calls 24/7",    body: "Picked up before ring three. Booked into your system." },
        { number: "02", title: "Confirms & rebooks",         body: "Confirmation, reminder, soft outreach on no-shows." },
        { number: "03", title: "VIP & dietary capture",      body: "Allergies, anniversaries, regulars — into the note." },
        { number: "04", title: "Review responses",           body: "On-brand drafts queued for one-tap approval." },
        { number: "05", title: "Walk-ins stay with the host",body: "The phone stops competing with the door." },
      ],
  }},
  // 5. HeadlineWithScreenshot — Connected by default (kv from hero spec block)
  { template: "HeadlineWithScreenshot", content: {
      number: "04", label: "CONNECTED BY DEFAULT",
      headlineParts: [
        { text: "We plug into the booking, POS, and review tools " },
        { text: "you already pay for.", accent: true },
      ],
      body: "Guests keep using the same OpenTable link, the same SMS thread, the same Google listing. We're additive, not a replacement.",
      bullets: [
        "No new tablet on the host stand",
        "No new platform for guests to learn",
        "One unified diary across channels",
      ],
      screenshot: { kind: "kv", title: "restaurant-crew / stack", rightLabel: "● CONNECTED", rows: [
        { label: "RESERVATIONS", value: "OpenTable · Resy" },
        { label: "POS",          value: "Toast · Square" },
        { label: "REVIEWS",      value: "Google · Yelp" },
        { label: "COMMS",        value: "SMS · Email" },
        { label: "WAITLIST",     value: "Yelp · Tock" },
      ]},
  }},
  // 6. NumberedPoints — Integrations ledger (6 from restaurantIntegrations)
  { template: "NumberedPoints", content: {
      number: "05", label: "INTEGRATIONS",
      headline: "Plugs into the stack you already pay for.",
      points: [
        { number: "01", title: "Reservations", body: "OpenTable · Resy · SevenRooms" },
        { number: "02", title: "POS",          body: "Toast · Square · Lightspeed" },
        { number: "03", title: "Reviews",      body: "Google · Yelp · TripAdvisor" },
        { number: "04", title: "Comms",        body: "SMS · Email · Voice" },
        { number: "05", title: "Waitlist",     body: "Yelp · OpenTable · Tock" },
        { number: "06", title: "Calendar",     body: "Google · Outlook" },
      ],
  }},
  // 7. ComparisonTable — Handoff matrix (from restaurantHandoff)
  { template: "ComparisonTable", content: {
      number: "06", label: "WHERE SARAH STOPS",
      headlineParts: [
        { text: "Some calls are still a host's job. " },
        { text: "Sarah knows which.", accent: true },
      ],
      columns: ["WHEN THIS HAPPENS", "SARAH DOES THIS", "YOUR TEAM GETS"],
      rows: [
        ["Party of 10+ or full buyout",        "Captures the brief, hands to private events", "Briefing with date, party, occasion, budget"],
        ["Guest complaint about a visit",      "Listens, acknowledges, routes to a manager",   "Immediate ping with name, visit, issue"],
        ["Allergy beyond standard menu",       "Captures detail, routes to chef pre-confirm",  "Flagged reservation note with the request"],
        ["Payment, refund, gift-card dispute", "Pauses, logs, hands to billing contact",       "Ticket with guest, amount, date, dispute"],
      ],
  }},
  // 8. SixCardGrid — By role (3 ops × 2 beats each)
  { template: "SixCardGrid", content: {
      number: "07", label: "FOR THE KIND OF RESTAURANT YOU RUN",
      headline: "Three answers, in the language of three operations.",
      cards: [
        { cornerLabel: "OWNER-OPERATOR", title: "100% phone answer rate", body: "Picked up before ring three, every time." },
        { cornerLabel: "OWNER-OPERATOR", title: "Hostess at the door",    body: "Stop losing the Friday-night reservation." },
        { cornerLabel: "MULTI-LOCATION", title: "Group consistency",      body: "Same booking flow and waitlist policy across venues." },
        { cornerLabel: "MULTI-LOCATION", title: "Loyalty across venues",  body: "The regular at venue A is recognized at venue B." },
        { cornerLabel: "FINE-DINING GM", title: "VIP brief in the note",  body: "Captain and kitchen see it before service." },
        { cornerLabel: "FINE-DINING GM", title: "Allergy & occasion tags",body: "Captured in conversation, written straight to the reservation." },
      ],
  }},
  // 9. ClosingCTA
  { template: "ClosingCTA", content: {
      headlineParts: [
        { text: "Stop missing calls. " },
        { text: "Start filling seats.", accent: true },
      ],
      sub: "Pick up the line and ask Sarah a real reservation question — she'll answer the same way she would for one of your guests. When you're ready, book a demo and we'll walk through your booking system, POS, and service flow.",
      primaryCta: { label: "Book a demo", href: "https://autocrew-ai.com/contact" },
      secondaryCta: { label: "Talk to Sarah live", href: "https://autocrew-ai.com/industry/restaurant" },
  }},
];
