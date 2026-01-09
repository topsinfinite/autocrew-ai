"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Client } from "@/types";

/**
 * Client Context - Client Component
 *
 * SECURITY UPDATE: This context no longer fetches data client-side.
 * Instead, it receives initialClients from the Server Component (DashboardLayout).
 * This follows the principle: "sensitive data must never cross into client components"
 *
 * Changes from previous version:
 * - Removed client-side API calls
 * - Removed Better Auth organization.list() call
 * - Now accepts server-fetched data as prop
 * - Active organization managed client-side via localStorage
 *
 * Benefits:
 * - Sensitive organization data stays on server
 * - Reduced client bundle size
 * - Better performance (no client-side fetches)
 * - Allows multiple tabs with different active organizations
 *
 * @see CODE_REVIEW_REPORT.md Issue #5, #6
 */

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
  initialClients: Client[]; // Server-fetched data
}

export function ClientProvider({ children, initialClients }: ClientProviderProps) {
  const [availableClients] = useState<Client[]>(initialClients);
  const [isLoading, setIsLoading] = useState(true);

  // Manage selected client in localStorage for persistence
  // This allows different tabs to have different active organizations
  const [selectedClient, setSelectedClientState] = useState<Client | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('activeOrganization');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // SECURITY: Verify the saved client is still in available clients
          // This prevents showing cached data from previous sessions (e.g., SuperAdmin session)
          const exists = initialClients.find(c => c.id === parsed.id);
          if (exists) {
            return parsed;
          } else {
            // Saved client is NOT in available clients - clear it
            console.warn('[ClientContext] Clearing invalid cached organization:', parsed.id);
            localStorage.removeItem('activeOrganization');
          }
        } catch {
          // Invalid JSON, clear it
          localStorage.removeItem('activeOrganization');
        }
      }
    }
    // Default to first available client
    return initialClients[0] || null;
  });

  // Update selectedClient wrapper that also updates localStorage
  const setSelectedClient = (client: Client | null) => {
    setSelectedClientState(client);
    if (typeof window !== 'undefined') {
      if (client) {
        localStorage.setItem('activeOrganization', JSON.stringify(client));
      } else {
        localStorage.removeItem('activeOrganization');
      }
    }
  };

  // Mark as loaded after initial render
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // SECURITY: Validate selectedClient when availableClients changes
  // This handles cases where:
  // 1. User switches accounts/sessions
  // 2. Permissions change server-side
  // 3. Organization membership is revoked
  useEffect(() => {
    if (selectedClient) {
      const isStillAvailable = availableClients.find(c => c.id === selectedClient.id);

      if (!isStillAvailable) {
        console.warn(
          '[ClientContext] Selected client is no longer available. Resetting to first available client.',
          {
            invalidClient: selectedClient.id,
            availableClients: availableClients.map(c => c.id)
          }
        );

        // Clear invalid selection
        localStorage.removeItem('activeOrganization');

        // Reset to first available client
        const newClient = availableClients[0] || null;
        setSelectedClientState(newClient);

        if (newClient && typeof window !== 'undefined') {
          localStorage.setItem('activeOrganization', JSON.stringify(newClient));
        }
      }
    }
  }, [availableClients, selectedClient]);

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
