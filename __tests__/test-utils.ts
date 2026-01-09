/**
 * Test Utilities and Mock Data Factories
 *
 * Provides reusable test helpers and mock data generators.
 */

import type { Client, Crew, Conversation, User, KnowledgeBaseDocument } from '@/types';

/**
 * Mock Data Factories
 */

export const mockClient: Client = {
  id: 'test-client-id',
  clientCode: 'TEST-001',
  slug: 'test-client',
  companyName: 'Test Company Inc',
  contactPersonName: 'John Doe',
  contactEmail: 'john@testcompany.com',
  phone: '+1234567890',
  plan: 'professional',
  status: 'active',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockUser: User = {
  id: 'test-user-id',
  email: 'testuser@example.com',
  name: 'Test User',
  role: 'client_admin',
  emailVerified: true,
  image: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockCrew: Crew = {
  id: 'test-crew-id',
  clientId: 'test-client-id',
  crewCode: 'CREW-001',
  name: 'Test Customer Support Crew',
  description: 'A test crew for customer support',
  type: 'customer_support',
  status: 'active',
  n8nWebhookUrl: 'https://example.com/webhook',
  databaseTableName: 'test_crew_conversations',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockConversation: Conversation = {
  id: 'test-conversation-id',
  clientId: 'test-client-id',
  crewId: 'test-crew-id',
  customerId: 'test-customer-id',
  customerName: 'Jane Customer',
  customerEmail: 'jane@customer.com',
  status: 'completed',
  startedAt: new Date('2024-01-01T10:00:00'),
  endedAt: new Date('2024-01-01T10:30:00'),
  messageCount: 5,
  sentiment: 'positive',
  summary: 'Customer inquiry about product features',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockKnowledgeBaseDocument: KnowledgeBaseDocument = {
  id: 'test-doc-id',
  crewId: 'test-crew-id',
  filename: 'test-document.pdf',
  fileSize: 1024000,
  fileType: 'application/pdf',
  uploadedBy: 'test-user-id',
  status: 'processed',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

/**
 * File Mock Helper
 * Creates a mock File object for testing file uploads
 */
export function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  const blob = new Blob(['a'.repeat(size)], { type });
  return new File([blob], name, { type });
}

/**
 * React Testing Library Wrapper
 * Can be extended with providers as needed
 */
export function renderWithProviders(ui: React.ReactElement) {
  // Currently just returns the element
  // Can be extended to wrap with Context providers, Router, etc.
  return ui;
}
