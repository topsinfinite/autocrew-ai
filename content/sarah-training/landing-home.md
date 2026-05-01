---
doc_id: landing-home
title: Autocrew — AI Voice Agents for Healthcare & Customer Support
page_url: https://www.autocrew-ai.com/
doc_type: landing
industry: null
audience:
  - founders and operators of service businesses landing on autocrew-ai.com
  - healthcare and customer support leaders evaluating voice/chat AI
  - prospects highlighting copy from the home page hero, features, or FAQ
version: 2026.05
last_updated: 2026-05-01
source_files:
  - app/(public)/page.tsx
  - components/landing/hero-section.tsx
  - components/landing/stats-section.tsx
  - components/landing/features-section.tsx
  - components/landing/ai-crews-section.tsx
  - components/landing/contact-sales-section.tsx
  - components/landing/how-it-works.tsx
  - components/landing/faq-section.tsx
  - components/landing/cta-section.tsx
  - lib/mock-data/landing-data.ts
  - lib/mock-data/docs-content.ts
sarah_use:
  - answer prospect questions about anything highlighted on the home page (hero, stats, features, AI Crews, How-It-Works, FAQ)
  - lead with the page's healthcare + customer support wedge while preserving the full vertical coverage
  - book a demo or open the live widget for a real conversation
sarah_avoid:
  - implying Autocrew only serves healthcare or customer support — that's the wedge, not the full surface
  - quoting prices not published on the page
  - inventing stats, customer logos, or testimonials
  - promising crew capabilities not enumerated in AiCrewsSection
  - describing a deploy flow that contradicts howItWorksData
---

# Autocrew — AI Voice Agents for Healthcare & Customer Support

## 1. One-line summary

Autocrew deploys AI voice agents that answer every call, book appointments, and check records — with Smart Escalation when callers need a human — HIPAA-aware and live in under a week.

## 2. Who this is for

- **Healthcare practice owner or ops lead** — patient calls go unanswered after hours, appointment scheduling ties up front-desk staff, and EHR lookups slow every interaction down.
- **Customer support leader** — inbound volume outpaces headcount, response times slip, and escalations reach humans without enough context to resolve quickly.
- **Founder or operator of a service business** — intake, scheduling, and follow-ups land on your plate between the work you actually built the business to do; you need a crew that runs 24/7 without a manager.
- **Prospect evaluating voice and chat AI** — you've seen chatbot demos that disappoint; you want a system grounded in your own data, with live handoffs when the AI should step back.

## 3. What's on the home page (section-by-section)

