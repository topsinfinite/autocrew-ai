# Changelog

All notable changes to the AutoCrew Marketing Site are documented here.

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

*Generated on 2026-03-07*
