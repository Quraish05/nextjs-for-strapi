import { executeGraphQL } from '@/lib/graphql-server';
import {
  GET_INGREDIENTS,
  GET_INGREDIENT,
  GET_INGREDIENT_BY_SLUG,
} from '@/graphql/ingredients';
import type {
  Ingredient,
  IngredientsResponse,
  IngredientResponse,
} from '@/types/ingredient';
import { print } from 'graphql';

/**
 * Fetch all ingredients using GraphQL (Server-side)
 * This function can be used in Server Components
 * 
 * Check your terminal/console to see the GraphQL request logs
 */
export async function getIngredients(): Promise<Ingredient[]> {
  try {
    const data = await executeGraphQL<IngredientsResponse>({
      query: print(GET_INGREDIENTS),
      revalidate: 60, // Cache for 60 seconds
      operationName: 'GetIngredients',
    });

    return data?.ingredients || [];
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
}

/**
 * Fetch a single ingredient by ID using GraphQL (Server-side)
 * This function can be used in Server Components
 * 
 * Check your terminal/console to see the GraphQL request logs
 */
export async function getIngredient(id: string): Promise<Ingredient | null> {
  try {
    const data = await executeGraphQL<IngredientResponse>({
      query: print(GET_INGREDIENT),
      variables: { id },
      revalidate: 60,
      operationName: 'GetIngredient',
    });

    return data?.ingredient || null;
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    return null;
  }
}

/**
 * Fetch a single ingredient by slug using GraphQL (Server-side)
 * This function can be used in Server Components
 * 
 * Check your terminal/console to see the GraphQL request logs
 */
export async function getIngredientBySlug(
  slug: string
): Promise<Ingredient | null> {
  try {
    const data = await executeGraphQL<{ ingredients: Ingredient[] }>({
      query: print(GET_INGREDIENT_BY_SLUG),
      variables: { slug },
      revalidate: 60,
      operationName: 'GetIngredientBySlug',
    });

    return data?.ingredients?.[0] || null;
  } catch (error) {
    console.error('Error fetching ingredient by slug:', error);
    return null;
  }
}

