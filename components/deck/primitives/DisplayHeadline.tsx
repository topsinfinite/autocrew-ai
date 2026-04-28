type Size = "xl" | "lg" | "md";

const SIZE_MAP: Record<Size, { fontSize: number; lineHeight: number; letterSpacing: string }> = {
  xl: { fontSize: 144, lineHeight: 0.95, letterSpacing: "-0.03em" },
  lg: { fontSize: 96,  lineHeight: 1.0,  letterSpacing: "-0.025em" },
  md: { fontSize: 64,  lineHeight: 1.05, letterSpacing: "-0.02em" },
};

type Props = {
  size?: Size;
  as?: "h1" | "h2" | "h3" | "div";
  children: React.ReactNode;
};

export function DisplayHeadline({ size = "md", as = "h2", children }: Props) {
  const Tag = as;
  const s = SIZE_MAP[size];
  return (
    <Tag
      style={{
        fontFamily: "var(--deck-display-family)",
        fontStyle: "var(--deck-display-style)",
        fontWeight: "var(--deck-display-weight)" as unknown as number,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        margin: 0,
      }}
    >
      {children}
    </Tag>
  );
}
