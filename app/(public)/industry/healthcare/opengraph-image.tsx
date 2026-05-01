import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt = "AI Automation for Healthcare — Autocrew";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "AI Voice Agents for Healthcare",
    description:
      "HIPAA-aware patient intake, scheduling, and EHR-grounded answers — with Smart Escalation to a human when needed.",
  });
}
