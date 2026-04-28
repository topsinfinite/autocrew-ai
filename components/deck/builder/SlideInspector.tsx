"use client";
import type { DeckDraft } from "@/lib/deck/state";
import { ACCENT_LIST, type AccentToken, type DisplayStyle } from "@/lib/deck/tokens";

type Props = {
  draft: DeckDraft;
  activeIdx: number;
  onUpdate: (m: (d: DeckDraft) => DeckDraft) => void;
  onClose: () => void;
};

export function SlideInspector({ draft, activeIdx, onUpdate, onClose }: Props) {
  const slide = draft.slides[activeIdx];
  if (!slide) return null;

  const updateContent = (patch: Record<string, unknown>) =>
    onUpdate((d) => ({ ...d, slides: d.slides.map((s, i) => i === activeIdx ? { ...s, content: { ...(s.content as object), ...patch } as any } : s) }));

  return (
    <aside style={{ width: 360, padding: 24, borderLeft: "1px solid var(--deck-border)", overflowY: "auto", background: "#050505" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <span style={lbl}>Slide {String(activeIdx + 1).padStart(2, "0")} · {slide.template}</span>
        <button onClick={onClose} style={ghostX}>×</button>
      </div>

      {/* Generic JSON editor as universal fallback. Per-template fields can be added later. */}
      <label style={lbl}>Content (JSON)</label>
      <textarea
        defaultValue={JSON.stringify(slide.content, null, 2)}
        onBlur={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            updateContent(parsed);
          } catch {/* ignore — keep prior value */}
        }}
        rows={20}
        style={{ width: "100%", padding: 12, background: "var(--deck-surface)", border: "1px solid var(--deck-border)", color: "var(--deck-text-primary)", fontFamily: "var(--deck-mono-family)", fontSize: 12, borderRadius: 2, marginBottom: 32, resize: "vertical" }}
      />

      <h3 style={lbl}>Theme</h3>
      <div style={{ display: "flex", gap: 8, marginTop: 8, marginBottom: 16 }}>
        {ACCENT_LIST.map((a) => (
          <button key={a} onClick={() => onUpdate((d) => ({ ...d, theme: { ...d.theme, accent: a as AccentToken } }))}
            style={{ width: 28, height: 28, borderRadius: 2, background: `var(--deck-accent-${a})`, border: draft.theme.accent === a ? "2px solid #fff" : "1px solid var(--deck-border)", padding: 0, cursor: "pointer" }} aria-label={a} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {(["serif-italic", "bold-sans"] as DisplayStyle[]).map((d) => (
          <button key={d} onClick={() => onUpdate((dr) => ({ ...dr, theme: { ...dr.theme, displayStyle: d } }))}
            style={{ flex: 1, padding: "8px 12px", background: draft.theme.displayStyle === d ? "var(--deck-accent)" : "var(--deck-surface)", color: draft.theme.displayStyle === d ? "#000" : "var(--deck-text-primary)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>{d}</button>
        ))}
      </div>
    </aside>
  );
}

const lbl: React.CSSProperties = { display: "block", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)", marginBottom: 8 };
const ghostX: React.CSSProperties = { background: "transparent", border: "none", color: "var(--deck-text-muted)", fontSize: 24, cursor: "pointer" };
