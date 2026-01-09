# Better Auth Integration - Implementation Plan

## Overview

This document outlines the phased implementation plan for integrating Better Auth into the AutoCrew SaaS platform, replacing the existing mock authentication system with production-ready multi-tenant authentication.

---

## Phase 1: Database Schema & Migration Setup

**Objective**: Prepare database schema to support Better Auth while preserving existing foreign key relationships.

### Tasks

#### 1.1 Install Better Auth Dependencies
- [ ] Install `better-auth` package
- [ ] Install Better Auth React client
- [ ] Verify Drizzle ORM and Zod are installed (should already be present)

```bash
npm install better-auth
```

#### 1.2 Add `slug` Field to Clients Table
- [ ] Update `db/schema.ts` to add `slug` field to `clients` table
- [ ] Add unique constraint on `slug`
- [ ] Add index on `slug` for Better Auth organization lookups
- [ ] Update `insertClientSchema` Zod validation to include slug validation
- [ ] Update TypeScript types to include slug field

**Changes**:
```typescript
// db/schema.ts - clients table
slug: text('slug').notNull().unique(), // NEW
```

#### 1.3 Create Better Auth Core Tables
- [ ] Add `user` table schema to `db/schema.ts`
- [ ] Add `session` table schema with `activeOrganizationId` field
- [ ] Add `account` table schema for password storage
- [ ] Add `verification` table schema for password reset tokens
- [ ] Add `member` table schema to link users to organizations
- [ ] Add proper indexes for all Better Auth tables
- [ ] Add Drizzle relations between tables

**Tables to create**:
- `user` - User identity and credentials
- `session` - Active sessions with organization context
- `account` - OAuth providers and password hashes
- `verification` - Email verification and password reset
- `member` - Organization membership with roles

#### 1.4 Create Database Migration for Slug Field
- [ ] Generate migration using Drizzle Kit for slug field addition
- [ ] Add SQL to backfill `slug` from existing `clientCode` values
- [ ] Add unique constraint after backfill
- [ ] Add comment explaining slug purpose
- [ ] Test migration on development database

**Migration file**: `db/migrations/0003_add_client_slug.sql`

#### 1.5 Create Database Migration for Better Auth Tables
- [ ] Generate migration using Drizzle Kit for Better Auth tables
- [ ] Verify all foreign key constraints are correct
- [ ] Verify indexes are created
- [ ] Add comments to tables explaining their purpose
- [ ] Test migration on development database

**Migration file**: `db/migrations/0004_add_better_auth_tables.sql`

#### 1.6 Run Migrations
- [ ] Backup production database (when ready for production)
- [ ] Run migrations in development environment
- [ ] Verify all tables created successfully
- [ ] Verify slug values backfilled for existing clients
- [ ] Verify foreign keys intact for crews and conversations

```bash
npm run db:generate
npm run db:migrate
```

---

## Phase 2: Better Auth Configuration

**Objective**: Configure Better Auth server and client with organization plugin mapped to clients table.

### Tasks

#### 2.1 Create Better Auth Server Configuration
- [ ] Create `lib/auth.ts` file
- [ ] Configure Drizzle adapter with PostgreSQL
- [ ] Map Better Auth tables to schema (user, session, account, verification)
- [ ] Enable email/password authentication
- [ ] Disable email verification (for MVP, enable later)
- [ ] Configure session expiration (7 days)
- [ ] Configure session update age (1 day)

**File**: `lib/auth.ts`

#### 2.2 Configure Organization Plugin
- [ ] Add organization plugin to Better Auth config
- [ ] Map `organization.name` → `clients.companyName`
- [ ] Map `organization.slug` → `clients.slug`
- [ ] Map `organization.id` → `clients.id`
- [ ] Set `organizationLimit: 1` to enforce one org per user
- [ ] Configure organization roles (owner, admin, member)
- [ ] Add `clientCode` as additional field (read-only)
- [ ] Add other client fields as additional fields (plan, status, etc.)

**Configuration**:
```typescript
organization({
  schema: {
    organization: {
      modelName: "clients",
      fields: {
        name: "companyName",
        slug: "slug",
      },
    },
  },
  organizationLimit: 1,
})
```

