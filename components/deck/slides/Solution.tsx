import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { SolutionContent } from "@/lib/deck/slide-content-types";

export function Solution({ content, positionLabel }: { content: SolutionContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12, height: "100%", display: "flex", flexDirection: "column" }}>
        <DisplayHeadline size="md">
          {content.headlineParts.map((p, i) =>
            p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
          )}
        </DisplayHeadline>
        <div style={{ marginTop: 48, maxWidth: 1100 }}>
          <BodyCopy size="lg" color="muted">{content.body}</BodyCopy>
        </div>
        <div style={{ marginTop: "auto", display: "flex", gap: 96, alignItems: "center", paddingBottom: 64 }}>
          {content.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <span style={{ width: 12, height: 12, borderRadius: 12, background: "var(--deck-accent)" }} />
              <MonoLabel>{b}</MonoLabel>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
