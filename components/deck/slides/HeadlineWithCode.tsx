import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { CodePanel } from "../primitives/CodePanel";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { HeadlineWithCodeContent } from "@/lib/deck/slide-content-types";

export function HeadlineWithCode({ content, positionLabel }: { content: HeadlineWithCodeContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">
          {content.headlineLines.map((l, i) => (
            <div key={i}>
              {l.accent ? <Accent>{l.text}</Accent> : <span>{l.text}</span>}
            </div>
          ))}
        </DisplayHeadline>
        <div style={{ marginTop: 48 }}>
          <CodePanel filename={content.code.filename} cornerLabel={content.code.cornerLabel} code={content.code.code} />
        </div>
        {content.footerCaption ? (
          <div style={{ marginTop: 24 }}>
            <MonoLabel>{content.footerCaption}</MonoLabel>
          </div>
        ) : null}
      </div>
    </SlideFrame>
  );
}
