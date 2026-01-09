// Knowledge base and vector storage types

export interface KnowledgeBaseDocument {
  id: string;
  docId: string;           // Foreign key to vector table chunks
  clientId: string;        // Multi-tenant support
  crewId: string;          // Crew association
  filename: string;        // Original filename
  fileType: string;        // MIME type or extension
  fileSize: number | null; // File size in bytes
  chunkCount: number;      // Number of chunks in vector table
  status: 'indexed' | 'processing' | 'error';
  createdAt: Date;         // Upload timestamp
  updatedAt: Date;         // Last update timestamp
}

// Knowledge Base Document with chunks (for detail view)
export interface KnowledgeBaseDocumentWithChunks extends KnowledgeBaseDocument {
  chunks: VectorChunk[];
}

// Vector chunk from dynamic vector tables
export interface VectorChunk {
  id: string;
  content: string;
  metadata: {
    docId?: string;
    filename?: string;
    fileType?: string;
    fileSize?: number;
    chunkIndex?: number;
    [key: string]: unknown;
  };
  created_at: Date;
}

// Vector table row structure (based on crew provisioning pattern)
export interface VectorTableRow {
  id: string;
  content: string;         // Text chunk
  embedding: number[];     // Vector embedding
  metadata: {
    docId: string;         // Groups chunks from same document
    filename: string;
    fileType: string;
    uploadedAt: string;
    chunkIndex?: number;
    [key: string]: unknown;
  };
  created_at: Date;
}

export type DocumentStatus = 'indexed' | 'processing' | 'error';
