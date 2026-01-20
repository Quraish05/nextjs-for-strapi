/**
 * Meal Prep Plan types for GraphQL queries
 */

import type { BaseIngredient } from './ingredient';

export type MealPrepPlanStatus = 'draft' | 'active' | 'archived';
export type MealSlotType = 'breakfast' | 'brunch' | 'lunch' | 'evening-snack' | 'dinner';
export type RecipeUnit = 'serving' | 'bowl' | 'plate';

export interface Recipe {
  documentId: string;
  title: string;
}

export interface PlanRecipeItem {
  __typename: 'ComponentPlanItemRecipeItem';
  quantity: number | null;
  unit: RecipeUnit | null;
  recipe: Recipe | null;
}

export interface PlanIngredientItem {
  __typename: 'ComponentPlanItemIngredientItem';
  quantity: number | null;
  ingredient: BaseIngredient | null;
}

export type FoodOption = PlanRecipeItem | PlanIngredientItem;

export interface MealSlot {
  documentId: string;
  titleOfMealSlot: string;
  date: string;
  slotType: MealSlotType;
  foodOptions?: FoodOption[] | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  meal_prep_plan?: {
    documentId: string;
    title: string;
    weekStartDate: string;
    statusOfThePlan: MealPrepPlanStatus;
  } | null;
}

export interface MealPrepPlan {
  documentId: string;
  title: string;
  weekStartDate: string;
  statusOfThePlan: MealPrepPlanStatus;
  meal_slots?: MealSlot[] | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface MealPrepPlansResponse {
  mealPrepPlans: MealPrepPlan[];
}

export interface MealPrepPlanResponse {
  mealPrepPlan: MealPrepPlan;
}

export interface MealSlotsByDateResponse {
  mealSlots: MealSlot[];
}
