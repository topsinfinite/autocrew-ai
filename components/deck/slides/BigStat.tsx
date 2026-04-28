import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import type { BigStatContent } from "@/lib/deck/slide-content-types";

export function BigStat({ content, positionLabel }: { content: BigStatContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
        <div style={{ fontFamily: "var(--deck-display-family)", fontStyle: "var(--deck-display-style)", fontWeight: "var(--deck-display-weight)" as unknown as number, fontSize: 320, lineHeight: 0.9, letterSpacing: "-0.04em", color: "var(--deck-accent)" }}>
          {content.stat}
        </div>
        <MonoLabel color="primary">{content.statLabel}</MonoLabel>
        <BodyCopy size="lg" color="muted" maxWidth={1100}>{content.context}</BodyCopy>
      </div>
    </SlideFrame>
  );
}
