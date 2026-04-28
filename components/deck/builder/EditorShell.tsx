"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadDraft, saveDraft, type DeckDraft } from "@/lib/deck/state";
import { DeckThemeProvider } from "@/components/deck/builder/DeckThemeContext";
import { SlideRail } from "./SlideRail";
import { SlideStage } from "./SlideStage";
import { DownloadButtons } from "./DownloadButtons";
import { HiddenRenderIframe } from "./HiddenRenderIframe";

export function EditorShell({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState<DeckDraft | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setDraft(loadDraft(draftId)); }, [draftId]);

  // Cross-tab edit collision banner
  const [otherTab, setOtherTab] = useState(false);
  useEffect(() => {
    const ch = new BroadcastChannel(`deck:${draftId}`);
    const me = Math.random().toString(36).slice(2);
    ch.postMessage({ type: "ping", from: me });
    ch.onmessage = (e) => { if (e.data?.type === "ping" && e.data.from !== me) setOtherTab(true); };
    return () => ch.close();
  }, [draftId]);

  const update = useCallback((mut: (d: DeckDraft) => DeckDraft) => {
    setDraft((cur) => {
      if (!cur) return cur;
      const next = mut(cur);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveDraft(next), 500);
      return next;
    });
  }, []);

  if (draft === null) {
    // loading
    return <main style={{ padding: 80, color: "var(--deck-text-muted)" }}>Loading…</main>;
  }
  if (!draft) {
    return (
      <main style={{ padding: 80 }}>
        <h1 style={{ color: "var(--deck-text-primary)", fontFamily: "var(--deck-display-family)", fontStyle: "italic", fontSize: 48 }}>Draft not found in this browser.</h1>
        <p style={{ color: "var(--deck-text-muted)", marginTop: 16 }}>Drafts are stored locally — try a different machine? Or start a new one.</p>
        <a href="/decks" style={{ display: "inline-block", marginTop: 24, padding: "14px 24px", background: "var(--deck-accent)", color: "#000", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>Start a new deck →</a>
      </main>
    );
  }

  return (
    <DeckThemeProvider accent={draft.theme.accent} displayStyle={draft.theme.displayStyle}>
      <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", height: "100vh" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid var(--deck-border)" }}>
          <a href="/decks" style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)", textDecoration: "none" }}>← Decks</a>
          <span style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)" }}>
            {draft.id} · {draft.template}
          </span>
          <DownloadButtons draft={draft} />
        </header>
        {otherTab && (
          <div style={{ background: "color-mix(in srgb, var(--deck-accent-yellow) 20%, transparent)", padding: "8px 24px", color: "var(--deck-text-primary)", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            ⚠ This deck is open in another tab. Edits may overlap.
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", height: "100%", overflow: "hidden" }}>
          <SlideRail draft={draft} activeIdx={activeIdx} onActivate={setActiveIdx} onUpdate={update} />
          <SlideStage draft={draft} activeIdx={activeIdx} onUpdate={update} />
        </div>
        <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderTop: "1px solid var(--deck-border)", color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.12em" }}>
          <button onClick={() => setActiveIdx((i) => Math.max(0, i - 1))} style={navBtn}>← prev</button>
          <span>{String(activeIdx + 1).padStart(2, "0")} / {String(draft.slides.length).padStart(2, "0")}</span>
          <button onClick={() => setActiveIdx((i) => Math.min(draft.slides.length - 1, i + 1))} style={navBtn}>next →</button>
        </footer>
      </div>
      <HiddenRenderIframe draftId={draft.id} />
    </DeckThemeProvider>
  );
}

const navBtn: React.CSSProperties = { background: "transparent", border: "none", color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
