import { NextResponse } from "next/server";

import {
  COOKIE_NAME,
  expectedAuthCookieValue,
  getWelcomeComposerSecret,
  isValidUnlockPassword,
  isWelcomeComposerEnabled,
} from "@/lib/welcome-sequences/auth";

export async function POST(request: Request) {
  if (!isWelcomeComposerEnabled()) {
    return NextResponse.json({ error: "Disabled" }, { status: 404 });
  }

  const secret = getWelcomeComposerSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "WELCOME_COMPOSER_SECRET is not configured" },
      { status: 503 },
    );
  }

  let password = "";
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } else {
    const form = await request.formData();
    password = String(form.get("password") ?? "");
  }

  if (!isValidUnlockPassword(password, secret)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: expectedAuthCookieValue(secret),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });
  return response;
}
