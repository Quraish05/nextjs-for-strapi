'use client';

import { useQuery } from '@apollo/client/react';
import { GET_RECIPES } from '@/graphql/recipes';
import type { Recipe } from '@/types/recipe';

export function RecipesList() {
  const { data, loading, error } = useQuery<{ recipes: Recipe[] }>(GET_RECIPES);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error loading recipes: {error.message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Make sure Strapi is running and GraphQL is enabled.
          </p>
        </div>
      </div>
    );
  }

  const recipes = data?.recipes || [];

  if (recipes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No recipes found. Create your first recipe in the Strapi Admin Panel!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Make sure recipes are published in Strapi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          All Recipes ({recipes.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.documentId}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-900"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {recipe.title || 'Untitled Recipe'}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {recipe.publishedAt && (
                <p>
                  <span className="font-medium">Published:</span>{' '}
                  {new Date(recipe.publishedAt).toLocaleDateString()}
                </p>
              )}
              <p>
                <span className="font-medium">Created:</span>{' '}
                {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
            </div>
            {!recipe.publishedAt && (
              <span className="inline-block mt-3 px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300 rounded">
                Draft
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

