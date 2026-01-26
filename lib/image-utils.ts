/**
 * Utility functions for handling Strapi image URLs
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Get the full URL for a Strapi image
 * Handles both absolute and relative URLs
 * Removes query parameters to avoid conflicts with Next.js Image optimization
 */
export function getStrapiImageUrl(url: string | undefined | null): string {
  if (!url) {
    return '';
  }

  let cleanUrl = url;

  // Remove query parameters if present (they can conflict with Next.js Image optimization)
  const queryIndex = cleanUrl.indexOf('?');
  if (queryIndex !== -1) {
    cleanUrl = cleanUrl.substring(0, queryIndex);
  }

  // If already absolute URL, return as is (without query params)
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  // If relative URL, prepend Strapi base URL
  if (cleanUrl.startsWith('/')) {
    return `${STRAPI_URL}${cleanUrl}`;
  }

  // Otherwise, assume it's a path and prepend Strapi URL with /uploads
  return `${STRAPI_URL}/uploads/${cleanUrl}`;
}

