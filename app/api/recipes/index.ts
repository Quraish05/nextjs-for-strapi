import { apolloClient } from '@/lib/apollo-client';
import { GET_RECIPES, GET_RECIPE } from '@/graphql/recipes';
import type { Recipe, RecipesResponse, RecipeResponse } from '@/types/recipe';

/**
 * Fetch all recipes using GraphQL
 */
export async function getRecipes(): Promise<Recipe[]> {
  try {
    const { data } = await apolloClient.query<RecipesResponse>({
      query: GET_RECIPES,
      fetchPolicy: 'network-only', // Always fetch fresh data
    });

    return data?.recipes || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Fetch a single recipe by ID using GraphQL
 */
export async function getRecipe(id: string): Promise<Recipe | null> {
  try {
    const { data } = await apolloClient.query<RecipeResponse>({
      query: GET_RECIPE,
      variables: { id },
      fetchPolicy: 'network-only',
    });

    return data?.recipe || null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

