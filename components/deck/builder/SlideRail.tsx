"use client";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DeckDraft } from "@/lib/deck/state";
import { SLIDE_TEMPLATE_IDS, type SlideTemplateId } from "@/lib/deck/slide-content-types";
import { useState } from "react";

type Props = {
  draft: DeckDraft;
  activeIdx: number;
  onActivate: (i: number) => void;
  onUpdate: (m: (d: DeckDraft) => DeckDraft) => void;
};

export function SlideRail({ draft, activeIdx, onActivate, onUpdate }: Props) {
  const [adding, setAdding] = useState(false);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onUpdate((d) => {
      const oldIdx = d.slides.findIndex((s) => s.uid === active.id);
      const newIdx = d.slides.findIndex((s) => s.uid === over.id);
      if (oldIdx < 0 || newIdx < 0) return d;
      const next = [...d.slides];
      const [moved] = next.splice(oldIdx, 1);
      next.splice(newIdx, 0, moved);
      onActivate(newIdx);
      return { ...d, slides: next };
    });
  }

  function toggleIncluded(uid: string) {
    onUpdate((d) => ({ ...d, slides: d.slides.map((s) => s.uid === uid ? { ...s, included: !s.included } : s) }));
  }

  function addSlide(t: SlideTemplateId) {
    onUpdate((d) => {
      const uid = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
      const newSlide = { uid, template: t, included: true, content: defaultContentFor(t) };
      const next = { ...d, slides: [...d.slides.slice(0, activeIdx + 1), newSlide as any, ...d.slides.slice(activeIdx + 1)] };
      onActivate(activeIdx + 1);
      return next;
    });
    setAdding(false);
  }

  return (
    <aside style={{ borderRight: "1px solid var(--deck-border)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--deck-border)" }}>
        <span style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)" }}>Slides</span>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={draft.slides.map((s) => s.uid)} strategy={verticalListSortingStrategy}>
          {draft.slides.map((s, i) => (
            <SortableRow key={s.uid} uid={s.uid} active={i === activeIdx} included={s.included} onActivate={() => onActivate(i)} onToggle={() => toggleIncluded(s.uid)}
              label={`${String(i + 1).padStart(2, "0")}  ${s.template}`} />
          ))}
        </SortableContext>
      </DndContext>
      <div style={{ borderTop: "1px solid var(--deck-border)", padding: 12 }}>
        <button onClick={() => setAdding((v) => !v)} style={addBtn}>+ Add slide</button>
        {adding && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {SLIDE_TEMPLATE_IDS.map((t) => (
              <button key={t} onClick={() => addSlide(t)} style={addItemBtn}>{t}</button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function SortableRow({ uid, label, active, included, onActivate, onToggle }: { uid: string; label: string; active: boolean; included: boolean; onActivate: () => void; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: uid });
  return (
    <div ref={setNodeRef} {...attributes} style={{ transform: CSS.Transform.toString(transform), transition, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: active ? "var(--deck-surface)" : "transparent", borderBottom: "1px solid var(--deck-border)" }}>
      <button {...listeners} aria-label="drag" style={{ background: "transparent", border: "none", color: "var(--deck-text-muted)", cursor: "grab", padding: 4 }}>⠿</button>
      <button onClick={onToggle} aria-label="toggle included" style={{ background: "transparent", border: "none", color: included ? "var(--deck-accent)" : "var(--deck-text-muted)", cursor: "pointer", padding: 4 }}>{included ? "▣" : "▢"}</button>
      <button onClick={onActivate} style={{ flex: 1, textAlign: "left", background: "transparent", border: "none", color: included ? "var(--deck-text-primary)" : "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.08em", cursor: "pointer", padding: 4 }}>{label}</button>
    </div>
  );
}

const addBtn: React.CSSProperties = { width: "100%", padding: "10px", background: "var(--deck-surface)", color: "var(--deck-text-primary)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
const addItemBtn: React.CSSProperties = { padding: "6px 10px", background: "transparent", color: "var(--deck-text-muted)", border: "none", textAlign: "left", fontFamily: "var(--deck-mono-family)", fontSize: 11, cursor: "pointer" };

// Default content per template — one entry per SlideTemplateId. Keep terse; sales fills it in inline.
function defaultContentFor(t: SlideTemplateId): any {
  switch (t) {
    case "Cover":             return { headlineParts: [{ text: "New cover " }, { text: "headline.", accent: true }], sub: "Sub copy.", footerLeft: "autocrew-ai.com" };
    case "Problem":           return { number: "01", label: "PROBLEM", headlineParts: [{ text: "The " }, { text: "problem", accent: true }, { text: "." }], body: "Body copy." };
    case "Solution":          return { number: "02", label: "SOLUTION", headlineParts: [{ text: "The " }, { text: "solution", accent: true }, { text: "." }], body: "Body copy.", bullets: ["ONE", "TWO", "THREE"] };
    case "FiveCardGrid":      return { number: "03", label: "OVERVIEW", headline: "Five things.", sub: "One sentence.", cards: [1,2,3,4,5].map((n) => ({ number: `0${n}`, title: `Card ${n}`, body: "Body." })) };
    case "DetailWithCode":    return { number: "01", label: "DETAIL", headline: "Detail title.", body: "Body.", bestFor: ["Use case A", "Use case B"], code: { filename: "example", code: "// code" } };
    case "SixCardGrid":       return { number: "04", label: "CATEGORIES", headline: "Six places.", cards: [1,2,3,4,5,6].map((n) => ({ cornerLabel: `LABEL ${n}`, title: `Card ${n}`, body: "Body." })) };
    case "NumberedPoints":    return { number: "05", label: "POINTS", headline: "Numbered points.", points: [1,2,3,4,5,6].map((n) => ({ number: `0${n}`, title: `Point ${n}`, body: "Body." })) };
    case "HeadlineWithScreenshot": return { number: "06", label: "DETAIL", headlineParts: [{ text: "Detail." }], body: "Body.", bullets: [], screenshot: { kind: "kv", title: "preview", rows: [{ label: "ONE", value: "Value" }] } };
    case "HeadlineWithCode":  return { number: "07", label: "INSTALL", headlineLines: [{ text: "Three " }, { text: "lines.", accent: true }], code: { filename: "example", code: "// code" } };
    case "ComparisonTable":   return { number: "08", label: "VS", headlineParts: [{ text: "We compare " }, { text: "favorably.", accent: true }], columns: ["CAPABILITY", "OTHER", "AUTOCREW"], rows: [["Time", "Slow", "Fast"]] };
    case "ClosingCTA":        return { headlineParts: [{ text: "Ready to " }, { text: "ship?", accent: true }], sub: "Talk to us.", primaryCta: { label: "Book a demo" } };
    case "BigStat":           return { label: "STAT", stat: "94%", statLabel: "AVERAGE METRIC", context: "Context." };
    case "Quote":             return { label: "TESTIMONIAL", quote: "Game changer.", attribution: { name: "Person", title: "Title", org: "Org" } };
  }
}
