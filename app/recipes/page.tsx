import { RecipesList } from './recipes-list';

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🍳 Recipes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Delicious recipes from Strapi CMS
            </p>
          </div>
          <RecipesList />
        </div>
      </main>
    </div>
  );
}

