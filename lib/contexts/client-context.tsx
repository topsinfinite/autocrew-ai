"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Client } from "@/types";
import { getClientById, mockClients } from "@/lib/mock-data/multi-tenant-data";

export interface ClientContextValue {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  availableClients: Client[];
  isLoading: boolean;
}

export const ClientContext = createContext<ClientContextValue | undefined>(
  undefined
);

interface ClientProviderProps {
  children: React.ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const { user, isLoggedIn, isSuperAdmin } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine available clients based on user role
  const availableClients = isSuperAdmin
    ? mockClients // SuperAdmin can see all clients
    : user?.clientId
    ? [getClientById(user.clientId)].filter(Boolean) as Client[] // Client admin sees only their client
    : [];

  useEffect(() => {
    if (!isLoggedIn) {
      setSelectedClient(null);
      setIsLoading(false);
      return;
    }

    // Auto-select client for client admins
    if (user?.clientId && !isSuperAdmin) {
      const client = getClientById(user.clientId);
      setSelectedClient(client || null);
    } else if (isSuperAdmin && availableClients.length > 0 && !selectedClient) {
      // For super admin, default to first client if none selected
      setSelectedClient(availableClients[0]);
    }

    setIsLoading(false);
  }, [user, isLoggedIn, isSuperAdmin]);

  return (
    <ClientContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        availableClients,
        isLoading,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClientContext must be used within a ClientProvider");
  }
  return context;
}
