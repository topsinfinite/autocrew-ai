"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ACCENT_LIST, type AccentToken, type DisplayStyle } from "@/lib/deck/tokens";
import { DECK_TEMPLATES, type DeckTemplateId } from "@/lib/deck/templates";
import { newDraftFromTemplate } from "@/lib/deck/draft-factory";
import { saveDraft, loadSalesRepProfile, saveSalesRepProfile } from "@/lib/deck/state";
import { fileToCappedDataUrl } from "@/lib/deck/image";

type Props = { templateId: DeckTemplateId };

export function WizardForm({ templateId }: Props) {
  const tpl = DECK_TEMPLATES[templateId];
  const router = useRouter();

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactName, setContactName] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [logo, setLogo] = useState<string | undefined>();
  const [accent, setAccent] = useState<AccentToken>(tpl.defaultAccent);
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>(tpl.defaultDisplayStyle);
  const [salesRepName, setSalesRepName] = useState("");
  const [salesRepEmail, setSalesRepEmail] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const p = loadSalesRepProfile();
    if (p.name) setSalesRepName(p.name);
    if (p.email) setSalesRepEmail(p.email);
  }, []);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await fileToCappedDataUrl(f);
      setLogo(url);
    } catch {
      setErr("Could not load that image. Try a different file.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErr("Prospect name is required.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      saveSalesRepProfile({ name: salesRepName || undefined, email: salesRepEmail || undefined });
      const draft = await newDraftFromTemplate({
        templateId,
        prospect: {
          name: name.trim() || undefined,
          industry: industry.trim() || undefined,
          contactName: contactName.trim() || undefined,
          dealValue: dealValue.trim() || undefined,
          logoDataUrl: logo,
        },
        salesRep: { name: salesRepName || undefined, email: salesRepEmail || undefined },
        now: new Date(),
        themeOverride: { accent, displayStyle },
      });
      saveDraft(draft);
      router.push(`/decks/preview/${draft.id}`);
    } catch {
      setErr("Could not generate deck. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 720 }}>
      <Field label="Prospect name *" value={name} onChange={setName} required autoFocus />
      <Field label="Prospect industry" value={industry} onChange={setIndustry} />
      <FileField label="Prospect logo (optional, ≤200KB)" preview={logo} onChange={handleLogoChange} />

      <SwatchPicker label="Accent color" value={accent} onChange={setAccent} />
      <DisplayStylePicker value={displayStyle} onChange={setDisplayStyle} />

      <button type="button" onClick={() => setShowMore((v) => !v)} style={discloseBtn}>
        {showMore ? "− Hide personalization" : "+ More personalization (optional)"}
      </button>
      {showMore && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingLeft: 16, borderLeft: "1px solid var(--deck-border)" }}>
          <Field label="Contact name" value={contactName} onChange={setContactName} />
          <Field label="Deal value (free text, e.g. $50,000)" value={dealValue} onChange={setDealValue} />
          <Field label="Your name" value={salesRepName} onChange={setSalesRepName} />
          <Field label="Your email" value={salesRepEmail} onChange={setSalesRepEmail} />
        </div>
      )}

      {err ? <div style={{ color: "var(--deck-accent-red)", fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>{err}</div> : null}

      <div style={{ display: "flex", gap: 12 }}>
        <button type="submit" disabled={busy} style={primaryBtn}>{busy ? "Generating…" : "Generate deck →"}</button>
        <a href="/decks" style={ghostBtn}>Cancel</a>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)", marginBottom: 8 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", background: "var(--deck-surface)", border: "1px solid var(--deck-border)", borderRadius: 2, color: "var(--deck-text-primary)", fontFamily: "var(--deck-body-family)", fontSize: 16, outline: "none" };
const primaryBtn: React.CSSProperties = { padding: "14px 24px", background: "var(--deck-accent)", color: "#000", border: "none", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" };
const ghostBtn: React.CSSProperties = { padding: "14px 24px", background: "transparent", color: "var(--deck-text-muted)", border: "1px solid var(--deck-border)", borderRadius: 2, fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center" };
const discloseBtn: React.CSSProperties = { background: "transparent", border: "none", color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", padding: 0, alignSelf: "flex-start" };

function Field({ label, value, onChange, required, autoFocus }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; autoFocus?: boolean }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} required={required} autoFocus={autoFocus} />
    </div>
  );
}

function FileField({ label, preview, onChange }: { label: string; preview?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" style={{ height: 48, background: "#fff", padding: 4, borderRadius: 2 }} />
        ) : null}
        <input type="file" accept="image/*" onChange={onChange} style={{ color: "var(--deck-text-muted)", fontFamily: "var(--deck-body-family)" }} />
      </div>
    </div>
  );
}

function SwatchPicker({ label, value, onChange }: { label: string; value: AccentToken; onChange: (v: AccentToken) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", gap: 12 }}>
        {ACCENT_LIST.map((a) => (
          <button
            key={a}
            type="button"
            aria-label={a}
            onClick={() => onChange(a)}
            style={{
              width: 40, height: 40, borderRadius: 2,
              background: `var(--deck-accent-${a})`,
              border: value === a ? "2px solid #fff" : "1px solid var(--deck-border)",
              cursor: "pointer", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DisplayStylePicker({ value, onChange }: { value: DisplayStyle; onChange: (v: DisplayStyle) => void }) {
  return (
    <div>
      <label style={labelStyle}>Display style</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StyleCard chosen={value === "serif-italic"} onClick={() => onChange("serif-italic")} previewFamily="var(--font-instrument-serif), serif" italic label="Serif italic" />
        <StyleCard chosen={value === "bold-sans"} onClick={() => onChange("bold-sans")} previewFamily="var(--font-geist-sans), sans-serif" italic={false} label="Bold sans" />
      </div>
    </div>
  );
}
function StyleCard({ chosen, onClick, previewFamily, italic, label }: { chosen: boolean; onClick: () => void; previewFamily: string; italic: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "var(--deck-surface)",
        border: chosen ? "2px solid var(--deck-accent)" : "1px solid var(--deck-border)",
        borderRadius: 2, padding: 24, cursor: "pointer", textAlign: "left",
      }}
    >
      <div style={{ fontFamily: previewFamily, fontStyle: italic ? "italic" : "normal", fontSize: 64, lineHeight: 1, color: "var(--deck-text-primary)", fontWeight: italic ? 400 : 700 }}>Aa</div>
      <div style={{ marginTop: 16, fontFamily: "var(--deck-mono-family)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--deck-text-muted)" }}>{label}</div>
    </button>
  );
}
