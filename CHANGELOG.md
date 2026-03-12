# Changelog

All notable changes to the AutoCrew Marketing Site are documented here.

---

## [v1.6.0] - 2026-03-12

### New Features

- **Restaurant Industry page** (`/industry/restaurant`) - Full landing page with hero, features, pain points, how it works, metrics, testimonials, FAQ, and CTA sections
- Added restaurant mock data (`lib/mock-data/restaurant-data.ts`) with comprehensive content for the restaurant vertical
- Added **industry page scaffold skill** (`.claude/commands/industry.md`) for generating new industry landing pages

### Bug Fixes

- Updated 404 page link from `/dashboard` to `/login` for correct user flow on the static marketing site
- Updated `PublicFooter` to conditionally hide on `/industry/restaurant` path, matching existing behavior for other industry pages

---

## Files Changed

13 files changed, 1,474 insertions, 2 deletions, including:

- 8 new restaurant industry components and page created
- Restaurant mock data with industry-specific content
- Footer and 404 page navigation fixes

---

## [v1.5.0] - 2026-03-11

### New Features

- **Coaching Industry page** (`/industry/coaching`) - Full landing page with hero, features, pain points, how it works, metrics, testimonials, FAQ, and CTA sections
- Added coaching mock data (`lib/mock-data/coaching-data.ts`) with comprehensive content for the coaching vertical
- Added **"Coming Soon" indicators** to documentation sidebar and public navigation for upcoming features
- Added new industry routes for coaching and restaurant in constants

### Improvements

- Simplified `BackgroundEffects` component by removing `unicornStudioProjectId` prop and associated script loading logic
- Changed header positioning in `PublicNav` from fixed to relative for improved layout consistency
- Adjusted hero section padding and margin for better visual alignment
- Updated dashboard preview URL in `browser-chrome.tsx`
- Fixed inconsistent label color badge styling
- Cleaned up global type declarations by removing unused `Window` interface extensions (`types/global.d.ts`)

### Bug Fixes

- Resolved layout inconsistencies on the LeadGen Crew page
- Adjusted "Coming Soon" indicators in navigation for better visibility
- Updated LeadGen Crew docs page and docs landing to reflect "Coming Soon" status

### Infrastructure

- Replaced `app/icon.png` with `app/icon.svg` for sharper favicon rendering
- Updated `landing-data.ts` mock data to include "Coming Soon" flags for LeadGen Crew

---

## Files Changed

25 files changed, 1,250 insertions, 100 deletions, including:

- 8 new coaching industry components and page created
- Navigation and sidebar updated with "Coming Soon" badges
- BackgroundEffects simplified, hero section refined
- Mock data and constants expanded for new industry verticals

---

## [v1.4.0] - 2026-03-07

### Hero Section & Messaging

- Revised hero section headline and subheadline for improved clarity and engagement
- Replaced Button with Link component for secondary CTA ("Watch Demo")
- Updated trust text and conversations count from "10M+" to "1k+" for accuracy
- Changed primary CTA from "Get Started Free" to "Request Access"
- Changed secondary CTA text to align with new access-request flow

### SEO & Structured Data

- Added JSON-LD schemas (Organization + WebSite) to the root layout for richer search results
- Updated metadata with new keywords related to healthcare AI automation
- Added `Strict-Transport-Security` and `Permissions-Policy` security headers in `next.config.ts`
- Updated sitemap with new last modified dates and added routes for Security, Compliance, and Design System pages
- Added 192x192 and 512x512 icons to the web manifest

### New Pages

- **Security page** (`/docs/security`) - Detailed security practices and infrastructure overview
- **Compliance page** (`/docs/compliance`) - Regulatory compliance documentation (HIPAA, SOC 2, GDPR)
- **Healthcare Crew page** (`/docs/healthcare-crew`) - Dedicated documentation for the Healthcare AI Crew
- **Design System page** (`/design-system`) - Component library and design token reference

### Documentation Updates

- Expanded Privacy Policy with sections on AI processing, legal bases, and user rights under GDPR/CCPA
- Expanded Terms of Service with updated legal language and revised dates
- Updated Getting Started guide to include Healthcare crew type option
- Enhanced Support Crew docs with multi-channel access details and updated key features
- Refined LeadGen Crew content with improved lead scoring descriptions
- Added Healthcare Crew link to docs sidebar navigation
- Added breadcrumb structured data component for docs pages

### Domain & Routing

- Redirected `/login` and `/signup` to the new app domain (`https://app.autocrew-ai.com`)
- Updated all login/signup links across constants and components to point to the new domain
- Updated Pricing nav link to direct users to contact sales instead

### Landing Page Components

- Introduced `SectionBadge` component for uniform badge styling across all landing sections
- Updated `BackgroundEffects` component with Unicorn Studio project integration
- Refined button components across AI Crews, CTA, FAQ, Features, and Contact Sales sections for consistency
- Improved conditional rendering in multiple components for better performance
- Consolidated icon mapping in `TabSettings` for improved maintainability

### Accessibility & Semantics

- Added `aria-hidden` attributes to decorative elements across landing sections
- Updated CTA buttons to use semantic `<button>` elements
- Improved heading hierarchy and semantic structure in How It Works section
- Added IDs to main content sections for improved layout accessibility

### Styling & UI Fixes

- Replaced all `bg-gradient-to-*` classes with `bg-linear-to-*` for Tailwind v4 consistency
- Adjusted layout and spacing across multiple sections for improved responsiveness
- Fixed text overlap issue on signup page mobile view
- Updated gradient classes across About, Contact, and Contact Support pages

### Dashboard Preview

- Added auto-navigation that cycles through tabs (Chat, Inbox, Analytics, Settings) every 10 seconds
- Auto-navigation stops when the user manually interacts with tabs
- Added floating "unmute" tooltip with interaction logic to the voice panel
- Mute interaction now stops dashboard auto-navigation

### Contact & Support

- Consolidated all support email addresses to `support@autocrew-ai.com` across the entire codebase
- Updated README, contact support page, FAQ, privacy, security, terms, and constants

---

## Files Changed

60 files changed across the project, including:

- 14 landing components updated
- 8 documentation pages added or revised
- 4 new pages created
- 3 layout files updated
- SEO schemas, constants, mock data, and config files updated

---

_Generated on 2026-03-12_
