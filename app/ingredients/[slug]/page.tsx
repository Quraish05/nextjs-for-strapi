import { getIngredientBySlug } from '@/app/api/ingredients';
import type { Ingredient } from '@/types/ingredient';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiImageUrl } from '@/lib/image-utils';

interface IngredientDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Server Component for Ingredient Detail Page
 * Fetches data on the server for better performance and SEO
 */
export default async function IngredientDetailPage({
  params,
}: IngredientDetailPageProps) {
  const { slug } = await params;
  const ingredient = await getIngredientBySlug(slug);

  if (!ingredient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Ingredient not found
                </p>
                <Link
                  href="/ingredients"
                  className="text-orange-600 dark:text-orange-400 hover:underline"
                >
                  ← Back to Ingredients
                </Link>
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
          <Link
            href="/ingredients"
            className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:underline mb-6"
          >
            ← Back to Ingredients
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Image */}
            {ingredient.image?.url ? (
              <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-700">
                <Image
                  src={getStrapiImageUrl(ingredient.image.url)}
                  alt={ingredient.image.alternativeText || ingredient.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <span className="text-8xl">🥘</span>
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {ingredient.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Slug: {ingredient.slug}
                  </p>
                </div>
                {ingredient.publishedAt ? (
                  <span className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded">
                    Published
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300 rounded">
                    Draft
                  </span>
                )}
              </div>

              {/* Description */}
              {ingredient.description && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300">
                    {typeof ingredient.description === 'string' ? (
                      <p>{ingredient.description}</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Rich text content (blocks format)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Created:
                    </span>{' '}
                    <span className="text-gray-900 dark:text-white">
                      {new Date(ingredient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Updated:
                    </span>{' '}
                    <span className="text-gray-900 dark:text-white">
                      {new Date(ingredient.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {ingredient.publishedAt && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Published:
                      </span>{' '}
                      <span className="text-gray-900 dark:text-white">
                        {new Date(ingredient.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
