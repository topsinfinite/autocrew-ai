"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { authClient } from "@/lib/auth-client";
import { Loader2, AlertCircle, CheckCircle2, User, Mail, Shield, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validate password
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);

    try {
      const { data, error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: false,
      });

      if (error) {
        setPasswordError(error.message || "Failed to change password");
        setIsChangingPassword(false);
        return;
      }

      if (data) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p className="text-base mt-1">{user.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <p className="text-base mt-1">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </label>
              <p className="text-base mt-1 capitalize">
                {user.role.replace("_", " ")}
              </p>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">Email verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-500">Email not verified</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Success Alert */}
            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-500">
                  Password changed successfully!
                </p>
              </div>
            )}

            {/* Error Alert */}
            {passwordError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{passwordError}</p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  disabled={isChangingPassword}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={isChangingPassword}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={isChangingPassword}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Actions Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account and session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
