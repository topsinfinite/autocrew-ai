# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoCrew is a B2B SaaS platform for managing "Agentic Crews" - AI-powered digital workers integrated via n8n workflows. The platform features a multi-tenant architecture with support for both super admin and client admin roles.

**Current Status**: Production-ready with Better Auth integration complete, multi-tenant data isolation, crew provisioning, knowledge base management, and conversation discovery. Next.js 16 best practices implemented including loading states, error boundaries, organized type system, validation schemas, and utility script tooling.

## Key Commands

```bash
# Development
npm run dev          # Start Next.js development server on localhost:3000
npm run build        # Build the application for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run typecheck    # Run TypeScript compiler check
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run validate     # Run typecheck + lint + format:check

# Database
npm run db:generate  # Generate migration from schema changes
npm run db:migrate   # Apply migrations to database
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:reset     # Drop all tables, migrate, and seed (requires --confirm)
npm run db:cleanup   # Find and cleanup orphaned crew tables (requires --confirm)

# Testing
npm run test         # Run all tests with Jest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ci      # Run tests in CI mode (maxWorkers=2)

# Utilities
npm run check-env    # Validate environment variables
```

## Testing

The project uses **Jest 30** and **React Testing Library 16** for unit and integration testing, fully configured for Next.js 16 with TypeScript support.

### Test Organization

```
__tests__/
├── test-utils.ts                       # Mock data factories and test helpers
├── lib/
│   ├── utils/                          # Utility function tests
│   │   ├── slug-generator.test.ts
│   │   └── file-validator.test.ts
│   └── validations/                    # Validation schema tests
│       ├── auth.schema.test.ts
│       └── client.schema.test.ts
├── components/                         # Component tests
│   └── empty-state.test.tsx
└── app/                                # Route/page tests (future)
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs tests on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# CI mode (optimized for CI/CD pipelines)
npm run test:ci
```

### Writing Tests

#### Test Utilities (`__tests__/test-utils.ts`)

The project provides mock data factories for consistent test data:

```typescript
import { mockClient, mockUser, mockCrew, mockConversation } from '../test-utils';

// Use mock data in tests
const client = mockClient; // Pre-configured test client
```

For file upload testing:

```typescript
import { createMockFile } from '../test-utils';

const file = createMockFile('document.pdf', 1024000, 'application/pdf');
```

#### Testing Validation Schemas

Example from `auth.schema.test.ts`:

```typescript
import { signupSchema } from '@/lib/validations/auth.schema';

describe('signupSchema', () => {
  it('should validate correct signup data', () => {
    const data = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      name: 'Test User',
      acceptTerms: true,
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject weak passwords', () => {
    const data = {
      email: 'test@example.com',
      password: 'weak',
      confirmPassword: 'weak',
      name: 'Test User',
      acceptTerms: true,
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
```

#### Testing React Components

Example from `empty-state.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/empty-state';
import { FileText } from 'lucide-react';

describe('EmptyState', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        icon={FileText}
        title="No items found"
        description="There are no items to display"
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display')).toBeInTheDocument();
  });

  it('should handle button clicks', () => {
    const handleClick = jest.fn();

    render(
      <EmptyState
        icon={FileText}
        title="No items"
        description="Get started"
        actionLabel="Create Item"
        onAction={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: 'Create Item' });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Testing Utility Functions

Example from `slug-generator.test.ts`:

```typescript
import { generateSlug, generateUniqueSlug } from '@/lib/utils/generators/slug-generator';

