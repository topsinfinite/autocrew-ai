import { ImageResponse } from "next/og";
import { OgLayout } from "@/lib/og/og-layout";

export const runtime = "edge";
export const alt = "AutoCrew – AI-Powered Automation That Works 24/7";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <OgLayout
      headline="AI-Powered Automation That Works 24/7"
      subline="Voice, chat, and multi-channel AI agents for your business. No code required."
    />,
    { ...size },
  );
}