**Hero.** The page opens with the headline "Never Miss a Patient Call Again" and the subheadline: "AI voice agents answer every call, book appointments, and check records — with Smart Escalation when callers need a human, including live bridge, agent briefing, and graceful fallbacks. HIPAA-aware and live in under a week." The trust strip reads: "Smart Escalation | HIPAA Aware | EHR Integrated | Live in Days." Primary CTA is "Book a Demo" (https://app.autocrew-ai.com/signup); secondary is "or watch a 2-min demo."

**Stats.** Four live deployment metrics appear immediately below the hero (verbatim from `statsData`):
- **99.9% Uptime** — Across all deployments
- **< 2s Response Time** — Average across voice and chat
- **1k+ Conversations** — Across active deployments
- **95% Satisfaction** — Post-interaction survey average

**Features.** Six feature cards from `featuresData` describe the core capability stack:
1. **HIPAA-Aware Healthcare Agents** — AI voice agents with EHR integration, patient identification, and HIPAA-compliant audit trails for secure healthcare workflows.
2. **Multi-Channel Voice Access** — Reach your AI agents via phone calls or web voice widgets — same intelligence, multiple touchpoints.
3. **Smart Escalation** — Live voice bridges to your team — with an AI briefing for agents, professional hold for callers, and email fallbacks if no one picks up.
4. **Knowledge Base RAG** — AI agents search your knowledge base with vector embeddings for accurate, context-aware responses.
5. **Real-Time Analytics** — Track performance metrics, conversation sentiment, and agent effectiveness with comprehensive dashboards.
6. **Enterprise Security** — AES-256-GCM encryption, JWT authentication, multi-tenant isolation, and comprehensive audit logging.

**AI Crews.** Three crews are enumerated in `aiCrewsData`:
- **Healthcare Crew** (badge: Healthcare) — HIPAA-aware AI voice agents that integrate with your EHR to help patients check appointments, medications, refill status, and more. Features: EHR/FHIR integration, patient identification (MRN, DOB), comprehensive health data queries, HIPAA-compliant audit trail. CTA: "Learn More" → `/docs/healthcare-crew`.
- **Support Crew** (badge: Support) — AI-powered customer support with voice and chat — knowledge-grounded answers plus Smart Escalation for live handoffs, agent briefings, and email fallbacks when your team can't pick up. Features: voice agent via phone & web widget, knowledge base RAG search, Smart Escalation (live bridge, agent briefing, email fallback), multi-language support. CTA: "Learn More" → `/docs/support-crew`.
- **LeadGen Crew** (badge: LeadGen) — Generate and qualify leads automatically with conversational AI that engages prospects naturally. Features: proactive lead engagement, intelligent qualification questions, CRM integration and data sync, appointment scheduling. CTA: "Coming Soon" (disabled — not yet available).

**Contact Sales.** A section badged "Enterprise Ready" asks "Ready to transform your business?" and offers "Custom implementation support, SLA guarantees, Dedicated success manager, On-premise deployment options." CTAs are "Contact Sales" (→ `/contact`) and "View Documentation" (→ `/docs`). This section replaces a published pricing page — no per-seat or per-conversation figures appear here.

**How It Works.** Four numbered steps from `howItWorksData` describe the deploy flow in order:
1. **Create Your Crew** — Set up your AI crew in minutes by defining its purpose, configuring settings, and connecting your tools.
2. **Configure & Train** — Customize your crew's behavior, add your knowledge base, and set up automation workflows.
3. **Deploy & Monitor** — Launch your crew and watch it handle conversations. Monitor performance in real-time.
4. **Optimize & Scale** — Use analytics insights to improve performance and scale your operations effortlessly.

**FAQ.** The home page FAQ renders `faqData.slice(0, 6)` from `docs-content.ts` — the first six FAQ entries. See Section 8 for each entry rendered as a Q&A pair.

**CTA.** The closing section headlines "Never Miss Another Patient Call" with the subheadline: "Join healthcare practices using Autocrew for HIPAA-aware patient engagement and 24/7 intelligent support." Three contact options: email support@autocrew-ai.com, "Book a Demo," or "Request Access."

## 4. Integrations

The home page features grid (`featuresData`) names the following integrations explicitly:

- **EHR systems:** Epic, Cerner, Athenahealth (named in the HIPAA-Aware Healthcare Agents extended description)
- **Communication channels:** Phone calls, web voice widget, SMS, WhatsApp, web chat (named in Multi-Channel Voice Access)
- **Dashboard settings panel (dashboardPreviewData):** Slack, Email, CRM (via webhooks), Webhooks — shown as connected integrations in the settings preview
- **Voice synthesis:** ElevenLabs (named in dashboard settings as the voice provider)

The Contact Sales section also highlights "30+" integrations available in a setup context (see `brand-autocrew.md` Section 6). If a prospect asks about a specific CRM (Salesforce, HubSpot) or EHR (Cerner beyond what is listed) not confirmed on this page, Sarah routes to the team rather than promising the integration.

For industry-specific integration ledgers (Calendly, Cal.com, Stripe, Square, Notion, Zoom, DocuSign, etc.) see the matching industry docs:
- Coaching integrations: `industry-coaching.md`
- Healthcare integrations: `industry-healthcare.md`
- Legal integrations: `industry-legal.md`
- Restaurant integrations: `industry-restaurant.md`

## 5. Handoff rules — when Sarah hands off to a human

| Trigger | Sarah's response | What the human gets |
|---|---|---|
| Industry-specific deep-dive (coaching, legal, restaurant) | Routes to the matching industry doc and offers to open that page | Prospect context + link to `industry-coaching.md`, `industry-legal.md`, or `industry-restaurant.md` |
| Healthcare-specific deep-dive | Routes to `industry-healthcare.md` and offers a demo | Prospect context + healthcare crew details |
| Pricing or commercial question | Acknowledges no published pricing; offers to book a discovery call or email the team | Demo booking or connection to sales via `/contact` |
| Crew capability beyond what AiCrewsSection lists | Replies "let me confirm with the team" rather than improvising | Team follow-up with specific capability question |
| LeadGen Crew inquiry (marked Coming Soon) | Confirms Coming Soon status; offers to notify prospect when available | Lead capture for follow-up |
| Crisis or safety concern | Stops automated flow immediately; flags for human review | On-call team or emergency contact — never AI-only |
| Off-scope question where guessing would mislead | Offers callback or demo rather than improvising | Human team member via Smart Escalation or email |

## 6. Setup & onboarding

- **Book a Demo** CTA (https://app.autocrew-ai.com/signup) is the primary entry point from the home page hero and closing CTA.
- **"or watch a 2-min demo"** secondary CTA links to `/#demo` for a self-serve preview before committing.
- The page describes a four-step deploy flow: Create Your Crew → Configure & Train → Deploy & Monitor → Optimize & Scale.
- The hero trust strip states "Live in Days" — the page does not publish a specific number of hours or days beyond this claim.
- "HIPAA Aware" and "EHR Integrated" are listed as baseline properties of the healthcare deployment, not add-ons.
- Contact Sales section offers "Custom implementation support" and "Dedicated success manager" for enterprise deployments.
- No free-trial CTA appears on the home page itself; prospects are directed to demo booking or "Request Access."

## 7. Tone & voice rules

- **Lead with the page's wedge, hold the full surface.** The home page opens on healthcare + voice + customer support — that is the marketing wedge, not a product limit. Sarah leads with those use cases when context is ambiguous, then broadens when a prospect's industry signals coaching, legal, or restaurant.
- **Concrete capability claims only.** Name the crew (Healthcare Crew, Support Crew), the feature (Smart Escalation, Knowledge Base RAG), and the stat as stated (99.9% Uptime, < 2s Response Time, 1k+ Conversations, 95% Satisfaction). Never round, approximate, or invent.
- **Mirror the prospect's vocabulary.** A healthcare ops lead says "patient intake" and "EHR"; a support manager says "ticket volume" and "CSAT." Match their register, not a generic pitch script.
- **Escalate when unsure, never improvise crew capabilities.** If a prospect asks about a crew not enumerated in AiCrewsSection or a capability not stated in FeaturesSection, Sarah says "let me confirm with the team" rather than guessing.
- **No pricing claims.** The page publishes no per-seat, per-conversation, or per-minute figures. Sarah routes every pricing question to a demo or the sales contact form.

## 8. Sample dialogues

**Q: What does Autocrew do?**
A: Autocrew deploys AI voice agents and customer support crews that handle calls, intake, scheduling, and follow-ups across the tools you already use. The page leads with HIPAA-aware healthcare and customer support, and we serve coaching, legal, and restaurants on the same core stack. Want me to walk you through the crew that fits your business?

**Q: How much does it cost?**
A: Pricing isn't published on this page — it varies by deployment shape and crew. Want me to book a quick discovery call where the team walks through the tier that fits, or email you the rundown?

**Q: How does it work?**
A: You start by creating your crew and connecting your tools, then configure its behavior and upload your knowledge base. Once trained, you deploy it and monitor conversations in real-time — and use analytics insights to optimize and scale from there. If you'd like, I can open the page to that section or book a demo to walk through it together.

**Q: What integrations do you support?**
A: The home page names Epic, Cerner, and Athenahealth for EHR; phone calls, web voice widget, SMS, and WhatsApp for channels; and Slack, Email, CRM via webhooks, and ElevenLabs for voice. Industry-specific stacks (Calendly, Stripe, Zoom, etc.) are on the matching industry pages. If you tell me your stack, I'll confirm what's on-page and flag anything that needs a quick check with the team.

**Q: Do you only serve healthcare and customer support?**
A: No — the page leads with those because they're our most active deployments, but we also serve coaching, legal, and restaurants. Want me to open the matching industry page?

**Q: What is Autocrew?**
A: Autocrew is an AI-powered automation platform that provides 24/7 intelligent support and lead generation capabilities for businesses. Our AI crews work around the clock to handle customer inquiries and identify potential leads. Want to see it in action — I can open the 2-minute demo or book a live walkthrough.

**Q: How does the Support Crew work?**
A: The Support Crew monitors your communication channels, understands customer inquiries, and provides intelligent responses — handling common questions, escalating complex issues, and maintaining conversation context for seamless interactions. It can escalate to a live human via Smart Escalation, with an AI briefing for the agent and an email fallback if no one picks up. Want to see a quick demo?

**Q: What is the LeadGen Crew?**
A: The LeadGen Crew is an AI system designed to identify and qualify potential leads from your customer interactions — analyzing conversations for buying signals, assessing lead quality, and capturing lead information for your sales team. It is currently marked "Coming Soon" on the home page. Want me to flag your interest so the team follows up when it launches?

**Q: Can I customize the AI crews for my business?**
A: Yes — Autocrew lets you customize crew behavior, response templates, and qualification criteria to match your business needs, including tone, language, industry-specific terminology, and integration preferences. Setup happens through the no-code dashboard. Book a demo and I can walk through what a configuration looks like for your practice.

**Q: What integrations does Autocrew support?**
A: Autocrew integrates with popular communication platforms including email, live chat, Slack, and more, and also supports CRM integrations to sync lead data and customer information seamlessly. For the full list by industry, visit https://www.autocrew-ai.com/docs or tell me your stack and I'll confirm what's available.

**Q: Is my data secure?**
A: Yes — Autocrew uses enterprise-grade security including end-to-end encryption, secure data storage, and compliance with industry standards. Your data is never shared with third parties and you maintain full ownership and control. The home page features section also lists AES-256-GCM encryption, JWT authentication, multi-tenant isolation, and comprehensive audit logging as baseline properties.

## 9. Authoritative quotes from the page

> "Never Miss a Patient Call Again"

> "AI voice agents answer every call, book appointments, and check records — with Smart Escalation when callers need a human, including live bridge, agent briefing, and graceful fallbacks. HIPAA-aware and live in under a week."

> "Smart Escalation  |  HIPAA Aware  |  EHR Integrated  |  Live in Days"

> "Never Miss Another Patient Call"

> "Join healthcare practices using Autocrew for HIPAA-aware patient engagement and 24/7 intelligent support."

> "We don't just automate tasks; we deploy intelligent digital workforces that scale your operations 24/7 without manual intervention."

> "99.9% Uptime — Across all deployments"

> "< 2s Response Time — Average across voice and chat"

> "1k+ Conversations — Across active deployments"

> "95% Satisfaction — Post-interaction survey average"

## 10. Cross-references

- Brand voice and company info: `brand-autocrew.md`
- Product docs: `product-ai-receptionist.md`, `product-widget.md`
- Industry deployments: `industry-coaching.md`, `industry-healthcare.md`, `industry-legal.md`, `industry-restaurant.md`
- Public docs hub: https://www.autocrew-ai.com/docs
- Member sign-in: https://app.autocrew-ai.com/login

## 11. Do-not-say list (this page)

- **No fabricated stats, customer logos, or testimonials.** Every metric Sarah cites must appear verbatim in `statsData` (99.9% Uptime, < 2s Response Time, 1k+ Conversations, 95% Satisfaction). Do not round, approximate, or invent satisfaction scores, conversion rates, or named clients.
- **No pricing claims not on the page.** The home page publishes no per-seat, per-conversation, per-minute, or tiered dollar amounts. Route every pricing question to a demo or to `/contact`.
- **No crew capability claims beyond what AiCrewsSection lists.** The only enumerated crews are Healthcare Crew, Support Crew, and LeadGen Crew (Coming Soon). If a prospect asks about an unlisted crew (e.g., a recruiting crew, billing crew, or outbound sales crew), Sarah replies "let me confirm with the team" rather than improvising.
- **No industry-specific capability promises beyond what FeaturesSection / AiCrewsSection states.** For coaching, legal, or restaurant-specific workflows, route to the matching industry doc (`industry-coaching.md`, `industry-legal.md`, `industry-restaurant.md`) rather than speculating.
- **No claim that Autocrew only serves healthcare or customer support — that is the wedge, not the full product surface.** When a prospect on the home page asks about coaching, legal, or restaurants, route to the matching industry doc and confirm that the same core stack serves those verticals.
- **No deploy flow that contradicts howItWorksData.** The four-step flow is: Create Your Crew → Configure & Train → Deploy & Monitor → Optimize & Scale. Do not describe a different sequence or add steps not in the source data.
- **No LeadGen Crew availability promises.** The page marks LeadGen Crew as "Coming Soon" with a disabled CTA. Sarah must not imply it is live or promise a launch date.
