import { use } from 'react';
import { getRecipe } from '@/app/api/recipes';
import type { Recipe } from '@/types/recipe';
import { IngredientsTable } from '../ingredients-table';
import BackButton from '@/components/back-button';
import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/image-utils';

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Server Component for Recipe Detail Page
 * Fetches data on the server for better performance and SEO
 */
export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Recipe not found
                </p>
                <BackButton className="text-orange-600 dark:text-orange-400 hover:underline" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <BackButton className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:underline mb-6" />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Cover Image */}
            {recipe.coverImage?.url ? (
              <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-700">
                <Image
                  src={getStrapiImageUrl(recipe.coverImage.url)}
                  alt={recipe.coverImage.alternativeText || recipe.title || 'Recipe cover'}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <span className="text-9xl">🍳</span>
              </div>
            )}

            {/* Header */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {recipe.title || 'Untitled Recipe'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recipe ID: {recipe.documentId}
                  </p>
                </div>
                {recipe.publishedAt ? (
                  <span className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded">
                    Published
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300 rounded">
                    Draft
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Created:
                  </span>{' '}
                  <span className="text-gray-900 dark:text-white">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Updated:
                  </span>{' '}
                  <span className="text-gray-900 dark:text-white">
                    {new Date(recipe.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {recipe.publishedAt && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Published:
                    </span>{' '}
                    <span className="text-gray-900 dark:text-white">
                      {new Date(recipe.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Ingredients
              </h2>
              {recipe.ingredientItems && recipe.ingredientItems.length > 0 ? (
                <IngredientsTable ingredientItems={recipe.ingredientItems} />
              ) : (
                <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No ingredients added to this recipe yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