#### 2.3 Configure Trusted Origins
- [ ] Add `NEXT_PUBLIC_APP_URL` to trusted origins
- [ ] Add localhost for development
- [ ] Add production domain (when ready)

#### 2.4 Create Better Auth Client Configuration
- [ ] Create `lib/auth-client.ts` file
- [ ] Configure `createAuthClient` with base URL
- [ ] Add organization client plugin
- [ ] Export authentication hooks (`useSession`, `signIn`, `signOut`)
- [ ] Export organization functions (`createOrganization`, `setActive`, etc.)

**File**: `lib/auth-client.ts`

#### 2.5 Create API Route Handler
- [ ] Create `app/api/auth/[...all]/route.ts`
- [ ] Import Better Auth server instance
- [ ] Export GET and POST handlers using `toNextJsHandler`
- [ ] Verify route catches all auth endpoints

**File**: `app/api/auth/[...all]/route.ts`

#### 2.6 Configure Environment Variables
- [ ] Add `BETTER_AUTH_SECRET` to `.env.local`
- [ ] Add `BETTER_AUTH_URL` to `.env.local`
- [ ] Add `NEXT_PUBLIC_APP_URL` to `.env.local`
- [ ] Generate secure secret using `openssl rand -base64 32`
- [ ] Document environment variables in `.env.example`

**Required variables**:
```bash
BETTER_AUTH_SECRET="generated-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://..."
```

---

## Phase 3: Utility Functions & Helpers

**Objective**: Create helper functions for slug generation, client creation, and query filtering.

### Tasks

#### 3.1 Create Slug Generation Utility
- [ ] Create `lib/utils/slug-generator.ts` file
- [ ] Implement `generateSlug(input: string)` function
- [ ] Implement `isValidSlug(slug: string)` validation function
- [ ] Implement `generateUniqueSlug()` with conflict resolution
- [ ] Add unit tests for slug generation (optional for MVP)

**File**: `lib/utils/slug-generator.ts`

**Functions**:
- `generateSlug()` - Convert string to URL-friendly slug
- `isValidSlug()` - Validate slug format
- `generateUniqueSlug()` - Ensure uniqueness with numeric suffix

#### 3.2 Create Client Creation Helper
- [ ] Create `lib/api/clients.ts` file
- [ ] Implement `createClient()` function with auto-generation
- [ ] Auto-generate `clientCode` if not provided
- [ ] Auto-generate `slug` if not provided
- [ ] Check uniqueness before insertion
- [ ] Add error handling for duplicate slugs/codes

**File**: `lib/api/clients.ts`

**Functions**:
- `createClient()` - Create client with auto-generated slug and clientCode
- `getClientBySlug()` - Get client by slug (for Better Auth)
- `getClientByCode()` - Get client by clientCode (for existing FKs)
- `checkSlugExists()` - Check if slug is taken
- `checkClientCodeExists()` - Check if clientCode is taken

#### 3.3 Create Session Helper
- [ ] Create `lib/auth/session-helpers.ts` file
- [ ] Implement `getSessionWithClient()` function
- [ ] Implement `withClientFilter()` for automatic query filtering
- [ ] Add TypeScript types for session context

**File**: `lib/auth/session-helpers.ts`

**Functions**:
- `getSessionWithClient()` - Get current user session with clientId
- `withClientFilter()` - Auto-filter queries by clientId for ClientAdmin

#### 3.4 Replace Mock Auth Hook
- [ ] Update `lib/hooks/use-auth.ts` to wrap Better Auth hooks
- [ ] Maintain backward-compatible interface
- [ ] Export `user`, `isLoggedIn`, `isSuperAdmin`, `isClientAdmin`, `logout`
- [ ] Use Better Auth's `useSession` hook internally

**File**: `lib/hooks/use-auth.ts`

---

## Phase 4: Authentication UI Components

**Objective**: Build login, password reset, and user management UI components.

### Tasks

