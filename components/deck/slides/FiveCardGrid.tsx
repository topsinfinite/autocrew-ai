import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import type { FiveCardGridContent } from "@/lib/deck/slide-content-types";

export function FiveCardGrid({ content, positionLabel }: { content: FiveCardGridContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} secondary={content.secondary} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12, height: "100%", display: "flex", flexDirection: "column" }}>
        <DisplayHeadline size="md">{content.headline}</DisplayHeadline>
        <div style={{ marginTop: 24 }}>
          <BodyCopy size="lg" color="muted" maxWidth={1100}>{content.sub}</BodyCopy>
        </div>
        <div style={{ marginTop: "auto", paddingBottom: 32, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24 }}>
          {content.cards.map((c, i) => (
            <div
              key={i}
              style={{
                background: "var(--deck-surface)",
                border: "1px solid var(--deck-border)",
                borderRadius: 2,
                padding: 32,
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <MonoLabel color="accent">{c.number}</MonoLabel>
                <span style={{ width: 8, height: 8, borderRadius: 8, background: "var(--deck-accent)" }} />
              </div>
              <div style={{ marginTop: "auto" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--deck-body-family)", fontSize: 24, fontWeight: 600, color: "var(--deck-text-primary)" }}>{c.title}</h3>
                <p style={{ margin: "8px 0 0", fontFamily: "var(--deck-body-family)", fontSize: 16, lineHeight: 1.5, color: "var(--deck-text-muted)" }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
