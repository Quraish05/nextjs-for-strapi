import { getMealSlotsByDate } from '@/app/api/meal-prep-plans';
import MealSlotDetails from '@/components/meal-slot-details';
import BackButton from '@/components/back-button';

interface MealPrepDatePageProps {
  params: Promise<{ date: string }>;
}

export default async function MealPrepDatePage({ params }: MealPrepDatePageProps) {
  const { date } = await params;
  const mealSlots = await getMealSlotsByDate(date);

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <BackButton className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {formattedDate}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {mealSlots.length} meal slot{mealSlots.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>

          {/* Meal Slots */}
          {mealSlots.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No meal slots found for this date.
              </p>
              <BackButton className="text-blue-600 dark:text-blue-400 hover:underline" />
            </div>
          ) : (
            <div className="space-y-6">
              {mealSlots.map((slot) => (
                <MealSlotDetails key={slot.documentId} mealSlot={slot} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
