'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { KnowledgeBaseUpload } from './knowledge-base-upload';
import { KnowledgeBaseList } from './knowledge-base-list';
import { getKnowledgeBaseDocuments } from '@/lib/api/knowledge-base';
import type { Crew, KnowledgeBaseDocument } from '@/types';
import { FileText, X } from 'lucide-react';

interface KnowledgeBaseManagerDialogProps {
  crew: Crew;
  isOpen: boolean;
  onClose: () => void;
}

export function KnowledgeBaseManagerDialog({
  crew,
  isOpen,
  onClose,
}: KnowledgeBaseManagerDialogProps) {
  const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load documents when dialog opens
  const loadDocuments = useCallback(async () => {
    console.log('[KB Manager] Loading documents for crew:', crew.id);
    setIsLoadingDocuments(true);
    setError(null);

    try {
      const result = await getKnowledgeBaseDocuments(crew.id);
      console.log('[KB Manager] Documents loaded:', result);

      if (result.success && result.data) {
        console.log('[KB Manager] Setting documents:', result.data.length, 'documents');
        setDocuments(result.data);
      } else {
        console.error('[KB Manager] Failed to load documents:', result.error);
        setError(result.error || 'Failed to load documents');
      }
    } catch (err) {
      console.error('[KB Manager] Error loading documents:', err);
      setError('Failed to load documents');
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [crew.id]);

  // Load documents when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen, loadDocuments]);

  // Handle upload success with delay to allow n8n processing
  const handleUploadSuccess = useCallback(() => {
    // N8n needs time to process (parse, chunk, embed, insert to vector table)
    // Wait 3 seconds before refreshing to allow processing to complete
    // Then retry every 2 seconds for up to 3 attempts
    let attempts = 0;
    const maxAttempts = 3;

    const checkForDocument = () => {
      attempts++;
      console.log(`[KB Manager] Refreshing documents (attempt ${attempts}/${maxAttempts})`);
      loadDocuments();

      if (attempts < maxAttempts) {
        setTimeout(checkForDocument, 2000);
      }
    };

    // Start first check after 3 seconds
    setTimeout(checkForDocument, 3000);
  }, [loadDocuments]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Knowledge Base: {crew.name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Upload and manage documents for your support crew
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Upload Document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add documents to train your support crew. Documents will be processed and
              indexed for AI-powered responses.
            </p>

            <KnowledgeBaseUpload
              crewId={crew.id}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={(err) => setError(err)}
            />
          </div>

          {/* Documents List Section */}
          <div>
            <KnowledgeBaseList
              crewId={crew.id}
              documents={documents}
              onDelete={loadDocuments}
              onRefresh={loadDocuments}
              isLoading={isLoadingDocuments}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
