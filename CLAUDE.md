# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoCrew Marketing Site - Static Next.js 16 marketing website for the AutoCrew AI-powered automation platform. This repo contains only the marketing/public-facing pages. Login and signup pages are static demos (no backend).

## Key Commands

```bash
npm run dev          # Start Next.js development server on localhost:3000
npm run build        # Build the application for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run typecheck    # Run TypeScript compiler check
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run validate     # Run typecheck + lint + format:check
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router, React 19, Turbopack
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with custom dark mode theme
- **UI Components**: Shadcn UI (New York style) with Radix UI primitives
- **Charts**: Recharts (for dashboard preview on landing page)

### Route Structure

- **`app/(public)/`**: Marketing pages (landing, about, contact, contact-support)
- **`app/(auth)/`**: Static login and signup pages (no backend)
- **`app/docs/`**: Documentation pages

### Component Organization

```
components/
├── ui/              # Shadcn UI primitives (auto-generated, don't edit)
├── landing/         # Landing page sections (hero, features, pricing, etc.)
├── docs/            # Documentation components
├── layout/          # Public navigation, footer, docs sidebar
└── providers/       # Theme provider
```

### Styling & Design System

- Dark mode is the default and primary theme
- **Primary (Cyan/Teal)**: `--primary: 185 80% 50%`
- **Background**: Dark slate (`222 47% 11%`)
- All UI components use CSS variables with HSL color space
- Shadcn components are in `components/ui/` and should not be modified directly

### Key Directories

```
lib/
├── constants/       # App config, routes
├── contexts/        # Theme context (client-side only)
├── hooks/           # useTheme, useLocalStorage
├── mock-data/       # Static data for landing and docs
└── utils/           # cn, slug generator, validators, transformers
```

### Path Aliases

- `@/*` maps to root directory (configured in `tsconfig.json`)

## Development Notes

- All pages are static - no database, no API routes, no authentication backend
- Login/signup pages are visual demos only
- Landing page data comes from `lib/mock-data/landing-data.ts`
- Docs content comes from `lib/mock-data/docs-content.ts`
- Theme toggle uses localStorage (no backend)
