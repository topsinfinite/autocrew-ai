import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { MonoLabel } from "../primitives/MonoLabel";
import type { SixCardGridContent } from "@/lib/deck/slide-content-types";

export function SixCardGrid({ content, positionLabel }: { content: SixCardGridContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">{content.headline}</DisplayHeadline>
        <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {content.cards.map((c, i) => (
            <div key={i} style={{ background: "var(--deck-surface)", border: "1px solid var(--deck-border)", borderRadius: 2, padding: 32, minHeight: 200, display: "flex", flexDirection: "column" }}>
              <div style={{ alignSelf: "flex-end", marginBottom: 16 }}>
                <MonoLabel color="accent">{c.cornerLabel}</MonoLabel>
              </div>
              <h3 style={{ margin: 0, fontFamily: "var(--deck-body-family)", fontSize: 22, fontWeight: 600, color: "var(--deck-text-primary)" }}>{c.title}</h3>
              <p style={{ margin: "8px 0 0", fontFamily: "var(--deck-body-family)", fontSize: 15, lineHeight: 1.5, color: "var(--deck-text-muted)" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
