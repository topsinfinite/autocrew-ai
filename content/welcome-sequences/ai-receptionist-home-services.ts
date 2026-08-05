import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "ai-receptionist-home-services",
  label: "AI Receptionist — Home Services",
  group: "receptionist",
  persona: "solo",
  lockedVertical: "home-services",
  siteSource: "/industry/home-services",
  day0Subject:
    "Welcome to Autocrew — Home Services AI Receptionist for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}**.

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
Sarah answers inbound service calls (HVAC, plumbing, electrical, etc.), captures job details and urgency, and books or escalates so emergency callers aren't left on voicemail while techs are in the field.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. Admin dashboard access.
2. Service zones, after-hours rules, escalation numbers.
3. CRM / dispatch touchpoints from sales scope.
4. First job inquiry handled.

Reply with after-hours emergency rules we must respect.

Talk soon,
{{owner_name}}
Autocrew`,
  day0BodyMulti: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}** across {{locations}} location(s) / service areas.

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
Sarah covers inbound job calls so no branch or dispatch desk becomes the missed-call leak.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. HQ admin access.
2. Zones, after-hours, per-site escalation.
3. CRM / dispatch scope locked.
4. First job inquiry handled.

Talk soon,
{{owner_name}}
Autocrew`,
});
