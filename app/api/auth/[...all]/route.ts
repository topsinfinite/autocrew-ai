import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

// Prevent Next.js from caching auth routes
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const { GET: originalGET, POST: originalPOST } = toNextJsHandler(auth);

// Wrapper to add logging
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  console.log("[AUTH API] GET request:", url.pathname);
  console.log("[AUTH API] Query params:", Object.fromEntries(url.searchParams));

  try {
    const response = await originalGET(request);
    console.log("[AUTH API] GET response status:", response.status);
    return response;
  } catch (error) {
    console.error("[AUTH API] GET error:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  console.log("[AUTH API] POST request:", url.pathname);
  console.log("[AUTH API] Headers:", Object.fromEntries(request.headers));

  // Clone request to read body for logging
  const clonedRequest = request.clone();
  try {
    const body = await clonedRequest.json();
    // Don't log password
    const safeBody = { ...body, password: body.password ? "[REDACTED]" : undefined };
    console.log("[AUTH API] POST body:", JSON.stringify(safeBody, null, 2));
  } catch {
    console.log("[AUTH API] POST body: (not JSON or empty)");
  }

  try {
    const startTime = Date.now();
    const response = await originalPOST(request);
    const duration = Date.now() - startTime;

    console.log("[AUTH API] POST response status:", response.status);
    console.log("[AUTH API] POST response time:", duration, "ms");

    // Try to log response body for debugging
    const clonedResponse = response.clone();
    try {
      const responseBody = await clonedResponse.json();
      // Don't log sensitive data
      const safeResponse = {
        ...responseBody,
        token: responseBody.token ? "[REDACTED]" : undefined,
      };
      console.log("[AUTH API] POST response body:", JSON.stringify(safeResponse, null, 2));
    } catch {
      console.log("[AUTH API] POST response body: (not JSON)");
    }

    return response;
  } catch (error) {
    console.error("[AUTH API] POST error:", error);
    console.error("[AUTH API] Error details:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}
