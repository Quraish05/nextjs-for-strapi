import { executeGraphQL } from '@/lib/graphql-server';
import { GET_MEAL_PREP_PLANS, GET_MEAL_PREP_PLAN, GET_MEAL_SLOTS_BY_DATE } from '@/graphql/meal-prep-plans';
import type { MealPrepPlan, MealPrepPlansResponse, MealPrepPlanResponse, MealSlot, MealSlotsByDateResponse } from '@/types/meal-prep-plan';
import { print } from 'graphql';

/**
 * Fetch all meal prep plans using GraphQL (Server-side)
 * This function can be used in Server Components
 * Data is cached for 60 seconds by default
 * 
 * Check your terminal/console to see the GraphQL request logs
 */
export async function getMealPrepPlans(): Promise<MealPrepPlan[]> {
  try {
    const data = await executeGraphQL<MealPrepPlansResponse>({
      query: print(GET_MEAL_PREP_PLANS),
      revalidate: 60, // Cache for 60 seconds
      operationName: 'GetMealPrepPlans',
    });

    return data?.mealPrepPlans || [];
  } catch (error) {
    console.error('Error fetching meal prep plans:', error);
    return [];
  }
}

/**
 * Fetch a single meal prep plan by documentId using GraphQL (Server-side)
 * This function can be used in Server Components
 * Data is cached for 60 seconds by default
 * 
 * Check your terminal/console to see the GraphQL request logs
 */
export async function getMealPrepPlan(documentId: string): Promise<MealPrepPlan | null> {
  try {
    const data = await executeGraphQL<MealPrepPlanResponse>({
      query: print(GET_MEAL_PREP_PLAN),
      variables: { documentId },
      revalidate: 60, // Cache for 60 seconds
      operationName: 'GetMealPrepPlan',
    });

    return data?.mealPrepPlan || null;
  } catch (error) {
    console.error('Error fetching meal prep plan:', error);
    return null;
  }
}

/**
 * Fetch meal slots for a specific date using GraphQL (Server-side)
 * This function can be used in Server Components
 * Data is cached for 60 seconds by default
 * 
 * Check your terminal/console to see the GraphQL request logs
 */
export async function getMealSlotsByDate(date: string): Promise<MealSlot[]> {
  try {
    const data = await executeGraphQL<MealSlotsByDateResponse>({
      query: print(GET_MEAL_SLOTS_BY_DATE),
      variables: { date },
      revalidate: 60, // Cache for 60 seconds
      operationName: 'GetMealSlotsByDate',
    });

    return data?.mealSlots || [];
  } catch (error) {
    console.error('Error fetching meal slots by date:', error);
    return [];
  }
}
