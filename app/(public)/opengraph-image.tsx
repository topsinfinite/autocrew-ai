import { ImageResponse } from "next/og";
import { OgLayout } from "@/lib/og/og-layout";

export const runtime = "edge";
export const alt = "AutoCrew – Never Miss a Patient Call Again";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <OgLayout
      headline="Never Miss a Patient Call Again"
      subline="AI voice agents answer every call, book appointments, and check records — HIPAA-aware and live in under a week."
      stats="HIPAA Aware · EHR Integrated · Live in Days"
    />,
    { ...size },
  );
}