describe('generateSlug', () => {
  it('should convert to lowercase and replace spaces with hyphens', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(generateSlug('Hello@World#2024')).toBe('hello-world-2024');
  });

  it('should enforce 50 character limit', () => {
    const longString = 'a'.repeat(100);
    expect(generateSlug(longString)).toHaveLength(50);
  });
});
```

### Test Configuration

- **`jest.config.ts`**: Jest configuration with Next.js integration
- **`jest.setup.ts`**: Test environment setup with Next.js navigation mocks
- **Coverage Thresholds**: 50% minimum (branches, functions, lines, statements)
- **Test Environment**: jsdom (browser-like environment for React components)

### Best Practices

1. **Use mock data factories**: Import from `test-utils.ts` for consistent test data
2. **Test validation with safeParse**: Use Zod's `safeParse()` for schema testing
3. **Test user interactions**: Use `@testing-library/user-event` for realistic interactions
4. **Avoid implementation details**: Test behavior, not implementation
5. **Keep tests focused**: One concept per test case
6. **Use descriptive test names**: "should [expected behavior] when [condition]"

### Current Test Coverage

- ✅ Utility functions: slug generation, file validation
- ✅ Validation schemas: auth, client management
- ✅ Components: empty state
- ⏳ API routes: planned
- ⏳ Database operations: planned
- ⏳ Integration tests: planned

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router, React 19, React Server Components, Turbopack
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with custom dark mode theme
- **UI Components**: Shadcn UI (New York style) with Radix UI primitives
- **State Management**: React Context API (ClientContext, ThemeContext)
- **Charts**: Recharts for data visualization
- **Backend**: Better Auth, Drizzle ORM, Supabase PostgreSQL
- **Authentication**: Better Auth with organization plugin for multi-tenancy
- **Database**: PostgreSQL with Drizzle ORM and migrations
- **Validation**: Zod schemas for API routes and forms

### Route Structure

The app uses Next.js route groups for organization:

- **`app/(public)/`**: Public-facing pages (landing, login, signup, password reset, contact)
- **`app/(dashboard)/`**: Protected dashboard routes (dashboard, analytics, conversations, crews, settings)
- **`app/(admin)/`**: Super admin routes for multi-tenant management (clients, users, crews overview)
- **`app/docs/`**: Documentation pages with markdown-style content
- **`app/api/`**: API routes for all backend operations

**Route Protection**:
- Middleware (`middleware.ts`) enforces authentication before route access
- All dashboard and admin routes require authentication
- Admin routes additionally require `super_admin` role

### Multi-Tenant Architecture

The application has a multi-tenant design with role-based access:

- **Super Admin**: Can view and manage all clients, access admin routes
- **Client Admin**: Limited to their assigned client's data
- **Viewer**: Read-only access to client data (planned)

Key multi-tenant components:
- `lib/contexts/client-context.tsx`: Manages selected client state, fetches organizations from Better Auth
- `lib/hooks/use-auth.ts`: Better Auth integration with role-based logic
- `lib/auth.ts`: Better Auth server configuration
- `lib/auth-client.ts`: Better Auth client hooks
- `lib/auth/session-helpers.ts`: Server-side session utilities (requireAuth, isSuperAdmin)
- `lib/dal.ts`: Data Access Layer with React.cache() optimization
- `middleware.ts`: Route protection middleware
- `types/`: Domain-specific type definitions (organized by feature)

All data models (Crew, Conversation, Lead) include a `clientId` field for tenant isolation, clientId foreign key mapped to the client_code in client table

### Authentication (Better Auth)

Production-ready authentication using Better Auth:
- **Server**: `lib/auth.ts` configures Better Auth with Drizzle adapter
- **Client**: `lib/auth-client.ts` provides React hooks (`useSession`, `signIn`, `signOut`)
- **Database**: User, session, account, verification, and member tables
- **Organization Plugin**: Maps Better Auth organizations to `clients` table
- **Middleware**: `middleware.ts` protects routes server-side before page render
- **API Routes**: `/api/auth/[...all]` handles all auth endpoints
- **Session Helpers**: `lib/auth/session-helpers.ts` provides `requireAuth()`, `isSuperAdmin()`

**User Roles:**
- `super_admin`: Full platform access, can manage all clients and create Client Admins
- `client_admin`: Access to their organization's data only
- `viewer`: Read-only access (planned)

**Multi-Tenant Data Isolation:**
- Client Admins filtered by `member` table join on `organizationId`
- SuperAdmin bypasses all filters
- API routes enforce authorization checks before queries

### Data Flow

**Current (Production-Ready)**:
- **Authentication**: Better Auth handles sessions, users, organizations
- **Database**: Drizzle ORM queries to Supabase PostgreSQL
- **API Routes**:
  - `/api/clients` - Client management (SuperAdmin only)
  - `/api/crews` - Crew CRUD with multi-tenant filtering
  - `/api/crews/:id/knowledge-base` - Document upload/management
  - `/api/conversations` - Conversation queries with tenant isolation
  - `/api/admin/create-client-admin` - User creation (SuperAdmin only)
- **Server Components**: Direct database queries with session context via DAL
- **Client Components**: Fetch from API routes
- **Multi-Tenancy**: Automatic filtering via `member` table joins
- **Background Jobs**: Conversation discovery via instrumentation.ts

**n8n Integration**:
- Document upload to crew knowledge bases
- Conversation transcript storage
- Lead generation (planned)

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
- Loading states on all async routes (`loading.tsx` files)
- Error boundaries on all route groups (`error.tsx` files)
- 404 handlers for better UX (`not-found.tsx` files)
- All UI components use CSS variables with HSL color space
- Shadcn components are in `components/ui/` and should not be modified directly

### Type System

Types are organized by domain in `types/`:
- `types/index.ts` - Barrel export for all types
- `types/auth.ts` - User, Session, AuthResponse types
- `types/client.ts` - Client, AdminUser, ClientMembership types
- `types/crew.ts` - Crew, CrewConfig, CrewActivationState types
- `types/conversation.ts` - Conversation, ConversationMessage types
- `types/lead.ts` - Lead types
- `types/knowledge-base.ts` - KnowledgeBaseDocument types
- `types/n8n.ts` - N8nUploadResponse, N8nWebhookPayload types
- `types/dashboard.ts` - DashboardStats types
- `types/api.ts` - ApiResponse, PaginatedResponse types

**Import Pattern**: Always use barrel export
```typescript
import { Crew, CrewConfig, Client, Conversation } from '@/types';
```

All data models with multi-tenant support include a `clientId: string` field.

### Validation System

Centralized Zod validation schemas in `lib/validations/`:
- `lib/validations/auth.schema.ts` - Login, signup, password reset validation
- `lib/validations/client.schema.ts` - Client creation/update validation
- `lib/validations/crew.schema.ts` - Crew creation/update validation
- `lib/validations/conversation.schema.ts` - Conversation query validation
- `lib/validations/knowledge-base.schema.ts` - File upload validation

**Usage Pattern**:
```typescript
import { createClientSchema } from '@/lib/validations/client.schema';