#### 4.1 Create Login Page
- [ ] Replace existing mock login page at `app/(public)/login/page.tsx`
- [ ] Use Better Auth `signIn.email()` function
- [ ] Add email and password input fields
- [ ] Add error handling and display
- [ ] Add loading state during authentication
- [ ] Redirect to `/reset-password?forced=true` if password reset required
- [ ] Redirect to `/admin` for SuperAdmin, `/dashboard` for ClientAdmin

**File**: `app/(public)/login/page.tsx`

**Features**:
- Email/password form
- Error messages
- Loading spinner
- Remember me (optional)
- Forgot password link

#### 4.2 Create Password Reset Page
- [ ] Create `app/(public)/reset-password/page.tsx`
- [ ] Accept `token` query parameter from email link
- [ ] Accept `forced` query parameter for first-time login
- [ ] Use Better Auth `resetPassword()` function
- [ ] Add new password and confirm password fields
- [ ] Validate password strength (min 8 characters)
- [ ] Show success message after reset
- [ ] Redirect to `/login` after successful reset

**File**: `app/(public)/reset-password/page.tsx`

**Features**:
- Token validation
- Password strength indicator (optional)
- Confirmation field
- Success/error messages

#### 4.3 Create Forgot Password Page (Optional)
- [ ] Create `app/(public)/forgot-password/page.tsx`
- [ ] Add email input field
- [ ] Use Better Auth `requestPasswordReset()` function
- [ ] Show success message (email sent)
- [ ] Handle user not found gracefully

**File**: `app/(public)/forgot-password/page.tsx` (optional for MVP)

#### 4.4 Update Dashboard Layout
- [ ] Update `app/(dashboard)/layout.tsx` to use Better Auth
- [ ] Replace mock auth check with `useSession()` hook
- [ ] Show loading state while checking auth
- [ ] Redirect to `/login` if not authenticated
- [ ] Redirect to `/reset-password` if password reset required
- [ ] Set active organization from session

**File**: `app/(dashboard)/layout.tsx`

#### 4.5 Update Admin Layout
- [ ] Update `app/(admin)/layout.tsx` to use Better Auth
- [ ] Verify SuperAdmin role before rendering
- [ ] Redirect ClientAdmin to `/dashboard`
- [ ] Use `useSession()` hook for role check

**File**: `app/(admin)/layout.tsx` (if separate from dashboard layout)

#### 4.6 Add Logout Functionality
- [ ] Update logout button in sidebar/header
- [ ] Use Better Auth `signOut()` function
- [ ] Clear session and cookies
- [ ] Redirect to `/login` after logout
- [ ] Add confirmation dialog (optional)

**Files**: `components/sidebar.tsx` or `components/layout/header.tsx`

---

## Phase 5: SuperAdmin User Management

**Objective**: Enable SuperAdmin to create and manage Client Admin accounts.

### Tasks

#### 5.1 Create Client Admin Creation API
- [ ] Create `app/api/admin/create-client-admin/route.ts`
- [ ] Verify SuperAdmin session in handler
- [ ] Accept `email`, `name`, `clientId` in request body
- [ ] Validate input with Zod schema
- [ ] Generate temporary random password
- [ ] Create user via Better Auth admin API
- [ ] Link user to organization via `member` table with role
- [ ] Set `requiresPasswordReset = true`
- [ ] Generate password reset token
- [ ] Send password reset email (or log to console for dev)
- [ ] Return success with user details

**File**: `app/api/admin/create-client-admin/route.ts`

**Endpoint**: `POST /api/admin/create-client-admin`

**Request Body**:
```json
{
  "email": "admin@client.com",
  "name": "Admin Name",
  "clientId": "client-uuid-here"
}
```

#### 5.2 Create Client Admin Creation Dialog
- [ ] Create `components/admin/create-client-admin-dialog.tsx`
- [ ] Add "Create Client Admin" button trigger
- [ ] Build form with fields: client selector, name, email
- [ ] Validate email format client-side
- [ ] Submit form to `/api/admin/create-client-admin`
- [ ] Show loading state during submission
- [ ] Display success message with reset link (dev only)
- [ ] Display error messages if creation fails
- [ ] Refresh user list after success

**File**: `components/admin/create-client-admin-dialog.tsx`

**Features**:
- Client dropdown (list all clients)
- Name input
- Email input with validation
- Error/success alerts
- Loading spinner

