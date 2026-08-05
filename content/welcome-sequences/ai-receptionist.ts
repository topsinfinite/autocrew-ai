import { defineSequence } from "./_factory";

export const sequence = defineSequence({
  slug: "ai-receptionist",
  label: "AI Receptionist (general)",
  group: "receptionist",
  persona: "solo",
  siteSource: "/ai-receptionist",
  day0Subject: "Welcome to Autocrew — {{package_name}} for {{company}}",
  day0Body: `Hi {{admin_name}},

Welcome to Autocrew. You're set up on **{{package_name}}** for {{company}}.

I'm {{owner_name}} — I'll be your point of contact as you go live. Reply to this email anytime ({{owner_email}}).

**What you bought**
Sarah, Autocrew's AI receptionist, answers inbound calls, captures intent, and escalates to your team with context when a human is needed.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**What happens next**
1. Confirm your admin access to the Autocrew dashboard.
2. We'll walk phone routing / greeting / escalation with you.
3. First real call handled is the milestone that matters.

If anything from the sales conversation should be top-of-mind for setup, just reply and tell me.

Talk soon,
{{owner_name}}
Autocrew`,
  day0BodyMulti: `Hi {{admin_name}},

Welcome to Autocrew. You're set up on **{{package_name}}** for {{company}} across {{locations}} location(s).

I'm {{owner_name}} — I'll be your point of contact as you standardize intake quality across sites. Reply anytime ({{owner_email}}).

**What you bought**
Sarah, Autocrew's AI receptionist, answers inbound calls for your locations, captures intent, and escalates to the right team with context.

**Success in the next 7 days**
{{promised_outcome}}

Target go-live: {{go_live}}.

**What happens next**
1. Confirm HQ admin access to the Autocrew dashboard.
2. We'll align phone routing per location and escalation rules.
3. First real call handled (any site) is the milestone that matters.

Reply with anything from the sales conversation we should prioritize for multi-site rollout.

Talk soon,
{{owner_name}}
Autocrew`,
});
