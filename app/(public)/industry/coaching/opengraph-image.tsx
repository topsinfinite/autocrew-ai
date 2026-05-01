import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt = "AI Automation for Coaches — Autocrew";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "AI Automation for Coaches",
    description:
      "Discovery calls, intake, scheduling, payments, and follow-ups handled in the background — across Calendly, Stripe, Notion, and Slack.",
  });
}
