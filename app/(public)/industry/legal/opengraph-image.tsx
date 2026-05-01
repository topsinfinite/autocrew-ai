import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt = "AI Automation for Law Firms — Autocrew";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "AI Automation for Law Firms & Legal Aid",
    description:
      "Privilege-respecting intake, conflict screening, and routine client comms — integrated with Clio, LegalServer, and MyCase.",
  });
}
