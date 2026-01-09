// n8n webhook integration types

export interface N8nUploadResponse {
  status: 'success' | 'error';
  message: string;
  statusCode?: number;     // For error responses
  metadata?: {
    crew_code: string;
    client_id: string;
    vector_table: string;
    doc_id?: string;       // Document ID
    timestamp: string;
  };
  document?: {
    status: 'indexed';
    chunk_count?: number;  // Number of chunks created
    embeddings_model: 'text-embedding-3-small';
  };
}

export type N8nResponseStatus = 'success' | 'error';
