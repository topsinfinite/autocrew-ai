/**
 * Slug Generation Utilities for Better Auth Organization Plugin
 *
 * These functions generate URL-friendly slugs from strings, following Better Auth requirements:
 * - 3-50 characters
 * - Lowercase letters, numbers, and hyphens only
 * - No leading/trailing hyphens
 */

/**
 * Convert a string to a URL-friendly slug
 * @param input - The input string (e.g., company name)
 * @returns A URL-friendly slug
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // Replace spaces and non-alphanumeric chars with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit to 50 characters
    .slice(0, 50)
    // Remove trailing hyphen if trimming created one
    .replace(/-+$/, '');
}

/**
 * Validate if a string is a valid slug
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]{3,50}$/;
  return slugRegex.test(slug) && !slug.startsWith('-') && !slug.endsWith('-');
}

/**
 * Generate a unique slug by appending a numeric suffix if needed
 * @param baseSlug - The base slug to make unique
 * @param checkExists - Async function that checks if a slug exists
 * @returns A unique slug
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    // Append counter, ensuring we don't exceed 50 chars
    const suffix = `-${counter}`;
    const maxBaseLength = 50 - suffix.length;
    slug = baseSlug.slice(0, maxBaseLength) + suffix;
    counter++;
  }

  return slug;
}
