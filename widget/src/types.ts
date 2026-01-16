/**
 * Metadata passed to n8n Chat Trigger
 */
export interface ChatMetadata {
  client_id: string;
  crew_code: string;
  agent_name?: string;
  environment?: string;
  [key: string]: unknown;
}

/**
 * Suggested action button configuration
 */
export interface SuggestedAction {
  label: string;   // Button text displayed to user
  message: string; // Message sent when button is clicked
}

/**
 * AutoCrew Widget Configuration
 * Read from window.AutoCrewConfig
 */
export interface AutoCrewConfig {
  // Required
  webhookUrl: string;
  crewCode: string;
  clientId: string;

  // n8n metadata (optional - auto-generated from crewCode/clientId if not provided)
  metadata?: ChatMetadata;
  agentName?: string;

  // Appearance (optional)
  primaryColor?: string;
  position?: WidgetPosition;
  theme?: WidgetTheme;

  // Branding (optional)
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;

  // Behavior (optional)
  firstLaunchAction?: FirstLaunchAction;
  greetingDelay?: number;

  // Quick actions (optional)
  suggestedActions?: SuggestedAction[];

  // Disclaimer (optional)
  disclaimer?: string;
}

export type WidgetPosition = 'bottom-right' | 'bottom-left';
export type WidgetTheme = 'light' | 'dark' | 'auto';
export type FirstLaunchAction = 'none' | 'auto-open' | 'show-greeting';

/**
 * Internal widget state
 */
export interface WidgetState {
  isOpen: boolean;
  isLoading: boolean;
  messages: Message[];
  sessionId: string;
  error: string | null;
}

/**
 * Chat message
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * n8n Chat Trigger request format
 */
export interface ChatRequest {
  action: 'sendMessage';
  sessionId: string;
  chatInput: string;
  metadata?: ChatMetadata;
}

/**
 * n8n Chat Trigger response format
 */
export interface ChatResponse {
  output: string;
}

/**
 * Stored session data
 */
export interface StoredSession {
  sessionId: string;
  crewCode: string;
  messages: Message[];
  createdAt: number;
}

/**
 * Widget defaults
 */
export const WIDGET_DEFAULTS = {
  PRIMARY_COLOR: '#0891b2',
  POSITION: 'bottom-right' as WidgetPosition,
  THEME: 'auto' as WidgetTheme,
  TITLE: 'Chat with us',
  SUBTITLE: '',
  WELCOME_MESSAGE: 'Hi! How can I help you today?',
  FIRST_LAUNCH_ACTION: 'none' as FirstLaunchAction,
  GREETING_DELAY: 3000,
  SUGGESTED_ACTIONS: [] as SuggestedAction[],
  DISCLAIMER: '',
  SESSION_MAX_AGE: 4 * 60 * 60 * 1000, // 4 hours
  MESSAGE_DEBOUNCE: 500,
} as const;

/**
 * Extend Window interface
 */
declare global {
  interface Window {
    AutoCrewConfig?: AutoCrewConfig;
    __autocrewWidgetInitialized?: boolean;
  }
}
