// Client and organization-related types

export interface Client {
  id: string;
  companyName: string;
  clientCode: string;
  slug: string;               // For Better Auth organization plugin
  contactPersonName: string;  // Renamed from "name"
  contactEmail: string;       // Renamed from "email"
  phone: string | null;       // OPTIONAL - matches database schema
  address: string | null;     // OPTIONAL - matches database schema
  city: string | null;        // OPTIONAL - matches database schema
  country: string | null;     // OPTIONAL - matches database schema
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "inactive" | "trial";
  createdAt: Date;
  updatedAt: Date;
}

export interface NewClientInput {
  companyName: string;
  contactPersonName: string;
  contactEmail: string;
  phone?: string | null;      // OPTIONAL - matches database schema
  address?: string | null;    // OPTIONAL - matches database schema
  city?: string | null;       // OPTIONAL - matches database schema
  country?: string | null;    // OPTIONAL - matches database schema
  plan: "starter" | "professional" | "enterprise";
  status?: "active" | "inactive" | "trial";
}

export interface CrewAssignment {
  id: string;
  clientId: string;
  crewId: string;
  assignedAt: Date;
  assignedBy: string;
}

export type ClientPlan = "starter" | "professional" | "enterprise";
export type ClientStatus = "active" | "inactive" | "trial";
