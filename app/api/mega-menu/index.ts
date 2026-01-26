/**
 * Server-side API functions for Mega Menu
 */

import { executeGraphQL } from '@/lib/graphql-server';
import { GET_MEGA_MENU } from '@/graphql/mega-menu';
import type { MegaMenuResponse } from '@/types/mega-menu';
import { print } from 'graphql';

/**
 * Fetch the Mega Menu from Strapi (server-side)
 * This function can be used in Server Components
 * Data is cached for 5 minutes by default
 */
export async function getMegaMenu(): Promise<MegaMenuResponse['megaMenu'] | null> {
  try {
    const data = await executeGraphQL<MegaMenuResponse>({
      query: print(GET_MEGA_MENU),
      revalidate: 300, // Cache for 5 minutes
      operationName: 'GetMegaMenu',
    });

    return data?.megaMenu || null;
  } catch (error) {
    console.error('Error fetching mega menu:', error);
    return null;
  }
}
