import { gql } from '@apollo/client';

export const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      documentId
      title
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

export const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      documentId
      title
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

