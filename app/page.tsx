import Link from "next/link";
import { getArticles } from "@/app/api/articles";

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Strapi + Next.js
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A modern headless CMS setup with PostgreSQL
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h2>
            <div className="space-y-2">
              <Link
                href="http://localhost:1337/admin"
                target="_blank"
                className="block text-blue-600 dark:text-blue-400 hover:underline"
              >
                → Strapi Admin Panel (http://localhost:1337/admin)
              </Link>
              <Link
                href="http://localhost:1337/api/articles"
                target="_blank"
                className="block text-blue-600 dark:text-blue-400 hover:underline"
              >
                → Strapi API (http://localhost:1337/api/articles)
              </Link>
              <Link
                href="http://localhost:1337/graphql"
                target="_blank"
                className="block text-blue-600 dark:text-blue-400 hover:underline"
              >
                → GraphQL Playground (http://localhost:1337/graphql)
              </Link>
              <Link
                href="/recipes"
                className="block text-blue-600 dark:text-blue-400 hover:underline"
              >
                → View Recipes (GraphQL)
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Articles from Strapi
            </h2>
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No articles found. Create your first article in the Strapi Admin Panel!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Make sure Strapi is running and you've created some articles.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {article.attributes.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {article.attributes.content?.substring(0, 150)}...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Published: {new Date(article.attributes.publishedAt).toLocaleDateString()}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
