# GraphQL Setup Guide

This project uses GraphQL to fetch data from Strapi, with both server-side and client-side implementations.

## ✅ What's Set Up

1. **Server-Side GraphQL Client** - `lib/graphql-server.ts`
   - Uses native `fetch` for Server Components
   - Automatic logging and error handling
   - Next.js caching support

2. **Client-Side Apollo Client** - `lib/apollo-client.ts`
   - Configured for Client Components
   - Wrapped in `app/layout.tsx` via `ApolloProviderWrapper`

3. **GraphQL Queries** - `graphql/` folder
   - `graphql/recipes.ts` - Recipe queries
   - `graphql/ingredients.ts` - Ingredient queries
   - `graphql/fragments.ts` - Reusable fragments

4. **Server Functions** - `app/api/` folder
   - `app/api/recipes/index.ts` - Server-side recipe functions
   - `app/api/ingredients/index.ts` - Server-side ingredient functions

## 🔧 Strapi Configuration

### 1. Enable GraphQL Plugin

The GraphQL plugin is configured in `strapi-backend/config/plugins.ts`:

```ts
export default () => ({
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      playgroundAlways: true,
    },
  },
});
```

### 2. Set GraphQL Permissions

1. Go to **Strapi Admin Panel**: http://localhost:1337/admin
2. Navigate to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Scroll to **GraphQL** section
4. Enable permissions:
   - `recipe.find` / `recipe.findOne`
   - `ingredient.find` / `ingredient.findOne`
5. Click **Save**

### 3. Publish Content

Make sure your content is **published** (not just saved as draft) in Strapi for it to appear via GraphQL.

## 🚀 Usage

### Server Components (Recommended)

```tsx
import { getRecipes } from '@/app/api/recipes';

export default async function RecipesPage() {
  const recipes = await getRecipes(); // Server-side fetch
  return <RecipesList recipes={recipes} />;
}
```

### Client Components (For Interactivity)

```tsx
'use client';

import { useQuery } from '@apollo/client';
import { GET_RECIPES } from '@/graphql/recipes';

export function InteractiveRecipesList() {
  const { data, loading, error } = useQuery(GET_RECIPES);
  // Handle loading/error states
}
```

## 🔍 GraphQL Playground

Test queries at: http://localhost:1337/graphql

Example query:
```graphql
query {
  recipes {
    documentId
    title
    ingredientItems {
      quantity
      unit
      baseIngredient {
        name
      }
    }
  }
}
```

## 📝 Adding New Queries

1. Create query in `graphql/` folder
2. Add fragments in `graphql/fragments.ts` if reusable
3. Create server function in `app/api/` if needed for Server Components
4. Use in components as shown above

## 🐛 Troubleshooting

**"No data returned"**
- Check if content is published in Strapi
- Verify GraphQL permissions are enabled
- Check terminal logs for errors

**"GraphQL endpoint not found"**
- Ensure Strapi is running on http://localhost:1337
- Verify GraphQL plugin is enabled

**"Permission denied"**
- Go to Strapi Admin → Settings → Roles → Public
- Enable GraphQL permissions for your content types

For more details, see [Debugging Guide](./DEBUGGING.md).
