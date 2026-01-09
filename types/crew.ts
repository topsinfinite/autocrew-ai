// Crew and crew configuration types

export type CrewType = "customer_support" | "lead_generation";
export type CrewStatus = "active" | "inactive" | "error";

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
    [key: string]: unknown;
  };
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
