# Data Fetching Guide

Complete guide on when and how to fetch data in Next.js App Router.

## Quick Decision Tree

```
Is data needed for initial page render?
├─ YES → Server Component (default)
│   └─ Is it user-specific or real-time?
│       ├─ NO → Server Component ✅
│       └─ YES → Server Component + Client updates (Hybrid)
│
└─ NO → Client Component with Apollo
    └─ Is it triggered by user interaction?
        ├─ YES → Client Component ✅
        └─ NO → Re-evaluate if needed
```

## Architecture Overview

### Server-Side Fetching (Default)

**Location**: `app/api/` folder

**Benefits:**
- ⚡ Faster initial page load
- 🔍 Better SEO (content in HTML)
- 📦 Smaller client bundle
- 💾 Automatic caching
- ✅ No loading states needed

**Files:**
- `lib/graphql-server.ts` - Server-side GraphQL client
- `app/api/recipes/index.ts` - Recipe server functions
- `app/api/ingredients/index.ts` - Ingredient server functions

**Usage:**
```tsx
import { getRecipes } from '@/app/api/recipes';

export default async function RecipesPage() {
  const recipes = await getRecipes(); // Server-side
  return <RecipesList recipes={recipes} />;
}
```

### Client-Side Fetching (Apollo)

**Location**: Client Components with Apollo Client

**Use When:**
- User interaction required (search, filters, buttons)
- Real-time updates needed (polling, subscriptions)
- User-specific data (requires auth)
- Optimistic updates (like buttons, comments)

**Usage:**
```tsx
'use client';

import { useQuery } from '@apollo/client';
import { GET_RECIPES } from '@/graphql/recipes';

export function RecipeSearch() {
  const { data, loading } = useQuery(SEARCH_RECIPES, {
    variables: { search: searchTerm },
  });
  return <SearchResults data={data} />;
}
```

## Decision Criteria

### ✅ Use Server Components When:

1. **Initial Page Load** - Data needed to render page
2. **Public Content** - Not user-specific
3. **SEO Important** - Search engines need to index
4. **Static/Semi-Static** - Content doesn't change frequently
5. **Performance Priority** - Fast initial load

### ✅ Use Client Components When:

1. **User Interaction** - Search, filters, buttons, forms
2. **Real-Time Updates** - Polling, subscriptions, live data
3. **User-Specific** - Requires authentication
4. **Optimistic Updates** - Immediate feedback needed
5. **Conditional Loading** - Only load when user expands/clicks

## Current Implementation

### ✅ Server Components (Current Setup)

All initial content uses Server Components:

- **Recipe List** (`app/recipes/page.tsx`) → `getRecipes()`
- **Recipe Detail** (`app/recipes/[id]/page.tsx`) → `getRecipe(id)`
- **Ingredients List** (`app/ingredients/page.tsx`) → `getIngredients()`
- **Ingredient Detail** (`app/ingredients/[slug]/page.tsx`) → `getIngredientBySlug(slug)`

**Why?** All are public content, SEO-important, and needed for initial render.

### 🔄 When to Add Client Components

Add Client Components for:
- Search functionality
- Filters/Sort
- User favorites
- Comments section
- Like/Bookmark buttons
- Real-time updates

## Hybrid Approach (Best Practice)

Combine Server Components for initial load + Client Components for interactivity:

```tsx
// Server Component: Initial data
export default async function RecipesPage() {
  const recipes = await getRecipes(); // Server-side
  
  return (
    <>
      <RecipesListServer recipes={recipes} />
      <RecipeSearch /> {/* Client component */}
    </>
  );
}

// Client Component: Search
'use client';

export function RecipeSearch() {
  const { data } = useQuery(SEARCH_RECIPES, {
    variables: { search: searchTerm },
  });
  return <SearchResults data={data} />;
}
```

## Decision Checklist

Before choosing, ask:

1. **Needed for initial render?** → Server Component
2. **Triggered by user interaction?** → Client Component
3. **User-specific or requires auth?** → Client Component
4. **Needs real-time updates?** → Client Component
5. **SEO important?** → Server Component
6. **Changes frequently?** → Client Component (or Server with short cache)

## Examples

### Example 1: Recipe List (Current - ✅ Correct)

```tsx
// Server Component
export default async function RecipesPage() {
  const recipes = await getRecipes(); // Server-side
  return <RecipesListServer recipes={recipes} />;
}
```

**Why Server?** Initial render, public content, SEO important.

### Example 2: Adding Search (Future)

```tsx
// Server: Initial list
export default async function RecipesPage() {
  const recipes = await getRecipes();
  
  return (
    <>
      <RecipesListServer recipes={recipes} />
      <RecipeSearch /> {/* Client component */}
    </>
  );
}

// Client: Search functionality
'use client';

export function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data } = useQuery(SEARCH_RECIPES, {
    variables: { search: searchTerm },
    skip: !searchTerm,
  });
  return <SearchResults data={data} />;
}
```

**Why Hybrid?** Server for initial load, Client for user interaction.

### Example 3: User Dashboard (Future)

```tsx
// Client Component
'use client';

export function UserDashboard() {
  const { data } = useQuery(GET_USER_DASHBOARD);
  return <DashboardContent data={data} />;
}
```

**Why Client?** User-specific, requires auth, may need real-time updates.

## Performance Comparison

| Aspect | Server Components | Client Components |
|--------|------------------|-------------------|
| **Initial Load** | ⚡ Fast | 🐌 Slower |
| **SEO** | ✅ Excellent | ❌ Poor |
| **Bundle Size** | ✅ Smaller | ❌ Larger |
| **Real-Time** | ❌ No | ✅ Yes |
| **Interactivity** | ❌ Limited | ✅ Full |

## Caching Strategy

Server functions use Next.js caching:

```ts
await executeGraphQL({
  query: print(GET_RECIPES),
  revalidate: 60, // Cache for 60 seconds
});
```

- **60 seconds**: Good for semi-static content
- **0**: Always fetch fresh (real-time data)
- **false**: Cache indefinitely (static content)

## Best Practices

1. **Default to Server Components** - Start server-side, add client-side only when needed
2. **Use Hybrid When Possible** - Server for initial load, Client for updates
3. **Consider SEO** - Public content should be server-side
4. **Monitor Performance** - Measure and optimize based on real usage

## Summary

**Rule of Thumb:**
- **Server Components by default** - Better performance, SEO, UX
- **Client Components when needed** - For interactivity, real-time, user-specific
- **Hybrid approach** - Best of both worlds

Your current implementation is correct! All initial content uses Server Components, which is the best practice.

