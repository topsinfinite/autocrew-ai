import Link from "next/link";
import { DECK_TEMPLATE_LIST } from "@/lib/deck/templates";

export default function DecksGalleryPage() {
  return (
    <main style={{ padding: 80, maxWidth: 1280, marginInline: "auto" }}>
      <h1 style={{ fontFamily: "var(--deck-display-family)", fontStyle: "var(--deck-display-style)", fontWeight: "var(--deck-display-weight)" as unknown as number, fontSize: 96, lineHeight: 1, letterSpacing: "-0.025em", margin: "0 0 16px" }}>
        Decks.
      </h1>
      <p style={{ color: "var(--deck-text-muted)", fontSize: 18, marginBottom: 64, maxWidth: 720 }}>
        Pick a template, fill in a prospect, download as PDF or PPTX.{" "}
        <span style={{ display: "inline-block", marginLeft: 8, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Drafts live in this browser only — download to keep them.
        </span>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
        {DECK_TEMPLATE_LIST.map((t) => (
          <Link key={t.id} href={`/decks/new/${t.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <article style={{ background: "var(--deck-surface)", border: "1px solid var(--deck-border)", borderRadius: 2, overflow: "hidden", aspectRatio: "16/12", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, background: "#000", backgroundImage: `url(${t.thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: "var(--deck-body-family)", fontSize: 20, color: "var(--deck-text-primary)" }}>{t.name}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--deck-text-muted)" }}>{t.description}</p>
                </div>
                <span style={{ fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-accent)" }}>{t.slides.length} ›</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
