/**
 * Recipe types for GraphQL queries
 */

export interface Recipe {
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface RecipesResponse {
  recipes: Recipe[];
}

export interface RecipeResponse {
  recipe: Recipe;
}

