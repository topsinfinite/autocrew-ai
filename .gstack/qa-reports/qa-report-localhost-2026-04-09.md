# QA Report — autocrew-marketing

- **Date:** 2026-04-09
- **Target:** http://localhost:3000/
- **Viewport:** 390×844 (mobile)
- **Tier:** Standard (smoke + one fix)
- **Browse:** Cursor IDE browser MCP (`gstack browse` binary not built locally)

## Summary

| Item | Result |
|------|--------|
| Home loads | OK (200) |
| Speak to Sarah FAB (`lg:hidden`) | Present, `tel:` link, correct aria-label |
| Cookie banner + FAB stack | Not re-tested with fresh `localStorage` (session already had consent) |
| Console | Dev-only warnings; hydration **debug** seen when using Cursor browser (see below) |

## ISSUE-001 — PhoneCallFab hydration class mismatch (real)

**Severity:** Medium (React dev warning in production builds can still log; DOM mismatch risk)

**Evidence:** Console showed `PhoneCallFab` wrapper `className` differing between SSR HTML and first client render when `fabStackBottomPx` was applied before hydration settled.

**Fix:** Defer use of `fabStackBottomPx` until `useEffect` runs (`hydrated` flag). First paint always uses `bottom-5` / `sm:bottom-6` Tailwind; measured offset applies after mount.

**Files:** `components/layout/phone-call-fab.tsx`

**Fix status:** verified (typecheck pass; logic review)

## Note — Cursor browser hydration noise

Large hydration warnings listing `data-cursor-ref` on many nodes are from **automation injecting refs into the DOM**, not from app SSR bugs. Reproduce in a normal browser tab without the MCP to validate.

## Follow-ups (deferred)

1. Manually clear `localStorage` key `cookie-consent` and confirm FAB stacks above cookie dialog, then drops after Accept.
2. Build or install `gstack browse` for `$B`-style regression baselines.
3. Re-run QA on production URL after deploy.

## PR-style summary

QA found 1 fixable issue (FAB stack offset vs hydration); fixed in `PhoneCallFab`. Cookie stacking flow needs a clean-storage manual pass.
