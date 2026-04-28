import { DeckThemeProvider } from "@/components/deck/builder/DeckThemeContext";
import { SlideFrame } from "@/components/deck/primitives/SlideFrame";
import { SlideHeader } from "@/components/deck/primitives/SlideHeader";
import { DisplayHeadline } from "@/components/deck/primitives/DisplayHeadline";
import { Accent } from "@/components/deck/primitives/Accent";
import { BodyCopy } from "@/components/deck/primitives/BodyCopy";
import { MonoLabel } from "@/components/deck/primitives/MonoLabel";
import { CodePanel } from "@/components/deck/primitives/CodePanel";
import { ACCENT_LIST, type AccentToken, type DisplayStyle } from "@/lib/deck/tokens";
import { Cover } from "@/components/deck/slides/Cover";
import { Problem } from "@/components/deck/slides/Problem";

const STYLES: DisplayStyle[] = ["serif-italic", "bold-sans"];

export default function PrimitivesQAPage() {
  return (
    <main style={{ padding: 40, display: "flex", flexDirection: "column", gap: 80 }}>
      <h1 style={{ color: "#fff", fontFamily: "system-ui", fontSize: 24 }}>
        Primitives QA — every accent × every display style
      </h1>

      {STYLES.map((displayStyle) =>
        ACCENT_LIST.map((accent: AccentToken) => (
          <div key={`${displayStyle}-${accent}`} style={{ transform: "scale(0.5)", transformOrigin: "top left" }}>
            <p style={{ color: "#888", marginBottom: 8, fontFamily: "system-ui" }}>
              {displayStyle} · {accent}
            </p>
            <DeckThemeProvider accent={accent} displayStyle={displayStyle}>
              <SlideFrame
                header={<SlideHeader number="01" label="THE PROBLEM" />}
                footer={
                  <>
                    <MonoLabel>autocrew · prepared for acme corp</MonoLabel>
                    <MonoLabel>02 / 15</MonoLabel>
                  </>
                }
              >
                <div style={{ marginTop: 200 - 80 - 24 - 12 }}>
                  <DisplayHeadline size="md">
                    Static forms send visitors into a <Accent>queue</Accent>. Conversations don&apos;t.
                  </DisplayHeadline>
                  <div style={{ marginTop: 48, maxWidth: 900 }}>
                    <BodyCopy size="lg" color="muted">
                      Every &ldquo;Contact us&rdquo; button is a form. Every form is a wait.
                      The widget flips that model: visitors talk to your AI agent immediately.
                    </BodyCopy>
                  </div>
                  <div style={{ marginTop: 64, maxWidth: 900 }}>
                    <CodePanel
                      filename="example.html"
                      cornerLabel="01 / 05"
                      code={`<button data-autocrew-question="What are your hours?">\n  See our hours\n</button>`}
                    />
                  </div>
                </div>
              </SlideFrame>
              <div style={{ marginTop: 24 }}>
                <Cover
                  positionLabel="01 / 15"
                  content={{
                    eyebrow: "V1.1 · LIVE",
                    headlineParts: [
                      { text: "Turn every button into a " },
                      { text: "live conversation.", accent: true },
                    ],
                    sub: "A trigger system for AI agents — five surfaces, zero forms, on any site.",
                    footerLeft: "autocrew-ai.com / widget",
                  }}
                />
              </div>
              <div style={{ marginTop: 24 }}>
                <Problem
                  positionLabel="02 / 15"
                  content={{
                    number: "01",
                    label: "THE PROBLEM",
                    headlineParts: [
                      { text: "Static forms send visitors into a " },
                      { text: "queue", accent: true },
                      { text: ". Conversations don’t." },
                    ],
                    body: "Every “Contact us” button is a form. Every form is a wait. The widget flips that model: visitors talk to your AI agent immediately.",
                    comparison: {
                      leftLabel: "FORM",
                      leftValues: ["FILL", "SUBMIT", "WAIT", "MAYBE REPLY"],
                      rightLabel: "WIDGET",
                      rightValues: ["CLICK", "TALK", "ANSWERED", "BOOKED"],
                    },
                  }}
                />
              </div>
            </DeckThemeProvider>
          </div>
        ))
      )}
    </main>
  );
}
