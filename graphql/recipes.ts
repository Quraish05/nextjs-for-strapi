import { gql } from '@apollo/client';
import {
  INGREDIENT_ITEM_FRAGMENT,
  BASE_INGREDIENT_FRAGMENT,
  INGREDIENT_IMAGE_FRAGMENT,
} from './fragments';

export const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      documentId
      title
      createdAt
      updatedAt
      publishedAt
      ingredientItems {
        ...IngredientItem
      }
    }
  }
  ${INGREDIENT_ITEM_FRAGMENT}
  ${BASE_INGREDIENT_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;

export const GET_RECIPE = gql`
  query GetRecipe($documentId: ID!) {
    recipe(documentId: $documentId) {
      documentId
      title
      createdAt
      updatedAt
      publishedAt
      ingredientItems {
        ...IngredientItem
      }
    }
  }
  ${INGREDIENT_ITEM_FRAGMENT}
  ${BASE_INGREDIENT_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;

