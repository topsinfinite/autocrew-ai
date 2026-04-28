"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ padding: 80 }}>
      <h1
        style={{
          fontFamily: "var(--deck-display-family)",
          fontStyle: "var(--deck-display-style)",
          fontWeight: "var(--deck-display-weight)" as unknown as number,
          fontSize: 48,
          color: "#fff",
          margin: 0,
        }}
      >
        Something went wrong.
      </h1>
      <p
        style={{
          marginTop: 16,
          color: "var(--deck-text-muted)",
          fontFamily: "var(--deck-body-family)",
          fontSize: 16,
        }}
      >
        Try again, or head back to <a href="/decks" style={{ color: "var(--deck-accent)" }}>the gallery</a>.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: 24,
          padding: "12px 24px",
          background: "var(--deck-accent)",
          color: "#000",
          border: "none",
          borderRadius: 2,
          fontFamily: "var(--deck-mono-family)",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </main>
  );
}
