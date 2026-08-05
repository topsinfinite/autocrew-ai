import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "ai-receptionist-legal",
  label: "AI Receptionist — Legal",
  group: "receptionist",
  persona: "solo",
  lockedVertical: "legal",
  siteSource: "/industry/legal",
  day0Subject: "Welcome to Autocrew — Legal AI Receptionist for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}**.

I'm {{owner_name}} ({{owner_email}}) — your setup contact.

**What you bought**
Sarah answers firm calls after hours and during overflow, captures matter intake details, and escalates to the right attorney or intake staff with context — so conflict-sensitive callers aren't left in voicemail.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. Admin dashboard access.
2. Greeting, practice areas, and escalation rules.
3. Calendar / CRM touchpoints from the sales scope.
4. First intake call handled.

Reply with any conflict-check or confidentiality constraints we should bake into the greeting.

Talk soon,
{{owner_name}}
Autocrew`,
});
