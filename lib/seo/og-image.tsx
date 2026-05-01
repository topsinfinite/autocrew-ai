import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

interface OgImageProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export function renderOgImage({
  title,
  description,
  eyebrow = "Autocrew",
}: OgImageProps) {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 72,
        background:
          "linear-gradient(145deg, #050814 0%, #0a1628 50%, #0d1f2a 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: "#FF6B35",
          }}
        />
        <span style={{ color: "#FF6B35", fontSize: 28, fontWeight: 600 }}>
          {eyebrow}
        </span>
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#f4f4f5",
          lineHeight: 1.1,
          maxWidth: 900,
          marginBottom: 24,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 28,
          color: "#a1a1aa",
          maxWidth: 900,
          lineHeight: 1.4,
        }}
      >
        {description}
      </div>
    </div>,
    { ...ogImageSize },
  );
}
