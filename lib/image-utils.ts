/**
 * Utility functions for handling Strapi image URLs
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Get the full URL for a Strapi image
 * Handles both absolute and relative URLs
 */
export function getStrapiImageUrl(url: string | undefined | null): string {
  if (!url) {
    return '';
  }

  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If relative URL, prepend Strapi base URL
  if (url.startsWith('/')) {
    return `${STRAPI_URL}${url}`;
  }

  // Otherwise, assume it's a path and prepend Strapi URL with /uploads
  return `${STRAPI_URL}/uploads/${url}`;
}

