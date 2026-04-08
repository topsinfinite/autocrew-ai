# Contextual AI: Highlight-to-Chat

**Product:** Autocrew Widget — Contextual AI Feature  
**Author:** Autocrew Product Team  
**Date:** April 2026  
**Status:** PROPOSAL — awaiting eng review  
**Version:** 1.0

---

## TL;DR

When a visitor highlights any text on a webpage where the Autocrew widget is embedded, a lightweight "Ask Sarah" popover appears. Clicking it opens the widget with the highlighted text — and its surrounding context — pre-loaded as a question. This turns every word on every page into an interactive entry point for a contextual AI conversation.

---

## 1. The Problem

### For Autocrew customers (website owners)

Most website copy is **dense and passive**. Visitors encounter unfamiliar terms, skeptical claims, or complex features and they do one of three things: re-read it, google it, or leave. None of these outcomes are good for conversion.

The chat widget exists at the bottom-right corner. Most visitors never click it. Those who do often open it with zero context ("hi"), leading to slow, generic conversations that require the AI to re-establish what the visitor was even thinking about.

**The widget is available but disconnected from the page.**

### For website visitors

Curiosity is high friction. "HIPAA-aware patient engagement" appears in a hero headline. The visitor wants to know what that means *for them*, right now. They have to:

1. Select the text
2. Open a new tab
3. Google it
4. Lose their place on the page

Or they just move on.

---

## 2. The Solution

**Contextual AI** — a Highlight-to-Chat interaction layer that connects any text on a page to the Autocrew widget.

### User experience

1. Visitor selects any text on the page (minimum ~15 characters).
2. A small popover anchors to the selection: **"Ask Sarah →"**
3. Visitor clicks the popover.
4. Widget opens with a pre-constructed message: *"Can you explain this from your website: '[selection]'?"* — with the surrounding paragraph included as silent context.
5. Sarah answers in the context of that specific page and section.

### What makes it different from just clicking the widget

- **Zero cold start.** No "hi, how can I help?" loop. The visitor arrives with a real question, pre-formed.
- **Context-aware answers.** The surrounding paragraph travels with the selection, so Sarah can give accurate, section-specific answers without the visitor having to re-explain what they were reading.
- **No page navigation.** The visitor stays in place.

---

## 3. Hypothesis

**Primary hypothesis:**

> If visitors can highlight text on any section of a webpage to instantly ask the embedded AI about it in context, then widget engagement rate will increase and the quality of first-message conversations will improve — because curiosity is captured at the exact moment it occurs rather than requiring the visitor to initiate a cold chat.

**Supporting assumptions:**

- A meaningful percentage of visitors highlight text while reading (estimated 15–30% based on browser heatmap data norms).
- The gap between "I wonder what this means" and "I'll ask the chat" is currently large enough to cause drop-off.
- Pre-loaded context produces faster, more useful AI responses than cold-open conversations.
- A visible, lightweight popover does not feel intrusive in the way a chat bubble or pop-up does.

---

## 4. Target Users

### Primary: Autocrew customers deploying widgets in content-rich environments

- **SaaS landing pages** — complex feature descriptions, technical differentiators
- **Healthcare websites** — compliance terms, treatment explanations, appointment flows
- **Professional services** — legal, financial, coaching — where language is specialized
- **E-commerce PDPs** — product specifications, policies, shipping terms

### Secondary: Autocrew's own marketing site

The feature will be **dogfooded on autocrew-ai.com** first. This site is the proving ground. Every hero headline, features section, pricing table, and FAQ becomes a live demo of Contextual AI.

---

## 5. How It Works — Technical Overview

### Architecture

```
Visitor highlights text
        ↓
useTextSelection hook fires (after 250ms debounce, 15 char minimum)
        ↓
getBoundingClientRect() on selection range
        ↓
SelectionPopover renders at calculated position (viewport-edge aware)
        ↓
Visitor clicks "Ask Sarah →"
        ↓
Context enrichment:
  - selection text (exact words highlighted)
  - surrounding paragraph text (silent context for AI)
  - section label (optional: "Pricing", "Features", etc.)
        ↓
window.AutoCrew.open() + prefill(enrichedPrompt)
        ↓
Widget opens with message ready
```

### Context enrichment message format

```
[silent context]
Page section: {sectionLabel}
Surrounding text: {surroundingParagraph}

[visible user message]
Can you explain this from your website: "{selection}"
```

