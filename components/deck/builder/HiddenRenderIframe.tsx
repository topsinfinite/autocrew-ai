"use client";
export function HiddenRenderIframe({ draftId }: { draftId: string }) {
  return <iframe id="deck-render-iframe" src={`/decks/render/${draftId}`} style={{ position: "fixed", left: -99999, top: -99999, width: 1920, height: 100000, opacity: 0, pointerEvents: "none" }} title="render" aria-hidden />;
}
