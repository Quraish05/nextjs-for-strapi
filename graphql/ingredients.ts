import { gql } from '@apollo/client';
import { INGREDIENT_FRAGMENT, INGREDIENT_IMAGE_FRAGMENT } from './fragments';

export const GET_INGREDIENTS = gql`
  query GetIngredients {
    ingredients {
      ...Ingredient
    }
  }
  ${INGREDIENT_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;

export const GET_INGREDIENT = gql`
  query GetIngredient($id: ID!) {
    ingredient(id: $id) {
      ...Ingredient
    }
  }
  ${INGREDIENT_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;

export const GET_INGREDIENT_BY_SLUG = gql`
  query GetIngredientBySlug($slug: String!) {
    ingredients(filters: { slug: { eq: $slug } }) {
      ...Ingredient
    }
  }
  ${INGREDIENT_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;

