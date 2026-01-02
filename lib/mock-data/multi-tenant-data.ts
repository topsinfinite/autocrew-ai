import type { Client, AdminUser, CrewAssignment } from "@/types";

// Mock Clients (3-5 organizations)
export const mockClients: Client[] = [
  {
    id: "client-1",
    companyName: "Acme Corp",
    clientCode: "ACME-001",
    contactPersonName: "John Smith",
    contactEmail: "contact@acmecorp.com",
    phone: "+1-555-0101",
    address: "123 Business Ave",
    city: "San Francisco",
    country: "USA",
    plan: "enterprise",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "client-2",
    companyName: "TechStart",
    clientCode: "TECHSTART-001",
    contactPersonName: "Sarah Johnson",
    contactEmail: "hello@techstart.io",
    phone: "+1-555-0102",
    address: "456 Innovation Blvd",
    city: "Austin",
    country: "USA",
    plan: "professional",
    status: "active",
    createdAt: new Date("2024-03-22"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "client-3",
    companyName: "RetailCo Ltd",
    clientCode: "RETAILCO-001",
    contactPersonName: "Mike Chen",
    contactEmail: "info@retailco.com",
    plan: "starter",
    status: "trial",
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-12-29"),
  },
  {
    id: "client-4",
    companyName: "FinanceHub Solutions",
    clientCode: "FINANCEHUB-001",
    contactPersonName: "Lisa Williams",
    contactEmail: "support@financehub.com",
    phone: "+1-555-0104",
    address: "789 Finance Street",
    city: "New York",
    country: "USA",
    plan: "professional",
    status: "active",
    createdAt: new Date("2024-06-08"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "client-5",
    companyName: "HealthTech",
    clientCode: "HEALTHTECH-001",
    contactPersonName: "David Brown",
    contactEmail: "admin@healthtech.com",
    phone: "+1-555-0105",
    address: "321 Medical Plaza",
    city: "Boston",
    country: "USA",
    plan: "enterprise",
    status: "active",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-12-27"),
  },
];

// Mock Admin Users
export const mockAdminUsers: AdminUser[] = [
  // SuperAdmin (no client association)
  {
    id: "super-admin-1",
    clientId: "",
    email: "superadmin@autocrew.com",
    name: "Super Admin",
    role: "super_admin",
    createdAt: new Date("2024-01-01"),
  },

  // Client 1 - Acme Corporation admins
  {
    id: "admin-1",
    clientId: "client-1",
    email: "john.smith@acmecorp.com",
    name: "John Smith",
    role: "client_admin",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "viewer-1",
    clientId: "client-1",
    email: "jane.doe@acmecorp.com",
    name: "Jane Doe",
    role: "viewer",
    createdAt: new Date("2024-02-01"),
  },

  // Client 2 - TechStart admins
  {
    id: "admin-2",
    clientId: "client-2",
    email: "sarah.johnson@techstart.io",
    name: "Sarah Johnson",
    role: "client_admin",
    createdAt: new Date("2024-03-22"),
  },

  // Client 3 - RetailCo admins
  {
    id: "admin-3",
    clientId: "client-3",
    email: "mike.chen@retailco.com",
    name: "Mike Chen",
    role: "client_admin",
    createdAt: new Date("2024-11-10"),
  },

  // Client 4 - FinanceHub admins
  {
    id: "admin-4",
    clientId: "client-4",
    email: "lisa.williams@financehub.com",
    name: "Lisa Williams",
    role: "client_admin",
    createdAt: new Date("2024-06-08"),
  },

  // Client 5 - HealthTech admins
  {
    id: "admin-5",
    clientId: "client-5",
    email: "david.brown@healthtech.com",
    name: "David Brown",
    role: "client_admin",
    createdAt: new Date("2024-02-20"),
  },
];

// Mock Crew Assignments (which crews are assigned to which clients)
export const mockCrewAssignments: CrewAssignment[] = [
  // Client 1 - Acme Corp has 3 crews (2 Support, 1 LeadGen)
  {
    id: "assignment-1",
    clientId: "client-1",
    crewId: "crew-1",
    assignedAt: new Date("2024-01-15"),
    assignedBy: "super-admin-1",
  },
  {
    id: "assignment-2",
    clientId: "client-1",
    crewId: "crew-2",
    assignedAt: new Date("2024-01-16"),
    assignedBy: "super-admin-1",
  },
  {
    id: "assignment-3",
    clientId: "client-1",
    crewId: "crew-3",
    assignedAt: new Date("2024-02-01"),
    assignedBy: "super-admin-1",
  },

  // Client 2 - TechStart has 2 crews (1 Support, 1 LeadGen)
  {
    id: "assignment-4",
    clientId: "client-2",
    crewId: "crew-4",
    assignedAt: new Date("2024-03-22"),
    assignedBy: "super-admin-1",
  },
  {
    id: "assignment-5",
    clientId: "client-2",
    crewId: "crew-5",
    assignedAt: new Date("2024-03-25"),
    assignedBy: "super-admin-1",
  },

  // Client 3 - RetailCo has 1 crew (Support only - trial account)
  {
    id: "assignment-6",
    clientId: "client-3",
    crewId: "crew-6",
    assignedAt: new Date("2024-11-10"),
    assignedBy: "super-admin-1",
  },

  // Client 4 - FinanceHub has 2 crews (Support and LeadGen)
  {
    id: "assignment-7",
    clientId: "client-4",
    crewId: "crew-7",
    assignedAt: new Date("2024-06-08"),
    assignedBy: "super-admin-1",
  },
  {
    id: "assignment-8",
    clientId: "client-4",
    crewId: "crew-8",
    assignedAt: new Date("2024-06-15"),
    assignedBy: "super-admin-1",
  },

  // Client 5 - HealthTech has 3 crews (2 Support, 1 LeadGen)
  {
    id: "assignment-9",
    clientId: "client-5",
    crewId: "crew-9",
    assignedAt: new Date("2024-02-20"),
    assignedBy: "super-admin-1",
  },
  {
    id: "assignment-10",
    clientId: "client-5",
    crewId: "crew-10",
    assignedAt: new Date("2024-03-01"),
    assignedBy: "super-admin-1",
  },
];

// Helper functions
export function getClientById(clientId: string): Client | undefined {
  return mockClients.find((client) => client.id === clientId);
}

export function getAdminUsersByClientId(clientId: string): AdminUser[] {
  return mockAdminUsers.filter((user) => user.clientId === clientId);
}

export function getCrewAssignmentsByClientId(
  clientId: string
): CrewAssignment[] {
  return mockCrewAssignments.filter(
    (assignment) => assignment.clientId === clientId
  );
}

export function getClientsByStatus(
  status: Client["status"]
): Client[] {
  return mockClients.filter((client) => client.status === status);
}
