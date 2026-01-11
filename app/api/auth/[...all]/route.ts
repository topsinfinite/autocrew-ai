import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Prevent Next.js from caching auth routes
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const { GET, POST } = toNextJsHandler(auth);
