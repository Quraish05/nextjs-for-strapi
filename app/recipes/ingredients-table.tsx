'use client';

import type { IngredientItem } from '@/types/ingredient';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiImageUrl } from '@/lib/image-utils';
import { useState } from 'react';

interface IngredientsTableProps {
  ingredientItems: IngredientItem[];
}

export function IngredientsTable({ ingredientItems }: IngredientsTableProps) {
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientItem | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ingredient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {ingredientItems.map((item, index) => {
              const baseIngredient = item.baseIngredient;
              const imageUrl = baseIngredient?.image?.url
                ? getStrapiImageUrl(baseIngredient.image.url)
                : null;

              return (
                <tr
                  key={`${baseIngredient?.documentId || 'no-ingredient'}-${item.quantity}-${item.unit}-${index}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedIngredient(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {imageUrl ? (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                          <Image
                            src={imageUrl}
                            alt={
                              baseIngredient?.image?.alternativeText ||
                              baseIngredient?.name ||
                              'Ingredient'
                            }
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">🥘</span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {baseIngredient?.name || 'Unknown Ingredient'}
                        </div>
                        {baseIngredient?.slug && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {baseIngredient.slug}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {item.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {item.price ? `$${item.price.toFixed(2)}` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.required ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        Optional
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {baseIngredient?.slug ? (
                      <Link
                        href={`/ingredients/${baseIngredient.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
                      >
                        View Details →
                      </Link>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIngredient(item);
                        }}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
                      >
                        View Details →
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <IngredientDetailModal
          item={selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
        />
      )}
    </>
  );
}

interface IngredientDetailModalProps {
  item: IngredientItem;
  onClose: () => void;
}

function IngredientDetailModal({
  item,
  onClose,
}: IngredientDetailModalProps) {
  const { quantity, unit, baseIngredient, required, price, notes } = item;
  const imageUrl = baseIngredient?.image?.url
    ? getStrapiImageUrl(baseIngredient.image.url)
    : null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Ingredient Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          {imageUrl && (
            <div className="mb-6">
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={imageUrl}
                  alt={
                    baseIngredient?.image?.alternativeText ||
                    baseIngredient?.name ||
                    'Ingredient'
                  }
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>
          )}

          {/* Base Ingredient Info */}
          {baseIngredient && (
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {baseIngredient.name}
              </h4>
              {baseIngredient.slug && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Slug: {baseIngredient.slug}
                </p>
              )}
              {baseIngredient.description && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {typeof baseIngredient.description === 'string'
                      ? baseIngredient.description
                      : 'Rich text description'}
                  </p>
                </div>
              )}
              {baseIngredient.slug && (
                <Link
                  href={`/ingredients/${baseIngredient.slug}`}
                  className="inline-block mt-4 text-orange-600 dark:text-orange-400 hover:underline"
                >
                  View Full Ingredient Page →
                </Link>
              )}
            </div>
          )}

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Quantity
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {quantity}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Unit
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {unit}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            {price && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Price
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  ${price.toFixed(2)}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Status
              </div>
              {required ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Required
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  Optional
                </span>
              )}
            </div>

            {notes && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Notes
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 italic">
                  {typeof notes === 'string' ? notes : 'Additional notes'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

