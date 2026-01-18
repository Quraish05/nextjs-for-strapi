/**
 * Ingredient types for GraphQL queries
 */

export type IngredientUnit = 'g' | 'kg' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'cup' | 'pcs';

export interface IngredientImage {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface BaseIngredient {
  documentId: string;
  name: string;
  slug: string;
  description?: any; // Rich text blocks
  image?: IngredientImage | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface IngredientItem {
  // Note: Components don't have documentId in Strapi
  quantity: number;
  unit: IngredientUnit;
  price?: number | null;
  required: boolean;
  notes?: any; // Rich text blocks
  baseIngredient?: BaseIngredient | null;
}

export interface Ingredient {
  documentId: string;
  name: string;
  slug: string;
  description?: any;
  image?: IngredientImage | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface IngredientsResponse {
  ingredients: Ingredient[];
}

export interface IngredientResponse {
  ingredient: Ingredient;
}

