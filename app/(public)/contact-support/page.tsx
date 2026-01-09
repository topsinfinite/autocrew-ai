"use client";

import { Zap, Mail, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactSupportPage() {
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
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-3">
            Contact Support
          </h1>
          <p className="text-center text-muted-foreground text-lg mb-8">
            We're here to help you get access to AutoCrew
          </p>

          {/* Support Email Section */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Email Support</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  For access requests, technical support, or general inquiries, please contact our support team:
                </p>
                <a
                  href="mailto:info@feattconsulting.com"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-lg"
                >
                  info@feattconsulting.com
                </a>
              </div>
            </div>
          </div>

          {/* Information Boxes */}
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold mb-2">🔐 Requesting Access</h3>
              <p className="text-sm text-muted-foreground">
                If you need access to AutoCrew, please email us with:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>• Your full name</li>
                <li>• Your organization name</li>
                <li>• Your role and reason for access</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold mb-2">⏱️ Response Time</h3>
              <p className="text-sm text-muted-foreground">
                Our support team typically responds within 24-48 hours during business days (Monday-Friday, 9 AM - 5 PM EST).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold mb-2">🏢 Existing Organization Members</h3>
              <p className="text-sm text-muted-foreground">
                If you're part of an existing organization, please contact your organization administrator first. They can invite you directly to your team.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1"
              asChild
            >
              <a href="mailto:info@feattconsulting.com?subject=AutoCrew Access Request" className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Send Email
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            AutoCrew - AI-Powered Automation Platform
          </p>
        </div>
      </div>
    </div>
  );
}
