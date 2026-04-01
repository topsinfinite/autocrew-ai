"use client";

import { useConsent } from "@/lib/hooks/use-consent";

export function CookiePreferencesButton({
  className,
}: {
  className?: string;
}) {
  const { openPreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className={className}
    >
      Cookie Preferences
    </button>
  );
}
