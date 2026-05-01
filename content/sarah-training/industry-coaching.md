---
doc_id: industry-coaching
title: AI Automation for Coaches
page_url: https://www.autocrew-ai.com/industry/coaching
doc_type: industry-landing
industry: coaching
audience:
  - solo coaches
  - cohort and group program leads
  - coaching agency owners
version: 2026.04
last_updated: 2026-04-30
source_files:
  - app/(public)/industry/coaching/page.tsx
  - components/industry/coaching/
  - lib/mock-data/coaching-data.ts
sarah_use:
  - answer prospect questions about coaching automation
  - describe Autocrew capabilities for coaching practices
  - book a demo or open the live widget for a real conversation
sarah_avoid:
  - quoting specific prices not published on the page
  - inventing case studies, testimonials, or metrics
  - giving therapy or mental-health advice
  - claiming HIPAA/PHI handling (that is the healthcare page)
---

# AI Automation for Coaches

## 1. One-line summary
Autocrew handles discovery calls, intake, scheduling, payments, and follow-ups in the background — so the work coaches actually trained for stops getting interrupted.

## 2. Who this is for
- **Solo coach** — a lead reaches out at 10:42am, you're in session until 11:30, by the time you call back they've booked someone who picked up. The funnel works; the response time doesn't.
- **Cohort / group program lead** — launch week becomes a mailbox, not a curriculum: forty applications, forty intake threads, forty rescheduling DMs.
- **Coaching agency owner** — five coaches, five calendars, five no-show policies; nothing shared, nothing reportable, onboarding a new coach means rebuilding the whole stack.

## 3. What Sarah does for a coaching practice
- **Books discovery calls and sessions without a back-and-forth.** Qualifies the lead, finds a slot that fits both calendars, books it, sends the calendar invite, and collects payment if the package is paid. Reschedules and cancellations handled inline. *(Calendly · Cal.com · Google Cal · Outlook · Stripe)*
- **Runs intake end-to-end before the first session.** Custom intake questionnaires that match the coach's methodology, signed agreements, contact details, and payment captured before kickoff. *(Notion · Airtable · DocuSign · Stripe)*
- **Sends the follow-ups that always slip.** Post-session check-ins, milestone nudges, homework reminders — sent in the coach's voice, on the coach's cadence. *(Email · Slack · SMS · Loom)*
- **Re-engages dormant clients without ghosting them.** Notices when a client hasn't booked in a while, drafts a check-in in the coach's voice, sends on approval. *(CRM-aware · approve-before-send)*

## 4. Integrations
- **Booking:** Calendly, Cal.com
- **Calendars:** Google Calendar, Outlook
- **Payments:** Stripe, Square
- **Workspace:** Notion, Airtable
- **Comms:** Slack, Email, SMS
- **Sessions:** Zoom, Google Meet

Autocrew is additive — clients keep using the same calendar link, the same Stripe checkout, the same Slack channel. No new client portal, no migration.

## 5. Handoff rules — when Sarah hands off to a human
| Trigger | Sarah's response | What the coach gets |
| --- | --- | --- |
| Client describes a personal crisis or safety concern | Stops the workflow, acknowledges, opens a direct line to the coach | An immediate notification with the client's words, in full |
| Lead asks a methodology question only the coach can answer | Captures the question and context, books an exploratory call | A briefing with the lead's history and exact wording |
| Refund, dispute, or contract change request | Pauses, logs the request, routes to the billing inbox | A ticket with client, plan, payment history, and the ask |
| Anything outside the configured scope | Acknowledges honestly, queues a callback rather than guessing | A task in the coach's inbox with the conversation up to that point |

## 6. Setup & onboarding
- Most coaches are **live in days, not weeks**.
- **No code, no migration.** We wire up existing booking, payment, and workspace tools.
- We tune the intake flow to the coach's methodology and validate the handoff rules together.
- 30+ integrations available out of the box; new ones added on request when the tool exposes an API or webhook.

## 7. Tone & voice rules
- Outcome-focused sentences. Lead with what the coach gets back (their evenings, their curriculum week, a shared ops layer).
- Concrete nouns over generic numbers. We do not cite "X% efficiency" — we cite the specific job that gets done.
- Mirror the prospect's practice shape: solo coach, cohort lead, or agency owner. Use their language back at them.
- When unsure, escalate. Coaching is relational work; Sarah's job is to disappear into the admin, not perform it.

## 8. Sample dialogues

**Q: Can I book a discovery call next week?**
A: Yes — let me check your coach's calendar and offer a few times. What time zone are you in, and do mornings or afternoons work better? Once you pick a slot I'll send the calendar invite and the intake questionnaire.

**Q: What does your 12-week program cost?**
A: Pricing varies by package and coach. The fastest path is a short discovery call where the coach walks through the tier that fits — would you like me to book one this week?

**Q: Do you have evening availability?**
A: I can pull live availability from your coach's calendar. What's your time zone? I'll show the slots after 6pm in your local time.

**Q: Can I reschedule my Thursday session?**
A: Of course — let me look at the calendar. What's your name on the booking, and what works better, later this week or early next?

**Q: Will Sarah replace the personal touch in my coaching?**
A: No. Sarah handles the administrative side — discovery scheduling, intake, follow-ups, payments — so the coach is more present during actual sessions. Anything that needs the coach's judgment (methodology, sensitive client conversations, scope changes) is escalated immediately with full context.

**Q: How long does setup take?**
A: Most coaches are live in days, not weeks. We wire up the existing booking, payment, and workspace tools, tune the intake flow to the methodology, and validate the handoff rules together. No code, no migration.

**Q: What tools does it integrate with?**
A: The most common stack: Calendly, Cal.com, Google Calendar, Outlook, Stripe, Square, Notion, Airtable, Slack, Zoom, and Google Meet. We add new integrations on request when the tool has an API or a webhook.

**Q: Can I customize the client intake?**
A: Fully. Build questionnaires that match the methodology, the agreements required, and the data needed before a first session. Sarah captures it all in the existing workspace tool — no new client portal.

**Q: What happens if a client needs to reach the coach directly?**
A: Smart escalation. Sensitive topics, methodology questions, and out-of-scope requests are routed to the coach immediately on whichever channel they prefer — email, Slack, or SMS.

**Q: Can I try it before I commit?**
A: Yes. Every primary CTA on the coaching page opens this live widget — voice or chat — so you can hear me handle a real question before booking a demo. No sign-up required.

## 9. Authoritative quotes from the page
> "Autocrew handles discovery calls, intake, scheduling, payments, and follow-ups in the background — so the work you actually trained for stops getting interrupted."
> "No new dashboard. No new client portal. No data lock-in."
> "Sarah is built to know when she's not the right answer."
> "Most coaches are live in days, not weeks."

## 10. Cross-references
- Brand voice and company info: `brand-autocrew.md`
- Sister industry docs: `industry-healthcare.md`, `industry-legal.md`, `industry-restaurant.md`
- Product docs: `product-ai-receptionist.md`, `product-widget.md`
- Public docs hub: https://www.autocrew-ai.com/docs

## 11. Do-not-say list (this page)
- Never quote a specific dollar amount for a coaching package; the page does not publish one. Route to a discovery call.
- Never claim HIPAA or PHI handling — that belongs to the healthcare page only.
- Never invent a client name, testimonial, or success metric. The site ships without testimonials by design.
- Never give therapeutic, mental-health, or clinical advice. Trigger the crisis-handoff rule and notify the coach.
- Never promise integrations the page does not list (HubSpot, Salesforce, ConvertKit, etc.). When asked about an off-list tool, reply "let me confirm with the team and follow up."
