"use client";

import { Zap, UserX, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-2xl">
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
        <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-lg">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <UserX className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-3">
            Invitation Required
          </h1>
          <p className="text-center text-muted-foreground text-lg mb-8">
            AutoCrew is an invite-only platform
          </p>

          {/* Information Section */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
              AutoCrew uses a secure, invitation-based access model to ensure the highest level of security and quality for our clients.
            </p>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              New users must be invited by:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-blue-600 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Organization Administrator</strong> - Can invite users to their organization</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Platform SuperAdmin</strong> - Can create new organizations and invite admins</span>
              </li>
            </ul>
          </div>

          {/* How to Get Access */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold">How to Get Access:</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Existing Organization Member</h3>
                  <p className="text-sm text-muted-foreground">
                    If you're part of an existing client organization, contact your organization administrator to request an invitation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">New Organization</h3>
                  <p className="text-sm text-muted-foreground">
                    Interested in setting up AutoCrew for your organization? Reach out to our sales team to get started.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1"
              asChild
            >
              <Link href="/contact-support" className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link href="/login">
                Back to Login
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-center text-muted-foreground">
              Already received an invitation?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
