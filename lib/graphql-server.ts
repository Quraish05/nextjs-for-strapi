/**
 * Server-side GraphQL client for Next.js Server Components
 * Uses native fetch instead of Apollo Client (which is client-side only)
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, any>;
  }>;
}

/**
 * Execute a GraphQL query on the server
 */
export async function executeGraphQL<T>({
  query,
  variables,
  revalidate = 60, // Revalidate every 60 seconds by default
  operationName,
}: {
  query: string;
  variables?: Record<string, any>;
  revalidate?: number;
  operationName?: string;
}): Promise<T> {
  const startTime = Date.now();
  const queryName = operationName || query.split('(')[0].replace(/query|mutation/, '').trim() || 'Unknown';

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate }, // Next.js caching
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ [GraphQL Request Failed]`);
      console.error(`   Operation: ${queryName}`);
      console.error(`   Status: ${response.status} ${response.statusText}`);
      console.error(`   Duration: ${duration}ms`);
      console.error(`   Response:`, errorText);
      if (variables) {
        console.error(`   Variables:`, JSON.stringify(variables, null, 2));
      }
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors) {
      console.error(`\n❌ [GraphQL Query Errors]`);
      console.error(`   Operation: ${queryName}`);
      console.error(`   Duration: ${duration}ms`);
      console.error(`   Errors:`, JSON.stringify(result.errors, null, 2));
      if (variables) {
        console.error(`   Variables:`, JSON.stringify(variables, null, 2));
      }
      throw new Error(
        `GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`
      );
    }

    if (!result.data) {
      console.error(`\n❌ [GraphQL No Data]`);
      console.error(`   Operation: ${queryName}`);
      console.error(`   Duration: ${duration}ms`);
      console.error(`   Response:`, JSON.stringify(result, null, 2));
      throw new Error('No data returned from GraphQL query');
    }

    // Success logging - show what was returned
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n✅ [GraphQL Success]`);
      console.log(`   Operation: ${queryName}`);
      console.log(`   Duration: ${duration}ms`);
      
      // Show response structure and data counts
      const dataKeys = Object.keys(result.data);
      console.log(`   Response Keys: ${dataKeys.join(', ')}`);
      
      // Show data summary (counts, lengths, etc.)
      for (const key of dataKeys) {
        const value = (result.data as any)[key];
        if (Array.isArray(value)) {
          console.log(`   ${key}: Array[${value.length}]`);
          if (value.length > 0 && value[0]) {
            const firstItemKeys = Object.keys(value[0]);
            console.log(`      Sample keys: ${firstItemKeys.slice(0, 5).join(', ')}${firstItemKeys.length > 5 ? '...' : ''}`);
          }
        } else if (value && typeof value === 'object') {
          const objKeys = Object.keys(value);
          console.log(`   ${key}: Object{${objKeys.join(', ')}}`);
        } else {
          console.log(`   ${key}: ${typeof value}`);
        }
      }
      
      // Show full response data (truncated if too large)
      const responseStr = JSON.stringify(result.data, null, 2);
      if (responseStr.length > 1000) {
        console.log(`   Response Data (truncated):`, responseStr.substring(0, 1000) + '...');
      } else {
        console.log(`   Response Data:`, result.data);
      }
    }

    return result.data;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`\n❌ [GraphQL Request Error]`);
    console.error(`   Operation: ${queryName}`);
    console.error(`   Duration: ${duration}ms`);
    console.error(`   Error:`, error instanceof Error ? error.message : error);
    if (variables) {
      console.error(`   Variables:`, JSON.stringify(variables, null, 2));
    }
    throw error;
  }
}

