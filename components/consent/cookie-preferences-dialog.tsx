"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useConsent } from "@/lib/hooks/use-consent";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const CATEGORIES = [
  {
    key: "essential" as const,
    label: "Essential Cookies",
    description: "Required for the site to function. Always enabled.",
    locked: true,
  },
  {
    key: "analytics" as const,
    label: "Analytics Cookies",
    description: "Help us understand how you use Autocrew.",
    locked: false,
  },
  {
    key: "preferences" as const,
    label: "Preference Cookies",
    description: "Remember your settings and preferences.",
    locked: false,
  },
  {
    key: "marketing" as const,
    label: "Marketing Cookies",
    description: "Used for targeted advertising and campaign measurement.",
    locked: false,
  },
];

export function CookiePreferencesDialog() {
  const { consent, isPreferencesOpen, closePreferences, updateConsent, rejectAll } =
    useConsent();

  const [local, setLocal] = useState({
    analytics: false,
    preferences: false,
    marketing: false,
  });

  // Sync local state when dialog opens
  useEffect(() => {
    if (isPreferencesOpen && consent) {
      setLocal({
        analytics: consent.analytics,
        preferences: consent.preferences,
        marketing: consent.marketing,
      });
    } else if (isPreferencesOpen) {
      setLocal({ analytics: false, preferences: false, marketing: false });
    }
  }, [isPreferencesOpen, consent]);

  function handleSave() {
    updateConsent(local);
    closePreferences();
  }

  function handleRejectAll() {
    rejectAll();
    closePreferences();
  }

  return (
    <Dialog open={isPreferencesOpen} onOpenChange={closePreferences}>
      <DialogContent data-contextual-ai="off" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
          <DialogDescription>
            Manage how we use cookies on this site.
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-border/50">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {cat.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cat.description}
                </p>
              </div>
              <Switch
                checked={
                  cat.locked
                    ? true
                    : local[cat.key as keyof typeof local]
                }
                disabled={cat.locked}
                onCheckedChange={
                  cat.locked
                    ? undefined
                    : (checked) =>
                        setLocal((prev) => ({
                          ...prev,
                          [cat.key]: checked,
                        }))
                }
                aria-label={`Toggle ${cat.label}`}
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Read our full{" "}
          <Link
            href="/docs/privacy"
            className="text-primary hover:underline underline-offset-2"
          >
            Privacy Policy
          </Link>
        </p>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={handleRejectAll}>
            Reject All
          </Button>
          <Button variant="pill" size="pill-sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
