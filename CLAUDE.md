# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoCrew is a B2B SaaS platform for managing "Agentic Crews" - AI-powered digital workers integrated via n8n workflows. The platform features a multi-tenant architecture with support for both super admin and client admin roles.

**Current Status**: Phase 1 - Frontend-only implementation with mock data. Backend integration (Better-Auth, Drizzle ORM, Supabase) is planned but not yet implemented.

## Key Commands

```bash
# Development
npm run dev          # Start Next.js development server on localhost:3000

# Build & Production
npm run build        # Build the application for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint on the codebase
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router, React Server Components
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with custom dark mode theme
- **UI Components**: Shadcn UI (New York style) with Radix UI primitives
- **State Management**: React Context API (ClientContext, ThemeContext)
- **Charts**: Recharts for data visualization
- **Planned Backend**: Better-Auth, Drizzle ORM, Supabase PostgreSQL

### Route Structure

The app uses Next.js route groups for organization:

- **`app/(public)/`**: Public-facing pages (landing, login, about, contact)
- **`app/(dashboard)/`**: Protected dashboard routes (dashboard, analytics, conversations, crews, settings)
- **`app/(admin)/`**: Super admin routes for multi-tenant management
- **`app/docs/`**: Documentation pages with markdown-style content

### Multi-Tenant Architecture

The application has a multi-tenant design with role-based access:

- **Super Admin**: Can view and manage all clients, access admin routes
- **Client Admin**: Limited to their assigned client's data
- **Viewer**: Read-only access to client data

Key multi-tenant components:
- `lib/contexts/client-context.tsx`: Manages selected client state
- `lib/hooks/use-auth.ts`: Mock authentication with role-based logic
- `types/index.ts`: Defines Client, AdminUser, CrewAssignment types

All data models (Crew, Conversation, Lead) include a `clientId` field for tenant isolation.

### Authentication (Mock)

Authentication is currently mocked using localStorage:
- `lib/hooks/use-auth.ts`: Provides login/logout and role checks
- `app/(dashboard)/layout.tsx`: Protected route wrapper that redirects to `/login`
- Mock users are stored in `lib/mock-data/multi-tenant-data.ts`

When implementing real auth, replace the mock `useAuth` hook with Better-Auth integration.

### Data Flow

**Current (Phase 1)**:
- All data is mocked in `lib/dummy-data.ts` and `lib/mock-data/`
- Components consume mock data directly
- No API calls or database queries

**Planned (Phase 2+)**:
- API routes in `app/api/` for CRUD operations
- Drizzle ORM queries to Supabase PostgreSQL
- n8n webhooks for crew execution

### Styling & Design System

**Color Palette** (defined in `app/globals.css`):
- **Primary (Cyan/Teal)**: `--primary: 185 80% 50%` - Main CTAs and interactive elements
- **Secondary (Cyber Blue)**: `--secondary: 199 89% 48%` - Information and status
- **Background**: Professional dark slate (`222 47% 11%`)
- **Success**: Green (`142 71% 45%`)
- **Warning**: Orange (`38 92% 50%`)
- **Destructive**: Red (`0 84.2% 60.2%`)

**Important Patterns**:
- Dark mode is the default and primary theme
- Empty states are a key UX pattern (`components/empty-state.tsx`)
- All UI components use CSS variables with HSL color space
- Shadcn components are in `components/ui/` and should not be modified directly

### Type System

All TypeScript types are centralized in `types/index.ts`:
- `Client`, `AdminUser`, `CrewAssignment` - Multi-tenant types
- `User`, `Crew`, `Conversation`, `Lead` - Core domain models
- `ConversationMessage`, `DashboardStats` - Supporting types

All data models with multi-tenant support include a `clientId: string` field.

### Component Organization

```
components/
├── ui/              # Shadcn UI primitives (auto-generated, don't edit)
├── admin/           # Super admin specific components
├── docs/            # Documentation page components
├── landing/         # Landing page sections
├── layout/          # Layout components (headers, footers)
├── providers/       # Context providers (theme-provider.tsx)
├── date-range-picker.tsx
├── empty-state.tsx  # Reusable empty state component
└── sidebar.tsx      # Dashboard navigation sidebar
```

### Context & Hooks

**Contexts**:
- `lib/contexts/client-context.tsx`: Multi-tenant client selection
- `lib/contexts/theme-context.tsx`: Theme management (dark/light)

**Hooks**:
- `lib/hooks/use-auth.ts`: Mock authentication and role checks
- `lib/hooks/use-client.ts`: Access ClientContext
- `lib/hooks/use-theme.ts`: Access ThemeContext
- `lib/hooks/use-local-storage.ts`: Persistent localStorage state

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` maps to root directory
- Use `@/components`, `@/lib`, `@/types`, `@/app` for imports

## Development Notes

### When Adding New Features

1. **Data Models**: Add types to `types/index.ts` with `clientId` for multi-tenant support
2. **Mock Data**: Add to `lib/dummy-data.ts` or appropriate mock-data file
3. **Protected Routes**: Place in `app/(dashboard)/` - they automatically require auth
4. **Public Routes**: Place in `app/(public)/` for non-authenticated access
5. **Admin Routes**: Place in `app/(admin)/` for super admin only

### Database Migration Path

When implementing the backend:
1. Set up Drizzle schema based on types in `types/index.ts`
2. Replace mock data imports with API fetches
3. Implement Better-Auth and replace `useAuth` hook
4. Add n8n webhook handlers in `app/api/webhooks/`
5. Update components to handle loading/error states

### n8n Integration Pattern

Crews execute via n8n workflows:
- Each Crew has an `n8nWebhookUrl` field
- Trigger workflows by POSTing to the webhook URL
- n8n responds with conversation transcripts and leads
- Store responses in Conversations and Leads tables

### Styling Guidelines

- Use Tailwind utility classes
- Reference CSS variables: `bg-background`, `text-foreground`, `border-border`
- For primary actions: `bg-primary text-primary-foreground`
- For secondary actions: `bg-secondary text-secondary-foreground`
- Empty states should use the `<EmptyState />` component

### Component Patterns

**Empty States**: Always provide helpful empty states with:
- Icon representation
- Clear heading
- Descriptive text
- Primary CTA button

**Sidebar Navigation**: Defined in `components/sidebar.tsx`:
- Dashboard, Analytics, Conversations, Crews, Settings
- Admin link appears only for super admins
- System status indicator at bottom

**Dashboard Layout**: Wraps all dashboard routes:
- Sidebar on left
- Main content area with container padding
- Auto-redirects to `/login` if not authenticated
- Wrapped in ClientProvider for multi-tenant context
