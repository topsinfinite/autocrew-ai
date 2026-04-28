"use client";
import { useState } from "react";
import type { DeckDraft } from "@/lib/deck/state";
import { renderSlide } from "@/lib/deck/slide-templates";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/deck/tokens";
import { SlideInspector } from "./SlideInspector";

type Props = { draft: DeckDraft; activeIdx: number; onUpdate: (m: (d: DeckDraft) => DeckDraft) => void };

export function SlideStage({ draft, activeIdx, onUpdate }: Props) {
  const slide = draft.slides[activeIdx];
  const [inspectorOpen, setInspectorOpen] = useState(false);
  if (!slide) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: inspectorOpen ? "1fr 360px" : "1fr", height: "100%" }}>
      <main onClick={() => setInspectorOpen(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflow: "hidden", background: "#050505", cursor: "pointer" }}>
        <div style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: "scale(min(calc((100vw - 280px - 360px - 48px) / 1920), calc((100vh - 130px) / 1080)))", transformOrigin: "center" }}>
          {renderSlide({ template: slide.template, content: slide.content } as any, { positionLabel: `${String(activeIdx + 1).padStart(2, "0")} / ${String(draft.slides.length).padStart(2, "0")}` })}
        </div>
      </main>
      {inspectorOpen ? <SlideInspector draft={draft} activeIdx={activeIdx} onUpdate={onUpdate} onClose={() => setInspectorOpen(false)} /> : null}
    </div>
  );
}