#### 5.3 Create User Management Page (Optional)
- [ ] Create `app/(admin)/admin/users/page.tsx`
- [ ] List all users with role and assigned client
- [ ] Show "Create Client Admin" button
- [ ] Add user search/filter functionality
- [ ] Add ability to disable/enable users
- [ ] Add ability to reset user passwords manually

**File**: `app/(admin)/admin/users/page.tsx` (optional for MVP)

#### 5.4 Configure Email Service
- [ ] Choose email provider (Resend, SendGrid, AWS SES)
- [ ] Add SMTP credentials to `.env.local`
- [ ] Configure Better Auth `sendResetPasswordEmail` hook
- [ ] Test email delivery in development
- [ ] Create email template for password reset

**Environment Variables**:
```bash
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM="noreply@autocrew.com"
```

**Note**: For MVP, can log reset links to console instead of sending emails

---

## Phase 6: Middleware & Route Protection

**Objective**: Implement Next.js middleware to protect routes and enforce multi-tenant access control.

### Tasks

#### 6.1 Create Middleware File
- [ ] Create `middleware.ts` in project root
- [ ] Import Better Auth server instance
- [ ] Get session from request headers
- [ ] Define public routes array

**File**: `middleware.ts`

#### 6.2 Implement Public Route Logic
- [ ] Check if current path is in public routes
- [ ] If public and user logged in on `/login`, redirect to role-based dashboard
- [ ] If public and not logged in, allow access

**Public Routes**:
- `/`
- `/login`
- `/about`
- `/contact`
- `/docs/*`
- `/api/auth/*` (Better Auth endpoints)

#### 6.3 Implement Protected Route Logic
- [ ] Check if user is authenticated
- [ ] If not authenticated, redirect to `/login`
- [ ] If `requiresPasswordReset = true`, redirect to `/reset-password?forced=true`

#### 6.4 Implement Admin Route Protection
- [ ] Check if path starts with `/admin`
- [ ] Verify user role is `super_admin`
- [ ] If not SuperAdmin, redirect to `/dashboard`

