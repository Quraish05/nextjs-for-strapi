import { getMealPrepPlans } from '@/app/api/meal-prep-plans';
import MealPrepCalendar from '@/components/meal-prep-calendar';

export default async function MealPrepPage() {
  const mealPrepPlans = await getMealPrepPlans();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Meal Prep Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your weekly meal prep plans
            </p>
          </div>

          {/* Calendar */}
          <MealPrepCalendar mealPrepPlans={mealPrepPlans} />
        </div>
      </main>
    </div>
  );
}
