/**
 * File Validator Tests
 *
 * Tests for file validation utilities used in knowledge base uploads.
 */

import { validateFile, formatFileSize, getMimeTypeLabel } from '@/lib/utils/validators/file-validator';
import { createMockFile } from '../../test-utils';

describe('validateFile', () => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  it('should validate correct PDF file', () => {
    const file = createMockFile('document.pdf', 1024000, 'application/pdf');
    const result = validateFile(file);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should validate correct DOCX file', () => {
    const file = createMockFile(
      'document.docx',
      1024000,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    const result = validateFile(file);

    expect(result.valid).toBe(true);
  });

  it('should validate correct TXT file', () => {
    const file = createMockFile('document.txt', 1024000, 'text/plain');
    const result = validateFile(file);

    expect(result.valid).toBe(true);
  });

  it('should validate correct Markdown file', () => {
    const file = createMockFile('document.md', 1024000, 'text/markdown');
    const result = validateFile(file);

    expect(result.valid).toBe(true);
  });

  it('should validate correct CSV file', () => {
    const file = createMockFile('data.csv', 1024000, 'text/csv');
    const result = validateFile(file);

    expect(result.valid).toBe(true);
  });

  it('should validate correct XLSX file', () => {
    const file = createMockFile(
      'data.xlsx',
      1024000,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    const result = validateFile(file);

    expect(result.valid).toBe(true);
  });

  it('should reject file exceeding size limit', () => {
    const file = createMockFile('large.pdf', MAX_FILE_SIZE + 1, 'application/pdf');
    const result = validateFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum');
  });

  it('should reject unsupported file type', () => {
    const file = createMockFile('image.jpg', 1024000, 'image/jpeg');
    const result = validateFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('not supported');
  });

  it('should reject empty files', () => {
    const file = createMockFile('empty.pdf', 0, 'application/pdf');
    const result = validateFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('should accept file at exact size limit', () => {
    const file = createMockFile('exact.pdf', MAX_FILE_SIZE, 'application/pdf');
    const result = validateFile(file);

    expect(result.valid).toBe(true);
  });
});

describe('formatFileSize', () => {
  it('should format bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(100)).toBe('100 Bytes');
    expect(formatFileSize(1023)).toBe('1023 Bytes');
  });

  it('should format kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10240)).toBe('10 KB');
  });

  it('should format megabytes correctly', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    expect(formatFileSize(10.5 * 1024 * 1024)).toBe('10.5 MB');
  });

  it('should format gigabytes correctly', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
  });

  it('should handle zero size', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });
});

describe('getMimeTypeLabel', () => {
  it('should return correct label for PDF', () => {
    expect(getMimeTypeLabel('application/pdf')).toBe('PDF');
  });

  it('should return correct label for DOCX', () => {
    expect(getMimeTypeLabel('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe('DOCX');
  });

  it('should return correct label for TXT', () => {
    expect(getMimeTypeLabel('text/plain')).toBe('Text');
  });

  it('should return correct label for Markdown', () => {
    expect(getMimeTypeLabel('text/markdown')).toBe('Markdown');
  });

  it('should return correct label for CSV', () => {
    expect(getMimeTypeLabel('text/csv')).toBe('CSV');
  });

  it('should return correct label for XLSX', () => {
    expect(getMimeTypeLabel('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')).toBe('Excel');
  });

  it('should return the MIME type itself for unsupported types', () => {
    expect(getMimeTypeLabel('image/jpeg')).toBe('image/jpeg');
    expect(getMimeTypeLabel('application/unknown')).toBe('application/unknown');
  });
});
