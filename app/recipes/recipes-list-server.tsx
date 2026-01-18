import { getRecipes } from '@/app/api/recipes';
import type { Recipe } from '@/types/recipe';
import Link from 'next/link';

/**
 * Server Component for Recipes List
 * Fetches data on the server for better performance and SEO
 */
export async function RecipesListServer() {
  const recipes = await getRecipes();

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {recipes.map((recipe) => (
          <Link
            key={recipe.documentId}
            href={`/recipes/${recipe.documentId}`}
            className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all bg-gray-50 dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-700 cursor-pointer"
          >
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                {recipe.title || 'Untitled Recipe'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {recipe.publishedAt && (
                  <span>
                    <span className="font-medium">Published:</span>{' '}
                    {new Date(recipe.publishedAt).toLocaleDateString()}
                  </span>
                )}
                <span>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </span>
                {!recipe.publishedAt && (
                  <span className="px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300 rounded">
                    Draft
                  </span>
                )}
              </div>
            </div>

            {/* Ingredients Preview */}
            {recipe.ingredientItems && recipe.ingredientItems.length > 0 ? (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Ingredients ({recipe.ingredientItems.length})
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to view full recipe details →
                </p>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  No ingredients added yet
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

