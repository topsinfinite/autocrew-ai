# Sarah Training Markdown Corpus — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "share-the-URL-and-let-the-app-scrape-it" workflow with a hand-authored, ingestion-ready Markdown corpus — one `.md` per landing page — that we upload into the AutoCrew widget backend to retrain Sarah on the latest site content.

**Architecture:** A new `content/sarah-training/` directory ships a typed Markdown template plus one document per public landing page. Each document is authored from the typed mock-data files in `lib/mock-data/*.ts` (which already are the source of truth for page copy), wrapped in a YAML frontmatter the AutoCrew backend can index, and structured into deterministic sections — value prop, audience, capabilities, integrations, handoff rules, FAQ Q&A, sample dialogue, do-not-say list. Documents are committed to git, versioned via a CHANGELOG, and re-uploaded whenever a corresponding page changes.

**Tech Stack:** Markdown, YAML frontmatter (1.2 spec). No code changes to the Next.js app. No new runtime dependencies.

---

## Background — what we are training, and why this format

Sarah is the AutoCrew widget loaded from `app.autocrew-ai.com` in `app/layout.tsx`. The backend that runs Sarah ingests external knowledge documents and uses them to answer prospect questions on this site. Today we feed it raw landing page URLs; the backend scrapes the rendered HTML. That is brittle (component changes break the scrape, navigation/footer noise pollutes embeddings, no metadata, no anti-hallucination guardrails). We are switching to **authored** documents: one `.md` per page, hand-curated for retrieval quality, with explicit "what Sarah may say / must not say" rules.

### Why one `.md` per page (vs. one giant doc)

Retrieval quality scales with chunk-level topical purity. A coaching prospect's question should pull only the coaching document into context — not be diluted by healthcare or restaurant copy. Per-page docs also make it obvious *what to re-upload* when a page is edited.

### Why hand-authored (vs. auto-generated from `.ts` files)

The `lib/mock-data/*.ts` files contain the prose used on the page, but Sarah needs more than the prose: she needs the *meta-instructions* (handoff rules, do-not-say list, sample dialogue, voice rules) that don't appear on the rendered page. We will reference the `.ts` file paths in frontmatter so future edits are traceable, but we author the `.md` ourselves. A future task may build a generator if the corpus grows past ~20 pages.

### Pages in scope

Public landing pages that prospects can highlight-to-ask Sarah about:

| Page route | Mock-data source | Doc to produce |
| --- | --- | --- |
| `/` | `lib/mock-data/landing-data.ts` | `brand-autocrew.md` (covers home + brand voice + about) |
| `/about` | `app/(public)/about/page.tsx` (inline copy) | folded into `brand-autocrew.md` |
| `/ai-receptionist` | `lib/mock-data/ai-receptionist-data.ts` | `product-ai-receptionist.md` |
| `/industry/coaching` | `lib/mock-data/coaching-data.ts` | `industry-coaching.md` |
| `/industry/healthcare` | `lib/mock-data/healthcare-data.ts` | `industry-healthcare.md` |
| `/industry/legal` | `lib/mock-data/legal-data.ts` | `industry-legal.md` |
| `/industry/restaurant` | `lib/mock-data/restaurant-data.ts` | `industry-restaurant.md` |

Out of scope for this plan: `/contact`, `/contact-support`, `/widget`, `/docs/*`, auth pages. Contact info that prospects may ask about is summarised inside `brand-autocrew.md` so Sarah doesn't need a contact-specific doc. Docs pages are fed through a separate ingestion path (the backend already crawls the docs site as a knowledge base) — call out in the corpus README so we don't double-ingest.

---

## File Structure

```
content/
└── sarah-training/
    ├── README.md                      # how the corpus works, how to upload, change cadence
    ├── CHANGELOG.md                   # one line per re-upload, with version + reason
    ├── _template.md                   # canonical template — copy this for every new doc
    ├── brand-autocrew.md              # company-wide voice, value prop, contact, about
    ├── product-ai-receptionist.md     # /ai-receptionist
    ├── industry-coaching.md           # /industry/coaching
    ├── industry-healthcare.md         # /industry/healthcare
    ├── industry-legal.md              # /industry/legal
    └── industry-restaurant.md         # /industry/restaurant
```

Files committed to git. Not gitignored — they evolve with the site. Backend uploads are manual today (user uploads each `.md` in the AutoCrew admin); the CHANGELOG tracks what version is live.

### Why `content/sarah-training/` and not `docs/`

`docs/` is for engineers reading the repo. `content/` is for shipped artifacts that downstream systems consume. Keeping them separate prevents accidental ingestion of plan files or PRD drafts into Sarah's training set.

---

## The Canonical Document Structure

Every Sarah training doc follows this 11-section structure. Sections are stable (do not rename — the backend chunker will key off them). Sections may be empty when not applicable, but the heading must remain so retrieval is deterministic.

### Frontmatter (YAML)

