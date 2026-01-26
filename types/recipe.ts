/**
 * Recipe types for GraphQL queries
 */

import type { IngredientItem, IngredientImage } from './ingredient';

export interface Recipe {
  documentId: string;
  title: string;
  coverImage?: IngredientImage | null;
  ingredientItems?: IngredientItem[] | null;
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

