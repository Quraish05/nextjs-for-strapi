'use client';

import type { IngredientItem } from '@/types/ingredient';
import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/image-utils';

interface IngredientItemProps {
  item: IngredientItem;
}

export function IngredientItemDisplay({ item }: IngredientItemProps) {
  const { quantity, unit, baseIngredient, required, price, notes } = item;
  const imageUrl = baseIngredient?.image?.url
    ? getStrapiImageUrl(baseIngredient.image.url)
    : null;

  return (
    <div className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      {/* Ingredient Image */}
      {imageUrl && baseIngredient && (
        <div className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={imageUrl}
              alt={baseIngredient.image?.alternativeText || baseIngredient.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </div>
      )}

      {/* Ingredient Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
              {baseIngredient?.name || 'Unknown Ingredient'}
            </h4>
            {baseIngredient?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {typeof baseIngredient.description === 'string'
                  ? baseIngredient.description
                  : 'Rich text description'}
              </p>
            )}
          </div>
          {!required && (
            <span className="flex-shrink-0 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
              Optional
            </span>
          )}
        </div>

        {/* Quantity and Unit */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-md bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 font-medium text-sm">
            {quantity} {unit}
          </span>
          {price && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Notes */}
        {notes && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
            {typeof notes === 'string' ? notes : 'Additional notes'}
          </div>
        )}
      </div>
    </div>
  );
}

