"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PostCoverProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  category?: string;
  className?: string;
  /** Used when no image and no src — text shown in placeholder */
  placeholderLabel?: string;
}

// Editorial color palettes per category for branded SVG placeholders.
// Selected to be distinct, calm, and to feel intentional rather than broken.
const CATEGORY_PALETTES: Record<string, { from: string; to: string; ink: string }> = {
  healthcare: { from: "#FFE9DC", to: "#FFC9A8", ink: "#5A2D14" },
  coaching: { from: "#E8E2D6", to: "#C9B79C", ink: "#3D2F1F" },
  legal: { from: "#E0DCD2", to: "#B5AD9D", ink: "#2D2820" },
  restaurants: { from: "#FFD9C4", to: "#FFA679", ink: "#5C1F0A" },
  "ai-automation": { from: "#FFE3C9", to: "#FF8A52", ink: "#3D1505" },
  "customer-service": { from: "#F4EBD8", to: "#D9C495", ink: "#3F3315" },
  playbooks: { from: "#EDE7DA", to: "#C4B89F", ink: "#2E2516" },
  news: { from: "#F2EDE0", to: "#D2C7AC", ink: "#2C2517" },
  default: { from: "#F4EFE6", to: "#D9CDB3", ink: "#1A1410" },
};

function PlaceholderCover({
  category,
  label,
  className,
}: {
  category?: string;
  label: string;
  className?: string;
}) {
  const palette = CATEGORY_PALETTES[category ?? "default"] ?? CATEGORY_PALETTES.default;
  return (
    <div
      className={cn("w-full h-full relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
      aria-hidden="true"
    >
      {/* Subtle diagonal lines for editorial texture */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="diag"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="14" stroke={palette.ink} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag)" />
      </svg>

      {/* Wordmark */}
      <div className="absolute inset-0 flex items-end p-6">
        <div
          className="font-display font-semibold tracking-tight uppercase text-[clamp(14px,3vw,18px)] leading-none"
          style={{ color: palette.ink, opacity: 0.7 }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export function PostCover({
  src,
  alt,
  width,
  height,
  priority,
  category,
  className,
  placeholderLabel = "Autocrew Journal",
}: PostCoverProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <PlaceholderCover
        category={category}
        label={placeholderLabel}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("w-full h-full object-cover", className)}
      onError={() => setErrored(true)}
    />
  );
}
