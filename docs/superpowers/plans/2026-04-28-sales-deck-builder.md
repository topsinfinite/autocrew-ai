# Sales Deck Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a password-gated, browser-local deck builder at `/decks` for the AutoCrew sales team — pick a template, fill a wizard, edit slides, download PDF + PPTX.

**Architecture:** Isolated `app/(deck)/` route group with its own layout, design tokens (Instrument Serif / DM Mono / Geist + 6-color accent palette + 2 display styles), 13 slide templates composed from 7 primitives, ephemeral browser-local drafts (localStorage, no DB), client-side exports (`window.print()` for PDF, `PptxGenJS` + `html2canvas` for PPTX). Single shared password via middleware + HMAC cookie.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, `next/font/google` (Instrument Serif, DM Mono), `pptxgenjs`, `html2canvas`, `@dnd-kit/core` + `@dnd-kit/sortable`, Vitest (jsdom).

**Spec:** `docs/superpowers/specs/2026-04-28-sales-deck-builder-design.md`
**Parking-lot:** `docs/superpowers/parking-lot/2026-04-28-workflow-c-live-page-editor.md`, `docs/superpowers/parking-lot/2026-04-28-deck-builder-v2-and-beyond.md`

---

## Phase 0: Branch + dependencies

### Task 0.1: Create feature branch

**Files:** none — git only.

- [ ] **Step 1: Verify clean working tree**

Run: `git status`
Expected: `nothing to commit, working tree clean` (or commit/stash any in-progress work first).

- [ ] **Step 2: Create and switch to branch**

Run: `git checkout -b feat/sales-deck-builder main`
Expected: `Switched to a new branch 'feat/sales-deck-builder'`

### Task 0.2: Install dependencies

**Files:** `package.json` (modify), `package-lock.json` (auto).

- [ ] **Step 1: Install runtime deps**

Run: `npm install pptxgenjs html2canvas @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
Expected: 5 packages added, no errors.

- [ ] **Step 2: Install dev types**

Run: `npm install -D @types/html2canvas`
Expected: dev dep added (or `up to date` if html2canvas ships its own types — that's fine, skip).

- [ ] **Step 3: Verify build still works**

Run: `npm run typecheck && npm run lint`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(deck): add pptxgenjs, html2canvas, dnd-kit deps"
```

---

## Phase 1: Foundation — route group, isolation, fonts, auth

### Task 1.1: Create `(deck)` route group with isolated layout

**Files:**
- Create: `app/(deck)/layout.tsx`
- Create: `app/(deck)/decks.css`
- Create: `app/(deck)/page.tsx` (placeholder gallery, replaced in Phase 10)

- [ ] **Step 1: Create `app/(deck)/decks.css`**

```css
/* Deck design tokens — scoped to [data-surface="deck"] so they never leak into the marketing site. */
[data-surface="deck"] {
  --deck-bg: #0A0A0A;
  --deck-surface: #0F0F0F;
  --deck-border: #1F1F1F;
  --deck-text-primary: #FFFFFF;
  --deck-text-muted: #7A7A7A;

  --deck-accent-green: #5EBD3E;
  --deck-accent-yellow: #FFB900;
  --deck-accent-orange: #F78200;
  --deck-accent-red: #E23838;
  --deck-accent-purple: #973999;
  --deck-accent-blue: #009CDF;

  /* Active accent — set by DeckThemeContext via inline style. Default fallback to green. */
  --deck-accent: var(--deck-accent-green);

  /* Display family pair — switched by DeckThemeContext via inline style. */
  --deck-display-family: var(--font-instrument-serif), Georgia, serif;
  --deck-display-style: italic;
  --deck-display-weight: 400;

  --deck-body-family: var(--font-geist-sans), -apple-system, sans-serif;
  --deck-mono-family: var(--font-dm-mono), "SF Mono", Menlo, monospace;

  background: var(--deck-bg);
  color: var(--deck-text-primary);
  font-family: var(--deck-body-family);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* Print stylesheet for /decks/render/[id]. Each slide becomes a 1920×1080 page. */
@page {
  size: 1920px 1080px;
  margin: 0;
}
@media print {
  html, body {
    width: 1920px;
    height: 1080px;
    background: #0A0A0A;
    margin: 0;
    padding: 0;
  }
  [data-deck-slide] {
    width: 1920px;
    height: 1080px;
    page-break-after: always;
    break-after: page;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  [data-deck-slide]:last-child {
    page-break-after: auto;
    break-after: auto;
  }
}
```

- [ ] **Step 2: Create `app/(deck)/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Instrument_Serif, DM_Mono } from "next/font/google";
import "./decks.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoCrew Decks",
  robots: { index: false, follow: false },
};

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-surface="deck"
      className={`${instrumentSerif.variable} ${dmMono.variable}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create placeholder `app/(deck)/page.tsx`**

```tsx
export default function DecksGalleryPage() {
  return (
    <main style={{ padding: "80px" }}>
      <h1 style={{ fontFamily: "var(--deck-display-family)", fontStyle: "italic", fontSize: 64 }}>
        Decks
      </h1>
      <p style={{ color: "var(--deck-text-muted)", marginTop: 16 }}>
        Gallery coming in Phase 10.
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Verify build + visual smoke test**

Run: `npm run dev`
In browser, visit `http://localhost:3000/decks`.
Expected: black background, white serif-italic "Decks" headline, muted subtext. No `PublicNav`, no `PublicFooter`, no `BackgroundEffects`. Confirms layout isolation works.

- [ ] **Step 5: Commit**

```bash
git add app/\(deck\)/
git commit -m "feat(deck): add isolated (deck) route group with layout + design tokens"
```

### Task 1.2: Override `X-Frame-Options` for the render route (allow same-origin iframe)

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Read current `next.config.ts`**

Already known: globally sets `X-Frame-Options: DENY` for `/(.*)`. We need `SAMEORIGIN` on `/decks/render/*` so the editor can mount it in a hidden iframe.

- [ ] **Step 2: Edit `next.config.ts` headers** to add a more-specific override BEFORE the global rule

Replace the `headers` array with:

