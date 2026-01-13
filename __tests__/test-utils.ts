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
  address: null,
  city: null,
  country: null,
  plan: 'professional',
  status: 'active',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockUser: User = {
  id: 'test-user-id',
  email: 'testuser@example.com',
  name: 'Test User',
  createdAt: new Date('2024-01-01'),
};

export const mockCrew: Crew = {
  id: 'test-crew-id',
  clientId: 'test-client-id',
  crewCode: 'CREW-001',
  name: 'Test Customer Support Crew',
  type: 'customer_support',
  config: {
    vectorTableName: 'test_vector_table',
    historiesTableName: 'test_histories_table',
    metadata: {},
    activationState: {
      documentsUploaded: false,
      supportConfigured: false,
      activationReady: false,
    },
  },
  webhookUrl: 'https://example.com/webhook',
  status: 'active',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockConversation: Conversation = {
  id: 'test-conversation-id',
  clientId: 'test-client-id',
  crewId: 'test-crew-id',
  userId: 'test-user-id',
  transcript: [
    {
      role: 'user',
      content: 'Hello, I have a question about your product.',
      timestamp: new Date('2024-01-01T10:00:00'),
    },
    {
      role: 'assistant',
      content: 'Hi! I would be happy to help. What would you like to know?',
      timestamp: new Date('2024-01-01T10:01:00'),
    },
  ],
  metadata: {
    customerName: 'Jane Customer',
    customerEmail: 'jane@customer.com',
    sentiment: 'positive',
    resolved: true,
    duration: 1800,
  },
  createdAt: new Date('2024-01-01'),
};

export const mockKnowledgeBaseDocument: KnowledgeBaseDocument = {
  id: 'test-doc-id',
  docId: 'test-doc-uuid',
  clientId: 'test-client-id',
  crewId: 'test-crew-id',
  filename: 'test-document.pdf',
  fileType: 'application/pdf',
  fileSize: 1024000,
  chunkCount: 5,
  status: 'indexed',
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
