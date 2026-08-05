import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "widget",
  label: "Embeddable Widget",
  group: "widget",
  persona: "solo",
  siteSource: "/widget",
  day0Subject: "Welcome to Autocrew — Widget for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. {{company}} is on **{{package_name}}**.

I'm {{owner_name}} ({{owner_email}}).

**What you bought**
The Autocrew embeddable widget turns site buttons and surfaces into live conversations with your AI crew — no form dead-ends.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**Next**
1. Admin dashboard access.
2. Install snippet on your site (or staging first).
3. Configure trigger surfaces and knowledge.
4. First live visitor conversation from the widget.

Reply with your staging URL if you want us to verify install before production.

Talk soon,
{{owner_name}}
Autocrew`,
});
