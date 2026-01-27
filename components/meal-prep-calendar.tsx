'use client';

import Link from 'next/link';
import type { MealPrepPlan, MealSlot, MealSlotType, FoodOption, PlanRecipeItem, PlanIngredientItem } from '@/types/meal-prep-plan';

interface MealPrepCalendarProps {
  mealPrepPlans: MealPrepPlan[];
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

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getWeekDates(weekStartDate: string): Date[] {
  const startDate = new Date(weekStartDate);
  const dates: Date[] = [];
  
  // Get the start of the week (Sunday)
  const dayOfWeek = startDate.getDay();
  const diff = startDate.getDate() - dayOfWeek;
  const weekStart = new Date(startDate.setDate(diff));
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function groupMealSlotsByDate(mealSlots: MealSlot[]): Record<string, MealSlot[]> {
  const grouped: Record<string, MealSlot[]> = {};
  
  mealSlots.forEach((slot) => {
    const dateKey = slot.date.split('T')[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(slot);
  });
  
  return grouped;
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'archived':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

function isRecipeItem(item: FoodOption): item is PlanRecipeItem {
  return item.__typename === 'ComponentPlanItemRecipeItem';
}

function isIngredientItem(item: FoodOption): item is PlanIngredientItem {
  return item.__typename === 'ComponentPlanItemIngredientItem';
}

function getFoodOptionsList(foodOptions: FoodOption[] | null | undefined): string[] {
  if (!foodOptions || foodOptions.length === 0) {
    return [];
  }

  const items: string[] = [];
  
  // Get recipe titles
  const recipes = foodOptions.filter(isRecipeItem)
    .map(item => item.recipe?.title)
    .filter(Boolean) as string[];
  
  // Get ingredient names
  const ingredients = foodOptions.filter(isIngredientItem)
    .map(item => item.ingredient?.name)
    .filter(Boolean) as string[];

  // Combine recipes and ingredients (limit to 3 items for calendar view)
  items.push(...recipes, ...ingredients);
  
  return items.slice(0, 3); // Show max 3 items in calendar
}

export default function MealPrepCalendar({ mealPrepPlans }: MealPrepCalendarProps) {
  if (mealPrepPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No meal prep plans found. Create your first meal prep plan in the Strapi Admin Panel!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {mealPrepPlans.map((plan) => {
        const weekDates = getWeekDates(plan.weekStartDate);
        const mealSlotsByDate = groupMealSlotsByDate(plan.meal_slots || []);
        const weekStart = weekDates[0];
        const weekEnd = weekDates[6];
        const month = MONTHS[weekStart.getMonth()];
        const year = weekStart.getFullYear();

        return (
          <div
            key={plan.documentId}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Plan Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{plan.title}</h2>
                  <p className="text-blue-100 mt-1">
                    {month} {weekStart.getDate()} - {weekEnd.getDate()}, {year}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeColor(
                    plan.statusOfThePlan
                  )}`}
                >
                  {plan.statusOfThePlan.charAt(0).toUpperCase() + plan.statusOfThePlan.slice(1)}
                </span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {/* Day Headers */}
                {DAYS_OF_WEEK.map((day, index) => {
                  const date = weekDates[index];
                  const dateKey = formatDateKey(date);
                  const slots = mealSlotsByDate[dateKey] || [];
                  const isToday = formatDateKey(new Date()) === dateKey;

                  return (
                    <Link
                      key={day}
                      href={`/meal-prep/${dateKey}`}
                      className={`border rounded-lg p-3 block transition-all hover:shadow-md ${
                        isToday
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {/* Day Header */}
                      <div className="mb-2">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          {day}
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            isToday
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      </div>

                      {/* Meal Slots */}
                      <div className="space-y-2">
                        {slots.length === 0 ? (
                          <div className="text-xs text-gray-400 dark:text-gray-500 italic">
                            No meals
                          </div>
                        ) : (
                          slots
                            .sort((a, b) => {
                              const order: MealSlotType[] = [
                                'breakfast',
                                'brunch',
                                'lunch',
                                'evening-snack',
                                'dinner',
                              ];
                              return order.indexOf(a.slotType) - order.indexOf(b.slotType);
                            })
                            .map((slot) => {
                              const foodItems = getFoodOptionsList(slot.foodOptions);
                              return (
                                <div
                                  key={slot.documentId}
                                  className={`text-xs p-2 rounded border ${SLOT_TYPE_COLORS[slot.slotType]}`}
                                  title={slot.titleOfMealSlot}
                                >
                                  <div className="font-semibold">
                                    {SLOT_TYPE_LABELS[slot.slotType]}
                                  </div>
                                  {foodItems.length > 0 && (
                                    <div className="mt-1 space-y-0.5">
                                      {foodItems.map((item, idx) => (
                                        <div key={idx} className="truncate text-[10px] opacity-90">
                                          {item}
                                        </div>
                                      ))}
                                      {slot.foodOptions && slot.foodOptions.length > foodItems.length && (
                                        <div className="text-[10px] opacity-75 italic">
                                          +{slot.foodOptions.length - foodItems.length} more
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
