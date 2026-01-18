'use client';

import { useQuery } from '@apollo/client/react';
import { GET_INGREDIENTS } from '@/graphql/ingredients';
import type { Ingredient } from '@/types/ingredient';
import { IngredientCard } from './ingredient-card';

export function IngredientsList() {
  const { data, loading, error } = useQuery<{ ingredients: Ingredient[] }>(
    GET_INGREDIENTS
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading ingredients...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error loading ingredients: {error.message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Make sure Strapi is running and GraphQL is enabled.
          </p>
        </div>
      </div>
    );
  }

  const ingredients = data?.ingredients || [];

  if (ingredients.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No ingredients found. Create your first ingredient in the Strapi Admin
            Panel!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Make sure ingredients are published in Strapi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          All Base Ingredients ({ingredients.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredients.map((ingredient) => (
          <IngredientCard key={ingredient.documentId} ingredient={ingredient} />
        ))}
      </div>
    </div>
  );
}

