# AutoCrew SaaS - Multi-Tenant UI Refactoring Plan

## Overview
Refactor the existing AutoCrew dashboard into a complete multi-tenant SaaS platform with:
- **Multi-tenant features** with SuperAdmin and Client Admin roles
- **Beautiful landing page** showcasing AI automation capabilities
- **Dual theme support** (light/dark mode toggle)
- **Comprehensive documentation** and legal pages

**Critical Note**: This is a UI-ONLY implementation using mock data. No backend logic or real authentication will be implemented.

---

## Implementation Phases

### Phase 1: Theme System Foundation (High Priority)
Build the theme infrastructure that will be used across all pages.

**New Files:**
- `lib/hooks/use-local-storage.ts` - localStorage persistence hook
- `lib/contexts/theme-context.tsx` - Theme React Context
- `components/providers/theme-provider.tsx` - Theme provider with system detection
- `lib/hooks/use-theme.ts` - Theme consumption hook
- `components/ui/theme-toggle.tsx` - Light/dark mode toggle button

**Modified Files:**
- `app/globals.css` - Add light theme CSS variables using `:root[data-theme="light"]`
- `app/layout.tsx` - Wrap with `<ThemeProvider>` and add `suppressHydrationWarning`

**CSS Variables to Add:**
```css
:root[data-theme="light"] {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --muted: 210 40% 96%;
  --border: 214 32% 91%;
  /* Keep primary orange and secondary blue */
}
```

---

### Phase 2: Multi-Tenant Data Foundation
Create mock data structure and context for multi-tenant features.

**New Files:**
- `lib/mock-data/multi-tenant-data.ts` - Mock clients, admin users, crew assignments (3-5 clients)
- `lib/contexts/client-context.tsx` - Client/tenant context provider
- `lib/hooks/use-client.ts` - Client context consumption hook
- `lib/hooks/use-auth.ts` - Mock authentication (localStorage-based)

**Modified Files:**
- `types/index.ts` - Add:
  - `Client` interface (id, name, companyName, email, plan, status, dates)
  - `AdminUser` interface (id, clientId, email, name, role, createdAt)
  - `CrewAssignment` interface (id, clientId, crewId, assignedAt, assignedBy)
  - Add `clientId: string` field to existing `Crew`, `Conversation`, `Lead` types
- `lib/dummy-data.ts` - Add `clientId` field to all mock crews, conversations, leads

**User Roles:**
- `super_admin` - Full access to admin panel, can view all clients
- `client_admin` - Access only to their organization's dashboard
- `public` - Unauthenticated user

---

### Phase 3: Landing Page & Public Routes
Create beautiful public-facing pages to showcase AutoCrew.

**New Route Group:** `app/(public)/`

**New Files:**
- `app/(public)/layout.tsx` - Public layout with nav and footer
- `app/(public)/page.tsx` - Landing page (composed of sections below)
- `app/(public)/about/page.tsx` - About page
- `app/(public)/contact/page.tsx` - Contact page
- `app/(public)/login/page.tsx` - Mock login form (sets localStorage)

**Landing Page Components:**
- `components/landing/hero-section.tsx` - Headline, CTAs, illustration
- `components/landing/features-section.tsx` - 6 key features in grid
- `components/landing/services-section.tsx` - Support Crew & LeadGen Crew cards
- `components/landing/how-it-works.tsx` - 4-step process visualization
- `components/landing/stats-section.tsx` - Impressive metrics display
- `components/landing/cta-section.tsx` - Final conversion CTA

**Navigation Components:**
- `components/layout/public-nav.tsx` - Horizontal nav (Logo, Features, Docs, About, Login/Signup, Theme Toggle)
- `components/layout/public-footer.tsx` - 4-column footer (Product, Resources, Legal, Company)

**Content Data:**
- `lib/mock-data/landing-data.ts` - Hero content, features, services, stats, testimonials

**Modified Files:**
- `app/page.tsx` - Remove redirect, move content to `app/(public)/page.tsx`

**Value Proposition:**
- Focus: "AI-Powered Automation for Businesses"
- Highlight: 24/7 Support Crew and LeadGen Crew capabilities
- CTAs: "Get Started Free" and "Watch Demo"

---

### Phase 4: Documentation & Legal Pages
Build comprehensive documentation with sidebar navigation.

**New Route:** `app/docs/`

