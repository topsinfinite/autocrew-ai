"use client";

import { useSession, signOut } from "@/lib/auth-client";

/**
 * Better Auth Integration Hook
 *
 * This hook wraps Better Auth's useSession to provide a consistent interface
 * for authentication state and actions throughout the application.
 *
 * Features:
 * - Session management with Better Auth
 * - Role-based access control (SuperAdmin vs ClientAdmin)
 * - Organization/client context from active organization
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "client_admin" | "viewer";
  clientId?: string;
  emailVerified: boolean;
  image?: string | null;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isClientAdmin: boolean;
  logout: () => Promise<void>;
  // Session data from Better Auth
  session: ReturnType<typeof useSession>['data'];
}

/**
 * useAuth Hook
 *
 * Provides authentication state and actions using Better Auth
 *
 * @example
 * ```tsx
 * function ProfilePage() {
 *   const { user, isLoggedIn, isSuperAdmin, logout } = useAuth();
 *
 *   if (!isLoggedIn) {
 *     return <div>Please log in</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Welcome {user.name}</h1>
 *       {isSuperAdmin && <AdminPanel />}
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const { data: session, isPending } = useSession();

  // Transform Better Auth session to AuthUser
  const user: AuthUser | null = session
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
        // Get role from Better Auth user
        // @ts-ignore - Better Auth additionalFields typing
        role: session.user.role || "client_admin",
        // Get clientId from active organization
        clientId: session.session.activeOrganizationId || undefined,
      }
    : null;

  const isLoggedIn = !!session;
  const isLoading = isPending;

  // Check role from user object
  const isSuperAdmin = user?.role === "super_admin";
  const isClientAdmin = isLoggedIn && user?.role === "client_admin";

  const handleLogout = async () => {
    // Clear localStorage to prevent stale data in next session
    if (typeof window !== 'undefined') {
      localStorage.removeItem('activeOrganization');
      console.log('[useAuth] Cleared localStorage on logout');
    }

    await signOut();
    // Redirect to login page after signout
    window.location.href = '/login';
  };

  return {
    user,
    isLoggedIn,
    isLoading,
    isSuperAdmin,
    isClientAdmin,
    logout: handleLogout,
    session,
  };
}
