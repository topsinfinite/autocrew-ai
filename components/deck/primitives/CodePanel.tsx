import { MonoLabel } from "./MonoLabel";

type Props = {
  filename?: string;       // "index.html"
  cornerLabel?: string;    // "01 / 05" or "REQUIRED"
  /** Pre-formatted code as string. Newlines preserved. */
  code: string;
};

export function CodePanel({ filename, cornerLabel, code }: Props) {
  return (
    <div
      style={{
        background: "var(--deck-surface)",
        border: "1px solid var(--deck-border)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid var(--deck-border)",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: 8, background: "#3a3a3a" }} />
          <span style={{ width: 8, height: 8, borderRadius: 8, background: "#3a3a3a" }} />
          <span style={{ width: 8, height: 8, borderRadius: 8, background: "#3a3a3a" }} />
          {filename ? <span style={{ marginLeft: 16 }}><MonoLabel>{filename}</MonoLabel></span> : null}
        </div>
        {cornerLabel ? <MonoLabel color="accent">{cornerLabel}</MonoLabel> : null}
      </div>
      <pre
        style={{
          margin: 0,
          padding: 24,
          fontFamily: "var(--deck-mono-family)",
          fontSize: 16,
          lineHeight: 1.5,
          color: "var(--deck-text-primary)",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        {code}
      </pre>
    </div>
  );
}
