/**
 * Knowledge Base validation schemas
 *
 * Provides Zod schemas for knowledge base document operations including
 * file uploads, document management, and search.
 */

import { z } from 'zod';

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
  'text/csv',
] as const;

const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.txt', '.doc', '.docx', '.md', '.csv'] as const;

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// File upload schema (for FormData validation)
export const uploadFileSchema = z.object({
  crewId: z.string().uuid('Invalid crew ID'),
  file: z.custom<File>((val) => val instanceof File, {
    message: 'File is required',
  })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    })
    .refine(
      (file) => {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        const hasValidType = ALLOWED_FILE_TYPES.includes(fileType as any);
        const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
        return hasValidType || hasValidExtension;
      },
      {
        message: `File type must be one of: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
      }
    ),
});

// Create knowledge base document schema (for API)
export const createKnowledgeBaseDocumentSchema = z.object({
  docId: z.string()
    .min(1, 'Document ID is required'),
  clientId: z.string()
    .min(1, 'Client ID is required'),
  crewId: z.string()
    .uuid('Invalid crew ID'),
  filename: z.string()
    .min(1, 'Filename is required')
    .max(255, 'Filename must be at most 255 characters'),
  fileType: z.string()
    .min(1, 'File type is required'),
  fileSize: z.number()
    .int('File size must be an integer')
    .min(0, 'File size must be positive')
    .max(MAX_FILE_SIZE, `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    .optional()
    .nullable(),
  chunkCount: z.number()
    .int('Chunk count must be an integer')
    .min(0, 'Chunk count must be positive')
    .default(0),
  status: z.enum(['indexed', 'processing', 'error']).default('indexed'),
});

// Update knowledge base document schema
export const updateKnowledgeBaseDocumentSchema = z.object({
  id: z.string().uuid('Invalid document ID'),
  status: z.enum(['indexed', 'processing', 'error']).optional(),
  chunkCount: z.number()
    .int('Chunk count must be an integer')
    .min(0, 'Chunk count must be positive')
    .optional(),
});

// Delete knowledge base document schema
export const deleteKnowledgeBaseDocumentSchema = z.object({
  id: z.string().uuid('Invalid document ID'),
  crewId: z.string().uuid('Invalid crew ID'),
});

// Query/filter schema for listing documents
export const knowledgeBaseFilterSchema = z.object({
  crewId: z.string().uuid('Invalid crew ID').optional(),
  clientId: z.string().optional(),
  status: z.enum(['indexed', 'processing', 'error']).optional(),
  search: z.string().optional(), // For searching by filename
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Search documents schema
export const searchDocumentsSchema = z.object({
  crewId: z.string().uuid('Invalid crew ID'),
  query: z.string()
    .min(1, 'Search query is required')
    .max(500, 'Search query must be at most 500 characters'),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// Type inference
export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type CreateKnowledgeBaseDocumentInput = z.infer<typeof createKnowledgeBaseDocumentSchema>;
export type UpdateKnowledgeBaseDocumentInput = z.infer<typeof updateKnowledgeBaseDocumentSchema>;
export type DeleteKnowledgeBaseDocumentInput = z.infer<typeof deleteKnowledgeBaseDocumentSchema>;
export type KnowledgeBaseFilterInput = z.infer<typeof knowledgeBaseFilterSchema>;
export type SearchDocumentsInput = z.infer<typeof searchDocumentsSchema>;

// Export constants for use in components
export const KB_MAX_FILE_SIZE = MAX_FILE_SIZE;
export const KB_ALLOWED_FILE_TYPES = ALLOWED_FILE_TYPES;
export const KB_ALLOWED_FILE_EXTENSIONS = ALLOWED_FILE_EXTENSIONS;
