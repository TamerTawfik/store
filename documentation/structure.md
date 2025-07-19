# Project Structure

## Root Directory

- `src/` - All source code
- `public/` - Static assets (SVG icons)
- `.kiro/` - Kiro configuration and steering
- `.next/` - Next.js build output
- `node_modules/` - Dependencies

## Source Organization (`src/`)

### Core Application

- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with fonts and metadata
  - `globals.css` - Global styles and Tailwind imports
  - `(store)/` - Store-related pages (route groups)

### Components

- `components/` - Reusable UI components
  - `ui/` - shadcn/ui components
  - `cart/` - Shopping cart components
  - `product/` - Product display components
  - Shared components: `Header.tsx`, `LoadingSpinner.tsx`, `ErrorMessage.tsx`

### Business Logic

- `hooks/` - Custom React hooks
  - `useCart.ts` - Cart management logic
  - `useProducts.ts` - Product data fetching
- `store/` - Zustand state management
  - `cartStore.ts` - Global cart state
- `services/` - External API integration
  - `api.ts` - FakeStore API client

### Utilities & Types

- `lib/` - Shared utilities and configurations
  - `utils.ts` - Common utility functions
- `types/` - TypeScript type definitions
  - `product.ts` - Product-related types
- `utils/` - Helper functions
  - `helpers.ts` - General helper utilities

## Naming Conventions

- Components: PascalCase (e.g., `LoadingSpinner.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useCart.ts`)
- Types: PascalCase interfaces/types
- Files: camelCase for utilities, PascalCase for components
- Folders: lowercase with hyphens for multi-word names

## Import Patterns

- Use `@/` alias for all internal imports
- Group imports: external libraries first, then internal modules
- Prefer named exports over default exports for utilities
