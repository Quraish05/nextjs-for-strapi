import { IngredientsListServer } from './ingredients-list-server';

export default function IngredientsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🥘 Base Ingredients
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Browse all available base ingredients from Strapi CMS
            </p>
          </div>
          <IngredientsListServer />
        </div>
      </main>
    </div>
  );
}