const result = createClientSchema.safeParse(data);
if (!result.success) {
  // Handle validation errors
}
```

### Constants

Shared constants in `lib/constants/index.ts`:
- `APP_CONFIG` - Application metadata
- `ROUTES` - All application route paths
- `API_ROUTES` - API endpoint paths
- `USER_ROLES` - Role constants
- `CREW_TYPES` - Crew type constants
- `PAGINATION` - Pagination settings
- `VALIDATION_RULES` - Validation constants

**Usage Pattern**:
```typescript
import { ROUTES, USER_ROLES, VALIDATION_RULES } from '@/lib/constants';
```

### Utilities Organization

Utilities are organized by category in `lib/utils/`:

```
lib/utils/
├── index.ts              # Client-safe barrel export
├── cn.ts                 # Tailwind className utility
├── generators/
│   ├── index.ts          # Only exports slug-generator (client-safe)
│   ├── slug-generator.ts            # ✅ Client-safe
│   ├── client-code-generator.ts     # ⚠️  Server-only (import directly)
│   └── crew-code-generator.ts       # ⚠️  Server-only (import directly)
├── crew/
│   ├── index.ts
│   ├── crew-provisioning.ts         # ⚠️  Server-only
│   ├── crew-table-creator.ts        # ⚠️  Server-only
│   └── crew-table-generator.ts      # ⚠️  Server-only
├── transformers/
│   ├── index.ts
│   └── message-transformer.ts       # ✅ Client-safe
├── validators/
│   ├── index.ts
│   └── file-validator.ts            # ✅ Client-safe
└── database/
    ├── index.ts
    └── cleanup-orphaned-tables.ts   # ⚠️  Server-only
