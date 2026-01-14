import type { Crew, NewCrewInput, CrewType, CrewStatus, WidgetSettings } from '@/types';
import type { ApiResponse } from '@/types/api';

/**
 * API Helper Functions for Crew Management
 * These functions provide a clean interface to interact with the crew API
 */

const API_BASE = '/api/crews';

/**
 * Get all crews with optional filtering
 * @param params - Optional filter parameters
 * @returns Promise<Crew[]>
 */
export async function getCrews(params?: {
  clientId?: string;
  type?: CrewType;
  status?: CrewStatus;
  sortBy?: string;
  order?: 'asc' | 'desc';
}): Promise<Crew[]> {
  const searchParams = new URLSearchParams();

  if (params?.clientId) searchParams.append('clientId', params.clientId);
  if (params?.type) searchParams.append('type', params.type);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.order) searchParams.append('order', params.order);

  const url = searchParams.toString()
    ? `${API_BASE}?${searchParams.toString()}`
    : API_BASE;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch crews');
  }

  const result: ApiResponse<Crew[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch crews');
  }

  return result.data;
}

/**
 * Get a single crew by ID
 * @param id - Crew ID
 * @returns Promise<Crew | null>
 */
export async function getCrewById(id: string): Promise<Crew | null> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch crew');
  }

  const result: ApiResponse<Crew> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch crew');
  }

  return result.data;
}

/**
 * Create a new crew
 * This will automatically:
 * - Generate a unique crew code (e.g., ACME-001-SUP-001)
 * - Create vector and histories tables for customer_support crews
 * - Populate the config JSONB with table names
 *
 * @param data - Crew data
 * @returns Promise<Crew>
 */
export async function createCrew(data: NewCrewInput): Promise<Crew> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Crew> = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to create crew');
  }

  return result.data;
}

/**
 * Update a crew
 * Note: Only name, status, and webhookUrl can be updated
 * Fields type, clientId, crewCode, and config are immutable
 *
 * @param id - Crew ID
 * @param data - Partial crew data to update
 * @returns Promise<Crew>
 */
export async function updateCrew(
  id: string,
  data: Partial<Pick<NewCrewInput, 'name' | 'status' | 'webhookUrl'>>
): Promise<Crew> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Crew> = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to update crew');
  }

  return result.data;
}

/**
 * Update crew configuration (support_email, support_client_name, agent_name, allowed_domain)
 * @param id - Crew ID
 * @param supportEmail - Support email address
 * @param supportClientName - Support client name
 * @param agentName - AI agent display name
 * @param allowedDomain - Allowed domain for chatbot embedding
 * @returns Promise<Crew>
 */
export async function updateCrewConfig(
  id: string,
  supportEmail: string,
  supportClientName: string,
  agentName: string,
  allowedDomain: string
): Promise<Crew> {
  const response = await fetch(`${API_BASE}/${id}/config`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ supportEmail, supportClientName, agentName, allowedDomain }),
  });

  const result: ApiResponse<Crew> = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to update crew configuration');
  }

  return result.data;
}

/**
 * Update crew widget settings
 * @param id - Crew ID
 * @param widgetSettings - Widget customization settings
 * @returns Promise<Crew>
 */
export async function updateCrewWidgetSettings(
  id: string,
  widgetSettings: WidgetSettings
): Promise<Crew> {
  const response = await fetch(`${API_BASE}/${id}/config`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ widgetSettings }),
  });

  const result: ApiResponse<Crew> = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to update widget settings');
  }

  return result.data;
}

/**
 * Delete a crew
 * This will automatically:
 * - Delete the crew record
 * - Drop associated vector and histories tables
 *
 * @param id - Crew ID
 * @returns Promise<void>
 */
export async function deleteCrew(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  const result: ApiResponse<void> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to delete crew');
  }
}

/**
 * Get all crews for a specific client
 * @param clientCode - Client code (e.g., "ACME-001")
 * @returns Promise<Crew[]>
 */
export async function getCrewsByClient(clientCode: string): Promise<Crew[]> {
  const response = await fetch(`/api/clients/${clientCode}/crews`);

  if (response.status === 404) {
    throw new Error(`Client not found: ${clientCode}`);
  }

  if (!response.ok) {
    throw new Error('Failed to fetch client crews');
  }

  const result: ApiResponse<Crew[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch client crews');
  }

  return result.data;
}
