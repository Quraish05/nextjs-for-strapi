# Frontend Mutations Guide - Editing Strapi Data from UI

## ✅ Yes, You Can Edit Strapi Data from Frontend!

You can absolutely interact with and edit Strapi data from your frontend UI. Both **POST** (create) and **PATCH** (update) operations are possible.

## 🎯 Your Specific Use Case

**Question:** Can I edit ingredients in a Pizza recipe from a list of already created ingredients in Strapi?

**Answer:** Yes! You can:
1. Update a recipe's `ingredientItems` to add/remove/modify ingredients
2. Select from existing ingredients (via the `baseIngredient` relation)
3. Update quantities, units, and other ingredient item properties

## 🛠️ Two Approaches

### Option 1: GraphQL Mutations (Recommended)
- Type-safe
- Single endpoint
- Better for complex nested updates

### Option 2: REST API
- More familiar HTTP methods
- Direct POST/PATCH requests
- Simpler for basic operations

---

## 📋 Setup Requirements

### 1. Create API Token in Strapi

1. Go to **Strapi Admin Panel**: http://localhost:1337/admin
2. Navigate to **Settings** → **API Tokens**
3. Click **Create new API Token**
4. Configure:
   - **Name**: `Frontend API Token`
   - **Token type**: `Full access` (or `Read-only` + specific permissions)
   - **Token duration**: `Unlimited` (or set expiration)
