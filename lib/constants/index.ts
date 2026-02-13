/**
 * Application-wide constants
 */

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  name: 'AutoCrew',
  description: 'B2B digital labor platform for managing Agentic Crews',
  tagline: 'Automate your business with AI-powered crews',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: 'support@autocrew.ai',
} as const;

// ============================================================================
// ROUTE PATHS
// ============================================================================

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ABOUT: '/about',
  CONTACT: '/contact',
  CONTACT_SUPPORT: '/contact-support',

  // Documentation routes
  DOCS: '/docs',
  DOCS_GETTING_STARTED: '/docs/getting-started',
  DOCS_USER_GUIDE: '/docs/user-guide',
  DOCS_SUPPORT_CREW: '/docs/support-crew',
  DOCS_LEADGEN_CREW: '/docs/leadgen-crew',
  DOCS_FAQ: '/docs/faq',
  DOCS_PRIVACY: '/docs/privacy',
  DOCS_TERMS: '/docs/terms',
} as const;

// ============================================================================
// DATE & TIME FORMATS
// ============================================================================

export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_MESSAGE_CONTENT_LENGTH: 10000,
} as const;
