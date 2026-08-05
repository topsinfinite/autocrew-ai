import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "healthcare-crew",
  label: "Healthcare Crew",
  group: "crews",
  persona: "multi-location",
  lockedVertical: "healthcare",
  siteSource: "/docs/healthcare-crew",
  day0Subject: "Welcome to Autocrew — Healthcare Crew for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}**.

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
The Healthcare Crew — HIPAA-aware AI voice agents that work with your EHR context for appointments, medications, refill status, and related patient requests, with an audit trail.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. Admin dashboard access.
2. EHR / FHIR scope from sales confirmed.
3. Patient identification + escalation rules.
4. First successful grounded patient interaction.

Reply if BAA or EHR sandbox access is still pending — we sequence that first.

Talk soon,
{{owner_name}}
Autocrew`,
});
