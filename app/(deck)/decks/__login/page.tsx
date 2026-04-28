import { Suspense } from "react";
import { LoginForm } from "@/components/deck/builder/LoginForm";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <h1
          style={{
            fontFamily: "var(--deck-display-family)",
            fontStyle: "var(--deck-display-style)",
            fontWeight: "var(--deck-display-weight)",
            fontSize: 64,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 48,
          }}
        >
          AutoCrew Decks.
        </h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
