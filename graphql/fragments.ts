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

