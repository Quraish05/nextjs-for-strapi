import { gql } from '@apollo/client';
import {
  MENU_SECTION_FRAGMENT,
  MENU_LINK_FRAGMENT,
  MENU_TEASER_FRAGMENT,
  RECIPE_BASIC_FRAGMENT,
  RECIPE_WITH_IMAGE_FRAGMENT,
  INGREDIENT_IMAGE_FRAGMENT,
} from './fragments';

export const GET_MEGA_MENU = gql`
  query GetMegaMenu {
    megaMenu {
      menuTitle
      menuSections {
        ...MenuSection
      }
    }
  }
  ${MENU_SECTION_FRAGMENT}
  ${MENU_LINK_FRAGMENT}
  ${MENU_TEASER_FRAGMENT}
  ${RECIPE_BASIC_FRAGMENT}
  ${RECIPE_WITH_IMAGE_FRAGMENT}
  ${INGREDIENT_IMAGE_FRAGMENT}
`;
