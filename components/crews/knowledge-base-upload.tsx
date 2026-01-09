'use client';

import { useState, useRef } from 'react';
import { Upload, File, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateFile } from '@/lib/utils';
import { uploadDocument } from '@/lib/api/knowledge-base';

interface KnowledgeBaseUploadProps {
  crewId: string;
  onUploadSuccess: () => void;
  onUploadError?: (error: string) => void;
}

interface UploadingFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'processing' | 'error';
  error?: string;
  progress?: number;
}

export function KnowledgeBaseUpload({
  crewId,
  onUploadSuccess,
  onUploadError,
}: KnowledgeBaseUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const newUploadingFiles: UploadingFile[] = [];

    // Validate all files first
    for (const file of filesArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        newUploadingFiles.push({
          file,
          status: 'error',
          error: validation.error,
        });
      } else {
        newUploadingFiles.push({
          file,
          status: 'pending',
        });
      }
    }

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    // Start uploading valid files
    newUploadingFiles.forEach((uploadingFile) => {
      if (uploadingFile.status === 'pending') {
        handleUpload(uploadingFile.file);
      }
    });
  };

  const handleUpload = async (file: File) => {
    console.log('[Upload] Starting upload for:', file.name);

    // Update status to uploading
    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.file === file ? { ...f, status: 'uploading' as const } : f
      )
    );

    try {
      const result = await uploadDocument(crewId, file);
      console.log('[Upload] Upload result:', result);

      if (result.success) {
        // Update status to success (uploaded)
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.file === file ? { ...f, status: 'success' as const } : f
          )
        );

        // After 1 second, show processing status (n8n is working)
        setTimeout(() => {
          console.log('[Upload] Showing processing status for:', file.name);
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.file === file ? { ...f, status: 'processing' as const } : f
            )
          );
        }, 1000);

        // Notify parent component (which will refresh after delay)
        console.log('[Upload] Notifying parent of upload success');
        onUploadSuccess();

        // Remove from list after 10 seconds to allow n8n processing
        setTimeout(() => {
          console.log('[Upload] Removing upload status for:', file.name);
          setUploadingFiles((prev) => prev.filter((f) => f.file !== file));
        }, 10000);
      } else {
        // Update status to error
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, status: 'error' as const, error: result.error }
              : f
          )
        );

        if (onUploadError) {
          onUploadError(result.error || 'Upload failed');
        }
      }
    } catch (error) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? {
                ...f,
                status: 'error' as const,
                error: 'Network error - please try again',
              }
            : f
        )
      );

      if (onUploadError) {
        onUploadError('Network error - please try again');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const handleRetry = (file: File) => {
    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.file === file ? { ...f, status: 'pending' as const, error: undefined } : f
      )
    );
    handleUpload(file);
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv,.xlsx"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Upload Knowledge Base Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop files here, or click to browse
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Files
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Supported: PDF, DOCX, TXT, MD, CSV, XLSX (Max 10MB)
        </p>
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg bg-card"
            >
              <File className="w-5 h-5 text-muted-foreground flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {uploadingFile.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {uploadingFile.status === 'uploading' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Uploading...</span>
                  </>
                )}
                {uploadingFile.status === 'success' && (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-xs text-green-500">Uploaded!</span>
                  </>
                )}
                {uploadingFile.status === 'processing' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-xs text-blue-500">Processing...</span>
                  </>
                )}
                {uploadingFile.status === 'error' && (
                  <>
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRetry(uploadingFile.file)}
                    >
                      Retry
                    </Button>
                  </>
                )}
                {uploadingFile.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFile(uploadingFile.file)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Error Messages */}
          {uploadingFiles.some((f) => f.status === 'error') && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  {uploadingFiles
                    .filter((f) => f.status === 'error')
                    .map((f, i) => (
                      <p key={i} className="text-destructive">
                        <span className="font-medium">{f.file.name}:</span>{' '}
                        {f.error}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
