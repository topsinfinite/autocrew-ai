# Better Auth Integration - Requirements

## Overview

Replace the existing mock authentication system with Better Auth, implementing secure multi-tenant authentication for the AutoCrew SaaS platform.

## Business Requirements

### BR-1: Multi-Tenant Architecture
- **Requirement**: Support strict tenant isolation with role-based access control
- **Roles**:
  - **SuperAdmin**: Global access to all clients/organizations, can create client admins
  - **ClientAdmin**: Scoped access to exactly ONE organization (their assigned client)
- **Constraint**: Each user can belong to only ONE organization (enforced at application level)

### BR-2: Authentication Method
- **Primary Method**: Email/Password authentication only
- **No OAuth**: Google, GitHub, or other social providers not required
- **Rationale**: Controlled user creation by SuperAdmin only

### BR-3: SuperAdmin Setup
- **Pre-seeded Account**: SuperAdmin account created via database migration
- **Default Credentials**:
  - Email: `superadmin@autocrew.com`
  - Password: Set via migration (must be changed on first login)
- **Access Level**: Can view and manage all clients without organization membership

### BR-4: Client Admin Creation Flow
- **Creator**: Only SuperAdmin can create Client Admin accounts
- **Process**:
  1. SuperAdmin creates Client Admin via UI
  2. System auto-generates temporary password
  3. Password reset email sent to Client Admin
  4. Client Admin forced to reset password on first login
- **Assignment**: Each Client Admin linked to exactly one `clientId`

### BR-5: Session Management
- **Storage**: Database sessions (not JWT)
- **Context**: Session includes user's assigned `clientId` for automatic query filtering
- **Duration**: 7 days with 1-day refresh
- **Active Organization**: Session tracks which client/organization user is currently accessing

### BR-6: Multi-Tenancy Enforcement
- **Application-Level Filtering**: Middleware automatically filters all queries by `clientId`
- **SuperAdmin Bypass**: SuperAdmin role bypasses all client filters
- **ClientAdmin Scope**: ClientAdmin can only query/modify data for their assigned client
- **Route Protection**: All dashboard and admin routes require authentication

## Technical Requirements

### TR-1: Database Schema
- **Preserve Existing Structure**:
  - Keep `clients.clientCode` as foreign key in `crews` and `conversations`
  - Do not modify existing foreign key relationships
- **Add New Fields**:
  - `clients.slug` - URL-friendly identifier for Better Auth organization plugin (unique, indexed)
- **Create Better Auth Tables**:
  - `user` - Authentication credentials and user identity
  - `session` - Active user sessions with organization context
  - `account` - OAuth providers and password hashes
  - `verification` - Email verification and password reset tokens
  - `member` - Links users to organizations (clients) with roles

### TR-2: Better Auth Configuration
- **Framework**: Better Auth with Next.js 15 App Router
- **Adapter**: Drizzle ORM adapter for PostgreSQL (Supabase)
- **Plugins**: Organization plugin with custom schema mapping
- **Field Mapping**:
  - `organization.name` → `clients.companyName`
  - `organization.slug` → `clients.slug` (NEW field)
  - `organization.id` → `clients.id`
- **Organization Limit**: 1 (enforce one user = one organization)

### TR-3: Client Table Modifications
- **Add `slug` field**:
  - Type: `text`
  - Unique: Yes
  - Required: Yes
  - Pattern: Lowercase letters, numbers, hyphens only (3-50 characters)
  - Auto-generated: From `companyName` if not provided
- **Keep `clientCode` unchanged**:
  - Continue using as foreign key in `crews.clientId` and `conversations.clientId`
  - Auto-generated: From `companyName` if not provided (e.g., "ACME001")

### TR-4: Auto-Generation Logic
- **Client Code**: Generate from company name (uppercase, alphanumeric, e.g., "ACMECORPORATION")
- **Slug**: Generate from company name (lowercase, hyphens, e.g., "acme-corporation")
- **Uniqueness Check**: Both fields checked for uniqueness before insertion
- **Conflict Resolution**: Append numeric suffix if conflict exists (e.g., "acme-corporation-2")

### TR-5: Middleware & Route Protection
- **Public Routes**: `/`, `/login`, `/about`, `/contact`, `/docs/*`
- **Protected Routes**: `/dashboard/*`, `/conversations/*`, `/crews/*`, `/settings/*`
- **Admin Routes**: `/admin/*` (SuperAdmin only)
- **Redirects**:
  - Unauthenticated users → `/login`
  - Authenticated users on `/login` → Role-based redirect (`/admin` or `/dashboard`)
  - ClientAdmin accessing `/admin/*` → `/dashboard`
  - Users requiring password reset → `/reset-password?forced=true`

