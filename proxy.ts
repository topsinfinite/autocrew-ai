import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware)
 *
 * IMPORTANT SECURITY NOTE:
 * This proxy ONLY checks for cookie existence and performs coarse-grained routing.
 * It does NOT validate sessions or make database calls.
 *
 * Per Next.js 16 and Better Auth best practices:
 * - Proxy should be lightweight and fast
 * - Session validation happens in Server Components/API Routes via DAL
 * - This implements the "defense in depth" pattern
 *
 * @see https://nextjs.org/docs/app/guides/authentication
 * @see https://www.better-auth.com/docs/integrations/next
 * @see CODE_REVIEW_REPORT.md for security rationale
 */

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/setup-password",
  "/contact-support",
  "/about",
  "/contact",
  "/docs",
];

/**
 * Routes that require SuperAdmin role (checked in Server Components)
 */
const ADMIN_ROUTES = ["/admin"];

/**
 * Check if a path matches any of the given route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route.endsWith("*")) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

/**
 * Proxy function - lightweight route protection
 *
 * This ONLY checks for:
 * 1. Cookie existence (not validity!)
 * 2. Route-based redirects
 *
 * It does NOT:
 * - Validate JWT tokens
 * - Check database
 * - Verify roles
 * - Check permissions
 *
 * Real authentication happens in Server Components via lib/dal.ts
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API auth routes (Better Auth handles these)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Only check for cookie existence - NO VALIDATION
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSessionCookie = !!sessionCookie;

  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isAdminRoute = matchesRoute(pathname, ADMIN_ROUTES);

  // ========================================
  // 1. Public Route Logic
  // ========================================
  if (isPublicRoute) {
    // If user has a session cookie and trying to access login/signup, redirect
    // Note: We don't validate the cookie - Server Components will do that
    if (hasSessionCookie && (pathname === "/login" || pathname === "/signup")) {
      // We can't determine role here, so redirect to dashboard
      // If they're SuperAdmin, the dashboard layout will redirect to /admin
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // ========================================
  // 2. Protected Route - Cookie Check Only
  // ========================================
  if (!hasSessionCookie) {
    // No session cookie - redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User has a session cookie (validity checked in Server Components)
  // For admin routes, the Server Component layout will verify SuperAdmin role
  return NextResponse.next();
}

/**
 * Proxy configuration
 * Specifies which routes the proxy should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api/auth (Better Auth endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api/auth).*)",
  ],
};
