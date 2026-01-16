// Crew and crew configuration types

export type CrewType = "customer_support" | "lead_generation";
export type CrewStatus = "active" | "inactive" | "error";

// Widget customization types
export type WidgetPosition = "bottom-right" | "bottom-left";
export type WidgetTheme = "light" | "dark" | "auto";
export type FirstLaunchAction = "none" | "auto-open" | "show-greeting";

// Suggested action for quick actions in chat widget
export interface SuggestedAction {
  label: string;   // Button text displayed to user
  message: string; // Message sent when button is clicked
}

export interface WidgetSettings {
  // Appearance
  primaryColor?: string; // Hex color e.g., "#0891b2"
  position?: WidgetPosition; // Default: 'bottom-right'
  theme?: WidgetTheme; // Default: 'auto'

  // Branding
  widgetTitle?: string; // e.g., "Chat with us"
  widgetSubtitle?: string; // e.g., "We reply within minutes"

  // Behavior
  welcomeMessage?: string; // First message from bot
  firstLaunchAction?: FirstLaunchAction; // Default: 'none'
  greetingDelay?: number; // ms before showing greeting bubble

  // Quick actions
  suggestedActions?: SuggestedAction[]; // Quick action buttons shown on first open

  // Disclaimer
  disclaimer?: string; // Disclaimer text shown above input
}

// Activation wizard step state
export interface CrewActivationState {
  documentsUploaded: boolean;
  supportConfigured: boolean;
  activationReady: boolean;
}

export interface CrewConfig {
  vectorTableName?: string;
  historiesTableName?: string;
  metadata?: {
    support_email?: string;
    support_client_name?: string;
    agent_name?: string;
    allowed_domain?: string;
    origin_hash?: string;
    [key: string]: unknown;
  };
  widgetSettings?: WidgetSettings;
  activationState?: CrewActivationState;
}

export interface Crew {
  id: string;
  clientId: string; // Multi-tenant support - references clients.clientCode
  crewCode: string; // Auto-generated unique code (e.g., "ACME-001-SUP-001")
  name: string;
  type: CrewType;
  config: CrewConfig; // JSONB field with dynamic table names
  webhookUrl: string; // n8n webhook URL
  status: CrewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewCrewInput {
  name: string;
  clientId: string;
  type: CrewType;
  webhookUrl: string;
  status?: CrewStatus;
}
