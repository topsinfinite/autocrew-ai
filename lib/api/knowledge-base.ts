import type { KnowledgeBaseDocument } from '@/types';

/**
 * Upload a document to a crew's knowledge base
 * @param crewId - The crew ID
 * @param file - The file to upload
 * @returns Upload result with success flag and data
 */
export async function uploadDocument(
  crewId: string,
  file: File
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/crews/${crewId}/knowledge-base`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to upload document',
      };
    }

    return result;
  } catch (error) {
    console.error('Upload document error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error - unable to upload document',
    };
  }
}

/**
 * Get all documents in a crew's knowledge base
 * @param crewId - The crew ID
 * @returns List of knowledge base documents
 */
export async function getKnowledgeBaseDocuments(
  crewId: string
): Promise<{ success: boolean; data?: KnowledgeBaseDocument[]; count?: number; error?: string }> {
  try {
    const response = await fetch(`/api/crews/${crewId}/knowledge-base`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to retrieve documents',
      };
    }

    // Transform createdAt strings to Date objects
    if (result.data) {
      result.data = result.data.map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }));
    }

    return result;
  } catch (error) {
    console.error('Get knowledge base documents error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error - unable to retrieve documents',
    };
  }
}

/**
 * Delete a document from a crew's knowledge base
 * @param crewId - The crew ID
 * @param docId - The document ID to delete
 * @returns Deletion result with success flag
 */
export async function deleteKnowledgeBaseDocument(
  crewId: string,
  docId: string
): Promise<{ success: boolean; data?: { deletedChunks: number }; error?: string; message?: string }> {
  try {
    const response = await fetch(`/api/crews/${crewId}/knowledge-base/${docId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to delete document',
      };
    }

    return result;
  } catch (error) {
    console.error('Delete knowledge base document error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error - unable to delete document',
    };
  }
}