#### 6.5 Implement Client Admin Scoping
- [ ] For dashboard routes, verify ClientAdmin has `clientId`
- [ ] If ClientAdmin missing `clientId`, redirect to `/login` (shouldn't happen)

#### 6.6 Add Custom Headers (Optional)
- [ ] Add `x-user-id` header for downstream use
- [ ] Add `x-user-role` header
- [ ] Add `x-client-id` header (if present)

#### 6.7 Configure Middleware Matcher
- [ ] Exclude static files from middleware
- [ ] Exclude Next.js internals (_next/static, _next/image)
- [ ] Exclude favicon and public assets
- [ ] Exclude Better Auth API routes
- [ ] Test middleware on all routes

**Matcher Config**:
```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
```

---

## Phase 7: Multi-Tenant Query Filtering

**Objective**: Automatically filter database queries by `clientId` for Client Admins while allowing SuperAdmin full access.

### Tasks

#### 7.1 Update API Routes to Use Session Context
- [ ] Update `app/api/crews/route.ts` to use `getSessionWithClient()`
- [ ] Apply `withClientFilter()` to crew queries
- [ ] Update `app/api/conversations/route.ts`
- [ ] Apply client filtering to conversation queries
- [ ] Update any other API routes that query multi-tenant data

**Files**:
- `app/api/crews/route.ts`
- `app/api/conversations/route.ts`
- `app/api/clients/[id]/crews/route.ts`

**Pattern**:
```typescript
const session = await getSessionWithClient();
if (!session) return new Response("Unauthorized", { status: 401 });

const crews = await db.query.crews.findMany({
  where: withClientFilter(crews, session),
});
```

#### 7.2 Update Server Components to Use Session Context
- [ ] Update `app/(dashboard)/crews/page.tsx` to fetch session
- [ ] Apply client filtering to crew queries
- [ ] Update `app/(dashboard)/conversations/page.tsx`
- [ ] Update `app/(dashboard)/dashboard/page.tsx` for stats
- [ ] Ensure SuperAdmin can view all data

**Pattern**:
```typescript
const session = await getSessionWithClient();
if (!session) redirect("/login");

const crews = await db.query.crews.findMany({
  where: withClientFilter(crews, session),
});
```

#### 7.3 Update Client Context Provider
- [ ] Update `lib/contexts/client-context.tsx` to use Better Auth
- [ ] Fetch user's organizations via Better Auth
- [ ] Auto-select organization for ClientAdmin (only one)
- [ ] Allow SuperAdmin to switch between organizations
- [ ] Store active organization in context

**File**: `lib/contexts/client-context.tsx`

#### 7.4 Add Authorization Checks to Mutations
- [ ] Verify user can only modify their own client's data
- [ ] Add checks to crew creation/update/delete endpoints
- [ ] Add checks to conversation endpoints
- [ ] Return 403 Forbidden if ClientAdmin tries to access other client's data

---

## Phase 8: Seed Data & SuperAdmin Setup

**Objective**: Seed SuperAdmin account and update existing seed data with slug fields.

### Tasks

#### 8.1 Create SuperAdmin Seed Migration
- [ ] Create migration to seed SuperAdmin user
- [ ] Set email: `superadmin@autocrew.com`
- [ ] Generate initial password hash (use Better Auth API)
- [ ] Set `requiresPasswordReset = true`
- [ ] Set role: `super_admin`
- [ ] Set `clientId = null` (no organization membership)
- [ ] Document SuperAdmin credentials securely

**Migration file**: `db/migrations/0005_seed_super_admin.sql` or in seed script

**Note**: Alternatively, create SuperAdmin via seed script instead of migration

#### 8.2 Update Seed Script with Slug Field
- [ ] Update `db/seed.ts` to include `slug` for each client
- [ ] Generate slugs from company names
- [ ] Ensure slugs are unique
- [ ] Verify clientCode remains unchanged

**File**: `db/seed.ts`

**Example**:
```typescript
const clients = [
  {
    companyName: "Acme Corporation",
    clientCode: "ACME-001",
    slug: "acme-corporation", // NEW
    // ...
  },
];
```

#### 8.3 Run Seed Script
- [ ] Run seed script in development
- [ ] Verify SuperAdmin account created
- [ ] Verify clients have slugs
- [ ] Test SuperAdmin login
- [ ] Test SuperAdmin can access all data

```bash
npm run db:seed
```

#### 8.4 Document SuperAdmin Credentials
- [ ] Store credentials in password manager
- [ ] Share credentials securely with team (if applicable)
- [ ] Add instructions for changing SuperAdmin password

---

## Phase 9: Cleanup Mock Authentication

**Objective**: Remove mock authentication code and replace with Better Auth throughout the application.

### Tasks

#### 9.1 Remove Mock Auth Files
- [ ] Delete `lib/mock-data/multi-tenant-data.ts` (mock users)
- [ ] Delete or archive old mock auth utilities
- [ ] Remove `lib/hooks/use-local-storage.ts` (if only used for auth)

#### 9.2 Update Components Using Mock Auth
- [ ] Search codebase for `useAuth` imports
- [ ] Verify all components using Better Auth hooks
- [ ] Remove any hardcoded mock user data
- [ ] Update any components referencing mock data

#### 9.3 Update Context Providers
- [ ] Ensure `ClientProvider` uses Better Auth session
- [ ] Remove any mock auth state from context
- [ ] Verify theme provider is unaffected

#### 9.4 Clean Up Unused Imports
- [ ] Remove unused mock data imports
- [ ] Run linter to catch unused imports
- [ ] Run TypeScript check to catch errors

```bash
npm run lint
npm run type-check
```

#### 9.5 Test All Routes
- [ ] Test public routes (landing, login, etc.)
- [ ] Test protected dashboard routes
- [ ] Test admin routes
- [ ] Test logout functionality
- [ ] Test password reset flow

---

## Phase 10: Final Verification & Documentation

**Objective**: Verify all functionality works end-to-end and document the authentication system.

### Tasks

#### 10.1 End-to-End Testing
- [ ] Test SuperAdmin login flow
- [ ] Test SuperAdmin creates Client Admin
- [ ] Test Client Admin receives reset email (or sees console log)
- [ ] Test Client Admin resets password
- [ ] Test Client Admin login
- [ ] Test Client Admin can only see their data
- [ ] Test SuperAdmin can see all data
- [ ] Test session persistence across page refreshes
- [ ] Test logout clears session
- [ ] Test unauthorized access redirects to login
- [ ] Test Client Admin cannot access admin routes

#### 10.2 Database Verification
- [ ] Verify all Better Auth tables exist
- [ ] Verify slug field exists on clients table
- [ ] Verify foreign keys intact for crews and conversations
- [ ] Verify indexes created for performance
- [ ] Run sample queries to test filtering

```sql
-- Verify tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Verify slug values
SELECT id, company_name, client_code, slug FROM clients;

-- Verify foreign keys
SELECT c.*, cl.company_name
FROM crews c
JOIN clients cl ON c.client_id = cl.client_code;
```

#### 10.3 Security Checklist
- [ ] Verify passwords are hashed (not plain text)
- [ ] Verify session tokens are secure random strings
- [ ] Verify HTTPS enforced in production config
- [ ] Verify CSRF protection enabled
- [ ] Verify rate limiting considerations documented
- [ ] Verify no credentials in source code
- [ ] Verify `.env.local` in `.gitignore`

#### 10.4 Performance Verification
- [ ] Check session lookup performance (should be fast)
- [ ] Check client filtering performance with indexes
- [ ] Check slug uniqueness check performance
- [ ] Verify no N+1 query problems

#### 10.5 Update Documentation
- [ ] Update `README.md` with authentication setup instructions
- [ ] Document SuperAdmin credentials location
- [ ] Document how to create Client Admins
- [ ] Document environment variables required
- [ ] Document database migrations
- [ ] Add troubleshooting section

**Files**:
- `README.md`
- `docs/authentication.md` (create if needed)

#### 10.6 Create Rollback Plan
- [ ] Document how to rollback migrations
- [ ] Document how to restore from backup
- [ ] Test rollback in development
- [ ] Document data recovery procedures

**File**: `docs/rollback-plan.md` (create if needed)

---

## Phase 11: Production Readiness (Optional - Post-MVP)

**Objective**: Harden authentication for production deployment.

### Tasks

#### 11.1 Enable Email Verification
- [ ] Set `requireEmailVerification: true` in Better Auth config
- [ ] Configure email verification template
- [ ] Test email verification flow

#### 11.2 Add Rate Limiting
- [ ] Install rate limiting library (e.g., `upstash/ratelimit`)
- [ ] Add rate limiting to login endpoint
- [ ] Add rate limiting to password reset endpoint
- [ ] Add rate limiting to signup endpoint (if enabled)

#### 11.3 Add Audit Logging
- [ ] Create audit log table
- [ ] Log login attempts (success/failure)
- [ ] Log password resets
- [ ] Log user creation/deletion
- [ ] Log role changes
- [ ] Add audit log viewer for SuperAdmin

#### 11.4 Add Session Management Dashboard
- [ ] Create page to view all active sessions
- [ ] Add ability to revoke sessions
- [ ] Add ability to force password reset
- [ ] Show session details (IP, user agent, last active)

#### 11.5 Configure Production Environment
- [ ] Set `BETTER_AUTH_URL` to production domain
- [ ] Enable `useSecureCookies: true`
- [ ] Configure CORS origins
- [ ] Set up production SMTP credentials
- [ ] Rotate `BETTER_AUTH_SECRET`

#### 11.6 Enable Two-Factor Authentication (Optional)
- [ ] Add Better Auth 2FA plugin
- [ ] Configure TOTP settings
- [ ] Create 2FA setup flow
- [ ] Require 2FA for SuperAdmin

---

## Success Criteria Checklist

### Authentication
- [ ] SuperAdmin can log in with email/password
- [ ] ClientAdmin can log in with email/password
- [ ] Invalid credentials show error message
- [ ] Session persists across page refreshes
- [ ] Logout clears session completely

### Authorization
- [ ] SuperAdmin can access all routes (`/admin`, `/dashboard`)
- [ ] ClientAdmin can access `/dashboard/*` but not `/admin/*`
- [ ] Unauthenticated users redirected to `/login`
- [ ] SuperAdmin can view all clients' data
- [ ] ClientAdmin can only view their assigned client's data

### User Management
- [ ] SuperAdmin can create Client Admin accounts
- [ ] Client Admin receives password reset email (or console log)
- [ ] Client Admin forced to reset password on first login
- [ ] Password reset flow works end-to-end

### Multi-Tenancy
- [ ] Each Client Admin linked to exactly one client
- [ ] Session includes `activeOrganizationId`
- [ ] Middleware filters queries by `clientId` for ClientAdmin
- [ ] SuperAdmin bypasses all filters
- [ ] No cross-tenant data leakage

### Data Integrity
- [ ] Existing `clientCode` foreign keys continue to work
- [ ] New `slug` field is unique and indexed
- [ ] Auto-generation produces valid slugs and client codes
- [ ] Migrations can be rolled back safely
- [ ] No data loss during migration

### Type Safety
- [ ] TypeScript compiles without errors
- [ ] Session types correctly inferred
- [ ] Database queries are type-safe
- [ ] Form validation uses Zod schemas

---

## Timeline Estimate

| Phase | Estimated Time | Dependencies |
|-------|---------------|--------------|
| Phase 1: Database Schema | 2-3 hours | None |
| Phase 2: Better Auth Config | 2-3 hours | Phase 1 |
| Phase 3: Utility Functions | 2-3 hours | Phase 1, 2 |
| Phase 4: Auth UI Components | 4-6 hours | Phase 2, 3 |
| Phase 5: User Management | 3-4 hours | Phase 2, 4 |
| Phase 6: Middleware | 2-3 hours | Phase 2 |
| Phase 7: Query Filtering | 3-4 hours | Phase 6 |
| Phase 8: Seed Data | 1-2 hours | Phase 1 |
| Phase 9: Cleanup | 1-2 hours | Phase 4, 7 |
| Phase 10: Verification | 2-3 hours | All phases |
| **Total** | **22-33 hours** | |

**Note**: Times are estimates for an experienced developer. Actual time may vary based on familiarity with Better Auth and Next.js 15.

---

## Risk Mitigation

### High Priority Risks
1. **Data Migration Failure**: Always backup database before migrations
2. **Foreign Key Conflicts**: Test migrations thoroughly in development
3. **Session Security**: Use HTTPS in production, secure cookies

### Medium Priority Risks
1. **Email Delivery**: Configure reliable SMTP service (Resend recommended)
2. **SuperAdmin Compromise**: Use strong password, consider 2FA
3. **Cross-Tenant Data Leakage**: Thoroughly test query filtering

### Low Priority Risks
1. **Performance**: Add indexes, monitor query performance
2. **Type Safety**: Run TypeScript checks frequently
3. **User Experience**: Test all flows before production

---

## Rollback Plan

If critical issues arise:

1. **Revert Migrations**:
   ```bash
   # Rollback to previous migration
   npm run db:rollback
   ```

2. **Restore Database Backup**:
   ```bash
   # Restore from backup taken before migrations
   psql $DATABASE_URL < backup.sql
   ```

3. **Revert Code Changes**:
   ```bash
   # Revert to commit before Better Auth integration
   git revert <commit-hash>
   ```

4. **Restore Mock Auth** (emergency only):
   - Re-add mock auth files from git history
   - Restore `useAuth` hook to mock implementation
   - Redeploy application

---

## Post-Implementation Tasks

After successful implementation:

- [ ] Monitor authentication metrics (login success rate, errors)
- [ ] Collect feedback from SuperAdmin and Client Admins
- [ ] Plan for email verification enablement
- [ ] Plan for rate limiting implementation
- [ ] Plan for audit logging implementation
- [ ] Plan for 2FA implementation (SuperAdmin first)
- [ ] Schedule security audit
- [ ] Schedule performance optimization review

---

## References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Organization Plugin](https://www.better-auth.com/docs/plugins/organization)
- [Better Auth Next.js Integration](https://www.better-auth.com/docs/integrations/next)
- [Better Auth Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle)
- [Next.js 15 Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
