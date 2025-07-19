/**
 * Enhanced Design System Tokens
 * Provides access to design tokens defined in globals.css
 */

export const designTokens = {
  colors: {
    primary: {
      50: 'var(--primary-50)',
      500: 'var(--primary-500)',
      600: 'var(--primary-600)',
      700: 'var(--primary-700)',
    },
    semantic: {
      success: 'var(--success)',
      warning: 'var(--warning)',
      error: 'var(--error)',
      info: 'var(--info)',
    },
    neutral: {
      50: 'var(--gray-50)',
      100: 'var(--gray-100)',
      500: 'var(--gray-500)',
      900: 'var(--gray-900)',
    },
  },
  typography: {
    sizes: {
      xs: 'var(--text-xs)',
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      lg: 'var(--text-lg)',
      xl: 'var(--text-xl)',
      '2xl': 'var(--text-2xl)',
      '3xl': 'var(--text-3xl)',
    },
    weights: {
      normal: 'var(--font-normal)',
      medium: 'var(--font-medium)',
      semibold: 'var(--font-semibold)',
      bold: 'var(--font-bold)',
    },
  },
  spacing: {
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    6: 'var(--space-6)',
    8: 'var(--space-8)',
    12: 'var(--space-12)',
    16: 'var(--space-16)',
  },
  animation: {
    timing: {
      easeInOut: 'var(--ease-in-out)',
      easeOut: 'var(--ease-out)',
      easeIn: 'var(--ease-in)',
    },
    duration: {
      fast: 'var(--duration-fast)',
      normal: 'var(--duration-normal)',
      slow: 'var(--duration-slow)',
    },
  },
  shadows: {
    card: 'var(--shadow-card)',
    cardHover: 'var(--shadow-card-hover)',
    product: 'var(--shadow-product)',
  },
} as const;

export type DesignTokens = typeof designTokens;