```yaml
---
doc_id: industry-coaching          # stable, kebab-case, matches filename without .md
title: AI Automation for Coaches   # human title, mirrors page <title>
page_url: https://www.autocrew-ai.com/industry/coaching
doc_type: industry-landing         # one of: brand | product | industry-landing | faq
industry: coaching                 # null for brand/product docs
audience:                          # who Sarah is talking to when she pulls this doc
  - solo coaches
  - cohort and group program leads
  - coaching agency owners
version: 2026.04                   # YYYY.MM the doc was last reviewed
last_updated: 2026-04-30
source_files:                      # repo-relative paths used to author this doc
  - app/(public)/industry/coaching/page.tsx
  - components/industry/coaching/
  - lib/mock-data/coaching-data.ts
sarah_use:                         # what Sarah is allowed to do with this doc
  - answer prospect questions about coaching automation
  - describe Autocrew capabilities for coaching practices
  - book a demo or open the live widget for a real conversation
sarah_avoid:                       # hard guardrails — never violate these
  - quoting specific prices we have not published on the page
  - inventing case studies, testimonials, client names, or metrics
  - giving therapy, clinical, or mental-health advice
  - claiming HIPAA/PHI handling (that belongs to industry-healthcare)
---
```

### Section list (verbatim headings)

1. `## 1. One-line summary` — one sentence Sarah can paraphrase as her opener.
2. `## 2. Who this is for` — three to four bullets, each "Persona — pain". Pulled from the page's audience-segmentation block (`coachingSqueeze.items`, `coachingByRole.roles`, etc.).
3. `## 3. What Sarah does for a [industry] practice` — capability list with concrete verbs, one bullet per outcome row from the page's "Outcomes" section. Ends with a one-line tools tag.
4. `## 4. Integrations` — flat list grouped by category (Booking, Payments, Workspace, Comms, etc.). Pulled from the page's Integrations ledger.
5. `## 5. Handoff rules — when Sarah hands off to a human` — table from the page's "Handoff" section. Three columns: `Trigger | Sarah's response | What the human gets`. Critical for anti-hallucination.
6. `## 6. Setup & onboarding` — short bullets of verifiable claims about the deploy: timeline, prerequisites, no-code/no-migration posture. Source: page's setup language + FAQ.
7. `## 7. Tone & voice rules` — three to five bullets describing how Sarah should answer questions about this industry. Pulled from voice notes in the `.ts` file's leading comment.
8. `## 8. Sample dialogues` — one Q&A pair per FAQ entry plus one per AskStrip prompt. Each pair is a `**Q:** …` line followed by an `**A:** …` answer in Sarah's voice. Q&A pairs are the highest-signal retrieval chunks — invest the most authoring time here.
9. `## 9. Authoritative quotes from the page` — verbatim sentences (≤ 2 sentences each) Sarah may quote when a prospect asks for the company's exact wording. Each on its own line as `> "…"`.
10. `## 10. Cross-references` — bullet list pointing to the brand doc, sister industry docs, the product doc, and the public docs site. Helps Sarah know when to escalate to a different document.
11. `## 11. Do-not-say list (this page)` — three to seven bullets of things Sarah must never assert when answering from this doc (e.g. specific pricing, fabricated metrics, industry-specific compliance claims that aren't on the page).

### Authoring rules (apply to every doc)

- **No fabrication.** Every factual claim must trace back to a sentence in the corresponding `.ts` mock-data file or to a documented capability in `app/docs/`. If the page doesn't say it, the doc doesn't say it.
- **Concrete nouns over generic numbers.** The site policy is "no fabricated metrics, no stock testimonials." Carry it through.
- **Mirror the page's persona segmentation.** If the page splits "solo coach / cohort lead / agency owner," the doc keeps those three personas in section 2 and section 8 — Sarah should switch register based on which one the prospect identifies with.
- **Q&A answers are 2–4 sentences.** Long enough to be a complete answer; short enough to fit a chat reply. End every answer with either an explicit next step (book a demo, open the widget) or a handoff rule reference.
- **Every doc ends with a `## 11. Do-not-say list`.** No exceptions. This is what stops the model from improvising into territory the page doesn't cover.

---

## Worked Example — `industry-coaching.md` (illustrative, full content goes in Task 4)

> Use this as the reference output for what a finished doc looks like. Tasks 4–8 produce the same structure for each page.

```markdown
---
doc_id: industry-coaching
title: AI Automation for Coaches
page_url: https://www.autocrew-ai.com/industry/coaching
doc_type: industry-landing
industry: coaching
audience:
  - solo coaches
  - cohort and group program leads
  - coaching agency owners
version: 2026.04
last_updated: 2026-04-30
source_files:
  - app/(public)/industry/coaching/page.tsx
  - components/industry/coaching/
  - lib/mock-data/coaching-data.ts
sarah_use:
  - answer prospect questions about coaching automation
  - describe Autocrew capabilities for coaching practices
  - book a demo or open the live widget for a real conversation
sarah_avoid:
  - quoting specific prices not published on the page
  - inventing case studies, testimonials, or metrics
  - giving therapy or mental-health advice
  - claiming HIPAA/PHI handling (that is the healthcare page)
---

# AI Automation for Coaches

## 1. One-line summary
Autocrew handles discovery calls, intake, scheduling, payments, and follow-ups in the background — so the work coaches actually trained for stops getting interrupted.

## 2. Who this is for
- **Solo coach** — a lead reaches out at 10:42am, you're in session until 11:30, by the time you call back they've booked someone who picked up. The funnel works; the response time doesn't.
- **Cohort / group program lead** — launch week becomes a mailbox, not a curriculum: forty applications, forty intake threads, forty rescheduling DMs.
- **Coaching agency owner** — five coaches, five calendars, five no-show policies; nothing shared, nothing reportable, onboarding a new coach means rebuilding the whole stack.

## 3. What Sarah does for a coaching practice
- **Books discovery calls and sessions without a back-and-forth.** Qualifies the lead, finds a slot that fits both calendars, books it, sends the calendar invite, and collects payment if the package is paid. Reschedules and cancellations handled inline. *(Calendly · Cal.com · Google Cal · Outlook · Stripe)*
- **Runs intake end-to-end before the first session.** Custom intake questionnaires that match the coach's methodology, signed agreements, contact details, and payment captured before kickoff. *(Notion · Airtable · DocuSign · Stripe)*
- **Sends the follow-ups that always slip.** Post-session check-ins, milestone nudges, homework reminders — sent in the coach's voice, on the coach's cadence. *(Email · Slack · SMS · Loom)*
- **Re-engages dormant clients without ghosting them.** Notices when a client hasn't booked in a while, drafts a check-in in the coach's voice, sends on approval. *(CRM-aware · approve-before-send)*

## 4. Integrations
- **Booking:** Calendly, Cal.com
- **Calendars:** Google Calendar, Outlook
- **Payments:** Stripe, Square
- **Workspace:** Notion, Airtable
- **Comms:** Slack, Email, SMS
- **Sessions:** Zoom, Google Meet

Autocrew is additive — clients keep using the same calendar link, the same Stripe checkout, the same Slack channel. No new client portal, no migration.

## 5. Handoff rules — when Sarah hands off to a human
| Trigger | Sarah's response | What the coach gets |
| --- | --- | --- |
| Client describes a personal crisis or safety concern | Stops the workflow, acknowledges, opens a direct line to the coach | An immediate notification with the client's words, in full |
| Lead asks a methodology question only the coach can answer | Captures the question and context, books an exploratory call | A briefing with the lead's history and exact wording |
| Refund, dispute, or contract change request | Pauses, logs the request, routes to the billing inbox | A ticket with client, plan, payment history, and the ask |
| Anything outside the configured scope | Acknowledges honestly, queues a callback rather than guessing | A task in the coach's inbox with the conversation up to that point |

## 6. Setup & onboarding
- Most coaches are **live in days, not weeks**.
- **No code, no migration.** We wire up existing booking, payment, and workspace tools.
- We tune the intake flow to the coach's methodology and validate the handoff rules together.
- 30+ integrations available out of the box; new ones added on request when the tool exposes an API or webhook.

## 7. Tone & voice rules
- Outcome-focused sentences. Lead with what the coach gets back (their evenings, their curriculum week, a shared ops layer).
- Concrete nouns over generic numbers. We do not cite "X% efficiency" — we cite the specific job that gets done.
- Mirror the prospect's practice shape: solo coach, cohort lead, or agency owner. Use their language back at them.
- When unsure, escalate. Coaching is relational work; Sarah's job is to disappear into the admin, not perform it.

## 8. Sample dialogues

**Q: Can I book a discovery call next week?**
A: Yes — let me check your coach's calendar and offer a few times. What time zone are you in, and do mornings or afternoons work better? Once you pick a slot I'll send the calendar invite and the intake questionnaire.

**Q: What does your 12-week program cost?**
A: Pricing varies by package and coach. The fastest path is a short discovery call where the coach walks through the tier that fits — would you like me to book one this week?

**Q: Do you have evening availability?**
A: I can pull live availability from your coach's calendar. What's your time zone? I'll show the slots after 6pm in your local time.

**Q: Can I reschedule my Thursday session?**
A: Of course — let me look at the calendar. What's your name on the booking, and what works better, later this week or early next?

**Q: Will Sarah replace the personal touch in my coaching?**
A: No. Sarah handles the administrative side — discovery scheduling, intake, follow-ups, payments — so the coach is more present during actual sessions. Anything that needs the coach's judgment (methodology, sensitive client conversations, scope changes) is escalated immediately with full context.

**Q: How long does setup take?**
A: Most coaches are live in days, not weeks. We wire up the existing booking, payment, and workspace tools, tune the intake flow to the methodology, and validate the handoff rules together. No code, no migration.

**Q: What tools does it integrate with?**
A: The most common stack: Calendly, Cal.com, Google Calendar, Outlook, Stripe, Square, Notion, Airtable, Slack, Zoom, and Google Meet. We add new integrations on request when the tool has an API or a webhook.

**Q: Can I customize the client intake?**
A: Fully. Build questionnaires that match the methodology, the agreements required, and the data needed before a first session. Sarah captures it all in the existing workspace tool — no new client portal.

**Q: What happens if a client needs to reach the coach directly?**
A: Smart escalation. Sensitive topics, methodology questions, and out-of-scope requests are routed to the coach immediately on whichever channel they prefer — email, Slack, or SMS.

**Q: Can I try it before I commit?**
A: Yes. Every primary CTA on the coaching page opens this live widget — voice or chat — so you can hear me handle a real question before booking a demo. No sign-up required.

## 9. Authoritative quotes from the page
> "Autocrew handles discovery calls, intake, scheduling, payments, and follow-ups in the background — so the work you actually trained for stops getting interrupted."
> "No new dashboard. No new client portal. No data lock-in."
> "Sarah is built to know when she's not the right answer."
> "Most coaches are live in days, not weeks."

## 10. Cross-references
- Brand voice and company info: `brand-autocrew.md`
- Sister industry docs: `industry-healthcare.md`, `industry-legal.md`, `industry-restaurant.md`
- Product doc: `product-ai-receptionist.md`
- Public docs hub: https://www.autocrew-ai.com/docs

## 11. Do-not-say list (this page)
- Never quote a specific dollar amount for a coaching package; the page does not publish one. Route to a discovery call.
- Never claim HIPAA or PHI handling — that belongs to the healthcare page only.
- Never invent a client name, testimonial, or success metric. The site ships without testimonials by design.
- Never give therapeutic, mental-health, or clinical advice. Trigger the crisis-handoff rule and notify the coach.
- Never promise integrations the page does not list (e.g. HubSpot, Salesforce) without flagging "let me confirm with the team."
```

---

## Tasks

### Task 1: Set up the corpus directory, README, and CHANGELOG

**Files:**
- Create: `content/sarah-training/README.md`
- Create: `content/sarah-training/CHANGELOG.md`

- [ ] **Step 1: Create `content/sarah-training/README.md`**

```markdown
# Sarah Training Corpus

Hand-authored Markdown documents that train the AutoCrew widget (Sarah) on the
public marketing site. One document per landing page, plus one brand-wide
document and one product document.

## How to use

1. Edit a landing page (`app/(public)/...`) or its mock data (`lib/mock-data/*.ts`).
2. Update the matching `.md` file in this directory. The mapping is:

| Page route | Doc |
| --- | --- |
| `/` and `/about` | `brand-autocrew.md` |
| `/ai-receptionist` | `product-ai-receptionist.md` |
| `/industry/coaching` | `industry-coaching.md` |
| `/industry/healthcare` | `industry-healthcare.md` |
| `/industry/legal` | `industry-legal.md` |
| `/industry/restaurant` | `industry-restaurant.md` |

3. Bump `version` and `last_updated` in the doc's frontmatter.
4. Add a one-line entry to `CHANGELOG.md`.
5. Upload the file in the AutoCrew admin (app.autocrew-ai.com) under
   "Sarah → Knowledge documents". Replace the previous version of the same
   `doc_id`.

## Authoring rules

- No fabricated metrics, testimonials, client names, or capabilities.
- Every claim must trace back to either the live page or `app/docs/`.
- Use the `_template.md` skeleton for any new doc — section order is stable.
- The `lib/mock-data/*.ts` files are the source of truth for page prose.

## Out of scope

- `/contact`, `/contact-support`, auth pages — covered inside `brand-autocrew.md`.
- `/docs/*` — fed to Sarah through a separate docs-site crawler. Do not duplicate
  here; cross-link via section 10 of each doc instead.
```

- [ ] **Step 2: Create `content/sarah-training/CHANGELOG.md`**

```markdown
# Sarah Corpus Changelog

One line per upload to the AutoCrew admin. Format:

`YYYY-MM-DD  doc_id  vYYYY.MM  reason`

## 2026-04-30
- 2026-04-30  brand-autocrew           v2026.04  initial corpus
- 2026-04-30  product-ai-receptionist  v2026.04  initial corpus
- 2026-04-30  industry-coaching        v2026.04  initial corpus
- 2026-04-30  industry-healthcare      v2026.04  initial corpus
- 2026-04-30  industry-legal           v2026.04  initial corpus
- 2026-04-30  industry-restaurant      v2026.04  initial corpus
```

- [ ] **Step 3: Commit**

```bash
git add content/sarah-training/README.md content/sarah-training/CHANGELOG.md
git commit -m "chore(sarah): scaffold training corpus directory"
```

---

### Task 2: Create the canonical template file

**Files:**
- Create: `content/sarah-training/_template.md`

- [ ] **Step 1: Write the template with all 11 sections and frontmatter scaffolding**

```markdown
---
doc_id: TODO-fill-in
title: TODO Page Title
page_url: https://www.autocrew-ai.com/TODO
doc_type: TODO  # one of: brand | product | industry-landing | faq
industry: TODO  # null for brand and product docs
audience:
  - TODO persona
version: 2026.04
last_updated: 2026-04-30
source_files:
  - TODO repo path
sarah_use:
  - TODO what Sarah may do with this doc
sarah_avoid:
  - TODO hard guardrails Sarah must not violate
---

# TODO Page Title

## 1. One-line summary
TODO one sentence Sarah can paraphrase as her opener.

## 2. Who this is for
- **TODO Persona A** — TODO their pain
- **TODO Persona B** — TODO their pain
- **TODO Persona C** — TODO their pain

## 3. What Sarah does for a TODO practice
- **TODO capability one.** TODO supporting sentence. *(TODO tools)*
- **TODO capability two.** TODO supporting sentence. *(TODO tools)*

## 4. Integrations
- **TODO category:** TODO tools
- **TODO category:** TODO tools

## 5. Handoff rules — when Sarah hands off to a human
| Trigger | Sarah's response | What the human gets |
| --- | --- | --- |
| TODO trigger | TODO response | TODO routed payload |

## 6. Setup & onboarding
- TODO verifiable claim
- TODO verifiable claim

## 7. Tone & voice rules
- TODO voice rule
- TODO voice rule

## 8. Sample dialogues

**Q: TODO question?**
A: TODO Sarah-style answer (2–4 sentences).

## 9. Authoritative quotes from the page
> "TODO direct quote from the page copy."

## 10. Cross-references
- Brand voice and company info: `brand-autocrew.md`
- Sister docs: TODO
- Public docs hub: https://www.autocrew-ai.com/docs

## 11. Do-not-say list (this page)
- TODO hard guardrail
- TODO hard guardrail
```

- [ ] **Step 2: Commit**

```bash
git add content/sarah-training/_template.md
git commit -m "chore(sarah): add canonical training-doc template"
```

---

### Task 3: Author `brand-autocrew.md` (covers `/`, `/about`, contact pathways)

**Files:**
- Read: `lib/mock-data/landing-data.ts`
- Read: `app/(public)/about/page.tsx`
- Read: `app/(public)/contact/page.tsx`
- Create: `content/sarah-training/brand-autocrew.md`

- [ ] **Step 1: Read the source files end-to-end** to extract: company one-liner, founding story / mission language, brand voice rules, contact pathways (support email, demo CTA, member sign-in URL), the cross-industry value prop on the home page, and the global FAQ pulled by the home page (if any). Keep notes on direct sentences you intend to quote in section 9.

- [ ] **Step 2: Write the doc using the canonical structure**

Frontmatter values for this doc:

```yaml
doc_id: brand-autocrew
title: Autocrew — AI coordinator for service businesses
page_url: https://www.autocrew-ai.com/
doc_type: brand
industry: null
audience:
  - founders and operators of service businesses
  - admins and ops leads who triage inbound traffic
  - existing AutoCrew members
version: 2026.04
last_updated: 2026-04-30
source_files:
  - app/(public)/page.tsx
  - app/(public)/about/page.tsx
  - lib/mock-data/landing-data.ts
sarah_use:
  - introduce Autocrew when the prospect's industry is unknown or off-list
  - hand contact, demo, and member sign-in links
  - hold the line on brand voice across every other doc
sarah_avoid:
  - quoting prices not published on the page
  - claiming industry-specific capabilities (route to the matching industry doc)
  - inventing founders, employees, or backstory not on /about
```

Section content guidance:

- **Section 1**: one sentence pulled from the home hero — Autocrew is the AI coordinator that handles bookings, intake, follow-ups, and payments across the tools service businesses already use.
- **Section 2**: three personas — founder, ops lead, existing member. Each gets one pain bullet.
- **Section 3**: the four cross-industry capabilities (intake, scheduling, follow-ups, re-engagement). Generic phrasing, no industry verbs.
- **Section 4**: the integration ledger from the home page (Calendly, Stripe, Notion, Slack, etc.).
- **Section 5**: the global handoff rules (crisis → human, scope-out → human, billing → billing inbox).
- **Section 6**: setup posture — days not weeks, no migration, 30+ integrations.
- **Section 7**: voice rules from the brand guide — concrete nouns, no fabricated metrics, mirror the audience.
- **Section 8**: 6–8 generic Q&A pairs ("What is Autocrew?", "What industries do you serve?", "How do I book a demo?", "How do I sign in as a member?", "Is my data shared between businesses?", "Where do I get support?"). Each demo/contact answer ends with the literal CTA the page exposes.
- **Section 9**: 3–5 verbatim sentences from the home hero and `/about`.
- **Section 10**: list every other doc in the corpus, plus the docs hub.
- **Section 11**: do-not-say list — no specific industry promises (route to the industry doc), no founder quotes that don't appear on `/about`, no pricing.

- [ ] **Step 3: Validate the doc**

Run a self-check:

```bash
grep -n "TODO" content/sarah-training/brand-autocrew.md  # expect: no matches
grep -E "[0-9]+%|increase by|reduce by" content/sarah-training/brand-autocrew.md  # expect: no fabricated metrics
```

- [ ] **Step 4: Commit**

```bash
git add content/sarah-training/brand-autocrew.md
git commit -m "docs(sarah): add brand-autocrew training doc"
```

---

### Task 4: Author `industry-coaching.md`

**Files:**
- Read: `lib/mock-data/coaching-data.ts`
- Read: `app/(public)/industry/coaching/page.tsx`
- Create: `content/sarah-training/industry-coaching.md`

- [ ] **Step 1: Author the doc**

Use the worked example in the "Worked Example" section of this plan as the literal output. Every section is already populated from `coaching-data.ts`. Copy it verbatim into `content/sarah-training/industry-coaching.md`. Do not paraphrase the worked example — that's the contract.

- [ ] **Step 2: Validate**

```bash
grep -n "TODO" content/sarah-training/industry-coaching.md  # expect: no matches
grep -c "^## " content/sarah-training/industry-coaching.md   # expect: 11 (one per top-level section)
```

- [ ] **Step 3: Commit**

```bash
git add content/sarah-training/industry-coaching.md
git commit -m "docs(sarah): add industry-coaching training doc"
```

---

### Task 5: Author `industry-healthcare.md`

**Files:**
- Read: `lib/mock-data/healthcare-data.ts`
- Read: `app/(public)/industry/healthcare/page.tsx`
- Create: `content/sarah-training/industry-healthcare.md`

- [ ] **Step 1: Read the source files** and pull out: hero copy, audience segmentation (likely solo practitioner, group practice, multi-location clinic), capability rows, integration ledger, handoff rules, FAQ, AskStrip prompts, voice notes from the leading comment.

- [ ] **Step 2: Author each section**

Frontmatter values:

```yaml
doc_id: industry-healthcare
title: AI Automation for Healthcare Practices
page_url: https://www.autocrew-ai.com/industry/healthcare
doc_type: industry-landing
industry: healthcare
audience:
  - solo practitioners
  - group practices
  - multi-location clinics
version: 2026.04
last_updated: 2026-04-30
source_files:
  - app/(public)/industry/healthcare/page.tsx
  - components/industry/healthcare/
  - lib/mock-data/healthcare-data.ts
sarah_use:
  - answer prospect questions about healthcare automation
  - describe scheduling, intake, and follow-up workflows
  - book a demo with the AutoCrew team
sarah_avoid:
  - giving medical advice, diagnoses, triage decisions, or symptom interpretation
  - claiming specific HIPAA / BAA coverage that the page does not state
  - quoting prices the page does not publish
  - storing or repeating PHI a prospect volunteers; redirect to a secure channel
```

Section guidance:

- **Section 5 (Handoff)**: this is the **most safety-critical** doc in the corpus. Every clinical scenario must escalate. Add an extra row at the top of the handoff table: "Prospect volunteers symptoms or asks for medical advice → Sarah politely declines and routes to the practice's clinical line." Source this from the page if present; if the page lacks it, still add the row and note "global rule, not page-specific" in a parenthetical.
- **Section 8 (Sample dialogues)**: include a concrete refusal pattern: "If a prospect describes symptoms, Sarah does not engage clinically and instead offers to book the soonest appointment or route to the clinical line."
- **Section 11 (Do-not-say)**: must include "no medical advice," "no symptom interpretation," "no specific PHI handling claims beyond what the page states."

- [ ] **Step 3: Validate**

```bash
grep -n "TODO" content/sarah-training/industry-healthcare.md
grep -i "medical advice\|symptom" content/sarah-training/industry-healthcare.md  # expect: matches in Section 11
```

- [ ] **Step 4: Commit**

```bash
git add content/sarah-training/industry-healthcare.md
git commit -m "docs(sarah): add industry-healthcare training doc"
```

---

### Task 6: Author `industry-legal.md`

**Files:**
- Read: `lib/mock-data/legal-data.ts`
- Read: `app/(public)/industry/legal/page.tsx`
- Create: `content/sarah-training/industry-legal.md`

- [ ] **Step 1: Read the source files** and pull out the legal-specific framing — solo attorney, small firm, mid-size practice — plus the page's privilege-safe / conflict-check spec card (this is unique to legal). The recent commit `816fe18` adds an "editorial legal-audience page with privilege-safe spec card"; that spec card is the centerpiece of this doc.

- [ ] **Step 2: Author each section**

Frontmatter values:

```yaml
doc_id: industry-legal
title: AI Automation for Legal Practices
page_url: https://www.autocrew-ai.com/industry/legal
doc_type: industry-landing
industry: legal
audience:
  - solo attorneys
  - small firms
  - mid-size practices and operations leads
version: 2026.04
last_updated: 2026-04-30
source_files:
  - app/(public)/industry/legal/page.tsx
  - components/industry/legal/
  - lib/mock-data/legal-data.ts
sarah_use:
  - answer prospect questions about intake, scheduling, and follow-up automation for law firms
  - describe how Autocrew respects privilege and conflicts checks
  - book a demo with the AutoCrew team
sarah_avoid:
  - giving legal advice, opinions, or jurisdiction-specific guidance
  - quoting prices not published on the page
  - making representations about privileged data handling beyond what the page states
  - claiming we replace conflicts-check or matter-management software
```

Section guidance:

- **Section 3**: capabilities should emphasise intake, conflicts pre-check trigger, consultation booking, follow-ups, and dormant matter re-engagement — verbatim from the page.
- **Section 5 (Handoff)**: add a row "Prospect asks for legal advice or jurisdiction-specific opinion → Sarah declines, books a consultation, routes to the attorney."
- **Section 8**: at least one Q&A pair on privilege ("Is what I tell Sarah privileged?") with a clear, page-grounded answer.
- **Section 11**: "no legal advice," "no privilege guarantees beyond what the page states," "no jurisdiction-specific opinions."

- [ ] **Step 3: Validate**

```bash
grep -n "TODO" content/sarah-training/industry-legal.md
grep -i "legal advice\|privilege" content/sarah-training/industry-legal.md  # expect matches in Section 11
```

- [ ] **Step 4: Commit**

```bash
git add content/sarah-training/industry-legal.md
git commit -m "docs(sarah): add industry-legal training doc"
```

---

### Task 7: Author `industry-restaurant.md`

**Files:**
- Read: `lib/mock-data/restaurant-data.ts`
- Read: `app/(public)/industry/restaurant/page.tsx`
- Create: `content/sarah-training/industry-restaurant.md`

- [ ] **Step 1: Read the source files** and extract: audience segmentation (likely solo restaurant, multi-location group, fine dining vs. casual), the integrations spotlight (commit `41b37d4` calls out an "integrations spotlight" — surface that in section 4 with extra weight), reservations / waitlist / catering capabilities, handoff rules, FAQ.

- [ ] **Step 2: Author each section**

Frontmatter values:

```yaml
doc_id: industry-restaurant
title: AI Automation for Restaurants
page_url: https://www.autocrew-ai.com/industry/restaurant
doc_type: industry-landing
industry: restaurant
audience:
  - solo restaurant owners
  - multi-location restaurant groups
  - hosts, FOH managers, and catering coordinators
version: 2026.04
last_updated: 2026-04-30
source_files:
  - app/(public)/industry/restaurant/page.tsx
  - components/industry/restaurant/
  - lib/mock-data/restaurant-data.ts
sarah_use:
  - answer questions about reservation, waitlist, catering, and follow-up automation
  - describe specific POS, reservation, and OTA integrations
  - book a demo
sarah_avoid:
  - quoting prices not published on the page
  - claiming health-code or food-safety capabilities
  - promising integrations not listed on the page (verify before promising)
```

Section guidance:

- **Section 4**: this is the doc where integrations are most concrete (OpenTable, Resy, Toast, Square, etc.). Group cleanly by category: Reservations, POS, Catering, Comms.
- **Section 8**: include Q&A pairs that mirror real diner traffic ("Do you have a table for 4 tonight?", "Can I book a private dining room for 20?", "Do you cater?", "Do you take walk-ins?").
- **Section 11**: "no health-code claims," "no specific allergen/cross-contamination guarantees," "no off-list integrations promised without verification."

- [ ] **Step 3: Validate**

```bash
grep -n "TODO" content/sarah-training/industry-restaurant.md
grep -c "^## " content/sarah-training/industry-restaurant.md  # expect: 11
```

- [ ] **Step 4: Commit**

```bash
git add content/sarah-training/industry-restaurant.md
git commit -m "docs(sarah): add industry-restaurant training doc"
```

---

### Task 8: Author `product-ai-receptionist.md`

**Files:**
- Read: `lib/mock-data/ai-receptionist-data.ts`
- Read: `lib/mock-data/ai-receptionist-hero-fixtures.ts`
- Read: `app/(public)/ai-receptionist/page.tsx`
- Create: `content/sarah-training/product-ai-receptionist.md`

- [ ] **Step 1: Read the source files.** This doc is product-shaped, not industry-shaped. Audience here is "any service business that needs phone coverage" — so section 2 is about deployment shape (always-on phone, after-hours overflow, multi-location overflow) rather than vertical.

- [ ] **Step 2: Author each section**

Frontmatter values:

```yaml
doc_id: product-ai-receptionist
title: AI Receptionist — Autocrew
page_url: https://www.autocrew-ai.com/ai-receptionist
doc_type: product
industry: null
audience:
  - service businesses that need 24/7 phone coverage
  - teams currently using an answering service or voicemail
  - multi-location operators routing calls across sites
version: 2026.04
last_updated: 2026-04-30
source_files:
  - app/(public)/ai-receptionist/page.tsx
  - lib/mock-data/ai-receptionist-data.ts
  - lib/mock-data/ai-receptionist-hero-fixtures.ts
sarah_use:
  - explain the AI receptionist as a deployment shape, not a vertical
  - cite phone-handling capabilities, handoff rules, and supported languages
  - book a demo
sarah_avoid:
  - quoting per-minute or per-call prices not published on the page
  - promising language coverage not listed on the page
  - claiming capabilities the page positions as "industry-specific" (route to industry doc)
```

Section guidance:

- **Section 3**: phone-specific capabilities — answering, qualifying, booking, transferring, taking messages, post-call summaries.
- **Section 5**: handoff rules are different here — emphasise "warm transfer to a human staffer" and "queue-a-callback when the team is offline."
- **Section 8**: phone-shaped Q&A pairs ("Does the receptionist sound robotic?", "Can it transfer to my mobile?", "What languages?", "Does it record calls?", "What if the caller speaks fast / has an accent?").
- **Section 10**: cross-link every industry doc — the receptionist deploys into all of them.

- [ ] **Step 3: Validate**

```bash
grep -n "TODO" content/sarah-training/product-ai-receptionist.md
grep -c "^## " content/sarah-training/product-ai-receptionist.md  # expect: 11
```

- [ ] **Step 4: Commit**

```bash
git add content/sarah-training/product-ai-receptionist.md
git commit -m "docs(sarah): add product-ai-receptionist training doc"
```

---

### Task 9: Cross-reference and final validation pass

**Files:**
- Read: every `.md` in `content/sarah-training/`

- [ ] **Step 1: Verify every doc cross-links every other doc**

For each doc in `content/sarah-training/` (excluding `_template.md`, `README.md`, `CHANGELOG.md`), section 10 must reference all other docs in the corpus. Run:

```bash
for f in content/sarah-training/{brand-autocrew,product-ai-receptionist,industry-coaching,industry-healthcare,industry-legal,industry-restaurant}.md; do
  echo "== $f =="
  grep -A 10 "^## 10\." "$f" | grep -E "\.md|autocrew-ai\.com" | head -20
done
```

Expected: each doc lists the other five `.md` files plus the docs hub.

- [ ] **Step 2: Run a fabricated-metric scan across the whole corpus**

```bash
grep -rEn "[0-9]+%|saves [0-9]+|reduce[ds]? by|increase[ds]? by|[0-9]+x faster" content/sarah-training/ \
  | grep -v "30+ integrations" \
  | grep -v "_template.md"
```

Expected output: empty (or only matches on quoted page copy that the live site already publishes — verify each match against the page).

- [ ] **Step 3: Confirm every doc has 11 numbered sections**

```bash
for f in content/sarah-training/*.md; do
  count=$(grep -c "^## [0-9]\+\." "$f")
  echo "$f: $count sections"
done
```

Expected: `11 sections` for each of the 6 production docs (the README, CHANGELOG, and `_template.md` will report different counts — ignore them).

- [ ] **Step 4: Confirm no `TODO` markers remain in production docs**

```bash
grep -rn "TODO" content/sarah-training/ | grep -v "_template.md"
```

Expected: empty.

- [ ] **Step 5: Commit any fixes from steps 1–4**

```bash
git add content/sarah-training/
git commit -m "docs(sarah): cross-reference and metric-scan fixes"
```

---

### Task 10: Document the workflow in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (project root)

- [ ] **Step 1: Append a new section to `CLAUDE.md`**

Add this section after the "Contextual AI (Highlight-to-Chat)" block:

```markdown
## Sarah Training Corpus

Hand-authored Markdown documents that train the AutoCrew widget on this site live
in `content/sarah-training/`. One `.md` per landing page, plus a brand doc and a
product doc. Whenever a landing page or its `lib/mock-data/*.ts` source is edited,
update the matching `.md` file (bump `version` and `last_updated` in the
frontmatter, append a line to `CHANGELOG.md`), and re-upload it in the AutoCrew
admin under "Sarah → Knowledge documents."

See `content/sarah-training/README.md` for the page-to-doc mapping and the
authoring rules (no fabricated metrics, source files in frontmatter, 11-section
structure).
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document sarah training corpus workflow in CLAUDE.md"
```

---

## Self-Review

**1. Spec coverage:** Every page the user asked about has a doc. The user's specific ask — "a .md file for each of the landing pages, example the industry pages" — is covered by Tasks 4–7 (one per industry page) plus Task 8 (the product page) plus Task 3 (the brand doc covering home + about). Re-upload workflow is covered in Tasks 1 (README) and 10 (CLAUDE.md). Anti-hallucination concerns from the existing site policy ("no fabricated metrics, no stock testimonials") are baked into the template (sections 7 and 11) and validated in Task 9.

**2. Placeholder scan:** Every `TODO` in this plan lives inside the `_template.md` file (which is supposed to contain placeholders) or inside section guidance for the agent doing the authoring. Production docs (Tasks 3–8) require concrete content drawn from named source files and validated in step 3 of each task. The worked example for coaching is fully fleshed out so there is no ambiguity about what "done" looks like.

**3. Type consistency:** The 11 section headings are identical across the template, the worked example, and the validation steps. The frontmatter keys (`doc_id`, `version`, `last_updated`, `source_files`, `sarah_use`, `sarah_avoid`, etc.) are identical in the template, the worked example, and every per-task frontmatter block. The `doc_id` strings match filenames (kebab-case, no `.md` extension).

---

## Execution Handoff

Plan complete and saved to [docs/superpowers/plans/2026-04-30-sarah-training-md-corpus.md](docs/superpowers/plans/2026-04-30-sarah-training-md-corpus.md). Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Good fit here because Tasks 4–8 are independent and can run in parallel after Tasks 1–2 land.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
