import Link from 'next/link';
import type { MealSlot, MealSlotType, FoodOption, PlanRecipeItem, PlanIngredientItem } from '@/types/meal-prep-plan';

interface MealSlotDetailsProps {
  mealSlot: MealSlot;
}

const SLOT_TYPE_COLORS: Record<MealSlotType, string> = {
  breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  brunch: 'bg-orange-100 text-orange-800 border-orange-300',
  lunch: 'bg-green-100 text-green-800 border-green-300',
  'evening-snack': 'bg-purple-100 text-purple-800 border-purple-300',
  dinner: 'bg-blue-100 text-blue-800 border-blue-300',
};

const SLOT_TYPE_LABELS: Record<MealSlotType, string> = {
  breakfast: 'Breakfast',
  brunch: 'Brunch',
  lunch: 'Lunch',
  'evening-snack': 'Evening Snack',
  dinner: 'Dinner',
};

function isRecipeItem(item: FoodOption): item is PlanRecipeItem {
  return item.__typename === 'ComponentPlanItemRecipeItem';
}

function isIngredientItem(item: FoodOption): item is PlanIngredientItem {
  return item.__typename === 'ComponentPlanItemIngredientItem';
}

export default function MealSlotDetails({ mealSlot }: MealSlotDetailsProps) {
  const foodOptions = mealSlot.foodOptions || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b ${SLOT_TYPE_COLORS[mealSlot.slotType]}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{mealSlot.titleOfMealSlot}</h2>
            <p className="text-sm mt-1 opacity-90">
              {SLOT_TYPE_LABELS[mealSlot.slotType]}
            </p>
          </div>
          {mealSlot.meal_prep_plan && (
            <div className="text-right">
              <p className="text-sm font-semibold">{mealSlot.meal_prep_plan.title}</p>
              <p className="text-xs opacity-75">
                {new Date(mealSlot.meal_prep_plan.weekStartDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Food Options */}
      <div className="p-6">
        {foodOptions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No food options specified for this meal slot.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Recipes */}
            {foodOptions.filter(isRecipeItem).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Recipes
                </h3>
                <div className="space-y-3">
                  {foodOptions.filter(isRecipeItem).map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      {item.recipe ? (
                        <Link
                          href={`/recipes/${item.recipe.documentId}`}
                          className="block"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {item.recipe.title || 'Unknown Recipe'}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Click to view recipe details
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              {item.quantity !== null && (
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </div>
                              )}
                              {item.unit && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                  {item.unit}
                                  {item.quantity !== null && item.quantity !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Unknown Recipe
                            </h4>
                          </div>
                          <div className="text-right ml-4">
                            {item.quantity !== null && (
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {item.quantity}
                              </div>
                            )}
                            {item.unit && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                {item.unit}
                                {item.quantity !== null && item.quantity !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {foodOptions.filter(isIngredientItem).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Ingredients
                </h3>
                <div className="space-y-3">
                  {foodOptions.filter(isIngredientItem).map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      {item.ingredient ? (
                        <Link
                          href={`/ingredients/${item.ingredient.slug}`}
                          className="block"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {item.ingredient.name}
                              </h4>
                              <div className="mt-2 flex items-center gap-2">
                                {item.ingredient.image?.url && (
                                  <img
                                    src={item.ingredient.image.url}
                                    alt={item.ingredient.image.alternativeText || item.ingredient.name}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                )}
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  <span>Click to view ingredient details</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              {item.quantity !== null && (
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </div>
                              )}
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Quantity
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Unknown Ingredient
                            </h4>
                          </div>
                          <div className="text-right ml-4">
                            {item.quantity !== null && (
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {item.quantity}
                              </div>
                            )}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
