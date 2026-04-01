"use client";

import { useConsentContext } from "@/lib/contexts/consent-context";

export function useConsent() {
  return useConsentContext();
}