**New Files:**
- `app/docs/layout.tsx` - Docs layout (sidebar left, TOC right, content center)
- `app/docs/page.tsx` - Documentation overview/home
- `app/docs/getting-started/page.tsx` - Quick start guide
- `app/docs/user-guide/page.tsx` - Complete user guide
- `app/docs/support-crew/page.tsx` - Support Crew documentation
- `app/docs/leadgen-crew/page.tsx` - LeadGen Crew documentation
- `app/docs/faq/page.tsx` - Frequently asked questions
- `app/docs/privacy/page.tsx` - Privacy Policy (legal)
- `app/docs/terms/page.tsx` - Terms of Service (legal)

**Documentation Components:**
- `components/layout/docs-sidebar.tsx` - Hierarchical navigation tree
- `components/docs/table-of-contents.tsx` - Right sidebar TOC (auto-generated from headings)
- `components/docs/doc-navigation.tsx` - Previous/Next page navigation
- `components/docs/code-block.tsx` - Syntax highlighted code examples

**Content Data:**
- `lib/mock-data/docs-content.ts` - Navigation structure, FAQ data, content outlines

---

### Phase 5: SuperAdmin Panel
Create dedicated admin interface for client management.

**New Route Group:** `app/(admin)/`

**New Files:**
- `app/(admin)/layout.tsx` - Admin layout with admin sidebar
- `app/(admin)/admin/page.tsx` - Admin dashboard (overview stats)
- `app/(admin)/admin/clients/page.tsx` - Client management table
- `app/(admin)/admin/clients/[id]/page.tsx` - Individual client details
- `app/(admin)/admin/crews/page.tsx` - Crew assignment interface
- `app/(admin)/admin/users/page.tsx` - User management (invite client admins)
- `app/(admin)/admin/settings/page.tsx` - Admin settings

**Admin Components:**
- `components/layout/admin-sidebar.tsx` - Admin navigation (Dashboard, Clients, Crews, Users, Settings)
- `components/admin/client-onboarding-form.tsx` - Create new client form (Dialog)
- `components/admin/crew-assignment-dialog.tsx` - Assign crews to clients
- `components/admin/user-invitation-form.tsx` - Invite client admin users
- `components/admin/client-overview-card.tsx` - Client stats card
- `components/admin/admin-stats-grid.tsx` - Total clients, crews, users metrics

**Admin Features:**
1. **Client Onboarding**: Form to create new client (company name, admin email, plan type)
2. **Crew Assignment**: Assign Support/LeadGen crews to specific clients
3. **User Management**: Invite and manage client admin users
4. **View as Client**: SuperAdmin can switch to client view with client selector

**Route Protection:**
- Check localStorage `mockUser.role === 'super_admin'`
- Redirect to `/login` if not authorized

---

### Phase 6: Multi-Tenant Dashboard Updates
Update existing dashboard to support multi-tenancy and client filtering.

**Modified Files:**
- `app/(dashboard)/layout.tsx` - Add `<ClientProvider>`, route protection, check localStorage for auth
- `components/sidebar.tsx` - Add:
  - Client selector dropdown (visible only for super_admin)
  - Current client name/logo in header
  - Theme toggle button in footer
  - "View as Client" mode indicator
- `app/(dashboard)/dashboard/page.tsx` - Filter stats, crews, conversations by `clientId`
- `app/(dashboard)/analytics/page.tsx` - Filter all analytics data by `clientId`
- `app/(dashboard)/conversations/page.tsx` - Filter conversations by `clientId`, add client badge
- `app/(dashboard)/crews/page.tsx` - Filter crews by `clientId`, auto-assign `clientId` on create
- `app/(dashboard)/settings/page.tsx` - Add theme toggle, client-specific settings

**Client Context Logic:**
- Client admins: Locked to their `clientId` (no selector)
- SuperAdmin: Can select any client from dropdown to view their data
- All tables/lists filtered by selected client context

**Visual Indicators:**
- Client name prominently displayed in sidebar
- Badge or label showing current client context
- "All systems operational" status remains in footer

---

### Phase 7: Additional UI Components
Create missing Shadcn components needed for forms and interactions.

