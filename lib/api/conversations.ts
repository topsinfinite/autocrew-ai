import type { Conversation } from '@/types';

/**
 * Fetch conversations from the API
 *
 * Authentication is handled server-side by the API route.
 * The API route uses Better Auth session to determine user role and access.
 * No need to pass auth info from client-side.
 */
export async function getConversations(params?: {
  clientId?: string;
  crewId?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}): Promise<{ conversations: Conversation[]; count: number }> {
  const searchParams = new URLSearchParams();
  if (params?.clientId) searchParams.append('clientId', params.clientId);
  if (params?.crewId) searchParams.append('crewId', params.crewId);
  if (params?.fromDate) searchParams.append('fromDate', params.fromDate.toISOString());
  if (params?.toDate) searchParams.append('toDate', params.toDate.toISOString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());

  const url = `/api/conversations${searchParams.toString() ? `?${searchParams}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to fetch conversations (${response.status})`);
  }

  const result = await response.json();
  return { conversations: result.data, count: result.count || result.data.length };
}

/**
 * Fetch a single conversation by ID
 *
 * Authentication is handled server-side by the API route.
 * The API route uses Better Auth session to determine user role and access.
 */
export async function getConversationById(id: string): Promise<Conversation | null> {
  const url = `/api/conversations/${id}`;
  const response = await fetch(url);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch conversation');

  const result = await response.json();
  return result.data;
}
