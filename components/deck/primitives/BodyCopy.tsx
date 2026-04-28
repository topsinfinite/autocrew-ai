type Size = "lg" | "md";
const SIZE_MAP: Record<Size, { fontSize: number; lineHeight: number; letterSpacing: string }> = {
  lg: { fontSize: 22, lineHeight: 1.45, letterSpacing: "-0.005em" },
  md: { fontSize: 16, lineHeight: 1.5,  letterSpacing: "0" },
};

export function BodyCopy({
  size = "lg",
  color = "primary",
  maxWidth,
  children,
}: {
  size?: Size;
  color?: "primary" | "muted";
  maxWidth?: number;
  children: React.ReactNode;
}) {
  const s = SIZE_MAP[size];
  return (
    <p
      style={{
        fontFamily: "var(--deck-body-family)",
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: color === "muted" ? "var(--deck-text-muted)" : "var(--deck-text-primary)",
        margin: 0,
        maxWidth,
      }}
    >
      {children}
    </p>
  );
}
