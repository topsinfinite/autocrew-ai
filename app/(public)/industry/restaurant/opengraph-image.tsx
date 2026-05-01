import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt = "AI Automation for Restaurants — Autocrew";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "AI Voice Agents for Restaurants",
    description:
      "Reservations, takeout orders, and overflow-call coverage — answered in seconds, every time.",
  });
}