The silent context is passed as a system injection (not shown to the user) so Sarah answers intelligently without the visitor needing to re-explain where they are on the page.

### Components required


| Component                  | Description                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `useTextSelection` hook    | Watches `mouseup` / `selectionchange`, reads `window.getSelection()`, computes position               |
| `<SelectionPopover />`     | Tooltip anchored to selection rect; "Ask Sarah" label + optional selection preview                    |
| `useContextEnrichment`     | Walks DOM upward from selection anchor to find surrounding paragraph and nearest `data-section` label |
| `useAutoCrewWidget` update | Adds `prefillWithContext(selection, context)` method                                                  |
| `data-section` attributes  | Added to key page sections for labeling context (non-breaking, optional)                              |


### Dependencies

- Requires `window.AutoCrew.open()` and `window.AutoCrew.prefill()` from the **Widget Public API v1** (currently in engineering). Will not function without this.
- Falls back gracefully: if API is not present, popover does not render.
- Shadow DOM remains closed — no internal widget queries needed.

---

## 6. Things to Test

### A. Functional / QA tests


| Test                               | Pass condition                                     |
| ---------------------------------- | -------------------------------------------------- |
| Selection below threshold          | Popover does NOT appear for <15 chars              |
| Selection above threshold          | Popover appears within 250ms of `mouseup`          |
| Popover position — normal          | Anchored above selection, centered                 |
| Popover position — near top        | Appears below selection (viewport flip)            |
| Popover position — near right edge | Clamped within viewport, no overflow               |
| Widget not loaded yet              | Popover still appears; click queues open command   |
| Widget already open                | Clicking popover prefills without double-open      |
| User dismisses popover             | Clicking elsewhere hides it, no state leak         |
| Rapid multi-select                 | Only last stable selection renders popover         |
| Mobile (touch)                     | Graceful no-op (see mobile notes)                  |
| Keyboard selection                 | Popover appears for keyboard-driven text selection |
| iFrame / cross-origin              | Does not interfere with embedded iframes           |


### B. Product / conversion experiments (A/B tests)

#### Experiment 1: Presence vs. absence

- **Control:** Current landing page (widget in corner, no text interaction)
- **Variant:** Contextual AI enabled on all sections
- **Metrics:** Widget open rate, conversation start rate, session depth, bounce rate

#### Experiment 2: Popover copy variants

- **A:** "Ask Sarah →"
- **B:** "Explain this →"
- **C:** "Ask a question →"
- **Metric:** Click-through rate on popover

#### Experiment 3: Context enrichment vs. raw selection

- **A:** Send selection only → `"What is [selection]?"`
- **B:** Send selection + surrounding paragraph as context
- **Metric:** Conversation quality score (resolution rate, turns to first useful answer)

#### Experiment 4: Section-aware prompt framing

- **A:** Generic → `"Can you explain: '[selection]'?"`
- **B:** Section-aware → Pricing: `"Is this plan right for me given: '[selection]'?"` / Features: `"How does [selection] work in practice?"`
- **Metric:** Conversation depth, lead quality

#### Experiment 5: Auto-send vs. editable prefill

- **A:** Message pre-filled, user must press send
- **B:** Message auto-sent after 1.5s countdown shown in input (with cancel option)
- **Metric:** Conversion to actual sent message, drop-off rate in widget

#### Experiment 6: Popover timing

- **A:** 250ms debounce
- **B:** 500ms debounce (appear only if user holds selection)
- **Metric:** Accidental trigger rate vs. engagement rate

### C. Qualitative / user research

- **Session recordings** (Hotjar / FullStory) — do visitors use it organically after first exposure?
- **Post-chat survey** — "How did you open this chat?" / "Was the answer helpful?"
- **First-message quality audit** — manual review of 50 contextual conversations vs. 50 cold-open conversations for relevance and resolution rate

### D. Success metrics


| Metric                                 | Baseline | Target (90 days)                        |
| -------------------------------------- | -------- | --------------------------------------- |
| Widget open rate                       | ~X%      | +25% relative                           |
| Contextual chat starts                 | 0        | >15% of all chat starts                 |
| First-message relevance score          | —        | Establish baseline, improve each sprint |
| Bounce rate (hero → features)          | ~X%      | -10% relative                           |
| Lead quality (qualified conversations) | —        | Establish benchmark                     |
| Accidental trigger rate                | —        | <5% of popover appearances              |


