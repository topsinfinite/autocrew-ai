import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { HeadlineWithScreenshotContent } from "@/lib/deck/slide-content-types";

export function HeadlineWithScreenshot({ content, positionLabel }: { content: HeadlineWithScreenshotContent; positionLabel?: string }) {
  const ss = content.screenshot;
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
        <div>
          <DisplayHeadline size="md">
            {content.headlineParts.map((p, i) =>
              p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
            )}
          </DisplayHeadline>
          <div style={{ marginTop: 32 }}><BodyCopy size="lg" color="muted">{content.body}</BodyCopy></div>
          <ul style={{ marginTop: 32, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {content.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "baseline", color: "var(--deck-text-primary)", fontFamily: "var(--deck-body-family)", fontSize: 16 }}>
                <span style={{ width: 4, height: 4, borderRadius: 4, background: "var(--deck-accent)", flexShrink: 0, transform: "translateY(-3px)" }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {ss.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ss.src} alt={ss.alt ?? ""} style={{ width: "100%", border: "1px solid var(--deck-border)", borderRadius: 2 }} />
          ) : (
            <div style={{ background: "var(--deck-surface)", border: "1px solid var(--deck-border)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--deck-border)" }}>
                <MonoLabel>{ss.title}</MonoLabel>
                {ss.rightLabel ? <MonoLabel color="accent">{ss.rightLabel}</MonoLabel> : null}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {ss.rows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: i < ss.rows.length - 1 ? "1px solid var(--deck-border)" : "none" }}>
                      <td style={{ padding: "14px 24px", color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>{r.label}</td>
                      <td style={{ padding: "14px 24px", color: "var(--deck-text-primary)", fontFamily: "var(--deck-body-family)", fontSize: 16 }}>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SlideFrame>
  );
}
