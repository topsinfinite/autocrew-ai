"use client";
import { useState } from "react";
import type { DeckDraft } from "@/lib/deck/state";
import { exportPdf } from "@/lib/deck/exporters/pdf";
import { exportPptx } from "@/lib/deck/exporters/pptx";

export function DownloadButtons({ draft }: { draft: DeckDraft }) {
  const [busy, setBusy] = useState<"pdf" | "pptx" | null>(null);
  const [progress, setProgress] = useState(0);

  async function pdf() {
    setBusy("pdf");
    try { await exportPdf(draft); } finally { setBusy(null); }
  }
  async function pptx() {
    setBusy("pptx"); setProgress(0);
    try { await exportPptx(draft, (cur, total) => setProgress(Math.round((cur / total) * 100))); }
    finally { setBusy(null); setProgress(0); }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={pdf} disabled={busy !== null} style={primary}>{busy === "pdf" ? "Opening…" : "PDF"}</button>
      <button onClick={pptx} disabled={busy !== null} style={ghost}>{busy === "pptx" ? `PPTX ${progress}%` : "PPTX"}</button>
    </div>
  );
}

const primary: React.CSSProperties = { padding: "8px 16px", background: "var(--deck-accent)", color: "#000", border: "none", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
const ghost: React.CSSProperties = { padding: "8px 16px", background: "var(--deck-surface)", color: "var(--deck-text-primary)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