### TR-6: Session Context
- **User Session Data**:
  - `userId` - User identifier
  - `email` - User email
  - `name` - Display name
  - `role` - "super_admin" or "client_admin"
  - `clientId` - Assigned client (null for SuperAdmin)
  - `activeOrganizationId` - Current organization (client) ID
  - `requiresPasswordReset` - Force password reset flag

### TR-7: Migration Strategy
- **Non-Breaking**: Additive migrations only (no destructive changes)
- **Backfill Data**: Auto-generate `slug` from existing `clientCode` for current clients
- **Migration Order**:
  1. Add `slug` field to `clients` table
  2. Create Better Auth core tables (`user`, `session`, `account`, `verification`, `member`)
  3. Seed SuperAdmin user
- **Rollback Safety**: Can revert migrations without data loss

## Functional Requirements

### FR-1: Login Flow
1. User navigates to `/login`
2. Enters email and password
3. Better Auth validates credentials
4. Check if user requires password reset
   - **If yes**: Redirect to `/reset-password?forced=true`
   - **If no**: Redirect based on role:
     - SuperAdmin → `/admin`
     - ClientAdmin → `/dashboard`
5. Session created with user context

### FR-2: Password Reset Flow
1. User receives password reset link via email
2. Clicks link → `/reset-password?token={resetToken}`
3. Enters new password (min 8 characters)
4. Confirms new password
5. Better Auth updates password hash
6. Set `requiresPasswordReset = false`
7. Redirect to `/login`

### FR-3: SuperAdmin Creates Client Admin
1. SuperAdmin navigates to `/admin/users` (or similar)
2. Clicks "Create Client Admin" button
3. Fills form:
   - Client Organization (dropdown)
   - Admin Name
   - Admin Email
4. Submits form
5. System:
   - Generates temporary password
   - Creates user account with `role = client_admin`
   - Links user to organization via `member` table
   - Sends password reset email
   - Sets `requiresPasswordReset = true`
6. Client Admin receives email with reset link
7. Client Admin sets new password on first login

### FR-4: Client Admin First Login
1. Client Admin receives email with password reset link
2. Opens reset link
3. Sets new password
4. Redirects to `/login`
5. Logs in with new password
6. System:
   - Creates session
   - Sets `activeOrganizationId` to their assigned client
   - Redirects to `/dashboard`
7. Client Admin can only view/modify data for their assigned client

### FR-5: Multi-Tenant Data Access
- **For ClientAdmin**:
  - All queries automatically filtered by `clientId` via middleware
  - Cannot access data from other clients
  - Cannot see other organizations
- **For SuperAdmin**:
  - No automatic filtering applied
  - Can view all clients via client selector
  - Can switch between clients in UI
  - Can view aggregate data across all clients

### FR-6: Logout Flow
1. User clicks logout button
2. Better Auth destroys session
3. Clears cookies
4. Redirects to `/login`

## Non-Functional Requirements

### NFR-1: Security
- **Password Storage**: Hashed with scrypt (Better Auth default)
- **Session Tokens**: Cryptographically secure random tokens
- **HTTPS**: Required in production (enforced by Better Auth config)
- **CSRF Protection**: Built into Better Auth
- **Rate Limiting**: Implement on login endpoints (recommended but not required for MVP)

### NFR-2: Performance
- **Session Lookup**: O(1) via indexed token lookup
- **Organization Filtering**: Indexed `clientId` columns in all tenant-scoped tables
- **Slug Uniqueness Check**: O(1) via unique index on `clients.slug`

### NFR-3: Type Safety
- **Full TypeScript**: End-to-end type safety
- **Drizzle ORM**: Type-safe database queries
- **Better Auth**: Type inference for session and user objects
- **Zod Validation**: Input validation for forms and API endpoints

### NFR-4: Developer Experience
- **Environment Variables**: Single `.env.local` file for configuration
- **Database Migrations**: Drizzle Kit for schema migrations
- **Auto-Generation**: Automatic slug and clientCode generation
- **Error Handling**: Graceful error messages for auth failures

## Out of Scope (Future Enhancements)

- OAuth providers (Google, GitHub, Microsoft)
- Two-factor authentication (2FA)
- Email verification on signup (disabled for now)
- Magic link authentication
- Session management dashboard (view/revoke sessions)
- Audit logging for authentication events
- Rate limiting on auth endpoints
- Multiple organization membership per user
- Invitation workflow for Client Admins (currently SuperAdmin creates accounts directly)
- Row-Level Security (RLS) in PostgreSQL

## Success Criteria

### SC-1: Authentication
- ✅ SuperAdmin can log in with email/password
- ✅ ClientAdmin can log in with email/password
- ✅ Invalid credentials show error message
- ✅ Session persists across page refreshes
- ✅ Logout clears session completely

