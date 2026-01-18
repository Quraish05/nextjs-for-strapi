'use client';

import type { Ingredient } from '@/types/ingredient';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiImageUrl } from '@/lib/image-utils';

interface IngredientCardProps {
  ingredient: Ingredient;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const { name, slug, image, description, publishedAt } = ingredient;
  const imageUrl = image?.url ? getStrapiImageUrl(image.url) : null;

  return (
    <Link
      href={`/ingredients/${slug}`}
      className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-700"
    >
      {/* Image */}
      {imageUrl ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
          <Image
            src={imageUrl}
            alt={image?.alternativeText || name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-full h-48 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-gray-700 dark:to-gray-600 mb-4 flex items-center justify-center">
          <span className="text-4xl">🥘</span>
        </div>
      )}

      {/* Content */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {typeof description === 'string'
              ? description
              : 'Rich text description'}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          {publishedAt ? (
            <span className="text-green-600 dark:text-green-400">Published</span>
          ) : (
            <span className="text-orange-600 dark:text-orange-400">Draft</span>
          )}
          <span className="text-gray-400">View Details →</span>
        </div>
      </div>
    </Link>
  );
}

