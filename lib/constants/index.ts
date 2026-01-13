/**
 * Application-wide constants
 *
 * Centralized constants for routes, configuration, validation rules, and enums.
 * Use these instead of magic strings/numbers throughout the application.
 *
 * Usage: import { ROUTES, USER_ROLES, PAGINATION } from '@/lib/constants'
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
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  SETUP_PASSWORD: '/setup-password',
  ABOUT: '/about',
  CONTACT: '/contact',
  CONTACT_SUPPORT: '/contact-support',

  // Dashboard routes
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  CONVERSATIONS: '/conversations',
  CREWS: '/crews',
  SETTINGS: '/settings',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_USERS: '/admin/users',
  ADMIN_CREWS: '/admin/crews',
  ADMIN_SETTINGS: '/admin/settings',

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

export const API_ROUTES = {
  // Authentication
  AUTH: '/api/auth',
  AUTH_SETUP_PASSWORD: '/api/auth/setup-password',

  // Admin
  ADMIN_CREATE_CLIENT_ADMIN: '/api/admin/create-client-admin',
  ADMIN_RESEND_INVITATION: '/api/admin/resend-invitation',

  // Clients
  CLIENTS: '/api/clients',
  CLIENT_BY_ID: (id: string) => `/api/clients/${id}`,
  CLIENT_CREWS: (id: string) => `/api/clients/${id}/crews`,

  // Crews
  CREWS: '/api/crews',
  CREW_BY_ID: (id: string) => `/api/crews/${id}`,
  CREW_CONFIG: (id: string) => `/api/crews/${id}/config`,
  CREW_CONVERSATIONS: (id: string) => `/api/crews/${id}/conversations`,
  CREW_KNOWLEDGE_BASE: (id: string) => `/api/crews/${id}/knowledge-base`,
  CREW_KB_DOCUMENT: (crewId: string, docId: string) => `/api/crews/${crewId}/knowledge-base/${docId}`,

  // Conversations
  CONVERSATIONS: '/api/conversations',
  CONVERSATION_BY_ID: (id: string) => `/api/conversations/${id}`,

  // Leads
  LEADS: '/api/leads',
} as const;

// ============================================================================
// USER ROLES & PERMISSIONS
// ============================================================================

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  CLIENT_ADMIN: 'client_admin',
  VIEWER: 'viewer',
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.CLIENT_ADMIN]: 'Client Admin',
  [USER_ROLES.VIEWER]: 'Viewer',
} as const;

export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.SUPER_ADMIN]: 'Full platform access, can manage all clients',
  [USER_ROLES.CLIENT_ADMIN]: 'Access to organization data only',
  [USER_ROLES.VIEWER]: 'Read-only access',
} as const;

// ============================================================================
// CREW TYPES & STATUS
// ============================================================================

export const CREW_TYPES = {
  CUSTOMER_SUPPORT: 'customer_support',
  LEAD_GENERATION: 'lead_generation',
} as const;

export const CREW_TYPE_LABELS = {
  [CREW_TYPES.CUSTOMER_SUPPORT]: 'Customer Support',
  [CREW_TYPES.LEAD_GENERATION]: 'Lead Generation',
} as const;

export const CREW_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ERROR: 'error',
} as const;

export const CREW_STATUS_LABELS = {
  [CREW_STATUS.ACTIVE]: 'Active',
  [CREW_STATUS.INACTIVE]: 'Inactive',
  [CREW_STATUS.ERROR]: 'Error',
} as const;

// ============================================================================
// WIDGET CONFIGURATION
// ============================================================================

export const WIDGET_DEFAULTS = {
  PRIMARY_COLOR: '#0891b2',
  POSITION: 'bottom-right' as const,
  THEME: 'auto' as const,
  FIRST_LAUNCH_ACTION: 'none' as const,
  GREETING_DELAY: 3000,
  TITLE: 'Chat with us',
  SUBTITLE: '',
  WELCOME_MESSAGE: 'Hi! How can I help you today?',
} as const;

export const WIDGET_SCRIPT_URL = 'https://widget.autocrew.ai/widget.js';

export const WIDGET_POSITIONS = {
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
} as const;

export const WIDGET_THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

export const FIRST_LAUNCH_ACTIONS = {
  NONE: 'none',
  AUTO_OPEN: 'auto-open',
  SHOW_GREETING: 'show-greeting',
} as const;

// ============================================================================
// CLIENT PLANS & STATUS
// ============================================================================

export const CLIENT_PLANS = {
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const;

export const CLIENT_PLAN_LABELS = {
  [CLIENT_PLANS.STARTER]: 'Starter',
  [CLIENT_PLANS.PROFESSIONAL]: 'Professional',
  [CLIENT_PLANS.ENTERPRISE]: 'Enterprise',
} as const;

export const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TRIAL: 'trial',
} as const;

export const CLIENT_STATUS_LABELS = {
  [CLIENT_STATUS.ACTIVE]: 'Active',
  [CLIENT_STATUS.INACTIVE]: 'Inactive',
  [CLIENT_STATUS.TRIAL]: 'Trial',
} as const;

// ============================================================================
// CONVERSATION & LEAD STATUS
// ============================================================================

export const CONVERSATION_SENTIMENT = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
} as const;

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
} as const;

export const LEAD_STATUS_LABELS = {
  [LEAD_STATUS.NEW]: 'New',
  [LEAD_STATUS.CONTACTED]: 'Contacted',
  [LEAD_STATUS.QUALIFIED]: 'Qualified',
  [LEAD_STATUS.CONVERTED]: 'Converted',
} as const;

// ============================================================================
// KNOWLEDGE BASE
// ============================================================================

export const DOCUMENT_STATUS = {
  INDEXED: 'indexed',
  PROCESSING: 'processing',
  ERROR: 'error',
} as const;

export const DOCUMENT_STATUS_LABELS = {
  [DOCUMENT_STATUS.INDEXED]: 'Indexed',
  [DOCUMENT_STATUS.PROCESSING]: 'Processing',
  [DOCUMENT_STATUS.ERROR]: 'Error',
} as const;

// ============================================================================
// PAGINATION & LIMITS
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_OFFSET: 0,
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  // Password requirements
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true,

  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_FILE_TYPES: ['.pdf', '.txt', '.doc', '.docx', '.md', '.csv'] as const,
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown',
    'text/csv',
  ] as const,

  // String length constraints
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_COMPANY_NAME_LENGTH: 2,
  MAX_COMPANY_NAME_LENGTH: 100,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 20,
  MAX_ADDRESS_LENGTH: 200,
  MAX_CITY_LENGTH: 100,
  MAX_COUNTRY_LENGTH: 100,
  MAX_SLUG_LENGTH: 50,
  MIN_SLUG_LENGTH: 3,
  MAX_FILENAME_LENGTH: 255,
  MAX_MESSAGE_CONTENT_LENGTH: 10000,
  MAX_SEARCH_QUERY_LENGTH: 500,

  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Slug validation
  SLUG_REGEX: /^[a-z0-9-]+$/,
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
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // Authentication errors
  UNAUTHORIZED: 'You must be logged in to access this resource',
  FORBIDDEN: 'You do not have permission to access this resource',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',

  // Validation errors
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_UUID: 'Invalid ID format',

  // Generic errors
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NOT_FOUND: 'The requested resource was not found',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  CLIENT_CREATED: 'Client created successfully',
  CLIENT_UPDATED: 'Client updated successfully',
  CLIENT_DELETED: 'Client deleted successfully',

  CREW_CREATED: 'Crew created successfully',
  CREW_UPDATED: 'Crew updated successfully',
  CREW_DELETED: 'Crew deleted successfully',
  CREW_ACTIVATED: 'Crew activated successfully',
  CREW_DEACTIVATED: 'Crew deactivated successfully',

  USER_CREATED: 'User created successfully',
  INVITATION_SENT: 'Invitation sent successfully',
  INVITATION_RESENT: 'Invitation resent successfully',

  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',

  SETTINGS_SAVED: 'Settings saved successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET: 'Password reset email sent',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Helper types for const assertions
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type CrewType = typeof CREW_TYPES[keyof typeof CREW_TYPES];
export type CrewStatus = typeof CREW_STATUS[keyof typeof CREW_STATUS];
export type ClientPlan = typeof CLIENT_PLANS[keyof typeof CLIENT_PLANS];
export type ClientStatus = typeof CLIENT_STATUS[keyof typeof CLIENT_STATUS];
export type ConversationSentiment = typeof CONVERSATION_SENTIMENT[keyof typeof CONVERSATION_SENTIMENT];
export type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];
export type DocumentStatus = typeof DOCUMENT_STATUS[keyof typeof DOCUMENT_STATUS];
export type WidgetPosition = typeof WIDGET_POSITIONS[keyof typeof WIDGET_POSITIONS];
export type WidgetTheme = typeof WIDGET_THEMES[keyof typeof WIDGET_THEMES];
export type FirstLaunchAction = typeof FIRST_LAUNCH_ACTIONS[keyof typeof FIRST_LAUNCH_ACTIONS];
