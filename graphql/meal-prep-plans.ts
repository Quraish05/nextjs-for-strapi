import { gql } from '@apollo/client';
import {
  PLAN_RECIPE_ITEM_FRAGMENT,
  PLAN_INGREDIENT_ITEM_FRAGMENT,
  INGREDIENT_IMAGE_FRAGMENT,
  MEAL_PREP_PLAN_FRAGMENT,
  MEAL_PREP_PLAN_BASIC_FRAGMENT,
  MEAL_SLOT_FRAGMENT,
  MEAL_SLOT_WITH_PLAN_FRAGMENT,
} from './fragments';

export const GET_MEAL_PREP_PLANS = gql`
  query GetMealPrepPlans {
    mealPrepPlans {
      ...MealPrepPlan
    }
  }
  ${MEAL_PREP_PLAN_FRAGMENT}
  ${MEAL_PREP_PLAN_BASIC_FRAGMENT}
  ${MEAL_SLOT_FRAGMENT}
  ${PLAN_RECIPE_ITEM_FRAGMENT}
  ${PLAN_INGREDIENT_ITEM_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;

export const GET_MEAL_PREP_PLAN = gql`
  query GetMealPrepPlan($documentId: ID!) {
    mealPrepPlan(documentId: $documentId) {
      ...MealPrepPlan
    }
  }
  ${MEAL_PREP_PLAN_FRAGMENT}
  ${MEAL_PREP_PLAN_BASIC_FRAGMENT}
  ${MEAL_SLOT_FRAGMENT}
  ${PLAN_RECIPE_ITEM_FRAGMENT}
  ${PLAN_INGREDIENT_ITEM_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;

export const GET_MEAL_SLOTS_BY_DATE = gql`
  query GetMealSlotsByDate($date: Date!) {
    mealSlots(filters: { date: { eq: $date } }) {
      ...MealSlotWithPlan
    }
  }
  ${MEAL_SLOT_WITH_PLAN_FRAGMENT}
  ${MEAL_SLOT_FRAGMENT}
  ${MEAL_PREP_PLAN_BASIC_FRAGMENT}
  ${PLAN_RECIPE_ITEM_FRAGMENT}
  ${PLAN_INGREDIENT_ITEM_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;