**New Files:**
- `components/ui/select.tsx` - Radix Select component
- `components/ui/dropdown-menu.tsx` - Radix Dropdown component
- `components/ui/separator.tsx` - Visual separator
- `components/ui/label.tsx` - Form label component
- `components/ui/textarea.tsx` - Textarea input
- `components/ui/switch.tsx` - Toggle switch component
- `components/ui/tabs.tsx` - Tabs component

**Usage:**
- Select: Client selector, crew type selector, plan type selector
- Dropdown: User menu, theme toggle dropdown variant
- Switch: Theme toggle, feature toggles in settings
- Tabs: Settings page sections, documentation sections

---

### Phase 8: Polish & Integration
Final touches for cohesive user experience.

**Tasks:**
1. **Responsive Design:**
   - Mobile hamburger menu for public nav
   - Collapsible sidebars on mobile (dashboard, admin, docs)
   - Test on tablet and mobile viewports

2. **Theme Consistency:**
   - Verify all colors use CSS variables
   - Test all pages in both light and dark modes
   - Ensure proper contrast ratios (WCAG AA)

3. **Mock Authentication Flow:**
   - `/login` page with role selector (Client Admin / SuperAdmin)
   - Set localStorage: `{ isLoggedIn: true, userRole: 'client_admin', clientId: 'client-1' }`
   - Logout button clears localStorage and redirects to landing page

4. **Navigation Flow:**
   - Landing page → Login → Dashboard (client admin) or Admin panel (super admin)
   - Public nav links work correctly
   - Footer links to all docs and legal pages
   - Breadcrumbs in admin and docs sections

5. **Empty States:**
   - Use existing `empty-state.tsx` component consistently
   - Add empty states for new admin pages

6. **Loading States:**
   - Add skeleton loaders where appropriate (optional enhancement)

---

## Critical Files Reference

### Files to CREATE (80+ new files):

**Theme System:**
- `lib/hooks/use-local-storage.ts`
- `lib/contexts/theme-context.tsx`
- `components/providers/theme-provider.tsx`
- `lib/hooks/use-theme.ts`
- `components/ui/theme-toggle.tsx`

**Multi-Tenant Foundation:**
- `lib/mock-data/multi-tenant-data.ts`
- `lib/contexts/client-context.tsx`
- `lib/hooks/use-client.ts`
- `lib/hooks/use-auth.ts`

**Landing Page:**
- `app/(public)/layout.tsx`
- `app/(public)/page.tsx`
- `app/(public)/about/page.tsx`
- `app/(public)/contact/page.tsx`
- `app/(public)/login/page.tsx`
- `components/layout/public-nav.tsx`
- `components/layout/public-footer.tsx`
- `components/landing/*` (6 section components)
- `lib/mock-data/landing-data.ts`

**Documentation:**
- `app/docs/layout.tsx`
- `app/docs/page.tsx`
- `app/docs/getting-started/page.tsx`
- `app/docs/user-guide/page.tsx`
- `app/docs/support-crew/page.tsx`
- `app/docs/leadgen-crew/page.tsx`
- `app/docs/faq/page.tsx`
- `app/docs/privacy/page.tsx`
- `app/docs/terms/page.tsx`
- `components/layout/docs-sidebar.tsx`
- `components/docs/*` (3 doc components)
- `lib/mock-data/docs-content.ts`

