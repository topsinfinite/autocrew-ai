// lib/deck/exporters/pptx.ts
import PptxGenJS from "pptxgenjs";
import html2canvas from "html2canvas";
import { waitForFonts, waitForImages } from "./wait";
import { deckFilename } from "../filename";
import type { DeckDraft } from "../state";

export async function exportPptx(draft: DeckDraft, onProgress?: (cur: number, total: number) => void): Promise<void> {
  const iframe = document.getElementById("deck-render-iframe") as HTMLIFrameElement | null;
  if (!iframe?.contentWindow || !iframe.contentDocument) throw new Error("Render iframe not mounted");
  await waitForFonts(iframe.contentWindow);
  await waitForImages(iframe.contentDocument);

  const slideEls = Array.from(iframe.contentDocument.querySelectorAll<HTMLElement>("[data-deck-slide]"));
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "AC_16x9", width: 13.333, height: 7.5 });
  pptx.layout = "AC_16x9";

  for (let i = 0; i < slideEls.length; i++) {
    onProgress?.(i, slideEls.length);
    const canvas = await html2canvas(slideEls[i], { scale: 2, backgroundColor: "#0A0A0A", useCORS: true, logging: false, windowWidth: 1920, windowHeight: 1080 });
    const dataUrl = canvas.toDataURL("image/png");
    pptx.addSlide().addImage({ data: dataUrl, x: 0, y: 0, w: 13.333, h: 7.5 });
  }
  onProgress?.(slideEls.length, slideEls.length);
  await pptx.writeFile({ fileName: `${deckFilename({ template: draft.template, prospectName: draft.prospect.name, date: new Date(draft.createdAt) })}.pptx` });
}
