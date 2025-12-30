export type CrewType = "Support" | "LeadGen";

// Multi-tenant types
export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "inactive" | "trial";
  createdAt: Date;
  updatedAt: Date;
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

export interface Crew {
  id: string;
  clientId: string; // NEW: Multi-tenant support
  userId: string;
  name: string;
  type: CrewType;
  n8nWebhookUrl: string;
  status: "active" | "inactive" | "error";
  createdAt: Date;
  updatedAt: Date;
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
