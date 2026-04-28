import type { SlideContent } from "../slide-content-types";

export const WIDGET_PITCH_SLIDES: SlideContent[] = [
  // 1. Cover
  { template: "Cover", content: {
      eyebrow: "V1.1 · LIVE",
      headlineParts: [
        { text: "Turn every button into a " },
        { text: "live conversation.", accent: true },
      ],
      sub: "A trigger system for AI agents — five surfaces, zero forms, on any site.",
      footerLeft: "autocrew-ai.com / widget",
  }},
  // 2. Problem
  { template: "Problem", content: {
      number: "01", label: "THE PROBLEM",
      headlineParts: [
        { text: "Static forms send visitors into a " },
        { text: "queue", accent: true },
        { text: ". Conversations don't." },
      ],
      body: "Every \"Contact us\" button is a form. Every form is a wait. Every wait is a conversion you've already lost. The widget flips that model: visitors talk to your AI agent immediately, on the same page they were already reading.",
      comparison: {
        leftLabel: "FORM",
        leftValues: ["queued", "replied to hours later", "often never"],
        rightLabel: "WIDGET",
        rightValues: ["triggered", "answered in seconds", "on the same page"],
      },
  }},
  // 3. Solution
  { template: "Solution", content: {
      number: "02", label: "THE SOLUTION",
      headlineParts: [
        { text: "Five trigger surfaces. " },
        { text: "Zero", accent: true },
        { text: " forms." },
      ],
      body: "One AI agent your visitors can reach from any page, button, or link — without re-embedding. A new trigger never requires a new ship.",
      bullets: ["DECLARATIVE", "URL PARAM", "JS API", "SEARCH", "VOICE"],
  }},
  // 4. FiveCardGrid
  { template: "FiveCardGrid", content: {
      number: "03", label: "FIVE SURFACES", secondary: "ONE WIDGET",
      headline: "Five ways to start a conversation.",
      sub: "The same agent answers every one.",
      cards: [
        { number: "01", title: "Declarative", body: "HTML, no JS." },
        { number: "02", title: "URL param", body: "Email-friendly." },
        { number: "03", title: "JS API", body: "Programmatic." },
        { number: "04", title: "Search", body: "Drop-in element." },
        { number: "05", title: "Voice", body: "Tap to talk." },
      ],
  }},
  // 5. DetailWithCode — Declarative
  { template: "DetailWithCode", content: {
      number: "01", label: "DECLARATIVE",
      headline: "HTML, no JavaScript.",
      body: "Add data-autocrew-question to any button or link. Marketing edits the CMS; the widget handles the rest. Works on buttons, anchors, and nested click targets.",
      bestFor: [
        "FAQ pages — every question becomes a trigger",
        "Pricing tier CTAs — pre-filled qualifying questions",
        "Footer quick-links — turn dead ends into conversations",
      ],
      code: {
        filename: "DECLARATIVE", cornerLabel: "01 / 05",
        code: `<button data-autocrew-question="What\nare your hours?">\n  See our hours\n</button>`,
      },
  }},
  // 6. DetailWithCode — URL Param
  { template: "DetailWithCode", content: {
      number: "02", label: "URL PARAMETER",
      headline: "Email-friendly. Self-cleaning.",
      body: "Append ?autocrew_q=… to any URL. The widget opens on landing and sends the question, then strips the param so a refresh doesn't re-fire. Pair with UTM tags for attribution.",
      bestFor: [
        "Email campaigns — link straight into a conversation",
        "Paid-ad landing URLs — per-audience question text",
        "Chatbot handoffs from other apps",
      ],
      code: {
        filename: "URL PARAMETER", cornerLabel: "02 / 05",
        code: `https://yoursite.com/?\nautocrew_q=Show%20me%20a%20demo\n\n&utm_source=email&utm_campaign=spring`,
      },
  }},
  // 7. DetailWithCode — JS API
  { template: "DetailWithCode", content: {
      number: "03", label: "JAVASCRIPT API",
      headline: "Programmatic control.",
      body: "window.AutoCrew.ask, open, close, isReady, onReady. Calls before widget.js loads buffer via the GA-style queue stub. Single-event dispatch keeps your analytics clean.",
      bestFor: [
        "Post-form-submit handoff with prefilled context",
        "Idle-detection — recover before they bounce",
        "Scroll-depth or exit-intent triggers",
      ],
      code: {
        filename: "JAVASCRIPT API", cornerLabel: "03 / 05",
        code: `// Wire to any in-page event\nwindow.AutoCrew.ask("Help me with my\naccount");\n\n// Or check ready state first\nwindow.AutoCrew.onReady(() => {\n  console.log("widget v" +\nwindow.AutoCrew.version);\n});`,
      },
  }},
  // 8. DetailWithCode — Search
  { template: "DetailWithCode", content: {
      number: "04", label: "SEARCH ELEMENT",
      headline: "Drop-in shadow-DOM box.",
      body: "<autocrew-search> is a custom element with closed shadow DOM — no CSS conflicts, no host access to internals. Submit calls ask(), so length caps and analytics reuse automatically.",
      bestFor: [
        "Help-center search box — one element, real answers",
        "Hero \"Ask anything\" CTA above the fold",
        "Docs site search replacement",
      ],
      code: {
        filename: "SEARCH ELEMENT", cornerLabel: "04 / 05",
        code: `<autocrew-search\n  placeholder="Search docs…"\n  button-label="Ask"\n  primary-color="#FF6B35"\n></autocrew-search>`,
      },
  }},
  // 9. HeadlineWithScreenshot — Voice mode
  { template: "HeadlineWithScreenshot", content: {
      number: "05", label: "VOICE MODE",
      headlineParts: [{ text: "A real voice agent." }],
      body: "Most chat widgets stop at text. Voice mode runs a full audio session: live transcription, natural-cadence speech, and barge-in — the visitor interrupts the agent mid-response and it stops cleanly.",
      bullets: ["Six visible states", "One tap to start", "Barge-in supported"],
      screenshot: { kind: "kv", title: "voice-states", rightLabel: "05 / 05", rows: [
        { label: "CONNECTING", value: "Establishing audio" },
        { label: "LISTENING", value: "Visitor speaks" },
        { label: "THINKING", value: "Forming response" },
        { label: "SPEAKING", value: "Agent responds" },
        { label: "MUTED", value: "Mic paused" },
        { label: "ERROR", value: "Connection lost" },
      ]},
  }},
  // 10. SixCardGrid — In the wild
  { template: "SixCardGrid", content: {
      number: "06", label: "IN THE WILD",
      headline: "Six places this earns its keep.",
      cards: [
        { cornerLabel: "DECLARATIVE", title: "FAQ rows", body: "Each question becomes a button." },
        { cornerLabel: "DECLARATIVE", title: "Pricing CTAs", body: "Plan-specific qualifying asks." },
        { cornerLabel: "URL PARAM", title: "Email links", body: "Land in conversation, not in a form." },
        { cornerLabel: "<SEARCH>", title: "Help-center box", body: "One element, real answers." },
        { cornerLabel: "VOICE MODE", title: "Mobile CTAs", body: "Tap to talk beats tiny keyboards." },
        { cornerLabel: "JS API", title: "Post-form handoff", body: "Continue immediately, with context." },
      ],
  }},
  // 11. NumberedPoints — Built for production
  { template: "NumberedPoints", content: {
      number: "07", label: "BUILT FOR PRODUCTION",
      headline: "The boring engineering that keeps this in production.",
      points: [
        { number: "01", title: "500-character cap", body: "Every trigger surface auto-truncates." },
        { number: "02", title: "Single-event dispatch", body: "Exactly one event per trigger." },
        { number: "03", title: "Pre-init queue", body: "Calls before load buffer + replay." },
        { number: "04", title: "Closed shadow DOM", body: "Host CSS can't leak in. Or out." },
        { number: "05", title: "Self-cleaning URLs", body: "Refresh doesn't re-fire deep links." },
        { number: "06", title: "Per-crew isolation", body: "Multi-tenant safe by construction." },
      ],
  }},
  // 12. HeadlineWithScreenshot — Configure without code
  { template: "HeadlineWithScreenshot", content: {
      number: "08", label: "CONFIGURE WITHOUT CODE",
      headlineParts: [
        { text: "Engineering ships once. " },
        { text: "Marketing iterates forever.", accent: true },
      ],
      body: "Theme, position, copy, suggested questions, voice toggle, greeting timing — change them per crew, push live, no redeploy. Widget pulls fresh config on every page load.",
      bullets: [
        "Tone the widget per audience without a code change",
        "A/B test copy and suggested questions",
        "Flip voice on for one crew, off for another",
      ],
      screenshot: { kind: "kv", title: "autocrew-001 / customize", rightLabel: "● SAVED", rows: [
        { label: "THEME", value: "Auto" },
        { label: "POSITION", value: "Bottom-right" },
        { label: "PRIMARY COLOR", value: "#FF6B35" },
        { label: "TITLE", value: "Chat with Sarah" },
        { label: "VOICE AGENT", value: "Enabled" },
      ]},
  }},
  // 13. HeadlineWithCode — Install
  { template: "HeadlineWithCode", content: {
      number: "09", label: "INSTALL",
      headlineLines: [
        { text: "Three lines." },
        { text: "One crewCode.", accent: true },
        { text: "That's it." },
      ],
      code: { filename: "index.html", cornerLabel: "REQUIRED",
        code: `<script>\n  window.AutoCrewConfig = { crewCode: "YOUR-CREW-CODE" };\n</script>\n<script src="https://app.autocrew-ai.com/widget.js" async></script>`,
      },
      footerCaption: "LOADS ASYNC · PULLS CONFIG · WIRES TRIGGERS AUTOMATICALLY",
  }},
  // 14. ComparisonTable
  { template: "ComparisonTable", content: {
      number: "10", label: "VERSUS THE ALTERNATIVES",
      headlineParts: [
        { text: "Static forms. Off-the-shelf chatbots. Custom builds. " },
        { text: "None of them ship in five minutes.", accent: true },
      ],
      columns: ["CAPABILITY", "STATIC FORM", "GENERIC CHATBOT", "CUSTOM AI BUILD", "AUTOCREW"],
      rows: [
        ["Time to deploy",                   "Hours", "Days",    "Weeks",  "Minutes"],
        ["Per-page question targeting",      "—",     "Partial", "✓",      "✓"],
        ["Voice mode",                       "—",     "—",       "Custom", "✓"],
        ["Single-dispatch + capped",         "—",     "Varies",  "Varies", "✓"],
        ["Live handoff",                     "—",     "✓",       "✓",      "✓"],
        ["No re-embed for new triggers",     "—",     "—",       "—",      "✓"],
        ["Cost",                             "Low",   "Per-seat","Very high","Usage-based"],
      ],
  }},
  // 15. ClosingCTA
  { template: "ClosingCTA", content: {
      headlineParts: [
        { text: "Ship a widget that " },
        { text: "talks back.", accent: true },
      ],
      sub: "Twenty minutes with a human, or thirty seconds with the widget itself.",
      primaryCta: { label: "Book a 20-min demo", href: "https://autocrew-ai.com/contact" },
      secondaryCta: { label: "Ask the widget", href: "https://autocrew-ai.com" },
  }},
];
