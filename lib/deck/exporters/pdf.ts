// lib/deck/exporters/pdf.ts
import { waitForFonts, waitForImages } from "./wait";
import { deckFilename } from "../filename";
import type { DeckDraft } from "../state";

export async function exportPdf(draft: DeckDraft): Promise<void> {
  const iframe = document.getElementById("deck-render-iframe") as HTMLIFrameElement | null;
  if (!iframe?.contentWindow || !iframe.contentDocument) throw new Error("Render iframe not mounted");
  const win = iframe.contentWindow;
  await waitForFonts(win);
  await waitForImages(iframe.contentDocument);
  iframe.contentDocument.title = deckFilename({ template: draft.template, prospectName: draft.prospect.name, date: new Date(draft.createdAt) });
  win.focus();
  win.print();
}
