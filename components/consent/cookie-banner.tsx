"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useConsent } from "@/lib/hooks/use-consent";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const { hasConsented, acceptAll, openPreferences } = useConsent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasConsented) return;
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [hasConsented]);

  if (hasConsented || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 z-[90] sm:max-w-sm rounded-xl bg-card/80 backdrop-blur-xl border border-border/50 p-4 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-4 fade-in duration-500"
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        We use cookies to improve your experience.{" "}
        <Link
          href="/docs/privacy"
          className="text-primary hover:underline underline-offset-2"
        >
          Learn more
        </Link>
      </p>
      <div className="flex items-center justify-end gap-2 mt-3">
        <Button variant="ghost" size="sm" onClick={openPreferences}>
          Manage
        </Button>
        <Button variant="pill" size="pill-sm" onClick={acceptAll}>
          Accept All
        </Button>
      </div>
    </div>
  );
}
