# GraphQL Setup Guide

This project uses Apollo Client to fetch data from Strapi via GraphQL.

## ✅ What's Been Set Up

1. **Apollo Client** - Configured in `lib/apollo-client.ts`
2. **Apollo Provider** - Wrapped around the app in `app/layout.tsx`
3. **GraphQL Queries** - Defined in `app/api/recipes/queries.ts`
4. **API Functions** - Available in `app/api/recipes/index.ts`
5. **Recipes UI** - Component at `app/recipes/page.tsx`

## 🔧 Strapi Configuration Required

### 1. Enable GraphQL Plugin

The GraphQL plugin is already installed and configured in `strapi-backend/config/plugins.ts`.

### 2. Set GraphQL Permissions

After starting Strapi, you need to enable GraphQL permissions:

1. Go to **Strapi Admin Panel**: http://localhost:1337/admin
2. Navigate to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Scroll down to find **GraphQL** section
4. Enable the following permissions:
   - `recipe.find` - To fetch all recipes
   - `recipe.findOne` - To fetch a single recipe
5. Click **Save**

### 3. Publish Recipes

Make sure your recipes are **published** (not just saved as draft) in Strapi for them to appear via GraphQL.

## 🚀 Usage

### Access Recipes Page

Visit: http://localhost:3000/recipes

### Use in Components

```tsx
'use client';

import { useQuery } from '@apollo/client';
import { GET_RECIPES } from '@/app/api/recipes/queries';

export function MyComponent() {
  const { data, loading, error } = useQuery(GET_RECIPES);
  
  // Your component logic
}
```

### Use API Functions

```tsx
import { getRecipes, getRecipe } from '@/app/api/recipes';

// In a server component or API route
const recipes = await getRecipes();
const recipe = await getRecipe('1');
```

## 🔍 GraphQL Playground

Test your GraphQL queries at: http://localhost:1337/graphql

Example query:
```graphql
query {
  recipes {
    data {
      id
      attributes {
        title
        createdAt
        publishedAt
      }
    }
  }
}
```

## 📝 Adding More Fields

If you add more fields to the Recipe content type in Strapi, update the GraphQL queries in `app/api/recipes/queries.ts`:

```graphql
query GetRecipes {
  recipes {
    data {
      id
      attributes {
        title
        description  # Add new fields here
        ingredients
        instructions
        createdAt
        updatedAt
        publishedAt
      }
    }
  }
}
```

## 🐛 Troubleshooting

### "No recipes found"
- Check if recipes are published in Strapi
- Verify GraphQL permissions are enabled
- Check browser console for errors

### "GraphQL endpoint not found"
- Ensure Strapi is running
- Verify GraphQL plugin is installed: `npm list @strapi/plugin-graphql` in strapi-backend
- Check `strapi-backend/config/plugins.ts` has GraphQL configuration

### "Permission denied"
- Go to Strapi Admin → Settings → Roles → Public
- Enable GraphQL permissions for Recipe content type

