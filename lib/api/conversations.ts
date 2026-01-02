import type { Conversation } from '@/types';

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "client_admin" | "viewer";
  clientId?: string;
}

function getMockUser(): MockUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('mockUser');
  return userStr ? JSON.parse(userStr) : null;
}

export async function getConversations(params?: {
  clientId?: string;
  crewId?: string;
}): Promise<{ conversations: Conversation[] }> {
  const searchParams = new URLSearchParams();
  if (params?.clientId) searchParams.append('clientId', params.clientId);
  if (params?.crewId) searchParams.append('crewId', params.crewId);

  // Add auth info from mock user (TODO: Replace with Better Auth session)
  const user = getMockUser();
  if (user) {
    searchParams.append('userRole', user.role);
    if (user.clientId) {
      searchParams.append('userClientId', user.clientId);
    }
  }

  const url = `/api/conversations${searchParams.toString() ? `?${searchParams}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to fetch conversations (${response.status})`);
  }

  const result = await response.json();
  return { conversations: result.data };
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const searchParams = new URLSearchParams();

  // Add auth info from mock user (TODO: Replace with Better Auth session)
  const user = getMockUser();
  if (user) {
    searchParams.append('userRole', user.role);
    if (user.clientId) {
      searchParams.append('userClientId', user.clientId);
    }
  }

  const url = `/api/conversations/${id}${searchParams.toString() ? `?${searchParams}` : ''}`;
  const response = await fetch(url);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch conversation');

  const result = await response.json();
  return result.data;
}
