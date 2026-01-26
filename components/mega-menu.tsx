"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MEGA_MENU } from "@/graphql/mega-menu";
import type {
  MenuSection,
  MenuLink,
  MenuLinkType,
  MenuTeaser,
  MegaMenuResponse,
} from "@/types/mega-menu";
import { getStrapiImageUrl } from "@/lib/image-utils";

/**
 * URL generators for each link type
 */
const linkUrlGenerators: Record<MenuLinkType, (link: MenuLink) => string> = {
  recipe: (link) => link.recipe ? `/recipes/${link.recipe.documentId}` : "#",
  ingredient: (link) => link.ingredient ? `/ingredients/${link.ingredient.slug}` : "#",
  meal_plan: (link) => {
    // Link to meal prep page - if we have weekStartDate, link to that date, otherwise just the list page
    if (link.mealPrepPlan?.weekStartDate) {
      // weekStartDate should already be in YYYY-MM-DD format from Strapi
      // But ensure it's properly formatted
      const dateStr = link.mealPrepPlan.weekStartDate;
      // If it's already in YYYY-MM-DD format, use it directly
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.log("dateStr", dateStr);
        return `/meal-prep/${dateStr}`;
      }
      // Otherwise, try to parse and format it
      try {
        const date = new Date(dateStr);
        const formattedDate = date.toISOString().split("T")[0];
        return `/meal-prep/${formattedDate}`;
      } catch {
        return "/meal-prep";
      }
    }
    return link.mealPrepPlan ? "/meal-prep" : "#";
  },
  "meal-slot": () => "#", // Meal slot links not yet implemented
  "custom-url": (link) => link.customUrl || "#",
};

/**
 * Get the URL for a menu link based on its type
 */
function getMenuLinkUrl(link: MenuLink): string {
  // If customUrl is provided, use it directly (regardless of linkType)
  if (link.customUrl) {
    return link.customUrl;
  }

  // Get the appropriate URL generator for the link type
  const generator = linkUrlGenerators[link.linkType];
  return generator ? generator(link) : "#";
}

/**
 * Get the title for a menu teaser
 */
function getTeaserTitle(teaser: MenuTeaser): string {
  if (teaser.title) return teaser.title;
  if (teaser.recipe) return teaser.recipe.title;
  return "Featured";
}

/**
 * Get the image URL for a menu teaser
 */
function getTeaserImageUrl(teaser: MenuTeaser): string | null {
  if (teaser.image?.url) {
    return getStrapiImageUrl(teaser.image.url);
  }
  // If no image in teaser, you could fetch recipe image here if needed
  return null;
}

/**
 * Get the link URL for a menu teaser
 */
function getTeaserLinkUrl(teaser: MenuTeaser): string {
  if (teaser.recipe) return `/recipes/${teaser.recipe.documentId}`;
  return "#";
}

interface MenuSectionDropdownProps {
  section: MenuSection;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function MenuSectionDropdown({
  section,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
  buttonRef,
}: MenuSectionDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [rightOffset, setRightOffset] = useState(0);

  useEffect(() => {
    if (isOpen && buttonRef?.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 600; // w-[600px]
      const padding = 16; // 1rem = 16px

      // Calculate right offset: distance from button right edge to viewport right edge
      const buttonRight = buttonRect.right;
      const distanceToRight = viewportWidth - buttonRight;

      // If dropdown would overflow, position it so right edge aligns with viewport right
      if (distanceToRight < dropdownWidth) {
        // Position from viewport right edge
        const newRightOffset = viewportWidth - buttonRect.right;
        setRightOffset(-newRightOffset);
      } else {
        // Position normally from button right edge
        setRightOffset(0);
      }
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-2 w-[600px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        right: rightOffset,
        left: "auto",
      }}
    >
      <div className="flex">
        {/* Links Column */}
        <div className="flex-1 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {section.sectionLabel}
          </h3>
          <ul className="space-y-2">
            {section.menuLinks.map((link, index) => {
              const url = getMenuLinkUrl(link);
              const isExternalUrl =
                link.linkType === "custom-url" &&
                link.customUrl &&
                (link.customUrl.startsWith("http://") ||
                  link.customUrl.startsWith("https://"));

              // For external URLs, use regular anchor tag
              if (isExternalUrl) {
                return (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onLinkClick}
                      className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      {link.linkText}
                    </a>
                  </li>
                );
              }

              // For internal URLs, use Next.js Link
              return (
                <li key={index}>
                  <Link
                    href={url}
                    onClick={onLinkClick}
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {link.linkText}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Teaser Column */}
        {section.teaserColumn && (
          <div className="w-[250px] border-l border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
            <Link
              href={getTeaserLinkUrl(section.teaserColumn)}
              onClick={onLinkClick}
              className="block group"
            >
              {getTeaserImageUrl(section.teaserColumn) && (
                <div className="mb-3 overflow-hidden rounded-lg">
                  <img
                    src={getTeaserImageUrl(section.teaserColumn)!}
                    alt={getTeaserTitle(section.teaserColumn)}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {getTeaserTitle(section.teaserColumn)}
              </h4>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

interface MegaMenuProps {
  className?: string;
}

export function MegaMenu({ className = "" }: MegaMenuProps) {
  const { data, loading, error } = useQuery<MegaMenuResponse>(GET_MEGA_MENU);
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRefs = useRef<{
    [key: number]: React.RefObject<HTMLButtonElement | null>;
  }>({});

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenSectionIndex(index);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow moving to dropdown
    timeoutRef.current = setTimeout(() => {
      setOpenSectionIndex(null);
    }, 150);
  };

  const handleLinkClick = () => {
    // Close the menu immediately when a link is clicked
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenSectionIndex(null);
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    );
  }

  if (error) {
    console.error("Mega Menu Error:", error);
    return null;
  }

  if (!data?.megaMenu) {
    console.warn("Mega Menu: No data received");
    return null;
  }

  const { menuSections } = data.megaMenu;

  if (!menuSections || menuSections.length === 0) {
    return null;
  }

  return (
    <nav
      className={`relative flex items-center gap-1 ${className}`}
      style={{ position: "relative" }}
    >
      {menuSections.map((section: MenuSection, index: number) => {
        // Get or create ref for this button
        if (!buttonRefs.current[index]) {
          buttonRefs.current[index] =
            React.createRef<HTMLButtonElement | null>();
        }
        const buttonRef = buttonRefs.current[index];

        return (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={buttonRef}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                openSectionIndex === index
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400"
              }`}
            >
              <span>{section.sectionLabel}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  openSectionIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

          <MenuSectionDropdown
            section={section}
            isOpen={openSectionIndex === index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onLinkClick={handleLinkClick}
            buttonRef={buttonRef}
          />
          </div>
        );
      })}
    </nav>
  );
}