---

## 7. Edge Cases and Non-Goals

### Edge cases

- **Long selections (>250 chars):** Truncate displayed text in popover; full selection still sent as context.
- **Selection spanning multiple elements:** Take full text of `window.getSelection().toString()`.
- **Repeated selection of same text:** Popover re-renders in-place; no duplicate widget opens.
- **Widget not initialized:** Queue the command; open and prefill when ready.
- **Multiple widgets on page:** Respects the `crewCode` in current scope.

### Non-goals (v1)

- **Voice trigger** — text selection → voice widget open is a separate idea, defer to v2.
- **Mobile/touch** — long-press conflicts with OS selection toolbar. Design separately, ship as v2.
- **Annotation/highlighting persistence** — this is not a reading tool, selections are ephemeral.
- **Multi-language selection** — automatic language detection, defer.
- **iframe content** — selecting text inside cross-origin iframes is not supported.

---

## 8. How to Package and Sell This

### Feature name options


| Name                  | Rationale                                        |
| --------------------- | ------------------------------------------------ |
| **Contextual AI**     | Product language, feels premium                  |
| **Smart Highlight**   | Describes the mechanic, instantly understandable |
| **Highlight to Chat** | Literal, clear for devs / technical buyers       |
| **Ask Anywhere**      | Marketing-friendly, action-forward               |


Recommend: **"Ask Anywhere"** for marketing surfaces, **"Contextual AI"** in the product dashboard.

---

### Tier placement


| Tier         | Contextual AI                                           |
| ------------ | ------------------------------------------------------- |
| Starter      | No                                                      |
| Professional | Yes — on by default                                     |
| Enterprise   | Yes — with custom section labels, custom prompt framing |


**Rationale:** This is a differentiated feature that requires a higher plan to access. It also drives higher widget engagement, which demonstrates value and justifies upgrades from Starter.

---

### Pitch to potential customers

> **Pitch:**
> Right now, your visitors read your page, get confused, and leave. Autocrew's **Ask Anywhere** turns every sentence on your site into a conversation starter. When someone highlights your pricing tiers or your HIPAA compliance section, they instantly get a contextual answer — without leaving the page or starting from scratch.

**Customer segments who will pay for this:**


| Segment                                          | Why they care                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| SaaS / tech companies                            | Complex features → reduce support tickets, improve self-serve understanding |
| Healthcare providers                             | Patients highlight scary medical/compliance terms constantly                |
| Professional services (legal, finance, coaching) | Jargon-heavy content; clients need clarification                            |
| E-commerce (high-consideration products)         | Shipping policies, returns, specs — reduce pre-purchase friction            |
| Agencies                                         | Offer it as a value-add to clients as a "smart website" differentiator      |


---

### Agency / reseller angle

This is especially powerful for **agencies building client sites**. They can say:

> "Your site isn't just a brochure anymore. Every visitor who reads your content can ask your AI to explain it — right there, in context."

That's a new category of deliverable. Agencies could charge a **setup fee + monthly rev share** for enabling Contextual AI on client sites.

---

### Launch strategy

**Phase 1 — Dogfood (internal)**

- Enable on autocrew-ai.com
- Instrument fully
- Collect first 500 contextual conversations, review quality

**Phase 2 — Private beta**

- Invite 10 Professional/Enterprise customers to enable it
- Provide session recording setup instructions
- Gather feedback on question quality, widget engagement lift

**Phase 3 — GA launch**

- Ship to all Professional + Enterprise plans
- Write "Ask Anywhere" launch post
- Case study from beta: "X% more widget conversations, Y% reduction in bounce"
- Add toggle to widget dashboard with per-section prompt customization

---

### Widget dashboard configuration (future)

```json
{
  "contextualAI": {
    "enabled": true,
    "minSelectionChars": 15,
    "maxSelectionChars": 250,
    "popoverLabel": "Ask Sarah →",
    "promptFraming": "auto",
    "sectionLabels": {
      "#pricing": "Pricing and plans",
      "#features": "Product features",
      "#about": "About our company"
    }
  }
}
```

Customer-configurable from the dashboard:

- On/off toggle
- Popover label text (brand voice)
- Prompt framing per section
- Min/max selection length

---

