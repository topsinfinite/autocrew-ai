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
import { FileText, Upload, FolderOpen, AlertCircle } from 'lucide-react';

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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Elegant Header with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 px-6 pt-6 pb-4 border-b border-border/50">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">Knowledge Base</DialogTitle>
                <DialogDescription className="text-sm mt-0.5">
                  {crew.name} - Train your AI with documents
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Upload Document</h4>
            </div>
            <p className="text-sm text-muted-foreground">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <FolderOpen className="h-4 w-4 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Uploaded Documents</h4>
            </div>

            <KnowledgeBaseList
              crewId={crew.id}
              documents={documents}
              onDelete={loadDocuments}
              onRefresh={loadDocuments}
              isLoading={isLoadingDocuments}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
          <div className="flex items-center justify-end">
            <Button onClick={onClose} className="px-6">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
