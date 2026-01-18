# Content Modeling & Data Consumption

This document explains how we consume data from Strapi's content model, the challenges faced, and our server-side rendering approach.

## Content Model Structure

### Collections

1. **Recipe** (`api::recipe.recipe`)
   - `title` (string)
   - `ingredientItems` (repeatable component)

2. **Ingredient** (`api::ingredient.ingredient`)
   - `name` (string, unique)
   - `slug` (UID)
   - `description` (blocks)
   - `image` (media)

### Components

**Ingredient Item** (`shared.ingredient-item`)
- `quantity` (decimal, required)
- `unit` (enumeration: g, kg, ml, l, tsp, tbsp, cup, pcs)
- `price` (decimal, optional)
- `required` (boolean, default: true)
- `notes` (blocks, optional)
- `baseIngredient` (relation to `api::ingredient.ingredient`)

### Relationship Flow

```
Recipe
  └─ ingredientItems[] (repeatable component)
      └─ baseIngredient → Ingredient (manyToOne relation)
```

**Usage Pattern:**
1. Create base ingredients (e.g., "Tomato", "Flour") in Strapi
2. Create recipes and add ingredient items
3. Each ingredient item references a base ingredient + adds quantity/unit

## Data Consumption

### GraphQL Queries

We use GraphQL to fetch data from Strapi. All queries are defined in `graphql/` folder with reusable fragments.

**Key Queries:**
- `GET_RECIPES` - Fetches all recipes with nested ingredient items
- `GET_RECIPE` - Fetches single recipe by documentId
- `GET_INGREDIENTS` - Fetches all base ingredients
- `GET_INGREDIENT_BY_SLUG` - Fetches ingredient by slug

**Fragments:**
- `INGREDIENT_ITEM_FRAGMENT` - Reusable ingredient item fields
- `BASE_INGREDIENT_FRAGMENT` - Reusable base ingredient fields
- `INGREDIENT_IMAGE_FRAGMENT` - Reusable image fields

See [GraphQL Setup](../01-foundations/GRAPHQL_SETUP.md) for details.

### Server-Side Rendering (SSR)

All initial data fetching uses **Server Components** for optimal performance:

```tsx
// Server Component - Data fetched on server
export default async function RecipesPage() {
  const recipes = await getRecipes(); // Server-side GraphQL
  return <RecipesListServer recipes={recipes} />;
}
```

**How it works:**
1. Server Component calls `getRecipes()` from `app/api/recipes/index.ts`
2. Server function uses `executeGraphQL()` from `lib/graphql-server.ts`
3. Native `fetch` API calls Strapi GraphQL endpoint
4. Data is fetched, cached (60s), and returned
5. Page renders with data already available (no loading states)

**Benefits:**
- ⚡ Faster initial load (data ready before page renders)
- 🔍 Better SEO (content in HTML)
- 📦 Smaller bundle (no client-side fetching code)
- 💾 Automatic caching

See [Data Fetching Guide](../01-foundations/DATA_FETCHING_GUIDE.md) for complete details.

## Challenges Faced & Solutions

### 1. Component Relations - Relation Type Issue

**Challenge:**
- Initially set `baseIngredient` relation as `oneToMany`
- GraphQL returned array instead of single object
- Frontend expected single object, causing "Unknown Ingredient" errors

**Solution:**
- Changed relation type to `manyToOne` in component schema
- One ingredient item → one base ingredient (correct relationship)
- Many ingredient items can reference same base ingredient

**Files Changed:**
- `strapi-backend/src/components/shared/ingredient-item.json`

### 2. Components Don't Have `documentId`

**Challenge:**
- Tried to query `documentId` on component fields in GraphQL
- Error: "Cannot query field 'documentId' on type 'ComponentSharedIngredientItem'"
- Components are embedded data, not separate entities

**Solution:**
- Removed `documentId` from component queries
- Use combination of fields for React keys: `${baseIngredient?.documentId}-${quantity}-${unit}-${index}`
- Updated TypeScript types to reflect this

**Files Changed:**
- `graphql/recipes.ts` - Removed `documentId` from `ingredientItems`
- `types/ingredient.ts` - Removed `documentId` from `IngredientItem`
- `app/recipes/recipes-list.tsx` - Updated key generation

### 3. GraphQL Query Argument Names

**Challenge:**
- Used `id` as query variable name
- Strapi GraphQL expects `documentId` for collection types
- Error: "Unknown argument 'id' on field 'Query.recipe'"

**Solution:**
- Changed query variable from `id` to `documentId`
- Updated all query calls to use `documentId`

**Files Changed:**
- `graphql/recipes.ts` - Updated `GET_RECIPE` query
- `app/recipes/[id]/page.tsx` - Pass `documentId` instead of `id`

### 4. Server-Side Request Visibility

**Challenge:**
- Server Component requests not visible in browser Network tab
- Hard to debug what data is being fetched
- Different from traditional MERN stack where requests are visible

**Solution:**
- Added comprehensive logging to `lib/graphql-server.ts`
- Logs show: operation name, duration, response data, errors
- View logs in terminal where `npm run dev` runs

See [Debugging Guide](../01-foundations/DEBUGGING.md) for details.

## Current Implementation

### Server-Side Functions

Located in `app/api/` folder:

- **`app/api/recipes/index.ts`**
  - `getRecipes()` - Fetches all recipes with ingredient items
  - `getRecipe(documentId)` - Fetches single recipe

- **`app/api/ingredients/index.ts`**
  - `getIngredients()` - Fetches all base ingredients
  - `getIngredient(id)` - Fetches ingredient by ID
  - `getIngredientBySlug(slug)` - Fetches ingredient by slug

### Server Components

All pages use Server Components:

- `app/recipes/page.tsx` → Uses `getRecipes()`
- `app/recipes/[id]/page.tsx` → Uses `getRecipe(documentId)`
- `app/ingredients/page.tsx` → Uses `getIngredients()`
- `app/ingredients/[slug]/page.tsx` → Uses `getIngredientBySlug(slug)`

### GraphQL Server Client

**File:** `lib/graphql-server.ts`

- Uses native `fetch` API (works in Server Components)
- Supports Next.js caching with `revalidate` option
- Comprehensive logging for debugging
- Error handling with detailed error messages

## Data Flow

```
User visits page
  ↓
Server Component (Next.js)
  ↓
Server Function (app/api/*/index.ts)
  ↓
GraphQL Server Client (lib/graphql-server.ts)
  ↓
Strapi GraphQL Endpoint (http://localhost:1337/graphql)
  ↓
Strapi Database
  ↓
Response flows back up
  ↓
Page renders with data (no loading state needed)
```

## Key Learnings

1. **Components ≠ Collections** - Components don't have `documentId`, only collections do
2. **Relation Types Matter** - `manyToOne` vs `oneToMany` affects GraphQL response structure
3. **Server Components by Default** - Better performance and SEO than client-side fetching
4. **GraphQL Fragments** - Essential for avoiding query duplication
5. **Terminal Logs** - Primary debugging tool for server-side requests

## Related Documentation

- [GraphQL Setup](../01-foundations/GRAPHQL_SETUP.md) - Complete GraphQL configuration
- [Data Fetching Guide](../01-foundations/DATA_FETCHING_GUIDE.md) - When to use Server vs Client Components
- [Debugging Guide](../01-foundations/DEBUGGING.md) - How to debug GraphQL requests

