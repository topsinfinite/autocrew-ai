import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "ai-receptionist-coaching",
  label: "AI Receptionist — Coaching",
  group: "receptionist",
  persona: "solo",
  lockedVertical: "coaching",
  siteSource: "/industry/coaching",
  day0Subject: "Welcome to Autocrew — Coaching AI Receptionist for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}**.

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
Sarah answers new-client and scheduling calls while you're in session, captures intent, and books or escalates so prospects don't bounce to the next coach in their search results.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. Admin dashboard access.
2. Calendar / booking rules and escalation.
3. First prospect call answered live (not voicemail).

Reply with your session blackout windows so we route correctly.

Talk soon,
{{owner_name}}
Autocrew`,
});
