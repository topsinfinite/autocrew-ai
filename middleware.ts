import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware
 *
 * IMPORTANT SECURITY NOTE:
 * This middleware ONLY checks for cookie existence and performs coarse-grained routing.
 * It does NOT validate sessions or make database calls.
 *
 * Per Next.js and Better Auth best practices:
 * - Middleware should be lightweight and fast
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
 * Generate or extract request ID for correlation logging
 */
function getOrCreateRequestId(request: NextRequest): string {
  // Check if request already has an ID (from load balancer or previous middleware)
  const existingId = request.headers.get('x-request-id');
  if (existingId) {
    return existingId;
  }

  // Generate new UUID for this request
  return crypto.randomUUID();
}

/**
 * Middleware function - lightweight route protection + request correlation
 *
 * This ONLY checks for:
 * 1. Cookie existence (not validity!)
 * 2. Route-based redirects
 * 3. Request ID generation for logging correlation
 *
 * It does NOT:
 * - Validate JWT tokens
 * - Check database
 * - Verify roles
 * - Check permissions
 *
 * Real authentication happens in Server Components via lib/dal.ts
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate or extract request ID for correlation logging
  const requestId = getOrCreateRequestId(request);

  // Skip API auth routes (Better Auth handles these)
  if (pathname.startsWith("/api/auth")) {
    const response = NextResponse.next();
    response.headers.set('x-request-id', requestId);
    return response;
  }

  // Only check for cookie existence - NO VALIDATION
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSessionCookie = !!sessionCookie;

  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isAdminRoute = matchesRoute(pathname, ADMIN_ROUTES);

  // Clone request headers and add request ID + pathname
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);
  requestHeaders.set('x-pathname', pathname);

  // ========================================
  // 1. Public Route Logic
  // ========================================
  if (isPublicRoute) {
    // If user has a session cookie and trying to access login/signup, redirect
    // Note: We don't validate the cookie - Server Components will do that
    // IMPORTANT: Don't redirect if there's a callbackUrl (indicates failed auth attempt with stale cookie)
    const hasCallbackUrl = request.nextUrl.searchParams.has("callbackUrl");
    if (hasSessionCookie && (pathname === "/login" || pathname === "/signup") && !hasCallbackUrl) {
      // We can't determine role here, so redirect to dashboard
      // If they're SuperAdmin, the dashboard layout will redirect to /admin
      const response = NextResponse.redirect(new URL("/dashboard", request.url));
      response.headers.set('x-request-id', requestId);
      return response;
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('x-request-id', requestId);
    return response;
  }

  // ========================================
  // 2. Protected Route - Cookie Check Only
  // ========================================
  if (!hasSessionCookie) {
    // No session cookie - redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('x-request-id', requestId);
    return response;
  }

  // User has a session cookie (validity checked in Server Components)
  // For admin routes, the Server Component layout will verify SuperAdmin role
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('x-request-id', requestId);

  // Add CORS headers if needed (can be customized per environment)
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id');
  }

  return response;
}

/**
 * Middleware configuration
 * Specifies which routes the middleware should run on
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
