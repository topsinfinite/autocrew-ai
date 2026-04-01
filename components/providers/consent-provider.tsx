"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ConsentContext,
  type ConsentPreferences,
} from "@/lib/contexts/consent-context";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

function updateGtagConsent(prefs: ConsentPreferences) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: prefs.analytics ? "granted" : "denied",
      ad_storage: prefs.marketing ? "granted" : "denied",
      ad_user_data: prefs.marketing ? "granted" : "denied",
      ad_personalization: prefs.marketing ? "granted" : "denied",
      functionality_storage: prefs.preferences ? "granted" : "denied",
    });
  }
}

const ALL_GRANTED: ConsentPreferences = {
  essential: true,
  analytics: true,
  preferences: true,
  marketing: true,
};

const ALL_DENIED: ConsentPreferences = {
  essential: true,
  analytics: false,
  preferences: false,
  marketing: false,
};

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useLocalStorage<ConsentPreferences | null>(
    "cookie-consent",
    null,
  );
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Restore consent for returning visitors
  useEffect(() => {
    if (consent) {
      updateGtagConsent(consent);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const acceptAll = useCallback(() => {
    setConsent(ALL_GRANTED);
    updateGtagConsent(ALL_GRANTED);
  }, [setConsent]);

  const rejectAll = useCallback(() => {
    setConsent(ALL_DENIED);
    updateGtagConsent(ALL_DENIED);
  }, [setConsent]);

  const updateConsent = useCallback(
    (prefs: Partial<ConsentPreferences>) => {
      const updated: ConsentPreferences = {
        ...ALL_DENIED,
        ...consent,
        ...prefs,
        essential: true,
      };
      setConsent(updated);
      updateGtagConsent(updated);
    },
    [consent, setConsent],
  );

  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasConsented: consent !== null,
        acceptAll,
        rejectAll,
        updateConsent,
        openPreferences,
        closePreferences,
        isPreferencesOpen,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
