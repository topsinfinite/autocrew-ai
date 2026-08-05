import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  COOKIE_NAME,
  getWelcomeComposerSecret,
  isValidAuthCookie,
  isWelcomeComposerEnabled,
} from "@/lib/welcome-sequences/auth";

const UNLOCK_PATH = "/internal/unlock";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/internal")) {
    return NextResponse.next();
  }

  if (!isWelcomeComposerEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (pathname === UNLOCK_PATH || pathname.startsWith(`${UNLOCK_PATH}/`)) {
    return NextResponse.next();
  }

  const secret = getWelcomeComposerSecret();
  if (!secret) {
    // Misconfigured — send to unlock with a clear error state via query
    const url = request.nextUrl.clone();
    url.pathname = UNLOCK_PATH;
    url.searchParams.set("error", "misconfigured");
    return NextResponse.redirect(url);
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (isValidAuthCookie(cookie, secret)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = UNLOCK_PATH;
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/internal/:path*"],
};
