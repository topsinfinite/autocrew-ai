// app/api/decks/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signAuthToken } from "@/lib/deck/auth";

export const runtime = "nodejs";

// In-process rate-limit (5 attempts / minute / IP). Reset by Vercel cold start; acceptable for v1.
const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRate(ip: string): boolean {
  const now = Date.now();
  const cur = attempts.get(ip);
  if (!cur || now - cur.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
    return true;
  }
  cur.count++;
  return cur.count <= MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!checkRate(ip)) {
    return new NextResponse("Too many attempts", { status: 429 });
  }

  const expected = process.env.DECKS_PASSWORD;
  const secret = process.env.DECKS_AUTH_SECRET;
  if (!expected || !secret) {
    return new NextResponse("DECKS_PASSWORD or DECKS_AUTH_SECRET not configured", { status: 500 });
  }

  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (typeof body.password !== "string" || body.password !== expected) {
    return new NextResponse("Invalid password", { status: 401 });
  }

  const payload = `v1:${Date.now()}`;
  const token = await signAuthToken(payload, secret);

  const res = new NextResponse(null, { status: 204 });
  res.cookies.set("decks_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
