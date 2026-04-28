// lib/deck/exporters/wait.ts
export async function waitForFonts(win: Window): Promise<void> {
  if (win.document.fonts?.ready) await win.document.fonts.ready;
}
export async function waitForImages(doc: Document): Promise<void> {
  const imgs = Array.from(doc.images);
  await Promise.all(imgs.map((img) => img.complete ? Promise.resolve() : new Promise<void>((res) => { img.addEventListener("load", () => res(), { once: true }); img.addEventListener("error", () => res(), { once: true }); })));
}
