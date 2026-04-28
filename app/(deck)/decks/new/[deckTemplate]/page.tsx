import { notFound } from "next/navigation";
import { DECK_TEMPLATES, type DeckTemplateId } from "@/lib/deck/templates";
import { WizardForm } from "@/components/deck/builder/WizardForm";

export default async function NewDeckPage({ params }: { params: Promise<{ deckTemplate: string }> }) {
  const { deckTemplate } = await params;
  const tpl = DECK_TEMPLATES[deckTemplate as DeckTemplateId];
  if (!tpl) notFound();
  return (
    <main style={{ padding: 80, maxWidth: 960, marginInline: "auto" }}>
      <a href="/decks" style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)", textDecoration: "none" }}>← Decks</a>
      <h1 style={{ fontFamily: "var(--deck-display-family)", fontStyle: "var(--deck-display-style)", fontWeight: "var(--deck-display-weight)" as unknown as number, fontSize: 64, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "16px 0 8px" }}>
        New {tpl.name}.
      </h1>
      <p style={{ color: "var(--deck-text-muted)", fontSize: 16, marginBottom: 48 }}>{tpl.description}</p>
      <WizardForm templateId={tpl.id} />
    </main>
  );
}
