import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { CodePanel } from "../primitives/CodePanel";
import type { DetailWithCodeContent } from "@/lib/deck/slide-content-types";

export function DetailWithCode({ content, positionLabel }: { content: DetailWithCodeContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
        <div>
          <DisplayHeadline size="md">{content.headline}</DisplayHeadline>
          <div style={{ marginTop: 32 }}>
            <BodyCopy size="lg" color="muted">{content.body}</BodyCopy>
          </div>
          <div style={{ marginTop: 64 }}>
            <MonoLabel>{content.bestForLabel ?? "BEST FOR"}</MonoLabel>
            <ul style={{ marginTop: 16, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.bestFor.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "baseline", color: "var(--deck-text-primary)", fontFamily: "var(--deck-body-family)", fontSize: 16, lineHeight: 1.5 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 4, background: "var(--deck-accent)", flexShrink: 0, transform: "translateY(-3px)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <CodePanel filename={content.code.filename} cornerLabel={content.code.cornerLabel} code={content.code.code} />
        </div>
      </div>
    </SlideFrame>
  );
}
