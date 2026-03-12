import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Automation for Coaches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: "#0f172a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 24,
          color: "#FF6B35",
          marginBottom: 16,
          display: "flex",
        }}
      >
        AutoCrew
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 800,
          display: "flex",
        }}
      >
        AI Automation for Coaches
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#94a3b8",
          marginTop: 16,
          textAlign: "center",
          maxWidth: 700,
          display: "flex",
        }}
      >
        Scale your coaching practice with AI-powered scheduling, client intake,
        and intelligent follow-ups.
      </div>
    </div>,
    { ...size },
  );
}