## 9. Implementation Plan

### Phase 1 — Marketing site prototype (this repo)

**Goal:** Validate UX on autocrew-ai.com before selling to customers.


| Task                                | Owner    | Notes                                                                 |
| ----------------------------------- | -------- | --------------------------------------------------------------------- |
| `useTextSelection` hook             | Frontend | `mouseup`, `selectionchange`, debounce, threshold                     |
| `<SelectionPopover />`              | Frontend | Anchor to range rect, viewport clamping                               |
| Context enrichment logic            | Frontend | Walk DOM for paragraph + `data-section`                               |
| Wire to `useAutoCrewWidget`         | Frontend | Needs `window.AutoCrew` API first, or fallback to shadow queries      |
| Add `data-section` to page sections | Frontend | Non-breaking `data-` attrs on section wrappers                        |
| Analytics events                    | Frontend | `contextual_ai_selection`, `contextual_ai_open`, `contextual_ai_sent` |


**Depends on:** Widget Public API v1 (`window.AutoCrew.open` + `prefill`)

**Estimated effort:** ~2–3 days frontend, after widget API ships

---

### Phase 2 — Widget runtime integration

**Goal:** Move Contextual AI into the widget bundle so any customer can enable it.


| Task                            | Owner           | Notes                                        |
| ------------------------------- | --------------- | -------------------------------------------- |
| Config flag in `AutoCrewConfig` | Widget team     | `contextualAI: { enabled: true }`            |
| Port hooks into widget runtime  | Widget team     | Self-contained, no marketing repo dependency |
| Section label resolution        | Widget team     | Via `data-section` or config JSON            |
| Prompt framing engine           | Widget team     | Template per section type                    |
| Dashboard toggle                | Product/backend | Enable/disable per crew                      |


**Estimated effort:** ~1 sprint after Phase 1 validation

---

### Phase 3 — Commercialization


| Task                              | Owner            |
| --------------------------------- | ---------------- |
| Gate behind Professional tier     | Product/billing  |
| Dashboard configuration UI        | Product/frontend |
| Case study + launch post          | Marketing        |
| Docs: "Contextual AI setup guide" | Docs             |
| Pricing update                    | GTM              |


---

## 10. Risks and Mitigations


| Risk                                   | Likelihood    | Mitigation                                                      |
| -------------------------------------- | ------------- | --------------------------------------------------------------- |
| Accidental triggers feel spammy        | Medium        | Debounce + min char threshold + dismiss on click-away           |
| Visitors find it intrusive             | Low–Medium    | Opt-out toggle for page owners; A/B test presence               |
| Context enrichment sends too much data | Low           | Cap surrounding text at 500 chars; no PII in page content       |
| Breaks on complex DOM structures       | Medium        | Defensive DOM walking with fallback to raw selection only       |
| Mobile UX conflicts with OS toolbar    | High          | Explicitly exclude on mobile (v1); design separately (v2)       |
| Depends on Widget API not yet shipped  | High (timing) | Build with fallback to `window.__acShadow` approach in parallel |


---

## 11. Open Questions

1. Should the popover also appear on mobile, using a different trigger (e.g. share sheet)?
2. Should Autocrew track which selections are made most frequently, and surface that data to customers as "what your visitors are confused about"?
3. Is there a version of this for images/diagrams — hover + ask about an element?
4. Should the popover appear for all visitors or only after some engagement threshold?
5. Can the section-level prompt framing be AI-generated based on the page content itself?

---

## Appendix: Competitive Landscape


| Product                  | Text highlight interaction                 |
| ------------------------ | ------------------------------------------ |
| Intercom                 | None                                       |
| Drift                    | None                                       |
| HubSpot Chat             | None                                       |
| Crisp                    | None                                       |
| Zendesk                  | None                                       |
| Perplexity (browser ext) | Highlight → search Perplexity              |
| Arc Browser              | Highlight → "Ask AI" on any page           |
| Kagi                     | Highlight → summarize/explain              |
| Medium                   | Highlight → quote/respond (social, not AI) |


**Key finding:** No embedded chat widget offers this. It exists in browser-level AI tools (Arc, Kagi, Perplexity extension) but never as a feature of a website widget that a business can own and brand. Autocrew has a clear first-mover window.

---

*Document owner: Autocrew Product Team*  
*Next review: After Phase 1 dogfood data is collected*