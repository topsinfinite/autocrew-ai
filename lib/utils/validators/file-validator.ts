const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file for upload based on type and size constraints
 * @param file - The File object to validate
 * @returns Object with valid flag and optional error message
 */
export function validateFile(file: File): FileValidationResult {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size (${sizeMB} MB) exceeds maximum allowed size of ${maxSizeMB} MB`,
    };
  }

  // Check for empty files
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    const fileExtension = getFileExtension(file.name);
    return {
      valid: false,
      error: `File type "${file.type || fileExtension}" is not supported. Allowed types: PDF, DOCX, TXT, MD, CSV, XLSX`,
    };
  }

  return {
    valid: true,
  };
}

/**
 * Extracts the file extension from a filename
 * @param filename - The filename to extract extension from
 * @returns The file extension (e.g., "pdf", "docx") or empty string if no extension
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  return filename.slice(lastDotIndex + 1).toLowerCase();
}

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "245 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Gets a user-friendly label for a MIME type
 * @param mimeType - The MIME type string
 * @returns Human-readable type label
 */
export function getMimeTypeLabel(mimeType: string): string {
  const mimeTypeMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/plain': 'Text',
    'text/markdown': 'Markdown',
    'text/csv': 'CSV',
    'application/vnd.ms-excel': 'Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  };

  return mimeTypeMap[mimeType] || mimeType;
}
