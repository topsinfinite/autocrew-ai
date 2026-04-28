"use client";
import { useEffect, useState } from "react";
import { loadDraft, type DeckDraft } from "@/lib/deck/state";
import { DeckThemeProvider } from "@/components/deck/builder/DeckThemeContext";
import { renderSlide } from "@/lib/deck/slide-templates";

export function RenderStack({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState<DeckDraft | null>(null);
  useEffect(() => { setDraft(loadDraft(draftId)); }, [draftId]);
  useEffect(() => { if (draft) document.title = `${draft.template}-${draft.prospect.name ?? "draft"}-${draft.id}`; }, [draft]);
  if (!draft) return null;
  const included = draft.slides.filter((s) => s.included);
  return (
    <DeckThemeProvider accent={draft.theme.accent} displayStyle={draft.theme.displayStyle}>
      <div data-deck-render-root style={{ background: "#0A0A0A" }}>
        {included.map((s, i) => (
          <div key={s.uid} data-deck-slide-wrap>
            {renderSlide({ template: s.template, content: s.content } as any, { positionLabel: `${String(i + 1).padStart(2, "0")} / ${String(included.length).padStart(2, "0")}` })}
          </div>
        ))}
      </div>
    </DeckThemeProvider>
  );
}
