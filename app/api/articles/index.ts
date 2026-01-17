import type { Article } from '@/types/article';

/**
 * Fetch all articles using REST API
 */
export async function getArticles(): Promise<Article[]> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  
  try {
    const res = await fetch(`${apiUrl}/api/articles?populate=*`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error('Failed to fetch articles:', res.statusText);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

