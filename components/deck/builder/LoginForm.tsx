"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/decks";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let nextError: string | null = null;
    try {
      const res = await fetch("/api/decks/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 204) {
        router.push(from);
        return;
      }
      if (res.status === 429) nextError = "Too many attempts — try again in a minute.";
      else if (res.status >= 500) nextError = "Service misconfigured — contact admin.";
      else nextError = "Access denied.";
    } catch {
      nextError = "Network error — try again.";
    } finally {
      setLoading(false);
      if (nextError) {
        setError(nextError);
        // Clear after 3s, but only if still mounted and still showing this error.
        const timer = setTimeout(() => setError((cur) => (cur === nextError ? null : cur)), 3000);
        // Best-effort cleanup: if React unmounts mid-timer, the closure no-ops because setError on
        // unmounted components is a benign warning in React 19 (no longer throws).
        // Note: a stricter cleanup would require wiring this into a useRef + useEffect cleanup.
        void timer;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <label
        htmlFor="deck-password"
        style={{
          display: "block",
          fontFamily: "var(--deck-mono-family)",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--deck-text-muted)",
          marginBottom: 12,
        }}
      >
        {error ?? "ACCESS"}
      </label>
      <input
        id="deck-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        placeholder="Password"
        style={{
          width: "100%",
          padding: "16px 20px",
          background: "var(--deck-surface)",
          border: "1px solid var(--deck-border)",
          borderRadius: 2,
          color: "var(--deck-text-primary)",
          fontFamily: "var(--deck-body-family)",
          fontSize: 18,
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={loading || !password}
        style={{
          marginTop: 16,
          padding: "14px 24px",
          background: "var(--deck-accent)",
          color: "#000",
          border: "none",
          borderRadius: 2,
          fontFamily: "var(--deck-mono-family)",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: loading ? "wait" : "pointer",
          opacity: loading || !password ? 0.6 : 1,
        }}
      >
        {loading ? "Verifying…" : "Enter →"}
      </button>
    </form>
  );
}