**Admin Panel:**
- `app/(admin)/layout.tsx`
- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/clients/page.tsx`
- `app/(admin)/admin/clients/[id]/page.tsx`
- `app/(admin)/admin/crews/page.tsx`
- `app/(admin)/admin/users/page.tsx`
- `app/(admin)/admin/settings/page.tsx`
- `components/layout/admin-sidebar.tsx`
- `components/admin/*` (5 admin components)

**Additional UI Components:**
- `components/ui/select.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/separator.tsx`
- `components/ui/label.tsx`
- `components/ui/textarea.tsx`
- `components/ui/switch.tsx`
- `components/ui/tabs.tsx`

### Files to MODIFY (7 files):

- `app/globals.css` - Add light theme CSS variables
- `app/layout.tsx` - Add ThemeProvider wrapper, suppressHydrationWarning
- `app/page.tsx` - Remove redirect (content moves to `(public)/page.tsx`)
- `types/index.ts` - Add Client, AdminUser, CrewAssignment types; add clientId to existing types
- `lib/dummy-data.ts` - Add clientId field to all mock data
- `components/sidebar.tsx` - Add client selector, theme toggle, client context display
- `app/(dashboard)/layout.tsx` - Add ClientProvider, auth protection
- `app/(dashboard)/dashboard/page.tsx` - Filter by clientId
- `app/(dashboard)/analytics/page.tsx` - Filter by clientId
- `app/(dashboard)/conversations/page.tsx` - Filter by clientId
- `app/(dashboard)/crews/page.tsx` - Filter by clientId, auto-assign clientId
- `app/(dashboard)/settings/page.tsx` - Add theme toggle, client settings

---

## User Experience Flows

### 1. Public Visitor
1. Land on `/` - See hero, features, services, stats
2. Click "Docs" → `/docs` - Browse documentation
3. Click "Get Started" → `/login` - Mock signup/login form
4. No access to `/dashboard` or `/admin` without login

### 2. Client Admin
1. Login at `/login` (select "Client Admin", choose client)
2. Redirect to `/dashboard` - See only their client's data
3. Sidebar locked to their client (no selector)
4. Navigation: Dashboard, Analytics, Conversations, Crews, Settings
5. All data filtered by their `clientId`
6. Cannot access `/admin` routes

### 3. SuperAdmin
1. Login at `/login` (select "SuperAdmin")
2. Redirect to `/admin` - See all-clients overview
3. `/admin/clients` - Onboard new clients
4. `/admin/crews` - Assign crews to clients
5. `/admin/users` - Invite client admin users
6. "View as Client" → `/dashboard` with client selector dropdown
7. Select client from dropdown to view their dashboard
8. "Back to Admin" returns to `/admin`

---

## Mock Data Structure

### Mock Clients (3-5):
- Acme Corporation (Enterprise, Active)
- TechStart Inc (Professional, Active)
- RetailCo (Starter, Trial)

### Mock Users:
- SuperAdmin: `superadmin@autocrew.com` (no clientId)
- Client Admins: One per client (e.g., `john@acme.com` for Acme)

### Mock Crew Assignments:
- Each client has 1-3 crews assigned (Support and/or LeadGen)
- All existing mock crews updated with `clientId`

---

## Implementation Order

**Week 1 Focus:**
1. Phase 1: Theme System (Foundation for everything)
2. Phase 2: Multi-Tenant Data (Required for filtering)
3. Phase 3: Landing Page (High user impact)

**Week 2 Focus:**
4. Phase 4: Documentation (Self-contained)
5. Phase 5: SuperAdmin Panel (Core feature)

**Week 3 Focus:**
6. Phase 6: Dashboard Updates (Integrate multi-tenancy)
7. Phase 7: Additional Components (As needed)
8. Phase 8: Polish & Integration (Final touches)

---

## Success Criteria

✅ Dual theme toggle works across all pages (light/dark/system)
✅ Landing page showcases AutoCrew features beautifully
✅ Complete documentation and legal pages accessible
✅ SuperAdmin can onboard clients and assign crews (UI only)
✅ SuperAdmin can invite client admin users (UI only)
✅ Client admins see only their organization's data
✅ SuperAdmin can view any client's dashboard via selector
✅ All existing dashboard functionality preserved
✅ Responsive design works on mobile, tablet, desktop
✅ Mock authentication flow works (localStorage-based)
✅ All pages use mock data (no backend required)

---

## Technical Notes

- **No Backend Logic**: All forms and actions are UI-only with mock data
- **localStorage**: Used for theme preference and mock authentication
- **Route Groups**: Use `(public)`, `(dashboard)`, `(admin)` for layout isolation
- **CSS Variables**: All colors must use CSS variables for theme switching
- **Accessibility**: Maintain ARIA labels, keyboard navigation, focus states
- **Component Library**: Shadcn UI + Radix primitives throughout
- **Icons**: Lucide React for all icons
- **Typography**: Inter font (existing)
- **Color Palette**: Keep orange (#F97316) and blue (#0EA5E9) as brand colors

---

## End Goal

A complete, production-ready UI demonstrating the full AutoCrew SaaS experience:
- Beautiful public landing page that converts visitors
- Comprehensive documentation for users
- Powerful SuperAdmin panel for client management
- Multi-tenant dashboard with client-specific data filtering
- Seamless theme switching across all pages
- Professional, modern design aesthetic in both light and dark modes

**Everything is UI-only with mock data, providing the complete user experience before backend implementation.**
