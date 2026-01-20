"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function SetupPasswordPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user is authenticated via magic link
  useEffect(() => {
    if (!isPending && !session) {
      // Not authenticated - redirect to login
      router.push("/login?error=unauthenticated");
    }
  }, [session, isPending, router]);

  const validatePassword = () => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to set password");
        setIsLoading(false);
        return;
      }

      // Success!
      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        const user = session?.user as any;
        const redirectUrl = user?.role === "super_admin" ? "/admin" : "/dashboard";
        router.push(redirectUrl);
        router.refresh();
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "Contains uppercase letter" },
    { met: /[a-z]/.test(password), text: "Contains lowercase letter" },
    { met: /[0-9]/.test(password), text: "Contains number" },
    { met: password === confirmPassword && password.length > 0, text: "Passwords match" },
  ];

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

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
          {success ? (
            // Success State
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Password Set Successfully!
              </h1>
              <p className="text-muted-foreground mb-6">
                Redirecting you to your dashboard...
              </p>
              <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center mb-2">
                Set Your Password
              </h1>
              <p className="text-center text-muted-foreground mb-8">
                Welcome, {session.user?.name || session.user?.email}! Create a secure password to complete your account setup.
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

              {/* Password Setup Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Password Requirements */}
                {password && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Password Requirements:</p>
                    {passwordRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            req.met ? "text-green-500" : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={req.met ? "text-green-500" : "text-muted-foreground"}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

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
                      Setting password...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  <strong>Security Tip:</strong> Choose a password you don't use anywhere else. Consider using a password manager to generate and store secure passwords.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
