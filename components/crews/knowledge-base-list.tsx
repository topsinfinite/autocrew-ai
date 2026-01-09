'use client';

import { useState } from 'react';
import { Trash2, FileText, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatFileSize, getMimeTypeLabel } from '@/lib/utils';
import { deleteKnowledgeBaseDocument } from '@/lib/api/knowledge-base';
import type { KnowledgeBaseDocument } from '@/types';

interface KnowledgeBaseListProps {
  crewId: string;
  documents: KnowledgeBaseDocument[];
  onDelete: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function KnowledgeBaseList({
  crewId,
  documents,
  onDelete,
  onRefresh,
  isLoading = false,
}: KnowledgeBaseListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<KnowledgeBaseDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (document: KnowledgeBaseDocument) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteKnowledgeBaseDocument(crewId, documentToDelete.docId);

      if (result.success) {
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
        onDelete();
      } else {
        setDeleteError(result.error || 'Failed to delete document');
      }
    } catch (error) {
      setDeleteError('Network error - please try again');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
      setDeleteError(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (documents.length === 0 && !isLoading) {
    return (
      <div className="border border-dashed rounded-lg p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Upload your first knowledge base document to get started
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Check for Documents
        </Button>
      </div>
    );
  }

  if (documents.length === 0 && isLoading) {
    return (
      <div className="border border-dashed rounded-lg p-8 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
        <h3 className="text-lg font-medium mb-2">Checking for Documents...</h3>
        <p className="text-sm text-muted-foreground">
          Waiting for n8n to finish processing
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Knowledge Base Documents ({documents.length})
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Documents Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Chunks</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.docId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate max-w-xs">{document.filename}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getMimeTypeLabel(document.fileType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        document.status === 'indexed'
                          ? 'default'
                          : document.status === 'processing'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={
                        document.status === 'indexed'
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : document.status === 'processing'
                          ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                          : ''
                      }
                    >
                      {document.status === 'indexed' && '✓ '}
                      {document.status === 'processing' && '⏳ '}
                      {document.status === 'error' && '✗ '}
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(document.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{document.chunkCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {document.fileSize
                      ? formatFileSize(document.fileSize)
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(document)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete?.filename}"?
              This will remove all {documentToDelete?.chunkCount} chunks from the
              knowledge base and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{deleteError}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
