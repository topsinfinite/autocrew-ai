import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "ai-receptionist-healthcare",
  label: "AI Receptionist — Healthcare",
  group: "receptionist",
  persona: "multi-location",
  lockedVertical: "healthcare",
  siteSource: "/industry/healthcare",
  day0Subject: "Welcome to Autocrew — Healthcare AI Receptionist for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}** — HIPAA-aware call handling for your practice.

I'm {{owner_name}} ({{owner_email}}). Reply here for anything setup-related.

**What you bought**
Sarah answers patient calls, helps with appointments and common intake questions, and escalates to your front desk with a briefing when a human should take over.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**What happens next**
1. Confirm admin dashboard access.
2. Align greeting, office hours, and escalation numbers.
3. Confirm EHR / calendar touchpoints scoped in sales.
4. First patient call handled cleanly.

If compliance or BAA paperwork is still open, reply and we'll prioritize that before go-live.

Talk soon,
{{owner_name}}
Autocrew`,
  day0BodyMulti: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}** across {{locations}} location(s) — HIPAA-aware call handling for the group.

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
Sarah standardizes inbound patient intake across sites, escalates with context, and keeps HQ from guessing which location is the weak link.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. HQ admin access confirmed.
2. Per-location routing + escalation map.
3. EHR / calendar scope from sales locked.
4. First patient call handled at any site.

Reply with BAA / compliance blockers if any are still open.

Talk soon,
{{owner_name}}
Autocrew`,
});
