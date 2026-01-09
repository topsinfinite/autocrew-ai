// Lead generation types

export interface Lead {
  id: string;
  clientId: string; // Multi-tenant support
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

export type LeadStatus = "new" | "contacted" | "qualified" | "converted";