```

**Import Patterns**:

Client-safe (from barrel export):
```typescript
import { cn, generateSlug, validateFile, formatFileSize } from '@/lib/utils';
```

Server-only (direct imports):
```typescript
import { provisionCrew } from '@/lib/utils/crew';
import { generateClientCode } from '@/lib/utils/generators/client-code-generator';
import { cleanupOrphanedTables } from '@/lib/utils/database';
```

**Important**: Server-side utilities with database dependencies are NOT exported in the main barrel to prevent client-side bundling issues.

### Component Organization

```
components/
├── ui/              # Shadcn UI primitives (auto-generated, don't edit)
├── admin/           # Super admin specific components
│   ├── client-onboarding-form.tsx
│   ├── client-actions.tsx
│   ├── create-client-admin-dialog.tsx
│   └── resend-invitation-button.tsx
├── crews/           # Crew management components
│   ├── knowledge-base-upload.tsx
│   └── knowledge-base-list.tsx
├── docs/            # Documentation page components
├── landing/         # Landing page sections
├── layout/          # Layout components (headers, footers)
├── providers/       # Context providers (theme-provider.tsx)
├── date-range-picker.tsx
├── empty-state.tsx  # Reusable empty state component
└── sidebar.tsx      # Dashboard navigation sidebar
```

**Barrel Exports Available**:
```typescript
// Import UI components
import { Button, Card, Dialog } from '@/components/ui';

// Import admin components
import { ClientOnboardingForm, ClientActions } from '@/components/admin';
```

### Context & Hooks

**Contexts**:
- `lib/contexts/client-context.tsx`: Multi-tenant client selection
- `lib/contexts/theme-context.tsx`: Theme management (dark/light)

**Hooks**:
- `lib/hooks/use-auth.ts`: Better Auth integration with role checks
- `lib/hooks/use-client.ts`: Access ClientContext
- `lib/hooks/use-theme.ts`: Access ThemeContext
- `lib/hooks/use-local-storage.ts`: Persistent localStorage state

**Barrel Export**:
```typescript
import { useAuth, useClient, useTheme } from '@/lib/hooks';
```

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` maps to root directory
- Use `@/components`, `@/lib`, `@/types`, `@/app` for imports

## Development Notes

### When Adding New Features

1. **Data Models**: Add types to appropriate file in `types/` with `clientId` for multi-tenant support
2. **Database Schema**: Add to `db/schema.ts` and run `npm run db:generate` then `npm run db:migrate`
3. **Validation**: Add Zod schema to `lib/validations/` for API validation
4. **Protected Routes**: Place in `app/(dashboard)/` - automatically protected by middleware
5. **Public Routes**: Place in `app/(public)/` for non-authenticated access
6. **Admin Routes**: Place in `app/(admin)/` for super admin only (middleware enforces)
7. **API Routes**: Use `requireAuth()` and `isSuperAdmin()` from `lib/auth/session-helpers.ts`
8. **Multi-Tenant Queries**: Filter by `clientId` for Client Admins, allow all for SuperAdmin
9. **Loading States**: Add `loading.tsx` for async data fetching routes
10. **Error Handling**: Add `error.tsx` for error boundaries

### Database Migrations

**Workflow**:
1. Update `db/schema.ts` with new tables or fields
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `db/migrations/`
4. Apply migration: `npm run db:migrate`
5. Update seed data in `db/seed.ts` if needed
6. Run seed: `npm run db:seed`

**Reset Database** (DANGER - deletes all data):
```bash
npm run db:reset -- --confirm
```

**Important Tables**:
- `clients` - Organizations (mapped to Better Auth organizations via `slug`)
- `user` - User accounts with `role` field (`super_admin`, `client_admin`, `viewer`)
- `session` - Better Auth sessions with `activeOrganizationId`
- `member` - Links users to organizations (for multi-tenant filtering)
- `crews` - AI crews, filtered by `clientId` (maps to `clients.clientCode`)
- `conversations` - Conversation history, filtered by `clientId`
- `knowledge_base_documents` - Document metadata for crew knowledge bases

**Dynamic Tables** (created per crew):
- `{client}_{type}_vector_{seq}` - Vector embeddings for RAG
- `{client}_{type}_histories_{seq}` - Conversation histories

### n8n Integration Pattern

Crews execute via n8n workflows:
- Each Crew has a `webhookUrl` field
- Knowledge base documents uploaded via `N8N_DOCUMENT_UPLOAD_WEBHOOK`
- n8n processes documents, creates embeddings, stores in vector tables
- Conversation histories stored in dynamic histories tables
- Use `N8N_API_KEY` header for authentication

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

