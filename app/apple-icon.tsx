import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 80,
        background: "linear-gradient(135deg, #FF6B35, #e55a2b)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        borderRadius: 36,
        fontFamily: "sans-serif",
      }}
    >
      A
    </div>,
    { ...size },
  );
}
