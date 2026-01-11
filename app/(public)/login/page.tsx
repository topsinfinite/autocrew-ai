"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log("[LOGIN] Starting sign-in attempt...");
    console.log("[LOGIN] Email:", email);
    console.log("[LOGIN] Auth client baseURL:", process.env.NEXT_PUBLIC_APP_URL);

    try {
      console.log("[LOGIN] Calling authClient.signIn.email...");
      const startTime = Date.now();

      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      const duration = Date.now() - startTime;
      console.log("[LOGIN] Sign-in response received in", duration, "ms");
      console.log("[LOGIN] Response data:", JSON.stringify(data, null, 2));
      console.log("[LOGIN] Response error:", authError);

      if (authError) {
        console.error("[LOGIN] Auth error:", authError);
        setError(authError.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (data) {
        console.log("[LOGIN] Sign-in successful!");
        console.log("[LOGIN] Full response data:", JSON.stringify(data, null, 2));
        console.log("[LOGIN] User data:", JSON.stringify(data.user, null, 2));

        // Redirect based on user role
        const user = data.user as any;
        const redirectUrl = user?.role === "super_admin" ? "/admin" : "/dashboard";
        console.log("[LOGIN] User role:", user?.role);
        console.log("[LOGIN] Redirect URL:", redirectUrl);
        console.log("[LOGIN] Calling router.push...");

        router.push(redirectUrl);
        console.log("[LOGIN] router.push called, now calling router.refresh...");
        router.refresh(); // Clear Next.js cache for protected routes
        console.log("[LOGIN] router.refresh called");
      } else {
        console.warn("[LOGIN] No data returned from sign-in");
        setError("Login failed - no data returned");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("[LOGIN] Exception caught:", err);
      console.error("[LOGIN] Error type:", typeof err);
      console.error("[LOGIN] Error message:", err instanceof Error ? err.message : String(err));
      console.error("[LOGIN] Error stack:", err instanceof Error ? err.stack : "N/A");
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">AutoCrew</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-destructive font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Need access?{" "}
          <Link href="/contact-support" className="text-primary hover:underline">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
