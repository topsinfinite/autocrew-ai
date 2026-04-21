const URL_PARAM = "contextual-ai";
const LOCAL_STORAGE_KEY = "contextual-ai:disabled";
const CONSENT_STORAGE_KEY = "cookie-consent";

export function isEnabled(): boolean {
  if (typeof window === "undefined") return false;

  // URL override has highest priority.
  const params = new URLSearchParams(window.location.search);
  const override = params.get(URL_PARAM);
  if (override === "on") return true;
  if (override === "off") return false;

  // localStorage per-visitor opt-out.
  try {
    if (window.localStorage.getItem(LOCAL_STORAGE_KEY) === "1") return false;
  } catch {
    // localStorage can throw in private browsing on some browsers.
  }

  // Build-time env flag. Default on when unset.
  const envFlag = process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED;
  if (envFlag === "false") return false;
  return true;
}

export function isStubEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB === "true";
}

interface StoredConsent {
  essential?: boolean;
  analytics?: boolean;
  preferences?: boolean;
  marketing?: boolean;
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const parsed: StoredConsent = JSON.parse(raw);
    return parsed.analytics === true;
  } catch {
    return false;
  }
}
