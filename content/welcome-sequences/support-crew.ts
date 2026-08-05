import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "support-crew",
  label: "Support Crew",
  group: "crews",
  persona: "solo",
  siteSource: "/docs/support-crew",
  day0Subject: "Welcome to Autocrew — Support Crew for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}**.

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
The Support Crew — AI voice and chat support grounded in your knowledge base, with Smart Escalation (live bridge, agent briefing, email fallback) when a human should take over.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. Admin dashboard access.
2. Knowledge base connected / seeded.
3. Escalation numbers and fallback email confirmed.
4. First support conversation handled (voice or chat).

Reply with the support channels you want live first (phone, widget, both).

Talk soon,
{{owner_name}}
Autocrew`,
});
