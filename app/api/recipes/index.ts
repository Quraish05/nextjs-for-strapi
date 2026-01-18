import { executeGraphQL } from '@/lib/graphql-server';
import { GET_RECIPES, GET_RECIPE } from '@/graphql/recipes';
import type { Recipe, RecipesResponse, RecipeResponse } from '@/types/recipe';
import { print } from 'graphql';

/**
 * Fetch all recipes using GraphQL (Server-side)
 * This function can be used in Server Components
 * Data is cached for 60 seconds by default
 * 
 * Check your terminal/console to see the GraphQL request logs
 */
export async function getRecipes(): Promise<Recipe[]> {
  try {
    const data = await executeGraphQL<RecipesResponse>({
      query: print(GET_RECIPES),
      revalidate: 60, // Cache for 60 seconds
      operationName: 'GetRecipes',
    });

    return data?.recipes || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Fetch a single recipe by documentId using GraphQL (Server-side)
 * This function can be used in Server Components
 * Data is cached for 60 seconds by default
 * 
 * Check your terminal/console to see the GraphQL request logs
 */
export async function getRecipe(documentId: string): Promise<Recipe | null> {
  try {
    const data = await executeGraphQL<RecipeResponse>({
      query: print(GET_RECIPE),
      variables: { documentId },
      revalidate: 60, // Cache for 60 seconds
      operationName: 'GetRecipe',
    });

    return data?.recipe || null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}
