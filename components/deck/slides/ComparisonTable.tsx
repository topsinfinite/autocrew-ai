import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { ComparisonTableContent } from "@/lib/deck/slide-content-types";

export function ComparisonTable({ content, positionLabel }: { content: ComparisonTableContent; positionLabel?: string }) {
  const lastCol = content.columns.length - 1;
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
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 64 }}>
          <thead>
            <tr style={{ borderTop: "1px solid var(--deck-border)", borderBottom: "1px solid var(--deck-border)" }}>
              {content.columns.map((c, i) => (
                <th
                  key={i}
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    fontFamily: "var(--deck-mono-family)",
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: i === lastCol ? "var(--deck-accent)" : "var(--deck-text-muted)",
                    background: i === lastCol ? "color-mix(in srgb, var(--deck-accent) 12%, transparent)" : "transparent",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: "1px solid var(--deck-border)" }}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "14px 24px",
                      fontFamily: "var(--deck-body-family)",
                      fontSize: 15,
                      color: ci === lastCol ? "var(--deck-text-primary)" : "var(--deck-text-muted)",
                      background: ci === lastCol ? "color-mix(in srgb, var(--deck-accent) 12%, transparent)" : "transparent",
                      fontWeight: ci === lastCol ? 600 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideFrame>
  );
}
