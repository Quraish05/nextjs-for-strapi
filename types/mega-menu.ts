/**
 * Mega Menu types for GraphQL queries
 */

export type MenuLinkType = 'recipe' | 'meal_plan' | 'meal-slot' | 'ingredient' | 'custom-url';

export interface MenuLink {
  linkText: string;
  linkType: MenuLinkType;
  customUrl?: string | null;
  recipe?: {
    documentId: string;
    title: string;
    coverImage?: {
      url: string;
      alternativeText?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
  } | null;
  ingredient?: {
    documentId: string;
    name: string;
    slug: string;
  } | null;
  mealPrepPlan?: {
    documentId: string;
    title: string;
    weekStartDate?: string | null;
  } | null;
}

export interface MenuTeaser {
  title?: string | null;
  recipe?: {
    documentId: string;
    title: string;
  } | null;
  image?: {
    url: string;
    alternativeText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
}

export interface MenuSection {
  sectionLabel: string;
  menuLinks: MenuLink[];
  teaserColumn?: MenuTeaser | null;
}

export interface MegaMenu {
  menuTitle?: string | null;
  menuSections: MenuSection[];
}

export interface MegaMenuResponse {
  megaMenu: MegaMenu;
}