### SC-2: Authorization
- ✅ SuperAdmin can access all routes (`/admin`, `/dashboard`, etc.)
- ✅ ClientAdmin can access `/dashboard/*` but not `/admin/*`
- ✅ Unauthenticated users redirected to `/login`
- ✅ SuperAdmin can view all clients' data
- ✅ ClientAdmin can only view their assigned client's data

### SC-3: User Management
- ✅ SuperAdmin can create Client Admin accounts
- ✅ Client Admin receives password reset email
- ✅ Client Admin forced to reset password on first login
- ✅ Password reset flow works end-to-end

### SC-4: Multi-Tenancy
- ✅ Each Client Admin linked to exactly one client
- ✅ Session includes `activeOrganizationId`
- ✅ Middleware filters queries by `clientId` for ClientAdmin
- ✅ SuperAdmin bypasses all filters
- ✅ No cross-tenant data leakage

### SC-5: Data Integrity
- ✅ Existing `clientCode` foreign keys continue to work
- ✅ New `slug` field is unique and indexed
- ✅ Auto-generation produces valid slugs and client codes
- ✅ Migrations can be rolled back safely
- ✅ No data loss during migration

### SC-6: Type Safety
- ✅ TypeScript compiles without errors
- ✅ Session types correctly inferred
- ✅ Database queries are type-safe
- ✅ Form validation uses Zod schemas

## Constraints

### Technical Constraints
- Next.js 15 with App Router (no Pages Router)
- React Server Components for data fetching
- Drizzle ORM (no Prisma or other ORMs)
- PostgreSQL database (Supabase)
- Better Auth (no NextAuth.js or Clerk)

### Business Constraints
- No user self-registration (SuperAdmin creates all accounts)
- Email/password only (no social login)
- One organization per user (no multi-org support)
- SuperAdmin credentials must be secured (password manager recommended)

### Regulatory Constraints
- GDPR compliance (future consideration for user data deletion)
- Password complexity requirements (min 8 characters for MVP)
- Session expiration (7 days max, configurable)

## Assumptions

1. Supabase PostgreSQL database is already provisioned
2. Email service (SMTP) will be configured separately (can use console logs for development)
3. All users have valid email addresses
4. SuperAdmin is trusted and will not abuse privileges
5. Clients table already exists with data (migration will backfill slugs)
6. Environment variables will be manually configured (not automated)

## Dependencies

### External Dependencies
- `better-auth` - Authentication library
- `better-auth/client` - Client-side hooks
- `better-auth/next-js` - Next.js integration
- `better-auth/adapters/drizzle` - Drizzle ORM adapter
- `better-auth/plugins` - Organization plugin
- `zod` - Schema validation (already installed)
- `drizzle-orm` - ORM (already installed)

### Internal Dependencies
- Existing `clients` table in database
- Existing `crews` and `conversations` tables with `clientId` foreign keys
- Existing Drizzle schema and migrations setup
- Existing UI components from shadcn/ui

## Risks & Mitigation

### Risk 1: Data Migration Failure
- **Impact**: Existing clients lose slug field, auth breaks
- **Likelihood**: Low (additive migration only)
- **Mitigation**:
  - Test migration in development first
  - Backup database before migration
  - Rollback plan documented

### Risk 2: Foreign Key Conflicts
- **Impact**: Crews and conversations can't reference clients
- **Likelihood**: Very Low (no changes to clientCode)
- **Mitigation**:
  - Keep clientCode unchanged
  - Add slug as separate field
  - Verify FKs in testing

### Risk 3: Session Security
- **Impact**: Session hijacking or fixation attacks
- **Likelihood**: Low (Better Auth handles security)
- **Mitigation**:
  - Use HTTPS in production
  - Set secure cookie flags
  - Implement CSRF protection (built-in)

### Risk 4: Password Reset Email Delivery
- **Impact**: Client Admins can't set passwords
- **Likelihood**: Medium (SMTP not configured yet)
- **Mitigation**:
  - Use console logs for development
  - Configure transactional email service (Resend, SendGrid)
  - Provide manual password reset option for SuperAdmin

### Risk 5: SuperAdmin Account Compromise
- **Impact**: Attacker gains access to all clients
- **Likelihood**: Low (assuming password manager used)
- **Mitigation**:
  - Enforce strong password on SuperAdmin account
  - Recommend 2FA (future enhancement)
  - Audit logging (future enhancement)

## Glossary

- **Better Auth**: TypeScript-first authentication library for Next.js
- **Organization**: Multi-tenant entity (maps to `clients` table in this project)
- **Member**: User's membership in an organization with role (owner, admin, member)
- **Slug**: URL-friendly identifier (e.g., "acme-corporation")
- **Client Code**: Business identifier for internal use (e.g., "ACME001")
- **SuperAdmin**: Platform administrator with global access
- **ClientAdmin**: Organization administrator with scoped access
- **Session**: Authenticated user state stored in database
- **Active Organization**: Currently selected client/organization in session
