# WP01 Stories - Post-Sale Welcome Composer

Branch: `feat/welcome-composer`
Lane: Work Package
Registry: `docs/brainstorms/2026-08-05-welcome-composer-design.md`
Definition of done: Sales can unlock `/internal/welcome-composer`, pick any of 9 site packages, fill intake, copy Day-0 plain-text email with friction footer; no Beehiiv; no PII persistence.

## Stories

- [x] `WP01-S1` - Sequence content + render lib
  - Scope: `lib/welcome-sequences/*`, `content/welcome-sequences/*`
  - Acceptance criteria:
    - 9 packages with Day 0 authored; steps 1–3 stubbed
    - Token resolve + friction footer + empty `go_live` fallback
  - Verification: `npm run typecheck`

- [x] `WP01-S2` - Secret cookie gate
  - Scope: `proxy.ts`, `app/api/internal/welcome-composer/unlock/route.ts`
  - Acceptance criteria:
    - `/internal/*` blocked without cookie
    - POST unlock with `WELCOME_COMPOSER_SECRET` sets httpOnly cookie
  - Verification: manual unlock flow + typecheck

- [x] `WP01-S3` - Composer UI
  - Scope: `app/internal/*`, composer components
  - Acceptance criteria:
    - Package select grouped; industry packages lock vertical
    - Copy subject/body; stub steps disabled; Beehiiv checklist gate
    - Client-only form state (no localStorage/URL PII)
  - Verification: `npm run validate` + browser smoke

- [x] `WP01-S4` - Ops docs + env
  - Scope: `docs/post-sale-friction.md`, `.env.example`, RULINGS
  - Acceptance criteria:
    - Friction log template exists; env documented
  - Verification: files present

## Out Of Scope

- Auto-send / Resend / Beehiiv enrollment
- HTML email preview
- Steps 1–3 full curriculum authorship
- LeadGen / Digital Front-Desk packages
- Public nav link

## Notes

- Design: `docs/brainstorms/2026-08-05-welcome-composer-design.md`
