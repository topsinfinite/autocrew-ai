// lib/deck/draft-factory.ts
import { DECK_TEMPLATES, type DeckTemplateId } from "./templates";
import type { DeckDraft } from "./state";
import type { AccentToken, DisplayStyle } from "./tokens";
import { draftIdFor } from "./hash";

let uidCounter = 0;
function nextUid(): string {
  uidCounter += 1;
  return `s${Date.now().toString(36)}${uidCounter.toString(36)}`;
}

export async function newDraftFromTemplate(args: {
  templateId: DeckTemplateId;
  prospect: DeckDraft["prospect"];
  salesRep: DeckDraft["salesRep"];
  now: Date;
  themeOverride?: { accent?: AccentToken; displayStyle?: DisplayStyle };
}): Promise<DeckDraft> {
  const template = DECK_TEMPLATES[args.templateId];
  const draftCore: Omit<DeckDraft, "id"> = {
    schemaVersion: 1,
    template: args.templateId,
    createdAt: args.now.toISOString(),
    theme: {
      accent: args.themeOverride?.accent ?? template.defaultAccent,
      displayStyle: args.themeOverride?.displayStyle ?? template.defaultDisplayStyle,
    },
    prospect: { ...args.prospect },
    salesRep: { ...args.salesRep },
    slides: template.slides.map((s) => ({
      uid: nextUid(),
      template: s.template,
      included: true,
      content: s.content,
    })),
  };
  const id = await draftIdFor(draftCore);
  return { id, ...draftCore };
}
