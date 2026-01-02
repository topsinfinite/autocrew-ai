export type CrewType = "customer_support" | "lead_generation";
export type CrewStatus = "active" | "inactive" | "error";

// Multi-tenant types
export interface Client {
  id: string;
  companyName: string;
  clientCode: string;
  contactPersonName: string;  // Renamed from "name"
  contactEmail: string;       // Renamed from "email"
  phone?: string;             // OPTIONAL
  address?: string;           // OPTIONAL
  city?: string;              // OPTIONAL
  country?: string;           // OPTIONAL
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "inactive" | "trial";
  createdAt: Date;
  updatedAt: Date;
}

export interface NewClientInput {
  companyName: string;
  contactPersonName: string;
  contactEmail: string;
  phone?: string;             // OPTIONAL
  address?: string;           // OPTIONAL
  city?: string;              // OPTIONAL
  country?: string;           // OPTIONAL
  plan: "starter" | "professional" | "enterprise";
  status?: "active" | "inactive" | "trial";
}

export interface AdminUser {
  id: string;
  clientId: string;
  email: string;
  name: string;
  role: "super_admin" | "client_admin" | "viewer";
  createdAt: Date;
}

export interface CrewAssignment {
  id: string;
  clientId: string;
  crewId: string;
  assignedAt: Date;
  assignedBy: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface CrewConfig {
  vectorTableName?: string;
  historiesTableName?: string;
  metadata?: Record<string, unknown>;
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

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  clientId: string; // NEW: Multi-tenant support
  crewId: string;
  userId: string;
  transcript: ConversationMessage[];
  metadata: {
    customerName?: string;
    customerEmail?: string;
    sentiment?: "positive" | "neutral" | "negative";
    resolved?: boolean;
    duration?: number; // in seconds
  };
  createdAt: Date;
}

export interface Lead {
  id: string;
  clientId: string; // NEW: Multi-tenant support
  crewId: string;
  email: string;
  name: string;
  data: {
    phone?: string;
    company?: string;
    position?: string;
    interest?: string;
    source?: string;
  };
  status: "new" | "contacted" | "qualified" | "converted";
  createdAt: Date;
}

export interface DashboardStats {
  totalCrews: number;
  activeCrews: number;
  totalConversations: number;
  totalLeads: number;
  conversationVolume: {
    date: string;
    count: number;
  }[];
  leadsGenerated: {
    date: string;
    count: number;
  }[];
}
