// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/deck/auth";

export const config = {
  matcher: ["/decks/:path*", "/api/decks/:path*"],
};

const COOKIE_NAME = "decks_auth";

const PUBLIC_PATHS = new Set<string>([
  "/decks/__login",
  "/api/decks/auth",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.DECKS_AUTH_SECRET;
  if (!secret) {
    // Misconfiguration — fail closed.
    return new NextResponse("DECKS_AUTH_SECRET not configured", { status: 500 });
  }

  const token = req.cookies.get(COOKIE_NAME)?.value ?? "";
  const ok = await verifyAuthToken(token, secret);

  if (!ok) {
    if (pathname.startsWith("/api/decks/")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/decks/__login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