5. Click **Save**
6. **Copy the token** (you'll only see it once!)

### 2. Configure Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Enable permissions for mutations:
   - **Recipe**: `create`, `update`, `delete`
   - **Ingredient**: `find`, `findOne` (to list existing ingredients)
3. Click **Save**

**OR** if using API Token:
- The token permissions override Public role
- Configure token with specific permissions during creation

### 3. Add Token to Frontend

Create `.env.local` in `nextjs-frontend/`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
```

---

## 🚀 Implementation Examples

### GraphQL Mutations Approach

#### Step 1: Create Mutation Queries

Create `nextjs-frontend/graphql/recipes.ts` mutations:

```typescript
import { gql } from '@apollo/client';

// ... existing queries ...

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($documentId: ID!, $data: RecipeInput!) {
    updateRecipe(documentId: $documentId, data: $data) {
      documentId
      title
      ingredientItems {
        id
        quantity
        unit
        baseIngredient {
          documentId
          name
        }
      }
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation CreateRecipe($data: RecipeInput!) {
    createRecipe(data: $data) {
      documentId
      title
    }
  }
`;
```

#### Step 2: Create Server-Side Mutation Function

Create `nextjs-frontend/app/api/recipes/mutations.ts`:

```typescript
import { executeGraphQL } from '@/lib/graphql-server';
import { print } from 'graphql';
import { gql } from '@apollo/client';

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($documentId: ID!, $data: RecipeInput!) {
    updateRecipe(documentId: $documentId, data: $data) {
      documentId
      title
      ingredientItems {
        id
        quantity
        unit
        baseIngredient {
          documentId
          name
        }
      }
    }
  }
`;

export async function updateRecipe(
  documentId: string,
  data: {
    title?: string;
    ingredientItems?: Array<{
      quantity: number;
      unit: string;
      baseIngredient: string; // documentId of ingredient
    }>;
  }
) {
  try {
    const result = await executeGraphQL({
      query: print(UPDATE_RECIPE),
      variables: {
        documentId,
        data,
      },
      operationName: 'UpdateRecipe',
      // Add token for authenticated requests
      headers: process.env.STRAPI_API_TOKEN
        ? {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          }
        : {},
    });

    return result?.updateRecipe;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
}
```

#### Step 3: Update GraphQL Server to Support Auth

Update `nextjs-frontend/lib/graphql-server.ts`:

```typescript
// ... existing code ...

export async function executeGraphQL<T>({
  query,
  variables,
  operationName,
  revalidate,
  headers = {},
}: GraphQLOptions): Promise<T> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

  // Add API token if available
  const authHeaders: Record<string, string> = {};
  if (process.env.STRAPI_API_TOKEN) {
    authHeaders['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    next: revalidate ? { revalidate } : undefined,
  });

  // ... rest of existing code ...
}
```

#### Step 4: Create Client Component for Editing

Create `nextjs-frontend/app/recipes/[id]/edit-form.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_RECIPE } from '@/graphql/recipes';
import { GET_RECIPE } from '@/graphql/recipes';

export function RecipeEditForm({ recipe, ingredients }) {
  const [title, setTitle] = useState(recipe.title);
  const [ingredientItems, setIngredientItems] = useState(recipe.ingredientItems);

  const [updateRecipe, { loading, error }] = useMutation(UPDATE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPE, variables: { documentId: recipe.documentId } }],
  });

  const handleAddIngredient = () => {
    setIngredientItems([
      ...ingredientItems,
      { quantity: 0, unit: 'g', baseIngredient: null },
    ]);
  };

  const handleUpdateIngredient = (index: number, field: string, value: any) => {
    const updated = [...ingredientItems];
    updated[index] = { ...updated[index], [field]: value };
    setIngredientItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateRecipe({
        variables: {
          documentId: recipe.documentId,
          data: {
            title,
            ingredientItems: ingredientItems.map((item) => ({
              quantity: item.quantity,
              unit: item.unit,
              baseIngredient: item.baseIngredient?.documentId,
            })),
          },
        },
      });
      alert('Recipe updated successfully!');
    } catch (err) {
      console.error('Error updating recipe:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Ingredients</label>
        {ingredientItems.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={item.baseIngredient?.documentId || ''}
              onChange={(e) =>
                handleUpdateIngredient(index, 'baseIngredient', {
                  documentId: e.target.value,
                })
              }
              className="border p-2 flex-1"
            >
              <option value="">Select ingredient</option>
              {ingredients.map((ing) => (
                <option key={ing.documentId} value={ing.documentId}>
                  {ing.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleUpdateIngredient(index, 'quantity', parseFloat(e.target.value))
              }
              className="border p-2 w-24"
            />
            <select
              value={item.unit}
              onChange={(e) => handleUpdateIngredient(index, 'unit', e.target.value)}
              className="border p-2 w-32"
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
              <option value="tsp">tsp</option>
              <option value="tbsp">tbsp</option>
              <option value="cup">cup</option>
              <option value="pcs">pcs</option>
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="mt-2 text-blue-600"
        >
          + Add Ingredient
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Updating...' : 'Update Recipe'}
      </button>

      {error && <div className="text-red-600">Error: {error.message}</div>}
    </form>
  );
}
```

---

### REST API Approach

#### Create API Route Handler

Create `nextjs-frontend/app/api/recipes/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const response = await fetch(`${STRAPI_URL}/api/recipes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
      },
      body: JSON.stringify({ data: body }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${STRAPI_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
      },
      body: JSON.stringify({ data: body }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}
```

#### Use in Client Component

```typescript
'use client';

const updateRecipe = async (id: string, data: any) => {
  const response = await fetch(`/api/recipes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

---

## 📝 Example: Updating Recipe Ingredients

Here's how to update a Pizza recipe's ingredients:

```typescript
// Update recipe with new ingredient items
const updatedRecipe = await updateRecipe(recipeDocumentId, {
  ingredientItems: [
    {
      quantity: 500,
      unit: 'g',
      baseIngredient: 'tomato-ingredient-document-id', // from existing ingredients
    },
    {
      quantity: 300,
      unit: 'g',
      baseIngredient: 'cheese-ingredient-document-id',
    },
  ],
});
```

---

## 🔐 Security Considerations

1. **API Token Storage**
   - Store tokens in environment variables (server-side)
   - Never expose tokens in client-side code
   - Use Next.js API routes as a proxy for client-side requests

2. **Permissions**
   - Use least-privilege principle
   - Create separate tokens for different operations
   - Regularly rotate tokens

3. **Validation**
   - Validate data on both frontend and backend
   - Use Strapi's built-in validation
   - Sanitize user inputs

---

## 🐛 Troubleshooting

**"Forbidden" or "Unauthorized" errors**
- Check API token is set correctly
- Verify permissions in Strapi Admin
- Ensure token hasn't expired

**"Relation not found" errors**
- Verify ingredient documentId exists
- Check relation is properly configured in schema
- Ensure ingredient is published (not draft)

**"Validation error"**
- Check required fields are provided
- Verify data types match schema
- Check enum values are valid

---

## 📚 Next Steps

1. Set up API token in Strapi
2. Configure permissions
3. Choose GraphQL or REST approach
4. Implement mutations
5. Create UI components for editing
6. Test thoroughly!

---

## 🔗 Related Documentation

- [Strapi API Tokens](https://docs.strapi.io/dev-docs/backend-customization/api-tokens)
- [Strapi GraphQL Mutations](https://docs.strapi.io/dev-docs/plugins/graphql#mutations)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)

