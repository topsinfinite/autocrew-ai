type Variant = "eyebrow" | "label";

type Props = {
  variant?: Variant;
  color?: "muted" | "primary" | "accent";
  as?: "span" | "div" | "p";
  children: React.ReactNode;
};

export function MonoLabel({ variant = "label", color = "muted", as = "span", children }: Props) {
  const Tag = as;
  const baseSize = variant === "eyebrow" ? 12 : 11;
  const baseLs = variant === "eyebrow" ? "0.18em" : "0.12em";
  const colorMap = {
    muted: "var(--deck-text-muted)",
    primary: "var(--deck-text-primary)",
    accent: "var(--deck-accent)",
  };
  return (
    <Tag
      style={{
        fontFamily: "var(--deck-mono-family)",
        fontSize: baseSize,
        fontWeight: 400,
        letterSpacing: baseLs,
        textTransform: "uppercase",
        color: colorMap[color],
        lineHeight: variant === "eyebrow" ? 1 : 1.4,
      }}
    >
      {children}
    </Tag>
  );
}
