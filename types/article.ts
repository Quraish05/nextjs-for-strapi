/**
 * Article types for REST API
 */

export interface Article {
  id: number;
  attributes: {
    title: string;
    content: string;
    slug: string;
    publishedAt: string;
  };
}

