/**
 * Better Auth Type Extensions
 *
 * This file extends Better Auth's default types to include our custom fields.
 * This eliminates the need for @ts-ignore comments throughout the codebase.
 *
 * @see CODE_REVIEW_REPORT.md Issue #9
 */

import 'better-auth';
import 'better-auth/client';

declare module 'better-auth' {
  interface User {
    /**
     * User role for authorization
     * - super_admin: Full platform access, can manage all clients
     * - client_admin: Access to their organization only
     * - viewer: Read-only access (planned)
     */
    role: 'super_admin' | 'client_admin' | 'viewer';
  }

  interface Session {
    /**
     * Active organization ID for multi-tenant context
     * This is the currently selected organization for the user's session
     */
    activeOrganizationId: string | null;
  }
}

declare module 'better-auth/client' {
  interface User {
    role: 'super_admin' | 'client_admin' | 'viewer';
  }

  interface Session {
    activeOrganizationId: string | null;
  }
}
