"use client";

import { useState } from "react";
import { Zap, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Use Better Auth client to request password reset
      const { data, error: authError } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (authError) {
        console.error("Password reset error:", authError);
        setError(authError.message || "Failed to send reset email");
        setIsLoading(false);
        return;
      }

      // Show success message even if user doesn't exist (security best practice)
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Forgot password error:", err);
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
            Forgot Password
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Enter your email and we'll send you a reset link
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

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-green-500 font-medium mb-1">
                  Check your email
                </p>
                <p className="text-xs text-green-500/80">
                  If an account exists with {email}, you will receive a password reset link shortly.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          {!success && (
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

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}

          {/* Return to Login Link */}
          {success && (
            <div className="mt-6">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Link href="/login">
                  Return to Login
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
