// lib/deck/image.ts
const MAX_BYTES = 200 * 1024;
const MAX_DIM = 512;

export async function fileToCappedDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(file);
  });
  const sizeBytes = Math.ceil(((dataUrl.length - dataUrl.indexOf(",") - 1) * 3) / 4);
  if (sizeBytes <= MAX_BYTES) return dataUrl;

  // Downscale via canvas
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("invalid image"));
    i.src = dataUrl;
  });
  const ratio = Math.min(MAX_DIM / img.width, MAX_DIM / img.height, 1);
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  let q = 0.92;
  let out = canvas.toDataURL("image/png");
  while (out.length * 0.75 > MAX_BYTES && q > 0.4) {
    q -= 0.1;
    out = canvas.toDataURL("image/jpeg", q);
  }
  return out;
}
