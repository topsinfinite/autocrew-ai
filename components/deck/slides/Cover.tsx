import { SlideFrame } from "../primitives/SlideFrame";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { CoverContent } from "@/lib/deck/slide-content-types";

type Props = {
  content: CoverContent;
  /** Slide-position label shown right side, e.g. "01 / 15". */
  positionLabel?: string;
  /** Logo node (e.g. <img>) shown top-left. Optional. */
  logo?: React.ReactNode;
};

export function Cover({ content, positionLabel, logo }: Props) {
  return (
    <SlideFrame
      header={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 24, borderBottom: "1px solid var(--deck-border)" }}>
          <div>{logo ?? <MonoLabel color="primary">autocrew</MonoLabel>}</div>
          {content.eyebrow ? <MonoLabel>{content.eyebrow}</MonoLabel> : null}
        </div>
      }
      footer={
        <>
          {content.footerLeft ? <MonoLabel>{content.footerLeft}</MonoLabel> : <span />}
          {positionLabel ? <MonoLabel>{positionLabel}</MonoLabel> : null}
        </>
      }
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <DisplayHeadline size="xl" as="h1">
          {content.headlineParts.map((part, i) =>
            part.accent
              ? <Accent key={i}>{part.text}</Accent>
              : <span key={i}>{part.text}</span>
          )}
        </DisplayHeadline>
        {content.sub ? (
          <div style={{ marginTop: 48 }}>
            <BodyCopy size="lg" color="muted" maxWidth={900}>{content.sub}</BodyCopy>
          </div>
        ) : null}
      </div>
    </SlideFrame>
  );
}
