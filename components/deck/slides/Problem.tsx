import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { ProblemContent } from "@/lib/deck/slide-content-types";

type Props = { content: ProblemContent; positionLabel?: string };

export function Problem({ content, positionLabel }: Props) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">
          {content.headlineParts.map((p, i) =>
            p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
          )}
        </DisplayHeadline>
        <div style={{ marginTop: 48, maxWidth: 1100 }}>
          <BodyCopy size="lg" color="muted">{content.body}</BodyCopy>
        </div>
        {content.comparison ? (
          <div style={{ marginTop: 80, borderTop: "1px solid var(--deck-border)", paddingTop: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, alignItems: "baseline" }}>
              <MonoLabel>{content.comparison.leftLabel}</MonoLabel>
              <div style={{ display: "flex", gap: 32, color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 13 }}>
                {content.comparison.leftValues.map((v, i) => (
                  <span key={i}>{v}{i < content.comparison!.leftValues.length - 1 ? "  ·" : ""}</span>
                ))}
              </div>
              <MonoLabel color="accent">{content.comparison.rightLabel}</MonoLabel>
              <div style={{ display: "flex", gap: 32, color: "var(--deck-text-primary)", fontFamily: "var(--deck-mono-family)", fontSize: 13 }}>
                {content.comparison.rightValues.map((v, i) => (
                  <span key={i}>{v}{i < content.comparison!.rightValues.length - 1 ? "  ·" : ""}</span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </SlideFrame>
  );
}
