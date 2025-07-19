# Technology Stack

## Framework & Runtime

- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Node.js** - Runtime environment

## Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York style)
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Motion** - Animation library
- **Geist fonts** - Typography (Sans & Mono)

## State Management & Data

- **Zustand** - Lightweight state management
- **FakeStore API** - External product data source

## Development Tools

- **ESLint** - Code linting with Next.js config
- **Turbopack** - Fast bundler for development

## Common Commands

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Configuration

- Path aliases configured with `@/*` pointing to `src/*`
- Remote image patterns configured for fakestoreapi.com
- CSS variables enabled for theming
- Strict TypeScript configuration
