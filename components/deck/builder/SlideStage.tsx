"use client";
import type { DeckDraft } from "@/lib/deck/state";
import { renderSlide } from "@/lib/deck/slide-templates";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/deck/tokens";
export function SlideStage({ draft, activeIdx }: { draft: DeckDraft; activeIdx: number; onUpdate: (m: (d: DeckDraft) => DeckDraft) => void }) {
  const slide = draft.slides[activeIdx];
  if (!slide) return null;
  // Fit-to-viewport scale
  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflow: "hidden", background: "#050505" }}>
      <div style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: "scale(min(calc((100vw - 280px - 48px) / 1920), calc((100vh - 130px) / 1080)))", transformOrigin: "center" }}>
        {renderSlide({ template: slide.template, content: slide.content } as any, { positionLabel: `${String(activeIdx + 1).padStart(2, "0")} / ${String(draft.slides.length).padStart(2, "0")}` })}
      </div>
    </main>
  );
}