**Loading States**: Use skeleton loading pattern:
```typescript
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      {/* More skeleton elements */}
    </div>
  );
}
```

**Error Boundaries**: Use consistent error handling:
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

**Sidebar Navigation**: Defined in `components/sidebar.tsx`:
- Dashboard, Analytics, Conversations, Crews, Settings
- Admin link appears only for super admins
- System status indicator at bottom

**Dashboard Layout**: Wraps all dashboard routes:
- Sidebar on left
- Main content area with container padding
- Auto-redirects to `/login` if not authenticated
- Wrapped in ClientProvider for multi-tenant context

## Important Development Patterns

### Server-Side vs Client-Side Code

**Server-Only Code** (avoid in client components):
- Database queries (Drizzle ORM)
- Better Auth session helpers
- Crew provisioning utilities
- Code generators (client/crew codes)

**Client-Safe Code**:
- Slug generators
- File validators
- Message transformers
- UI utilities (cn)

**Rule**: If it imports from `@/db` or uses Node.js built-ins, it's server-only.

### API Route Authorization Pattern

```typescript
export async function GET(request: NextRequest) {
  // 1. Verify authentication
  const session = await requireAuth();

  // 2. Check role if needed
  if (!await isSuperAdmin()) {
    return NextResponse.json({
      success: false,
      error: 'Forbidden - SuperAdmin access required',
    }, { status: 403 });
  }

  // 3. Validate input with Zod
  const result = querySchema.safeParse(data);
  if (!result.success) {
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
    }, { status: 400 });
  }

  // 4. Perform database query
  // 5. Return response
}
```

### Multi-Tenant Query Pattern

```typescript
// For Client Admins - filter by organization
if (!await isSuperAdmin()) {
  const userId = session.user.id;
  const membership = await db
    .select()
    .from(member)
    .innerJoin(clients, eq(member.organizationId, clients.id))
    .where(eq(member.userId, userId))
    .limit(1);

  if (membership.length === 0) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Use membership[0].clients.clientCode for filtering
}

// For SuperAdmin - allow all data
```

### Crew Provisioning Pattern

```typescript
import { provisionCrew } from '@/lib/utils/crew';

const result = await provisionCrew({
  name: 'Customer Support',
  clientId: 'ACME-001',
  type: 'customer_support',
  webhookUrl: 'https://n8n.example.com/webhook/support',
});

// Result includes:
// - crew: Full crew record
// - tablesCreated: { vectorTable, historiesTable }
```

## Troubleshooting

### Build Errors

**"Module not found: Can't resolve 'fs'"**
- A server-only module is being imported by a client component
- Check that database utilities are not in barrel exports
- Import server utilities directly

**"Dynamic server usage: Route couldn't be rendered statically"**
- Expected for routes using `headers()` or `cookies()`
- These routes are server-rendered on demand (marked with ƒ)

### Import Patterns

❌ **Wrong** (tries to bundle database code for client):
```typescript
import { provisionCrew } from '@/lib/utils';
```

✅ **Correct** (direct import for server-side code):
```typescript
import { provisionCrew } from '@/lib/utils/crew';
```

### Environment Variables

Run validation script:
```bash
npm run check-env
```

Required variables:
- `POSTGRES_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Min 32 characters for JWT signing
- `BETTER_AUTH_URL` - Base URL for Better Auth
- `NEXT_PUBLIC_APP_URL` - Public app URL

Optional but recommended:
- `N8N_API_KEY` - For n8n webhook authentication
- `N8N_DOCUMENT_UPLOAD_WEBHOOK` - Document upload endpoint
- Email configuration for password reset

## Utility Scripts

### Check Environment
```bash
npm run check-env
```
Validates all required environment variables using Zod schemas.

### Reset Database
```bash
npm run db:reset -- --confirm
```
⚠️  WARNING: Deletes all data, runs migrations, seeds database.

### Cleanup Orphaned Tables
```bash
npm run db:cleanup              # Dry run
npm run db:cleanup -- --confirm # Actually delete
```
Finds crew tables not registered in any crew config.

### Validate Code Quality
```bash
npm run validate
```
Runs typecheck + lint + format:check before committing.
