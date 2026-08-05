import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "ai-receptionist-restaurant",
  label: "AI Receptionist — Restaurant",
  group: "receptionist",
  persona: "solo",
  lockedVertical: "restaurant",
  siteSource: "/industry/restaurant",
  day0Subject: "Welcome to Autocrew — Restaurant AI Receptionist for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}**.

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
Sarah answers reservation and overflow calls when the floor is slammed, captures party size / time / special requests, and escalates to your host team when a human should take it.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. Admin dashboard access.
2. Hours, reservation rules, and escalation line.
3. First reservation or inquiry call handled without the host abandoning the floor.

Reply with peak-service windows we should treat as overflow-first.

Talk soon,
{{owner_name}}
Autocrew`,
  day0BodyMulti: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}** for {{locations}} location(s).

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
Sarah covers reservation/overflow calls across sites so no location becomes the weak link when the floor is full.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. HQ admin access.
2. Per-location hours, menus/policies, escalation.
3. First call handled at any site.

Talk soon,
{{owner_name}}
Autocrew`,
});
