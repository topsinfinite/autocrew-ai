"use client";
import type { DeckDraft } from "@/lib/deck/state";
export function DownloadButtons(_: { draft: DeckDraft }) {
  return <div style={{ display: "flex", gap: 8 }}>
    <button disabled style={{ padding: "8px 16px", background: "var(--deck-accent)", color: "#000", border: "none", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>PDF</button>
    <button disabled style={{ padding: "8px 16px", background: "var(--deck-surface)", color: "var(--deck-text-primary)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>PPTX</button>
  </div>;
}
