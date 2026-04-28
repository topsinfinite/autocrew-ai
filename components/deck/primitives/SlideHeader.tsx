import { MonoLabel } from "./MonoLabel";

type Props = {
  number?: string;     // "01"
  label: string;       // "THE PROBLEM"
  /** Optional secondary label after a second separator, e.g. "FIVE SURFACES · ONE WIDGET" */
  secondary?: string;
};

export function SlideHeader({ number, label, secondary }: Props) {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "baseline" }}>
      {number ? <MonoLabel variant="eyebrow" color="muted">{number}</MonoLabel> : null}
      {number ? <span style={{ color: "var(--deck-text-muted)" }}>·</span> : null}
      <MonoLabel variant="eyebrow" color="muted">{label}</MonoLabel>
      {secondary ? <span style={{ color: "var(--deck-text-muted)" }}>·</span> : null}
      {secondary ? <MonoLabel variant="eyebrow" color="muted">{secondary}</MonoLabel> : null}
    </div>
  );
}
