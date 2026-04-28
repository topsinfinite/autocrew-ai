import { SlideFrame } from "../primitives/SlideFrame";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { Accent } from "../primitives/Accent";
import type { ClosingCTAContent } from "@/lib/deck/slide-content-types";

export function ClosingCTA({ content }: { content: ClosingCTAContent }) {
  return (
    <SlideFrame footer={<><span /><span /></>}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 48, textAlign: "center" }}>
        {content.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.logo.src} alt={content.logo.alt ?? "logo"} style={{ height: 48 }} />
        ) : null}
        <DisplayHeadline size="lg" as="h1">
          {content.headlineParts.map((p, i) =>
            p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
          )}
        </DisplayHeadline>
        <BodyCopy size="lg" color="muted" maxWidth={900}>{content.sub}</BodyCopy>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <a
            href={content.primaryCta.href ?? "#"}
            style={{
              padding: "16px 28px",
              borderRadius: 999,
              background: "var(--deck-accent)",
              color: "#000",
              fontFamily: "var(--deck-body-family)",
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {content.primaryCta.label} →
          </a>
          {content.secondaryCta ? (
            <a
              href={content.secondaryCta.href ?? "#"}
              style={{
                padding: "16px 28px",
                borderRadius: 999,
                background: "transparent",
                border: "1px solid var(--deck-border)",
                color: "var(--deck-text-primary)",
                fontFamily: "var(--deck-body-family)",
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              {content.secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
    </SlideFrame>
  );
}
