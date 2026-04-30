# Sarah Training Corpus

Hand-authored Markdown documents that train the AutoCrew widget (Sarah) on the
public marketing site. One document per landing page, plus one brand-wide
document and one product document.

## How to use

1. Edit a landing page (`app/(public)/...`) or its mock data (`lib/mock-data/*.ts`).
2. Update the matching `.md` file in this directory. The mapping is:

| Page route | Doc |
| --- | --- |
| `/` and `/about` | `brand-autocrew.md` |
| `/ai-receptionist` | `product-ai-receptionist.md` |
| `/industry/coaching` | `industry-coaching.md` |
| `/industry/healthcare` | `industry-healthcare.md` |
| `/industry/legal` | `industry-legal.md` |
| `/industry/restaurant` | `industry-restaurant.md` |

3. Bump `version` and `last_updated` in the doc's frontmatter.
4. Add a one-line entry to `CHANGELOG.md`.
5. Upload the file in the AutoCrew admin (app.autocrew-ai.com) under
   "Sarah → Knowledge documents". Replace the previous version of the same
   `doc_id`.

## Authoring rules

- No fabricated metrics, testimonials, client names, or capabilities.
- Every claim must trace back to either the live page or `app/docs/`.
- Use the `_template.md` skeleton for any new doc — section order is stable.
- The `lib/mock-data/*.ts` files are the source of truth for page prose.

## Out of scope

- `/contact`, `/contact-support`, auth pages — covered inside `brand-autocrew.md`.
- `/docs/*` — fed to Sarah through a separate docs-site crawler. Do not duplicate
  here; cross-link via section 10 of each doc instead.
