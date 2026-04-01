"use client";

import { createContext, useContext } from "react";

export interface ConsentPreferences {
  essential: true;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
}

export interface ConsentContextValue {
  consent: ConsentPreferences | null;
  hasConsented: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (prefs: Partial<ConsentPreferences>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  isPreferencesOpen: boolean;
}

export const ConsentContext = createContext<ConsentContextValue | undefined>(
  undefined,
);

export function useConsentContext() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsentContext must be used within a ConsentProvider");
  }
  return context;
}
