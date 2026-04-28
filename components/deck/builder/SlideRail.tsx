"use client";
import type { DeckDraft } from "@/lib/deck/state";
export function SlideRail({ draft, activeIdx, onActivate }: { draft: DeckDraft; activeIdx: number; onActivate: (i: number) => void; onUpdate: (m: (d: DeckDraft) => DeckDraft) => void }) {
  return <aside style={{ borderRight: "1px solid var(--deck-border)", overflowY: "auto" }}>{draft.slides.map((s, i) => <button key={s.uid} onClick={() => onActivate(i)} style={{ display: "block", padding: 12, background: i === activeIdx ? "var(--deck-surface)" : "transparent", border: "none", color: "var(--deck-text-primary)", textAlign: "left", width: "100%", cursor: "pointer", fontFamily: "var(--deck-mono-family)", fontSize: 11 }}>{String(i + 1).padStart(2, "0")} {s.template}</button>)}</aside>;
}
