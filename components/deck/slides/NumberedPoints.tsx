import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { MonoLabel } from "../primitives/MonoLabel";
import type { NumberedPointsContent } from "@/lib/deck/slide-content-types";

export function NumberedPoints({ content, positionLabel }: { content: NumberedPointsContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">{content.headline}</DisplayHeadline>
        <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 80, rowGap: 40 }}>
          {content.points.map((p, i) => (
            <div key={i} style={{ paddingBottom: 24, borderBottom: "1px solid var(--deck-border)", display: "flex", gap: 24 }}>
              <div style={{ minWidth: 32 }}><MonoLabel color="accent">{p.number}</MonoLabel></div>
              <div>
                <h3 style={{ margin: 0, fontFamily: "var(--deck-body-family)", fontSize: 22, fontWeight: 600, color: "var(--deck-text-primary)" }}>{p.title}</h3>
                <p style={{ margin: "6px 0 0", fontFamily: "var(--deck-body-family)", fontSize: 15, lineHeight: 1.5, color: "var(--deck-text-muted)" }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
