import { getIngredients } from '@/app/api/ingredients';
import type { Ingredient } from '@/types/ingredient';
import { IngredientCard } from './ingredient-card';

/**
 * Server Component for Ingredients List
 * Fetches data on the server for better performance and SEO
 */
export async function IngredientsListServer() {
  const ingredients = await getIngredients();

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

