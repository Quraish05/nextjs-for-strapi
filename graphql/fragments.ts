import { gql } from '@apollo/client';

/**
 * Fragment for ingredient image fields
 * Used in both baseIngredient and ingredient queries
 */
export const INGREDIENT_IMAGE_FRAGMENT = gql`
  fragment IngredientImage on UploadFile {
    url
    alternativeText
    width
    height
  }
`;

/**
 * Fragment for base ingredient fields
 * Used in ingredientItems component
 */
export const BASE_INGREDIENT_FRAGMENT = gql`
  fragment BaseIngredient on Ingredient {
    documentId
    name
    slug
    description
    image {
      ...IngredientImage
    }
    createdAt
    updatedAt
    publishedAt
  }
`;

/**
 * Fragment for ingredient item component fields
 * Used in recipe queries
 */
export const INGREDIENT_ITEM_FRAGMENT = gql`
  fragment IngredientItem on ComponentSharedIngredientItem {
    quantity
    unit
    price
    required
    notes
    baseIngredient {
      ...BaseIngredient
    }
  }
`;

/**
 * Fragment for full ingredient fields
 * Used in ingredient queries
 */
export const INGREDIENT_FRAGMENT = gql`
  fragment Ingredient on Ingredient {
    documentId
    name
    slug
    description
    image {
      ...IngredientImage
    }
    createdAt
    updatedAt
    publishedAt
  }
`;

/**
 * Fragment for recipe item in meal slots (plan-item.recipe-item)
 */
export const PLAN_RECIPE_ITEM_FRAGMENT = gql`
  fragment PlanRecipeItem on ComponentPlanItemRecipeItem {
    quantity
    unit
    recipe {
      documentId
      title
    }
  }
`;

/**
 * Fragment for ingredient item in meal slots (plan-item.ingredient-item)
 */
export const PLAN_INGREDIENT_ITEM_FRAGMENT = gql`
  fragment PlanIngredientItem on ComponentPlanItemIngredientItem {
    quantity
    ingredient {
      documentId
      name
      slug
      image {
        ...IngredientImage
      }
    }
  }
`;

/**
 * Fragment for meal slot fields (used in meal prep plans)
 */
export const MEAL_SLOT_FRAGMENT = gql`
  fragment MealSlot on MealSlot {
    documentId
    titleOfMealSlot
    date
    slotType
    createdAt
    updatedAt
    publishedAt
    foodOptions {
      __typename
      ... on ComponentPlanItemRecipeItem {
        ...PlanRecipeItem
      }
      ... on ComponentPlanItemIngredientItem {
        ...PlanIngredientItem
      }
    }
  }
`;

/**
 * Fragment for meal prep plan basic fields
 */
export const MEAL_PREP_PLAN_BASIC_FRAGMENT = gql`
  fragment MealPrepPlanBasic on MealPrepPlan {
    documentId
    title
    weekStartDate
    statusOfThePlan
    createdAt
    updatedAt
    publishedAt
  }
`;

/**
 * Fragment for meal prep plan with meal slots
 */
export const MEAL_PREP_PLAN_FRAGMENT = gql`
  fragment MealPrepPlan on MealPrepPlan {
    ...MealPrepPlanBasic
    meal_slots {
      ...MealSlot
    }
  }
`;

/**
 * Fragment for meal slot with meal prep plan relation (used in date queries)
 */
export const MEAL_SLOT_WITH_PLAN_FRAGMENT = gql`
  fragment MealSlotWithPlan on MealSlot {
    ...MealSlot
    meal_prep_plan {
      ...MealPrepPlanBasic
    }
  }
`;

