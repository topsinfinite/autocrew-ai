import type { Client, NewClientInput } from '@/types';
import type { ApiResponse } from '@/types/api';

/**
 * API Helper Functions for Client Management
 * These functions provide a clean interface to interact with the client API
 */

const API_BASE = '/api/clients';

/**
 * Get all clients with optional filtering
 * @param params - Optional filter parameters
 * @returns Promise<Client[]>
 */
export async function getClients(params?: {
  status?: 'active' | 'inactive' | 'trial';
  plan?: 'starter' | 'professional' | 'enterprise';
  sortBy?: string;
  order?: 'asc' | 'desc';
}): Promise<Client[]> {
  const searchParams = new URLSearchParams();

  if (params?.status) searchParams.append('status', params.status);
  if (params?.plan) searchParams.append('plan', params.plan);
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.order) searchParams.append('order', params.order);

  const url = searchParams.toString()
    ? `${API_BASE}?${searchParams.toString()}`
    : API_BASE;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }

  const result: ApiResponse<Client[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch clients');
  }

  return result.data;
}

/**
 * Get a single client by ID
 * @param id - Client ID
 * @returns Promise<Client | null>
 */
export async function getClientById(id: string): Promise<Client | null> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch client');
  }

  const result: ApiResponse<Client> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch client');
  }

  return result.data;
}

/**
 * Create a new client
 * @param data - Client data
 * @returns Promise<Client>
 */
export async function createClient(data: NewClientInput): Promise<Client> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Client> = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to create client');
  }

  return result.data;
}

/**
 * Update a client
 * @param id - Client ID
 * @param data - Partial client data to update
 * @returns Promise<Client>
 */
export async function updateClient(
  id: string,
  data: Partial<NewClientInput>
): Promise<Client> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Client> = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to update client');
  }

  return result.data;
}

/**
 * Delete a client
 * @param id - Client ID
 * @returns Promise<void>
 */
export async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  const result: ApiResponse<void> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to delete client');
  }
}