```ts
headers: async () => [
  {
    // Render route must allow same-origin framing for the editor's hidden iframe (PDF/PPTX export).
    source: "/decks/render/:path*",
    headers: [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ],
  },
  {
    source: "/(.*)",
    headers: [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
    ],
  },
],
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, then `curl -I http://localhost:3000/decks/render/test`
Expected: `x-frame-options: SAMEORIGIN` header present (route returns 404 for now since render route doesn't exist; the header still applies via the headers config).

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat(deck): allow same-origin framing for /decks/render/*"
```

### Task 1.3: Password middleware — gate `/decks/*` and `/api/decks/*`

**Files:**
- Create: `middleware.ts` (project root)
- Create: `lib/deck/auth.ts`
- Create: `__tests__/deck/auth.test.ts`

- [ ] **Step 1: Write failing test for HMAC cookie helpers**

Create `__tests__/deck/auth.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { signAuthToken, verifyAuthToken } from "@/lib/deck/auth";

describe("deck auth tokens", () => {
  const secret = "0123456789abcdef0123456789abcdef";

  it("signs a token that verifies with the same secret", async () => {
    const token = await signAuthToken("v1:1700000000000", secret);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
    const ok = await verifyAuthToken(token, secret);
    expect(ok).toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signAuthToken("v1:1700000000000", secret);
    const ok = await verifyAuthToken(token, "different-secret-also-32-chars-x");
    expect(ok).toBe(false);
  });

  it("rejects garbage input", async () => {
    expect(await verifyAuthToken("not-a-token", secret)).toBe(false);
    expect(await verifyAuthToken("", secret)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

Run: `npx vitest run __tests__/deck/auth.test.ts`
Expected: FAIL — module `@/lib/deck/auth` not found.

- [ ] **Step 3: Implement `lib/deck/auth.ts` using Web Crypto (works in Edge runtime + Node)**

```ts
// lib/deck/auth.ts
// Uses Web Crypto so the same code runs in middleware (Edge) and route handlers (Node).

const enc = new TextEncoder();

async function hmacSha256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(sig).toString("base64url");
}

/** Returns the cookie value. Format: "<payload>.<sig>" */
export async function signAuthToken(payload: string, secret: string): Promise<string> {
  const sig = await hmacSha256(payload, secret);
  return `${payload}.${sig}`;
}

/** Verifies the cookie value. Returns true iff payload was signed with the same secret. */
export async function verifyAuthToken(token: string, secret: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === token.length - 1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = await hmacSha256(payload, secret);
  // Constant-time-ish: compare equal-length strings; bail early on mismatch is acceptable here
  // because the secret never differs per-request.
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
```

- [ ] **Step 4: Run test — verify it passes**

Run: `npx vitest run __tests__/deck/auth.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Create `middleware.ts` at repo root**

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/deck/auth";

export const config = {
  matcher: ["/decks/:path*", "/api/decks/:path*"],
};

const COOKIE_NAME = "decks_auth";

const PUBLIC_PATHS = new Set<string>([
  "/decks/__login",
  "/api/decks/auth",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.DECKS_AUTH_SECRET;
  if (!secret) {
    // Misconfiguration — fail closed.
    return new NextResponse("DECKS_AUTH_SECRET not configured", { status: 500 });
  }

  const token = req.cookies.get(COOKIE_NAME)?.value ?? "";
  const ok = await verifyAuthToken(token, secret);

  if (!ok) {
    if (pathname.startsWith("/api/decks/")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/decks/__login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
```

- [ ] **Step 6: Verify the build still compiles**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/deck/auth.ts __tests__/deck/auth.test.ts middleware.ts
git commit -m "feat(deck): add HMAC auth + middleware gating /decks/* and /api/decks/*"
```

### Task 1.4: `/api/decks/auth` route + login page

**Files:**
- Create: `app/api/decks/auth/route.ts`
- Create: `app/(deck)/__login/page.tsx`
- Create: `components/deck/builder/LoginForm.tsx`

- [ ] **Step 1: Create `app/api/decks/auth/route.ts`**

```ts
// app/api/decks/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signAuthToken } from "@/lib/deck/auth";

export const runtime = "nodejs";

// In-process rate-limit (5 attempts / minute / IP). Reset by Vercel cold start; acceptable for v1.
const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRate(ip: string): boolean {
  const now = Date.now();
  const cur = attempts.get(ip);
  if (!cur || now - cur.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
    return true;
  }
  cur.count++;
  return cur.count <= MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!checkRate(ip)) {
    return new NextResponse("Too many attempts", { status: 429 });
  }

  const expected = process.env.DECKS_PASSWORD;
  const secret = process.env.DECKS_AUTH_SECRET;
  if (!expected || !secret) {
    return new NextResponse("DECKS_PASSWORD or DECKS_AUTH_SECRET not configured", { status: 500 });
  }

  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (typeof body.password !== "string" || body.password !== expected) {
    return new NextResponse("Invalid password", { status: 401 });
  }

  const payload = `v1:${Date.now()}`;
  const token = await signAuthToken(payload, secret);

  const res = new NextResponse(null, { status: 204 });
  res.cookies.set("decks_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
```

- [ ] **Step 2: Create `components/deck/builder/LoginForm.tsx`**

```tsx
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
      if (res.status === 429) {
        setError("Too many attempts — try again in a minute.");
      } else {
        setError("Access denied.");
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setError(null), 3000);
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
```

- [ ] **Step 3: Create `app/(deck)/__login/page.tsx`**

```tsx
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
```

- [ ] **Step 4: Local env setup**

Add to `.env.local` (NOT committed):
```
DECKS_PASSWORD=changeme-locally
DECKS_AUTH_SECRET=0123456789abcdef0123456789abcdef0123456789abcdef
```

Document the same vars in `.env.example` (commit this):

```
# Deck builder (sales-only access)
DECKS_PASSWORD=
DECKS_AUTH_SECRET=
```

- [ ] **Step 5: Manual verify**

Run: `npm run dev`
1. Visit `http://localhost:3000/decks` → should redirect to `/decks/__login?from=/decks`.
2. Wrong password → "Access denied" eyebrow appears.
3. Correct password → redirects to `/decks` and shows the placeholder gallery.
4. Reload `/decks` → no redirect (cookie persists).
5. `curl -I http://localhost:3000/api/decks/something` → 401.

- [ ] **Step 6: Commit**

```bash
git add app/api/decks/ app/\(deck\)/__login/ components/deck/builder/LoginForm.tsx .env.example
git commit -m "feat(deck): add password gate (/decks/__login + /api/decks/auth)"
```

---

## Phase 2: Primitives + dev QA page

### Task 2.1: Design tokens module

**Files:**
- Create: `lib/deck/tokens.ts`

- [ ] **Step 1: Create `lib/deck/tokens.ts`**

```ts
// lib/deck/tokens.ts
// Single source of truth for design constants. Used by React components AND PptxGenJS exporter.

export const ACCENT_TOKENS = {
  green:  { hex: "#5EBD3E", cssVar: "--deck-accent-green" },
  yellow: { hex: "#FFB900", cssVar: "--deck-accent-yellow" },
  orange: { hex: "#F78200", cssVar: "--deck-accent-orange" },
  red:    { hex: "#E23838", cssVar: "--deck-accent-red" },
  purple: { hex: "#973999", cssVar: "--deck-accent-purple" },
  blue:   { hex: "#009CDF", cssVar: "--deck-accent-blue" },
} as const;

export type AccentToken = keyof typeof ACCENT_TOKENS;
export const ACCENT_LIST: AccentToken[] = ["green", "yellow", "orange", "red", "purple", "blue"];

export const DISPLAY_STYLES = {
  "serif-italic": { family: "var(--font-instrument-serif), Georgia, serif", style: "italic", weight: 400 },
  "bold-sans":    { family: "var(--font-geist-sans), -apple-system, sans-serif", style: "normal", weight: 700 },
} as const;

export type DisplayStyle = keyof typeof DISPLAY_STYLES;

export const DECK_BG = "#0A0A0A";
export const DECK_SURFACE = "#0F0F0F";
export const DECK_BORDER = "#1F1F1F";
export const DECK_TEXT_PRIMARY = "#FFFFFF";
export const DECK_TEXT_MUTED = "#7A7A7A";

// Slide frame
export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
export const SLIDE_OUTER_MARGIN = 80;
export const SLIDE_HEADLINE_TOP = 200;
export const SLIDE_CONTENT_WIDTH = SLIDE_WIDTH - SLIDE_OUTER_MARGIN * 2;
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/deck/tokens.ts
git commit -m "feat(deck): add design tokens module (lib/deck/tokens.ts)"
```

### Task 2.2: `DeckThemeContext` — accent + display style provider

**Files:**
- Create: `components/deck/builder/DeckThemeContext.tsx`

- [ ] **Step 1: Create `components/deck/builder/DeckThemeContext.tsx`**

```tsx
"use client";
import { createContext, useContext, useMemo } from "react";
import { ACCENT_TOKENS, DISPLAY_STYLES, type AccentToken, type DisplayStyle } from "@/lib/deck/tokens";

type DeckTheme = {
  accent: AccentToken;
  displayStyle: DisplayStyle;
};

const DeckThemeContext = createContext<DeckTheme>({ accent: "green", displayStyle: "serif-italic" });

export function DeckThemeProvider({
  accent,
  displayStyle,
  children,
}: DeckTheme & { children: React.ReactNode }) {
  const value = useMemo(() => ({ accent, displayStyle }), [accent, displayStyle]);
  const accentHex = ACCENT_TOKENS[accent].hex;
  const display = DISPLAY_STYLES[displayStyle];

  return (
    <DeckThemeContext.Provider value={value}>
      <div
        style={
          {
            "--deck-accent": accentHex,
            "--deck-display-family": display.family,
            "--deck-display-style": display.style,
            "--deck-display-weight": display.weight,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </DeckThemeContext.Provider>
  );
}

export function useDeckTheme(): DeckTheme {
  return useContext(DeckThemeContext);
}
```

- [ ] **Step 2: Commit**

```bash
git add components/deck/builder/DeckThemeContext.tsx
git commit -m "feat(deck): add DeckThemeContext (accent + display style cascading via CSS vars)"
```

### Task 2.3: `SlideFrame` primitive

**Files:**
- Create: `components/deck/primitives/SlideFrame.tsx`

- [ ] **Step 1: Create `components/deck/primitives/SlideFrame.tsx`**

```tsx
import { SLIDE_WIDTH, SLIDE_HEIGHT, SLIDE_OUTER_MARGIN } from "@/lib/deck/tokens";

type Props = {
  /** Footer node, rendered bottom-aligned with hairline rule above. Optional. */
  footer?: React.ReactNode;
  /** Header node, rendered top-aligned. Optional (some slides like Cover/ClosingCTA omit). */
  header?: React.ReactNode;
  /** Override default outer padding (e.g. ClosingCTA centered layout). */
  noPadding?: boolean;
  children: React.ReactNode;
};

export function SlideFrame({ footer, header, noPadding, children }: Props) {
  return (
    <section
      data-deck-slide
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        background: "var(--deck-bg)",
        color: "var(--deck-text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: noPadding ? 0 : SLIDE_OUTER_MARGIN,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {header ? <header style={{ flexShrink: 0 }}>{header}</header> : null}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      {footer ? (
        <footer
          style={{
            flexShrink: 0,
            paddingTop: 24,
            borderTop: "1px solid var(--deck-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/deck/primitives/SlideFrame.tsx
git commit -m "feat(deck): add SlideFrame primitive (1920x1080, optional header/footer)"
```

### Task 2.4: `MonoLabel` primitive (eyebrow / labels / footer chips)

**Files:**
- Create: `components/deck/primitives/MonoLabel.tsx`

- [ ] **Step 1: Create file**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/deck/primitives/MonoLabel.tsx
git commit -m "feat(deck): add MonoLabel primitive (eyebrow + label variants)"
```

### Task 2.5: `SlideHeader` primitive (`01 · THE PROBLEM`)

**Files:**
- Create: `components/deck/primitives/SlideHeader.tsx`

- [ ] **Step 1: Create file**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/deck/primitives/SlideHeader.tsx
git commit -m "feat(deck): add SlideHeader primitive (numbered eyebrow row)"
```

### Task 2.6: `DisplayHeadline` + `Accent` primitives

**Files:**
- Create: `components/deck/primitives/DisplayHeadline.tsx`
- Create: `components/deck/primitives/Accent.tsx`

- [ ] **Step 1: Create `Accent.tsx`**

```tsx
export function Accent({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--deck-accent)" }}>{children}</span>;
}
```

- [ ] **Step 2: Create `DisplayHeadline.tsx`**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/deck/primitives/DisplayHeadline.tsx components/deck/primitives/Accent.tsx
git commit -m "feat(deck): add DisplayHeadline + Accent primitives"
```

### Task 2.7: `BodyCopy` + `CodePanel` primitives

**Files:**
- Create: `components/deck/primitives/BodyCopy.tsx`
- Create: `components/deck/primitives/CodePanel.tsx`

- [ ] **Step 1: Create `BodyCopy.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `CodePanel.tsx`**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/deck/primitives/BodyCopy.tsx components/deck/primitives/CodePanel.tsx
git commit -m "feat(deck): add BodyCopy + CodePanel primitives"
```

### Task 2.8: Dev QA page `/decks/__primitives`

**Files:**
- Create: `app/(deck)/__primitives/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { DeckThemeProvider } from "@/components/deck/builder/DeckThemeContext";
import { SlideFrame } from "@/components/deck/primitives/SlideFrame";
import { SlideHeader } from "@/components/deck/primitives/SlideHeader";
import { DisplayHeadline } from "@/components/deck/primitives/DisplayHeadline";
import { Accent } from "@/components/deck/primitives/Accent";
import { BodyCopy } from "@/components/deck/primitives/BodyCopy";
import { MonoLabel } from "@/components/deck/primitives/MonoLabel";
import { CodePanel } from "@/components/deck/primitives/CodePanel";
import { ACCENT_LIST, type AccentToken, type DisplayStyle } from "@/lib/deck/tokens";

const STYLES: DisplayStyle[] = ["serif-italic", "bold-sans"];

export default function PrimitivesQAPage() {
  return (
    <main style={{ padding: 40, display: "flex", flexDirection: "column", gap: 80 }}>
      <h1 style={{ color: "#fff", fontFamily: "system-ui", fontSize: 24 }}>
        Primitives QA — every accent × every display style
      </h1>

      {STYLES.map((displayStyle) =>
        ACCENT_LIST.map((accent: AccentToken) => (
          <div key={`${displayStyle}-${accent}`} style={{ transform: "scale(0.5)", transformOrigin: "top left" }}>
            <p style={{ color: "#888", marginBottom: 8, fontFamily: "system-ui" }}>
              {displayStyle} · {accent}
            </p>
            <DeckThemeProvider accent={accent} displayStyle={displayStyle}>
              <SlideFrame
                header={<SlideHeader number="01" label="THE PROBLEM" />}
                footer={
                  <>
                    <MonoLabel>autocrew · prepared for acme corp</MonoLabel>
                    <MonoLabel>02 / 15</MonoLabel>
                  </>
                }
              >
                <div style={{ marginTop: 200 - 80 - 24 - 12 }}>
                  <DisplayHeadline size="md">
                    Static forms send visitors into a <Accent>queue</Accent>. Conversations don&apos;t.
                  </DisplayHeadline>
                  <div style={{ marginTop: 48, maxWidth: 900 }}>
                    <BodyCopy size="lg" color="muted">
                      Every &ldquo;Contact us&rdquo; button is a form. Every form is a wait.
                      The widget flips that model: visitors talk to your AI agent immediately.
                    </BodyCopy>
                  </div>
                  <div style={{ marginTop: 64, maxWidth: 900 }}>
                    <CodePanel
                      filename="example.html"
                      cornerLabel="01 / 05"
                      code={`<button data-autocrew-question="What are your hours?">\n  See our hours\n</button>`}
                    />
                  </div>
                </div>
              </SlideFrame>
            </DeckThemeProvider>
          </div>
        ))
      )}
    </main>
  );
}
```

- [ ] **Step 2: Visual smoke test**

Run: `npm run dev`. Visit `http://localhost:3000/decks/__primitives` (log in first).
Expected: 12 scaled-down slides (2 styles × 6 accents). Eyebrow + display headline + accent word + body copy + code panel render correctly. Display family changes between rows. Accent color changes.

- [ ] **Step 3: Commit**

```bash
git add app/\(deck\)/__primitives/
git commit -m "feat(deck): add /decks/__primitives dev QA page (all accents × styles)"
```

---

## Phase 3: Slide kit — content types + 13 slide templates

### Task 3.1: Concrete `SlideContent` types per template

**Files:**
- Create: `lib/deck/slide-content-types.ts`

- [ ] **Step 1: Create the file with all 13 content shapes**

```ts
// lib/deck/slide-content-types.ts
// Concrete content shapes per slide template. Discriminated by `template` field on SlideInstance.

export type CoverContent = {
  /** Mono eyebrow at top, e.g. "V1.1 · LIVE" */
  eyebrow?: string;
  /** Headline split into runs; runs with `accent: true` render in the deck accent color. */
  headlineParts: Array<{ text: string; accent?: boolean }>;
  sub?: string;
  /** Footer left chip (e.g. site URL). Right chip is auto: "<deck>.<slide-num>". */
  footerLeft?: string;
};

export type ProblemContent = {
  number: string;       // "01"
  label: string;        // "THE PROBLEM"
  headlineParts: Array<{ text: string; accent?: boolean }>;
  body: string;
  /** Optional bottom comparison strip with hairline divider. */
  comparison?: { leftLabel: string; leftValues: string[]; rightLabel: string; rightValues: string[] };
};

export type SolutionContent = {
  number: string;
  label: string;
  headlineParts: Array<{ text: string; accent?: boolean }>;
  body: string;
  /** Horizontal dot-bullet items rendered along the bottom. */
  bullets: string[];
};

export type FiveCardGridContent = {
  number: string;
  label: string;
  secondary?: string;   // optional secondary eyebrow segment
  headline: string;
  sub: string;
  cards: Array<{ number: string; title: string; body: string }>;  // exactly 5
};

export type DetailWithCodeContent = {
  number: string;       // "01"
  label: string;        // "DECLARATIVE"
  headline: string;
  body: string;
  bestForLabel?: string; // default "BEST FOR"
  bestFor: string[];     // bullet items
  code: { filename?: string; cornerLabel?: string; code: string };
};

export type SixCardGridContent = {
  number: string;
  label: string;
  headline: string;
  cards: Array<{ cornerLabel: string; title: string; body: string }>;  // exactly 6, 2x3
};

export type NumberedPointsContent = {
  number: string;
  label: string;
  headline: string;
  /** Exactly 6 numbered points; renders as 2 columns × 3 rows with hairline rules. */
  points: Array<{ number: string; title: string; body: string }>;
};

export type HeadlineWithScreenshotContent = {
  number: string;
  label: string;
  headlineParts: Array<{ text: string; accent?: boolean }>;
  body: string;
  bullets: string[];
  /** Right-side card. Either an image src or a structured key-value preview. */
  screenshot:
    | { kind: "image"; src: string; alt?: string }
    | { kind: "kv"; title: string; rightLabel?: string; rows: Array<{ label: string; value: string }> };
};

export type HeadlineWithCodeContent = {
  number: string;
  label: string;
  /** Headline rendered as stacked lines; each can be accented. */
  headlineLines: Array<{ text: string; accent?: boolean }>;
  code: { filename?: string; cornerLabel?: string; code: string };
  /** Mono caption rendered below the code panel. */
  footerCaption?: string;
};

export type ComparisonTableContent = {
  number: string;
  label: string;
  headlineParts: Array<{ text: string; accent?: boolean }>;
  /** First col is the capability column. Last col is the highlighted "us" column. */
  columns: string[];          // e.g. ["CAPABILITY", "STATIC FORM", "GENERIC CHATBOT", "CUSTOM AI BUILD", "AUTOCREW"]
  rows: Array<string[]>;      // each row length === columns.length; final column highlighted
};

export type ClosingCTAContent = {
  /** Optional logo wordmark at top centre. */
  logo?: { src: string; alt?: string };
  headlineParts: Array<{ text: string; accent?: boolean }>;
  sub: string;
  primaryCta: { label: string; href?: string };
  secondaryCta?: { label: string; href?: string };
};

export type BigStatContent = {
  number?: string;
  label: string;
  /** The big number, e.g. "30s" or "94%". */
  stat: string;
  /** Short label under the stat, e.g. "AVERAGE TIME-TO-CONVERSATION". */
  statLabel: string;
  /** Sub-context paragraph below. */
  context: string;
};

export type QuoteContent = {
  number?: string;
  label: string;            // e.g. "TESTIMONIAL"
  /** The pull-quote. Rendered in display-italic. */
  quote: string;
  attribution: { name: string; title?: string; org?: string };
};

/** Discriminated union — used by the rest of the codebase. */
export type SlideContent =
  | { template: "Cover";                  content: CoverContent }
  | { template: "Problem";                content: ProblemContent }
  | { template: "Solution";               content: SolutionContent }
  | { template: "FiveCardGrid";           content: FiveCardGridContent }
  | { template: "DetailWithCode";         content: DetailWithCodeContent }
  | { template: "SixCardGrid";            content: SixCardGridContent }
  | { template: "NumberedPoints";         content: NumberedPointsContent }
  | { template: "HeadlineWithScreenshot"; content: HeadlineWithScreenshotContent }
  | { template: "HeadlineWithCode";       content: HeadlineWithCodeContent }
  | { template: "ComparisonTable";        content: ComparisonTableContent }
  | { template: "ClosingCTA";             content: ClosingCTAContent }
  | { template: "BigStat";                content: BigStatContent }
  | { template: "Quote";                  content: QuoteContent };

export type SlideTemplateId = SlideContent["template"];
export const SLIDE_TEMPLATE_IDS: SlideTemplateId[] = [
  "Cover", "Problem", "Solution", "FiveCardGrid",
  "DetailWithCode", "SixCardGrid", "NumberedPoints",
  "HeadlineWithScreenshot", "HeadlineWithCode", "ComparisonTable",
  "ClosingCTA", "BigStat", "Quote",
];
```

- [ ] **Step 2: Verify types**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/deck/slide-content-types.ts
git commit -m "feat(deck): add concrete SlideContent discriminated union (13 templates)"
```

### Task 3.2: `Cover` slide

**Files:**
- Create: `components/deck/slides/Cover.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { CoverContent } from "@/lib/deck/slide-content-types";

type Props = {
  content: CoverContent;
  /** Slide-position label shown right side, e.g. "01 / 15". */
  positionLabel?: string;
  /** Logo node (e.g. <img>) shown top-left. Optional. */
  logo?: React.ReactNode;
};

export function Cover({ content, positionLabel, logo }: Props) {
  return (
    <SlideFrame
      header={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 24, borderBottom: "1px solid var(--deck-border)" }}>
          <div>{logo ?? <MonoLabel color="primary">autocrew</MonoLabel>}</div>
          {content.eyebrow ? <MonoLabel>{content.eyebrow}</MonoLabel> : null}
        </div>
      }
      footer={
        <>
          {content.footerLeft ? <MonoLabel>{content.footerLeft}</MonoLabel> : <span />}
          {positionLabel ? <MonoLabel>{positionLabel}</MonoLabel> : null}
        </>
      }
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <DisplayHeadline size="xl" as="h1">
          {content.headlineParts.map((part, i) =>
            part.accent
              ? <Accent key={i}>{part.text}</Accent>
              : <span key={i}>{part.text}</span>
          )}
        </DisplayHeadline>
        {content.sub ? (
          <div style={{ marginTop: 48 }}>
            <BodyCopy size="lg" color="muted" maxWidth={900}>{content.sub}</BodyCopy>
          </div>
        ) : null}
      </div>
    </SlideFrame>
  );
}
```

- [ ] **Step 2: Add `Cover` to the `__primitives` page** to verify it renders. Append below existing tests:

In `app/(deck)/__primitives/page.tsx`, add an import and a sample render:

```tsx
import { Cover } from "@/components/deck/slides/Cover";
// ... at bottom of return, inside one of the DeckThemeProvider blocks for variety:
<Cover
  positionLabel="01 / 15"
  content={{
    eyebrow: "V1.1 · LIVE",
    headlineParts: [
      { text: "Turn every button into a " },
      { text: "live conversation.", accent: true },
    ],
    sub: "A trigger system for AI agents — five surfaces, zero forms, on any site.",
    footerLeft: "autocrew-ai.com / widget",
  }}
/>
```

- [ ] **Step 3: Visually verify**

Run dev, refresh `/decks/__primitives`. Confirm Cover slide matches the design language (large display headline with accented portion, footer chips, header rule).

- [ ] **Step 4: Commit**

```bash
git add components/deck/slides/Cover.tsx app/\(deck\)/__primitives/
git commit -m "feat(deck): add Cover slide"
```

### Task 3.3: `Problem` slide

**Files:**
- Create: `components/deck/slides/Problem.tsx`

- [ ] **Step 1: Create**

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { ProblemContent } from "@/lib/deck/slide-content-types";

type Props = { content: ProblemContent; positionLabel?: string };

export function Problem({ content, positionLabel }: Props) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">
          {content.headlineParts.map((p, i) =>
            p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
          )}
        </DisplayHeadline>
        <div style={{ marginTop: 48, maxWidth: 1100 }}>
          <BodyCopy size="lg" color="muted">{content.body}</BodyCopy>
        </div>
        {content.comparison ? (
          <div style={{ marginTop: 80, borderTop: "1px solid var(--deck-border)", paddingTop: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, alignItems: "baseline" }}>
              <MonoLabel>{content.comparison.leftLabel}</MonoLabel>
              <div style={{ display: "flex", gap: 32, color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 13 }}>
                {content.comparison.leftValues.map((v, i) => (
                  <span key={i}>{v}{i < content.comparison!.leftValues.length - 1 ? "  ·" : ""}</span>
                ))}
              </div>
              <MonoLabel color="accent">{content.comparison.rightLabel}</MonoLabel>
              <div style={{ display: "flex", gap: 32, color: "var(--deck-text-primary)", fontFamily: "var(--deck-mono-family)", fontSize: 13 }}>
                {content.comparison.rightValues.map((v, i) => (
                  <span key={i}>{v}{i < content.comparison!.rightValues.length - 1 ? "  ·" : ""}</span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </SlideFrame>
  );
}
```

- [ ] **Step 2: Add to `__primitives` page**, render with sample content from the existing pitch (page 2): headline "Static forms send visitors into a queue. Conversations don't.", comparison FORM vs WIDGET.

- [ ] **Step 3: Visually verify, commit**

```bash
git add components/deck/slides/Problem.tsx app/\(deck\)/__primitives/
git commit -m "feat(deck): add Problem slide (with comparison strip)"
```

### Task 3.4: `Solution` slide

**Files:**
- Create: `components/deck/slides/Solution.tsx`

- [ ] **Step 1: Create**

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { SolutionContent } from "@/lib/deck/slide-content-types";

export function Solution({ content, positionLabel }: { content: SolutionContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12, height: "100%", display: "flex", flexDirection: "column" }}>
        <DisplayHeadline size="md">
          {content.headlineParts.map((p, i) =>
            p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
          )}
        </DisplayHeadline>
        <div style={{ marginTop: 48, maxWidth: 1100 }}>
          <BodyCopy size="lg" color="muted">{content.body}</BodyCopy>
        </div>
        <div style={{ marginTop: "auto", display: "flex", gap: 96, alignItems: "center", paddingBottom: 64 }}>
          {content.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <span style={{ width: 12, height: 12, borderRadius: 12, background: "var(--deck-accent)" }} />
              <MonoLabel>{b}</MonoLabel>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
```

- [ ] **Step 2: Verify visually + commit**

```bash
git add components/deck/slides/Solution.tsx app/\(deck\)/__primitives/
git commit -m "feat(deck): add Solution slide (horizontal dot-bullets)"
```

### Task 3.5: `FiveCardGrid` slide

**Files:**
- Create: `components/deck/slides/FiveCardGrid.tsx`

- [ ] **Step 1: Create**

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import type { FiveCardGridContent } from "@/lib/deck/slide-content-types";

export function FiveCardGrid({ content, positionLabel }: { content: FiveCardGridContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} secondary={content.secondary} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12, height: "100%", display: "flex", flexDirection: "column" }}>
        <DisplayHeadline size="md">{content.headline}</DisplayHeadline>
        <div style={{ marginTop: 24 }}>
          <BodyCopy size="lg" color="muted" maxWidth={1100}>{content.sub}</BodyCopy>
        </div>
        <div style={{ marginTop: "auto", paddingBottom: 32, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24 }}>
          {content.cards.map((c, i) => (
            <div
              key={i}
              style={{
                background: "var(--deck-surface)",
                border: "1px solid var(--deck-border)",
                borderRadius: 2,
                padding: 32,
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <MonoLabel color="accent">{c.number}</MonoLabel>
                <span style={{ width: 8, height: 8, borderRadius: 8, background: "var(--deck-accent)" }} />
              </div>
              <div style={{ marginTop: "auto" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--deck-body-family)", fontSize: 24, fontWeight: 600, color: "var(--deck-text-primary)" }}>{c.title}</h3>
                <p style={{ margin: "8px 0 0", fontFamily: "var(--deck-body-family)", fontSize: 16, lineHeight: 1.5, color: "var(--deck-text-muted)" }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
```

- [ ] **Step 2: Verify visually + commit**

```bash
git add components/deck/slides/FiveCardGrid.tsx app/\(deck\)/__primitives/
git commit -m "feat(deck): add FiveCardGrid slide"
```

### Task 3.6: `DetailWithCode` slide

**Files:**
- Create: `components/deck/slides/DetailWithCode.tsx`

- [ ] **Step 1: Create**

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { CodePanel } from "../primitives/CodePanel";
import type { DetailWithCodeContent } from "@/lib/deck/slide-content-types";

export function DetailWithCode({ content, positionLabel }: { content: DetailWithCodeContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
        <div>
          <DisplayHeadline size="md">{content.headline}</DisplayHeadline>
          <div style={{ marginTop: 32 }}>
            <BodyCopy size="lg" color="muted">{content.body}</BodyCopy>
          </div>
          <div style={{ marginTop: 64 }}>
            <MonoLabel>{content.bestForLabel ?? "BEST FOR"}</MonoLabel>
            <ul style={{ marginTop: 16, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.bestFor.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "baseline", color: "var(--deck-text-primary)", fontFamily: "var(--deck-body-family)", fontSize: 16, lineHeight: 1.5 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 4, background: "var(--deck-accent)", flexShrink: 0, transform: "translateY(-3px)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <CodePanel filename={content.code.filename} cornerLabel={content.code.cornerLabel} code={content.code.code} />
        </div>
      </div>
    </SlideFrame>
  );
}
```

- [ ] **Step 2: Verify, commit**

```bash
git add components/deck/slides/DetailWithCode.tsx
git commit -m "feat(deck): add DetailWithCode slide"
```

### Task 3.7: `SixCardGrid`, `NumberedPoints`, `HeadlineWithScreenshot`, `HeadlineWithCode`

These four slides follow patterns established above. Each task: create file, add to QA page, visually verify, commit.

#### 3.7a — `SixCardGrid`

**Files:** `components/deck/slides/SixCardGrid.tsx`

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { MonoLabel } from "../primitives/MonoLabel";
import type { SixCardGridContent } from "@/lib/deck/slide-content-types";

export function SixCardGrid({ content, positionLabel }: { content: SixCardGridContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">{content.headline}</DisplayHeadline>
        <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {content.cards.map((c, i) => (
            <div key={i} style={{ background: "var(--deck-surface)", border: "1px solid var(--deck-border)", borderRadius: 2, padding: 32, minHeight: 200, display: "flex", flexDirection: "column" }}>
              <div style={{ alignSelf: "flex-end", marginBottom: 16 }}>
                <MonoLabel color="accent">{c.cornerLabel}</MonoLabel>
              </div>
              <h3 style={{ margin: 0, fontFamily: "var(--deck-body-family)", fontSize: 22, fontWeight: 600, color: "var(--deck-text-primary)" }}>{c.title}</h3>
              <p style={{ margin: "8px 0 0", fontFamily: "var(--deck-body-family)", fontSize: 15, lineHeight: 1.5, color: "var(--deck-text-muted)" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
```

Commit: `feat(deck): add SixCardGrid slide`

#### 3.7b — `NumberedPoints`

**Files:** `components/deck/slides/NumberedPoints.tsx`

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { MonoLabel } from "../primitives/MonoLabel";
import type { NumberedPointsContent } from "@/lib/deck/slide-content-types";

export function NumberedPoints({ content, positionLabel }: { content: NumberedPointsContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">{content.headline}</DisplayHeadline>
        <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 80, rowGap: 40 }}>
          {content.points.map((p, i) => (
            <div key={i} style={{ paddingBottom: 24, borderBottom: "1px solid var(--deck-border)", display: "flex", gap: 24 }}>
              <div style={{ minWidth: 32 }}><MonoLabel color="accent">{p.number}</MonoLabel></div>
              <div>
                <h3 style={{ margin: 0, fontFamily: "var(--deck-body-family)", fontSize: 22, fontWeight: 600, color: "var(--deck-text-primary)" }}>{p.title}</h3>
                <p style={{ margin: "6px 0 0", fontFamily: "var(--deck-body-family)", fontSize: 15, lineHeight: 1.5, color: "var(--deck-text-muted)" }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
```

Commit: `feat(deck): add NumberedPoints slide`

#### 3.7c — `HeadlineWithScreenshot`

**Files:** `components/deck/slides/HeadlineWithScreenshot.tsx`

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { HeadlineWithScreenshotContent } from "@/lib/deck/slide-content-types";

export function HeadlineWithScreenshot({ content, positionLabel }: { content: HeadlineWithScreenshotContent; positionLabel?: string }) {
  const ss = content.screenshot;
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
        <div>
          <DisplayHeadline size="md">
            {content.headlineParts.map((p, i) =>
              p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
            )}
          </DisplayHeadline>
          <div style={{ marginTop: 32 }}><BodyCopy size="lg" color="muted">{content.body}</BodyCopy></div>
          <ul style={{ marginTop: 32, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {content.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "baseline", color: "var(--deck-text-primary)", fontFamily: "var(--deck-body-family)", fontSize: 16 }}>
                <span style={{ width: 4, height: 4, borderRadius: 4, background: "var(--deck-accent)", flexShrink: 0, transform: "translateY(-3px)" }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {ss.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ss.src} alt={ss.alt ?? ""} style={{ width: "100%", border: "1px solid var(--deck-border)", borderRadius: 2 }} />
          ) : (
            <div style={{ background: "var(--deck-surface)", border: "1px solid var(--deck-border)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--deck-border)" }}>
                <MonoLabel>{ss.title}</MonoLabel>
                {ss.rightLabel ? <MonoLabel color="accent">{ss.rightLabel}</MonoLabel> : null}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {ss.rows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: i < ss.rows.length - 1 ? "1px solid var(--deck-border)" : "none" }}>
                      <td style={{ padding: "14px 24px", color: "var(--deck-text-muted)", fontFamily: "var(--deck-mono-family)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>{r.label}</td>
                      <td style={{ padding: "14px 24px", color: "var(--deck-text-primary)", fontFamily: "var(--deck-body-family)", fontSize: 16 }}>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SlideFrame>
  );
}
```

Commit: `feat(deck): add HeadlineWithScreenshot slide`

#### 3.7d — `HeadlineWithCode`

**Files:** `components/deck/slides/HeadlineWithCode.tsx`

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { CodePanel } from "../primitives/CodePanel";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { HeadlineWithCodeContent } from "@/lib/deck/slide-content-types";

export function HeadlineWithCode({ content, positionLabel }: { content: HeadlineWithCodeContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">
          {content.headlineLines.map((l, i) => (
            <div key={i}>
              {l.accent ? <Accent>{l.text}</Accent> : <span>{l.text}</span>}
            </div>
          ))}
        </DisplayHeadline>
        <div style={{ marginTop: 48 }}>
          <CodePanel filename={content.code.filename} cornerLabel={content.code.cornerLabel} code={content.code.code} />
        </div>
        {content.footerCaption ? (
          <div style={{ marginTop: 24 }}>
            <MonoLabel>{content.footerCaption}</MonoLabel>
          </div>
        ) : null}
      </div>
    </SlideFrame>
  );
}
```

Commit: `feat(deck): add HeadlineWithCode slide`

### Task 3.8: `ComparisonTable` slide

**Files:** `components/deck/slides/ComparisonTable.tsx`

- [ ] **Step 1: Create**

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { MonoLabel } from "../primitives/MonoLabel";
import { Accent } from "../primitives/Accent";
import type { ComparisonTableContent } from "@/lib/deck/slide-content-types";

export function ComparisonTable({ content, positionLabel }: { content: ComparisonTableContent; positionLabel?: string }) {
  const lastCol = content.columns.length - 1;
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ marginTop: 200 - 80 - 12 }}>
        <DisplayHeadline size="md">
          {content.headlineParts.map((p, i) =>
            p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
          )}
        </DisplayHeadline>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 64 }}>
          <thead>
            <tr style={{ borderTop: "1px solid var(--deck-border)", borderBottom: "1px solid var(--deck-border)" }}>
              {content.columns.map((c, i) => (
                <th
                  key={i}
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    fontFamily: "var(--deck-mono-family)",
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: i === lastCol ? "var(--deck-accent)" : "var(--deck-text-muted)",
                    background: i === lastCol ? "color-mix(in srgb, var(--deck-accent) 12%, transparent)" : "transparent",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: "1px solid var(--deck-border)" }}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "14px 24px",
                      fontFamily: "var(--deck-body-family)",
                      fontSize: 15,
                      color: ci === lastCol ? "var(--deck-text-primary)" : "var(--deck-text-muted)",
                      background: ci === lastCol ? "color-mix(in srgb, var(--deck-accent) 12%, transparent)" : "transparent",
                      fontWeight: ci === lastCol ? 600 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideFrame>
  );
}
```

- [ ] **Step 2: Visually verify, commit**

```bash
git add components/deck/slides/ComparisonTable.tsx
git commit -m "feat(deck): add ComparisonTable slide (highlighted last column)"
```

### Task 3.9: `ClosingCTA`, `BigStat`, `Quote`

#### 3.9a — `ClosingCTA`

**Files:** `components/deck/slides/ClosingCTA.tsx`

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { DisplayHeadline } from "../primitives/DisplayHeadline";
import { BodyCopy } from "../primitives/BodyCopy";
import { Accent } from "../primitives/Accent";
import type { ClosingCTAContent } from "@/lib/deck/slide-content-types";

export function ClosingCTA({ content }: { content: ClosingCTAContent }) {
  return (
    <SlideFrame footer={<><span /><span /></>}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 48, textAlign: "center" }}>
        {content.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.logo.src} alt={content.logo.alt ?? "logo"} style={{ height: 48 }} />
        ) : null}
        <DisplayHeadline size="lg" as="h1">
          {content.headlineParts.map((p, i) =>
            p.accent ? <Accent key={i}>{p.text}</Accent> : <span key={i}>{p.text}</span>
          )}
        </DisplayHeadline>
        <BodyCopy size="lg" color="muted" maxWidth={900}>{content.sub}</BodyCopy>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <a
            href={content.primaryCta.href ?? "#"}
            style={{
              padding: "16px 28px",
              borderRadius: 999,
              background: "var(--deck-accent)",
              color: "#000",
              fontFamily: "var(--deck-body-family)",
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {content.primaryCta.label} →
          </a>
          {content.secondaryCta ? (
            <a
              href={content.secondaryCta.href ?? "#"}
              style={{
                padding: "16px 28px",
                borderRadius: 999,
                background: "transparent",
                border: "1px solid var(--deck-border)",
                color: "var(--deck-text-primary)",
                fontFamily: "var(--deck-body-family)",
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              {content.secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
    </SlideFrame>
  );
}
```

Commit: `feat(deck): add ClosingCTA slide`

#### 3.9b — `BigStat`

**Files:** `components/deck/slides/BigStat.tsx`

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { BodyCopy } from "../primitives/BodyCopy";
import { MonoLabel } from "../primitives/MonoLabel";
import type { BigStatContent } from "@/lib/deck/slide-content-types";

export function BigStat({ content, positionLabel }: { content: BigStatContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
        <div style={{ fontFamily: "var(--deck-display-family)", fontStyle: "var(--deck-display-style)", fontWeight: "var(--deck-display-weight)" as unknown as number, fontSize: 320, lineHeight: 0.9, letterSpacing: "-0.04em", color: "var(--deck-accent)" }}>
          {content.stat}
        </div>
        <MonoLabel color="primary">{content.statLabel}</MonoLabel>
        <BodyCopy size="lg" color="muted" maxWidth={1100}>{content.context}</BodyCopy>
      </div>
    </SlideFrame>
  );
}
```

Commit: `feat(deck): add BigStat slide`

#### 3.9c — `Quote`

**Files:** `components/deck/slides/Quote.tsx`

```tsx
import { SlideFrame } from "../primitives/SlideFrame";
import { SlideHeader } from "../primitives/SlideHeader";
import { MonoLabel } from "../primitives/MonoLabel";
import type { QuoteContent } from "@/lib/deck/slide-content-types";

export function Quote({ content, positionLabel }: { content: QuoteContent; positionLabel?: string }) {
  return (
    <SlideFrame
      header={<SlideHeader number={content.number ?? "—"} label={content.label} />}
      footer={positionLabel ? <><span /><MonoLabel>{positionLabel}</MonoLabel></> : undefined}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 48, maxWidth: 1400 }}>
        <blockquote style={{ margin: 0, fontFamily: "var(--deck-display-family)", fontStyle: "italic", fontWeight: 400, fontSize: 80, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--deck-text-primary)" }}>
          &ldquo;{content.quote}&rdquo;
        </blockquote>
        <div style={{ display: "flex", gap: 16, alignItems: "baseline", color: "var(--deck-text-muted)", fontFamily: "var(--deck-body-family)", fontSize: 18 }}>
          <span style={{ color: "var(--deck-text-primary)", fontWeight: 600 }}>{content.attribution.name}</span>
          {content.attribution.title ? <span>· {content.attribution.title}</span> : null}
          {content.attribution.org ? <span>· {content.attribution.org}</span> : null}
        </div>
      </div>
    </SlideFrame>
  );
}
```

Commit: `feat(deck): add Quote slide`

### Task 3.10: Slide template registry

**Files:**
- Create: `lib/deck/slide-templates.ts`

- [ ] **Step 1: Create the registry**

```ts
// lib/deck/slide-templates.ts
import type { ComponentType } from "react";
import type { SlideContent, SlideTemplateId } from "./slide-content-types";

import { Cover } from "@/components/deck/slides/Cover";
import { Problem } from "@/components/deck/slides/Problem";
import { Solution } from "@/components/deck/slides/Solution";
import { FiveCardGrid } from "@/components/deck/slides/FiveCardGrid";
import { DetailWithCode } from "@/components/deck/slides/DetailWithCode";
import { SixCardGrid } from "@/components/deck/slides/SixCardGrid";
import { NumberedPoints } from "@/components/deck/slides/NumberedPoints";
import { HeadlineWithScreenshot } from "@/components/deck/slides/HeadlineWithScreenshot";
import { HeadlineWithCode } from "@/components/deck/slides/HeadlineWithCode";
import { ComparisonTable } from "@/components/deck/slides/ComparisonTable";
import { ClosingCTA } from "@/components/deck/slides/ClosingCTA";
import { BigStat } from "@/components/deck/slides/BigStat";
import { Quote } from "@/components/deck/slides/Quote";

type AnySlideProps = { content: any; positionLabel?: string; logo?: React.ReactNode };

export const SLIDE_COMPONENTS: Record<SlideTemplateId, ComponentType<AnySlideProps>> = {
  Cover, Problem, Solution, FiveCardGrid,
  DetailWithCode, SixCardGrid, NumberedPoints,
  HeadlineWithScreenshot, HeadlineWithCode, ComparisonTable,
  ClosingCTA, BigStat, Quote,
};

/** Strongly-typed render helper. */
export function renderSlide(slide: SlideContent, props?: { positionLabel?: string; logo?: React.ReactNode }) {
  const Comp = SLIDE_COMPONENTS[slide.template] as ComponentType<{ content: typeof slide.content } & typeof props>;
  return <Comp content={slide.content as any} {...props} />;
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/deck/slide-templates.ts
git commit -m "feat(deck): add slide-template registry + renderSlide helper"
```

---

## Phase 4: Deck-template manifests

### Task 4.1: Widget Pitch deck template (15 slides)

**Files:**
- Create: `lib/deck/templates/widget-pitch.ts`

- [ ] **Step 1: Create the manifest**

Use the exact content from the existing AutoCrew Widget Pitch (pages 1–15) — author one slide entry per page, matching the slide-template type to the page's layout type. Default `accent: 'orange'`, `displayStyle: 'bold-sans'`. Each slide entry shape:

```ts
import type { SlideContent } from "../slide-content-types";

export const WIDGET_PITCH_SLIDES: SlideContent[] = [
  // 1. Cover
  { template: "Cover", content: {
      eyebrow: "V1.1 · LIVE",
      headlineParts: [
        { text: "Turn every button into a " },
        { text: "live conversation.", accent: true },
      ],
      sub: "A trigger system for AI agents — five surfaces, zero forms, on any site.",
      footerLeft: "autocrew-ai.com / widget",
  }},
  // 2. Problem
  { template: "Problem", content: {
      number: "01", label: "THE PROBLEM",
      headlineParts: [
        { text: "Static forms send visitors into a " },
        { text: "queue", accent: true },
        { text: ". Conversations don't." },
      ],
      body: "Every \"Contact us\" button is a form. Every form is a wait. Every wait is a conversion you've already lost. The widget flips that model: visitors talk to your AI agent immediately, on the same page they were already reading.",
      comparison: {
        leftLabel: "FORM",
        leftValues: ["queued", "replied to hours later", "often never"],
        rightLabel: "WIDGET",
        rightValues: ["triggered", "answered in seconds", "on the same page"],
      },
  }},
  // 3. Solution
  { template: "Solution", content: {
      number: "02", label: "THE SOLUTION",
      headlineParts: [
        { text: "Five trigger surfaces. " },
        { text: "Zero", accent: true },
        { text: " forms." },
      ],
      body: "One AI agent your visitors can reach from any page, button, or link — without re-embedding. A new trigger never requires a new ship.",
      bullets: ["DECLARATIVE", "URL PARAM", "JS API", "SEARCH", "VOICE"],
  }},
  // 4. FiveCardGrid
  { template: "FiveCardGrid", content: {
      number: "03", label: "FIVE SURFACES", secondary: "ONE WIDGET",
      headline: "Five ways to start a conversation.",
      sub: "The same agent answers every one.",
      cards: [
        { number: "01", title: "Declarative", body: "HTML, no JS." },
        { number: "02", title: "URL param", body: "Email-friendly." },
        { number: "03", title: "JS API", body: "Programmatic." },
        { number: "04", title: "Search", body: "Drop-in element." },
        { number: "05", title: "Voice", body: "Tap to talk." },
      ],
  }},
  // 5. DetailWithCode — Declarative
  { template: "DetailWithCode", content: {
      number: "01", label: "DECLARATIVE",
      headline: "HTML, no JavaScript.",
      body: "Add data-autocrew-question to any button or link. Marketing edits the CMS; the widget handles the rest. Works on buttons, anchors, and nested click targets.",
      bestFor: [
        "FAQ pages — every question becomes a trigger",
        "Pricing tier CTAs — pre-filled qualifying questions",
        "Footer quick-links — turn dead ends into conversations",
      ],
      code: {
        filename: "DECLARATIVE", cornerLabel: "01 / 05",
        code: `<button data-autocrew-question="What\nare your hours?">\n  See our hours\n</button>`,
      },
  }},
  // 6. DetailWithCode — URL Param
  { template: "DetailWithCode", content: {
      number: "02", label: "URL PARAMETER",
      headline: "Email-friendly. Self-cleaning.",
      body: "Append ?autocrew_q=… to any URL. The widget opens on landing and sends the question, then strips the param so a refresh doesn't re-fire. Pair with UTM tags for attribution.",
      bestFor: [
        "Email campaigns — link straight into a conversation",
        "Paid-ad landing URLs — per-audience question text",
        "Chatbot handoffs from other apps",
      ],
      code: {
        filename: "URL PARAMETER", cornerLabel: "02 / 05",
        code: `https://yoursite.com/?\nautocrew_q=Show%20me%20a%20demo\n\n&utm_source=email&utm_campaign=spring`,
      },
  }},
  // 7. DetailWithCode — JS API
  { template: "DetailWithCode", content: {
      number: "03", label: "JAVASCRIPT API",
      headline: "Programmatic control.",
      body: "window.AutoCrew.ask, open, close, isReady, onReady. Calls before widget.js loads buffer via the GA-style queue stub. Single-event dispatch keeps your analytics clean.",
      bestFor: [
        "Post-form-submit handoff with prefilled context",
        "Idle-detection — recover before they bounce",
        "Scroll-depth or exit-intent triggers",
      ],
      code: {
        filename: "JAVASCRIPT API", cornerLabel: "03 / 05",
        code: `// Wire to any in-page event\nwindow.AutoCrew.ask("Help me with my\naccount");\n\n// Or check ready state first\nwindow.AutoCrew.onReady(() => {\n  console.log("widget v" +\nwindow.AutoCrew.version);\n});`,
      },
  }},
  // 8. DetailWithCode — Search
  { template: "DetailWithCode", content: {
      number: "04", label: "SEARCH ELEMENT",
      headline: "Drop-in shadow-DOM box.",
      body: "<autocrew-search> is a custom element with closed shadow DOM — no CSS conflicts, no host access to internals. Submit calls ask(), so length caps and analytics reuse automatically.",
      bestFor: [
        "Help-center search box — one element, real answers",
        "Hero \"Ask anything\" CTA above the fold",
        "Docs site search replacement",
      ],
      code: {
        filename: "SEARCH ELEMENT", cornerLabel: "04 / 05",
        code: `<autocrew-search\n  placeholder="Search docs…"\n  button-label="Ask"\n  primary-color="#FF6B35"\n></autocrew-search>`,
      },
  }},
  // 9. HeadlineWithScreenshot — Voice mode (kv variant for the 6-state grid would be a separate slide; we use the headline+kv)
  { template: "HeadlineWithScreenshot", content: {
      number: "05", label: "VOICE MODE",
      headlineParts: [{ text: "A real voice agent." }],
      body: "Most chat widgets stop at text. Voice mode runs a full audio session: live transcription, natural-cadence speech, and barge-in — the visitor interrupts the agent mid-response and it stops cleanly.",
      bullets: ["Six visible states", "One tap to start", "Barge-in supported"],
      screenshot: { kind: "kv", title: "voice-states", rightLabel: "05 / 05", rows: [
        { label: "CONNECTING", value: "Establishing audio" },
        { label: "LISTENING", value: "Visitor speaks" },
        { label: "THINKING", value: "Forming response" },
        { label: "SPEAKING", value: "Agent responds" },
        { label: "MUTED", value: "Mic paused" },
        { label: "ERROR", value: "Connection lost" },
      ]},
  }},
  // 10. SixCardGrid — In the wild
  { template: "SixCardGrid", content: {
      number: "06", label: "IN THE WILD",
      headline: "Six places this earns its keep.",
      cards: [
        { cornerLabel: "DECLARATIVE", title: "FAQ rows", body: "Each question becomes a button." },
        { cornerLabel: "DECLARATIVE", title: "Pricing CTAs", body: "Plan-specific qualifying asks." },
        { cornerLabel: "URL PARAM", title: "Email links", body: "Land in conversation, not in a form." },
        { cornerLabel: "<SEARCH>", title: "Help-center box", body: "One element, real answers." },
        { cornerLabel: "VOICE MODE", title: "Mobile CTAs", body: "Tap to talk beats tiny keyboards." },
        { cornerLabel: "JS API", title: "Post-form handoff", body: "Continue immediately, with context." },
      ],
  }},
  // 11. NumberedPoints — Built for production
  { template: "NumberedPoints", content: {
      number: "07", label: "BUILT FOR PRODUCTION",
      headline: "The boring engineering that keeps this in production.",
      points: [
        { number: "01", title: "500-character cap", body: "Every trigger surface auto-truncates." },
        { number: "02", title: "Single-event dispatch", body: "Exactly one event per trigger." },
        { number: "03", title: "Pre-init queue", body: "Calls before load buffer + replay." },
        { number: "04", title: "Closed shadow DOM", body: "Host CSS can't leak in. Or out." },
        { number: "05", title: "Self-cleaning URLs", body: "Refresh doesn't re-fire deep links." },
        { number: "06", title: "Per-crew isolation", body: "Multi-tenant safe by construction." },
      ],
  }},
  // 12. HeadlineWithScreenshot — Configure without code
  { template: "HeadlineWithScreenshot", content: {
      number: "08", label: "CONFIGURE WITHOUT CODE",
      headlineParts: [
        { text: "Engineering ships once. " },
        { text: "Marketing iterates forever.", accent: true },
      ],
      body: "Theme, position, copy, suggested questions, voice toggle, greeting timing — change them per crew, push live, no redeploy. Widget pulls fresh config on every page load.",
      bullets: [
        "Tone the widget per audience without a code change",
        "A/B test copy and suggested questions",
        "Flip voice on for one crew, off for another",
      ],
      screenshot: { kind: "kv", title: "autocrew-001 / customize", rightLabel: "● SAVED", rows: [
        { label: "THEME", value: "Auto" },
        { label: "POSITION", value: "Bottom-right" },
        { label: "PRIMARY COLOR", value: "#FF6B35" },
        { label: "TITLE", value: "Chat with Sarah" },
        { label: "VOICE AGENT", value: "Enabled" },
      ]},
  }},
  // 13. HeadlineWithCode — Install
  { template: "HeadlineWithCode", content: {
      number: "09", label: "INSTALL",
      headlineLines: [
        { text: "Three lines." },
        { text: "One crewCode.", accent: true },
        { text: "That's it." },
      ],
      code: { filename: "index.html", cornerLabel: "REQUIRED",
        code: `<script>\n  window.AutoCrewConfig = { crewCode: "YOUR-CREW-CODE" };\n</script>\n<script src="https://app.autocrew-ai.com/widget.js" async></script>`,
      },
      footerCaption: "LOADS ASYNC · PULLS CONFIG · WIRES TRIGGERS AUTOMATICALLY",
  }},
  // 14. ComparisonTable
  { template: "ComparisonTable", content: {
      number: "10", label: "VERSUS THE ALTERNATIVES",
      headlineParts: [
        { text: "Static forms. Off-the-shelf chatbots. Custom builds. " },
        { text: "None of them ship in five minutes.", accent: true },
      ],
      columns: ["CAPABILITY", "STATIC FORM", "GENERIC CHATBOT", "CUSTOM AI BUILD", "AUTOCREW"],
      rows: [
        ["Time to deploy",                   "Hours", "Days",    "Weeks",  "Minutes"],
        ["Per-page question targeting",      "—",     "Partial", "✓",      "✓"],
        ["Voice mode",                       "—",     "—",       "Custom", "✓"],
        ["Single-dispatch + capped",         "—",     "Varies",  "Varies", "✓"],
        ["Live handoff",                     "—",     "✓",       "✓",      "✓"],
        ["No re-embed for new triggers",     "—",     "—",       "—",      "✓"],
        ["Cost",                             "Low",   "Per-seat","Very high","Usage-based"],
      ],
  }},
  // 15. ClosingCTA
  { template: "ClosingCTA", content: {
      headlineParts: [
        { text: "Ship a widget that " },
        { text: "talks back.", accent: true },
      ],
      sub: "Twenty minutes with a human, or thirty seconds with the widget itself.",
      primaryCta: { label: "Book a 20-min demo", href: "https://autocrew-ai.com/contact" },
      secondaryCta: { label: "Ask the widget", href: "https://autocrew-ai.com" },
  }},
];
```

- [ ] **Step 2: Commit**

```bash
git add lib/deck/templates/widget-pitch.ts
git commit -m "feat(deck): add Widget Pitch deck template (15 slides)"
```

### Task 4.2: Healthcare and Restaurant deck templates

**Files:**
- Create: `lib/deck/templates/healthcare-pitch.ts`
- Create: `lib/deck/templates/restaurant-pitch.ts`

- [ ] **Step 1:** For each, author a `SlideContent[]` array, mining content from:
  - Healthcare: `/Users/jeberulz/Documents/AutoCrew/AutoCrew-Healthcare-06APR2026.key` (open in Keynote, copy slide text)
  - Restaurant: `app/(public)/industry/restaurant/page.tsx` source

Same shape as Task 4.1. Aim for 10–14 slides per template, picking from the 13 available templates as appropriate (Cover, Problem, Solution, FiveCardGrid, DetailWithCode, BigStat, Quote, ClosingCTA work well for an industry pitch).

- [ ] **Step 2: Commit each**

```bash
git add lib/deck/templates/healthcare-pitch.ts
git commit -m "feat(deck): add Healthcare Pitch deck template"
```
```bash
git add lib/deck/templates/restaurant-pitch.ts
git commit -m "feat(deck): add Restaurant Pitch deck template"
```

### Task 4.3: Blank deck template + manifest registry

**Files:**
- Create: `lib/deck/templates/blank.ts`
- Create: `lib/deck/templates.ts`

- [ ] **Step 1: `templates/blank.ts`**

```ts
import type { SlideContent } from "../slide-content-types";

export const BLANK_SLIDES: SlideContent[] = [
  { template: "Cover", content: {
      headlineParts: [{ text: "Untitled deck for " }, { text: "{{prospect.name}}", accent: true }],
      sub: "Add your slides from the + Add slide button.",
      footerLeft: "autocrew-ai.com",
  }},
  { template: "ClosingCTA", content: {
      headlineParts: [{ text: "Ready when you are" }, { text: ".", accent: true }],
      sub: "Tell us what to build next.",
      primaryCta: { label: "Talk to sales", href: "https://autocrew-ai.com/contact" },
  }},
];
```

- [ ] **Step 2: `lib/deck/templates.ts` — registry**

```ts
import type { AccentToken, DisplayStyle } from "./tokens";
import type { SlideContent } from "./slide-content-types";
import { WIDGET_PITCH_SLIDES } from "./templates/widget-pitch";
import { HEALTHCARE_PITCH_SLIDES } from "./templates/healthcare-pitch";
import { RESTAURANT_PITCH_SLIDES } from "./templates/restaurant-pitch";
import { BLANK_SLIDES } from "./templates/blank";

export type DeckTemplateId = "widget-pitch" | "healthcare-pitch" | "restaurant-pitch" | "blank";

export type DeckTemplateManifest = {
  id: DeckTemplateId;
  name: string;
  description: string;
  thumbnail: string;
  defaultAccent: AccentToken;
  defaultDisplayStyle: DisplayStyle;
  slides: SlideContent[];
};

export const DECK_TEMPLATES: Record<DeckTemplateId, DeckTemplateManifest> = {
  "widget-pitch":     { id: "widget-pitch",     name: "Widget Pitch",      description: "The full 15-slide product pitch.",          thumbnail: "/decks/thumbs/widget-pitch.jpg",     defaultAccent: "orange", defaultDisplayStyle: "bold-sans",    slides: WIDGET_PITCH_SLIDES },
  "healthcare-pitch": { id: "healthcare-pitch", name: "Healthcare Pitch",  description: "HIPAA-aware voice agents for clinics.",     thumbnail: "/decks/thumbs/healthcare-pitch.jpg", defaultAccent: "green",  defaultDisplayStyle: "serif-italic", slides: HEALTHCARE_PITCH_SLIDES },
  "restaurant-pitch": { id: "restaurant-pitch", name: "Restaurant Pitch",  description: "Phone + reservations for restaurants.",     thumbnail: "/decks/thumbs/restaurant-pitch.jpg", defaultAccent: "orange", defaultDisplayStyle: "serif-italic", slides: RESTAURANT_PITCH_SLIDES },
  "blank":            { id: "blank",            name: "Blank deck",        description: "Cover + ClosingCTA. Add the rest.",         thumbnail: "/decks/thumbs/blank.jpg",            defaultAccent: "green",  defaultDisplayStyle: "serif-italic", slides: BLANK_SLIDES },
};

export const DECK_TEMPLATE_LIST: DeckTemplateManifest[] = Object.values(DECK_TEMPLATES);
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add lib/deck/templates/blank.ts lib/deck/templates.ts
git commit -m "feat(deck): add Blank template + DECK_TEMPLATES registry"
```

(Phase 4 continues into the rest of the build — state, wizard, editor, render, exports, gallery, polish — in `2026-04-28-sales-deck-builder-part2.md`. Splitting the plan in two so each part stays digestible. See Phase 5 onward in part 2.)
