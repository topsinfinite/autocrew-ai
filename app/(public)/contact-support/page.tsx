"use client";

import { Mail, MessageSquare, ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { APP_CONFIG } from "@/lib/constants";

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo height={29} className="text-foreground" />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold font-space-grotesk tracking-tight text-center mb-3">
            Contact Support
          </h1>
          <p className="text-center text-muted-foreground text-lg font-geist mb-8">
            We're here to help you get access to Autocrew
          </p>

          {/* Support Email Section */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold font-space-grotesk mb-2">
                  Email Support
                </h2>
                <p className="text-sm text-muted-foreground font-geist mb-3">
                  For access requests, technical support, or general inquiries,
                  please contact our support team:
                </p>
                <a
                  href="mailto:support@autocrew-ai.com"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-lg font-geist"
                >
                  support@autocrew-ai.com
                </a>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold font-space-grotesk mb-2">
                  Phone
                </h2>
                <p className="text-sm text-muted-foreground font-geist mb-3">
                  Prefer to talk? Reach us during business hours.
                </p>
                <a
                  href={APP_CONFIG.supportPhoneTel}
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-lg font-geist"
                >
                  {APP_CONFIG.supportPhoneDisplay}
                </a>
                <p className="text-xs text-muted-foreground font-geist mt-2">
                  {APP_CONFIG.supportPhoneHours}
                </p>
              </div>
            </div>
          </div>

          {/* Information Boxes */}
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold font-space-grotesk mb-2">
                Requesting Access
              </h3>
              <p className="text-sm text-muted-foreground font-geist">
                If you need access to Autocrew, please email us with:
              </p>
              <ul className="text-sm text-muted-foreground font-geist mt-2 space-y-1 ml-4">
                <li>Your full name</li>
                <li>Your organization name</li>
                <li>Your role and reason for access</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold font-space-grotesk mb-2">
                Response Time
              </h3>
              <p className="text-sm text-muted-foreground font-geist">
                Our support team typically responds within 24-48 hours during
                business days (Monday-Friday, 9 AM - 5 PM EST).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold font-space-grotesk mb-2">
                Existing Organization Members
              </h3>
              <p className="text-sm text-muted-foreground font-geist">
                If you're part of an existing organization, please contact your
                organization administrator first. They can invite you directly
                to your team.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Button
              variant="pill"
              size="pill-md"
              className="flex-1 min-w-[140px]"
              asChild
            >
              <a href="mailto:support@autocrew-ai.com?subject=Autocrew Access Request">
                <Mail className="h-4 w-4" />
                Send Email
              </a>
            </Button>
            <Button
              variant="pill-outline"
              size="pill-md"
              className="flex-1 min-w-[140px]"
              asChild
            >
              <a href={APP_CONFIG.supportPhoneTel}>
                <Phone className="h-4 w-4" />
                Call us
              </a>
            </Button>
            <Button
              variant="pill-outline"
              size="pill-md"
              className="flex-1 min-w-[140px]"
              asChild
            >
              <Link href="https://app.autocrew-ai.com/login">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground font-geist">
          <p>Autocrew - AI-Powered Automation Platform</p>
        </div>
      </div>
    </div>
  );
}
