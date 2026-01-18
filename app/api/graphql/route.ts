/**
 * API Route to proxy GraphQL requests
 * This allows you to see GraphQL requests in the browser Network tab
 * 
 * Usage: Call this endpoint from client components if you want to see
 * requests in the Network tab for debugging purposes
 */

import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the GraphQL request to Strapi
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('GraphQL proxy error:', error);
    return NextResponse.json(
      { 
        errors: [{ 
          message: error instanceof Error ? error.message : 'Unknown error' 
        }] 
      },
      { status: 500 }
    );
  }
}

