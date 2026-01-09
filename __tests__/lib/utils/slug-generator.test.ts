/**
 * Slug Generator Tests
 *
 * Tests for slug generation utilities used in Better Auth organization plugin.
 */

import {
  generateSlug,
  isValidSlug,
  generateUniqueSlug,
} from '@/lib/utils/generators/slug-generator';

describe('generateSlug', () => {
  it('should convert string to lowercase slug', () => {
    expect(generateSlug('Test Company')).toBe('test-company');
    expect(generateSlug('ACME Corporation')).toBe('acme-corporation');
  });

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('Multiple Word Name')).toBe('multiple-word-name');
  });

  it('should remove special characters', () => {
    expect(generateSlug('Test & Company!')).toBe('test-company');
    expect(generateSlug('Company@Email.com')).toBe('company-email-com');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(generateSlug(' Test Company ')).toBe('test-company');
    expect(generateSlug('---Test---')).toBe('test');
  });

  it('should limit length to 50 characters', () => {
    const longName = 'a'.repeat(100);
    const slug = generateSlug(longName);
    expect(slug.length).toBeLessThanOrEqual(50);
  });

  it('should handle empty strings', () => {
    expect(generateSlug('')).toBe('');
    expect(generateSlug('   ')).toBe('');
  });

  it('should handle numbers', () => {
    expect(generateSlug('Company 123')).toBe('company-123');
  });

  it('should collapse multiple hyphens', () => {
    expect(generateSlug('Test---Company')).toBe('test-company');
  });
});

describe('isValidSlug', () => {
  it('should validate correct slugs', () => {
    expect(isValidSlug('test-company')).toBe(true);
    expect(isValidSlug('acme-corp')).toBe(true);
    expect(isValidSlug('company-123')).toBe(true);
  });

  it('should reject slugs with uppercase letters', () => {
    expect(isValidSlug('Test-Company')).toBe(false);
  });

  it('should reject slugs with special characters', () => {
    expect(isValidSlug('test_company')).toBe(false);
    expect(isValidSlug('test@company')).toBe(false);
  });

  it('should reject slugs with leading or trailing hyphens', () => {
    expect(isValidSlug('-test-company')).toBe(false);
    expect(isValidSlug('test-company-')).toBe(false);
  });

  it('should reject slugs shorter than 3 characters', () => {
    expect(isValidSlug('ab')).toBe(false);
  });

  it('should reject slugs longer than 50 characters', () => {
    const longSlug = 'a'.repeat(51);
    expect(isValidSlug(longSlug)).toBe(false);
  });

  it('should accept minimum length slug', () => {
    expect(isValidSlug('abc')).toBe(true);
  });

  it('should accept maximum length slug', () => {
    const maxSlug = 'a'.repeat(50);
    expect(isValidSlug(maxSlug)).toBe(true);
  });
});

describe('generateUniqueSlug', () => {
  it('should return base slug if available', async () => {
    const checkExists = jest.fn().mockResolvedValue(false);
    const slug = await generateUniqueSlug('test-company', checkExists);

    expect(slug).toBe('test-company');
    expect(checkExists).toHaveBeenCalledWith('test-company');
    expect(checkExists).toHaveBeenCalledTimes(1);
  });

  it('should append counter if slug exists', async () => {
    const checkExists = jest.fn()
      .mockResolvedValueOnce(true)  // test-company exists
      .mockResolvedValueOnce(false); // test-company-1 available

    const slug = await generateUniqueSlug('test-company', checkExists);

    expect(slug).toBe('test-company-1');
    expect(checkExists).toHaveBeenCalledTimes(2);
  });

  it('should increment counter until unique slug is found', async () => {
    const checkExists = jest.fn()
      .mockResolvedValueOnce(true)  // test-company exists
      .mockResolvedValueOnce(true)  // test-company-1 exists
      .mockResolvedValueOnce(true)  // test-company-2 exists
      .mockResolvedValueOnce(false); // test-company-3 available

    const slug = await generateUniqueSlug('test-company', checkExists);

    expect(slug).toBe('test-company-3');
    expect(checkExists).toHaveBeenCalledTimes(4);
  });

  it('should respect 50 character limit when appending counter', async () => {
    const longBase = 'a'.repeat(48);
    const checkExists = jest.fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const slug = await generateUniqueSlug(longBase, checkExists);

    expect(slug.length).toBeLessThanOrEqual(50);
    expect(slug).toMatch(/-\d+$/); // Should end with -N
  });
});
