import { type ReactElement } from "react";

export interface OgImageProps {
  eyebrow?: string;
  headline: string;
  subline: string;
  stats?: string;
  accentColor?: string;
}

/**
 * Shared OG image layout matching AutoCrew's dark brand.
 * Uses inline styles (required by next/og ImageResponse / Satori).
 */
export function OgLayout({
  eyebrow,
  headline,
  subline,
  stats,
  accentColor = "#0ea5e9",
}: OgImageProps): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        background:
          "linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0a0f1e 100%)",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative gradient orb */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          display: "flex",
        }}
      />

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88, transparent)`,
          display: "flex",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          display: "flex",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 800,
              color: "#fff",
            }}
          >
            A
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#e2e8f0",
              letterSpacing: "-0.02em",
            }}
          >
            AutoCrew
          </span>
        </div>

        {/* Eyebrow */}
        {eyebrow && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "2px",
                background: accentColor,
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        {/* Headline */}
        <h1
          style={{
            fontSize: headline.length > 40 ? "52px" : "60px",
            fontWeight: 800,
            color: "#f1f5f9",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: 0,
            maxWidth: "900px",
          }}
        >
          {headline}
        </h1>

        {/* Subline */}
        <p
          style={{
            fontSize: "24px",
            fontWeight: 400,
            color: "#94a3b8",
            lineHeight: 1.4,
            margin: 0,
            maxWidth: "800px",
          }}
        >
          {subline}
        </p>

        {/* Stats bar */}
        {stats && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "12px",
              padding: "12px 20px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              width: "fit-content",
            }}
          >
            <span
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: "#cbd5e1",
                letterSpacing: "0.02em",
              }}
            >
              {stats}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
