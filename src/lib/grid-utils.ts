/**
 * Enhanced Grid System Utilities
 * Provides utility functions and classes for responsive grid layouts
 */

import { cn } from './utils';

/**
 * Product grid responsive classes
 * Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns, Large: 4 columns
 */
export const productGridClasses = 'product-grid';

/**
 * Animation utility classes
 */
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
  bounceIn: 'animate-bounce-in',
} as const;

/**
 * Transition utility classes
 */
export const transitionClasses = {
  smooth: 'transition-smooth',
  fast: 'transition-fast',
  slow: 'transition-slow',
} as const;

/**
 * Hover effect utility classes
 */
export const hoverClasses = {
  lift: 'hover-lift',
  scale: 'hover-scale',
} as const;

/**
 * Focus utility classes
 */
export const focusClasses = {
  ring: 'focus-ring',
} as const;

/**
 * Utility function to combine grid classes with custom classes
 */
export function createGridClasses(customClasses?: string) {
  return cn(productGridClasses, customClasses);
}

/**
 * Utility function to create animated classes
 */
export function createAnimatedClasses(
  animation: keyof typeof animationClasses,
  customClasses?: string
) {
  return cn(animationClasses[animation], customClasses);
}

/**
 * Utility function to create hover effect classes
 */
export function createHoverClasses(
  effect: keyof typeof hoverClasses,
  customClasses?: string
) {
  return cn(hoverClasses[effect], customClasses);
}