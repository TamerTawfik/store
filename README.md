# Store Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

> 📚 **For more detailed information, check out our [Documentation](./documentation/) folder.**

## Quick Overview

This is an e-commerce store application built with Next.js, featuring modern web technologies and best practices for online retail.

## Why Next.js?

Next.js was chosen for this store application for several compelling reasons:

- **Server-Side Rendering (SSR)**: Provides better SEO performance and faster initial page loads, crucial for an e-commerce store
- **Static Site Generation (SSG)**: Enables pre-rendering of product pages for optimal performance
- **API Routes**: Built-in API functionality for handling backend operations without a separate server
- **File-based Routing**: Intuitive routing system that makes navigation structure clear and maintainable
- **Image Optimization**: Automatic image optimization with `next/image` for better performance
- **TypeScript Support**: Excellent TypeScript integration for better development experience and type safety
- **Vercel Deployment**: Seamless deployment experience with zero configuration
- **Hot Reloading**: Fast development experience with instant feedback during development

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.17 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TamerTawfik/store.git
cd store
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Local Development

1. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

3. The page auto-updates as you edit the file. You can start editing the page by modifying `app/(store)/page.tsx`.

### Development Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
