# DevMetrics Dashboard

A production-ready Next.js 15 development metrics and deployment tracking dashboard built with TypeScript, Tailwind CSS v4, and advanced rendering strategies.

## Features

- **🚀 SSR Dashboard**: Real-time data fetched from the server on every request
- **📊 ISR Leaderboard**: Static generation with 60-second revalidation
- **📚 SSG Documentation**: Static documentation pages with dynamic parameter fallback
- **🎯 Server Actions**: Type-safe mutations with Zod validation
- **🌐 Embed SDK**: Self-contained npm package for iframe and WebView integrations
- **🔐 Edge Middleware**: JWT-based authentication at the edge
- **📱 Fully Responsive**: Optimized for 375px, 768px, and 1440px viewports
- **🌓 Dark Mode**: Server-side theme detection with cookie persistence
- **⚡ Streaming**: Real-time activity feed with SSE and Suspense
- **🧪 E2E Tests**: Comprehensive Vitest + Playwright test suite

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first)
- **Icons**: lucide-react
- **Validation**: Zod
- **Auth**: jose (Web Crypto API)
- **Testing**: Vitest + Playwright
- **Package Building**: tsup

## Project Structure

```
dev-metrics-dashboard/
├── src/
│   ├── app/
│   │   ├── dashboard/          # SSR dashboard page
│   │   ├── leaderboard/        # ISR leaderboard page
│   │   ├── docs/               # SSG documentation
│   │   ├── embed/              # Iframe & WebView embeds
│   │   ├── login/              # Authentication
│   │   ├── api/                # API endpoints
│   │   ├── globals.css         # Tailwind v4 config
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Layout components
│   │   └── dashboard/          # Dashboard-specific components
│   ├── types/                  # TypeScript types
│   ├── lib/                    # Utilities & API client
│   ├── actions/                # Server Actions
│   └── middleware.ts           # Edge middleware
├── packages/embed/             # Embed SDK package
├── __tests__/
│   ├── unit/                   # Unit tests
│   └── e2e/                    # E2E tests
├── .env.local                  # Environment variables
├── vitest.config.ts            # Vitest configuration
└── middleware.ts               # Edge middleware
```

## Environment Setup

### Prerequisites

- Node.js 18+ (20+ recommended)
- pnpm 9+ (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dev-metrics-dashboard

# Install dependencies
pnpm install

# Build the embed package
pnpm build
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://devmetrics-mock-api-production-5ed8.up.railway.app
JWT_SECRET=dev-secret-key-change-in-production
REVALIDATE_SECRET=revalidate-secret-key-change-in-production
```

## Usage

### Development

```bash
# Start dev server with Turbopack
pnpm dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build the entire project
pnpm build

# Start production server
pnpm start
```

### Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Watch mode
pnpm test

# UI dashboard
pnpm test:ui
```

## Architecture Decisions

### Rendering Strategies

1. **Dashboard (`/dashboard`)** - SSR with `export const dynamic = 'force-dynamic'`
   - Fresh data on every request
   - Personalized per session
   - Real-time activity feed with Suspense

2. **Leaderboard (`/leaderboard`)** - ISR with `export const revalidate = 60`
   - Cached for 60 seconds
   - On-demand revalidation via webhook

3. **Docs (`/docs/[slug]`)** - SSG with `generateStaticParams()`
   - Build-time generation
   - Dynamic fallback enabled
   - No server fetches at request time

### Component Architecture

- **Server Components** by default for all data fetching
- **Client Components** (`'use client'`) only for interactivity
- **Server Actions** for all mutations with Zod validation
- **useOptimistic()** for optimistic UI updates

### State Management

- Server-side state via database queries
- Form state with React hooks
- Optimistic updates with `useOptimistic()`
- Event stream with SSE

## API Endpoints

All API calls use `process.env.NEXT_PUBLIC_API_BASE_URL` and never hardcode URLs.

### Internal Endpoints

- `POST /api/revalidate` - Webhook for ISR revalidation

### External API (Mocked)

- `GET /api/deployments`
- `POST /api/deployments`
- `GET /api/services`
- `GET /api/metrics`
- `GET /api/metrics/stream` - Server-Sent Events
- `GET /api/leaderboard`
- `GET /api/incidents`
- `PATCH /api/incidents/:id/acknowledge`
- `GET /api/docs`
- `GET /api/docs/:slug`

## Embed SDK

The `@devmetrics/embed` package provides a zero-dependency embed solution.

### Installation

```bash
npm install @devmetrics/embed
```

### Usage

```javascript
import { init } from '@devmetrics/embed';

const embed = init('#my-container', {
  apiUrl: 'https://devmetrics-mock-api-production-5ed8.up.railway.app',
  theme: 'dark',
  onEvent: (event) => console.log(event),
});

// Ready
await embed.ready();

// Subscribe to events
embed.on('deployment_success', (data) => {
  console.log('Deployment:', data);
});

// Change theme
embed.setTheme('dark');

// Refresh data
embed.refresh();

// Cleanup
embed.destroy();
```

### Auto-initialization

```html
<div data-devmetrics-auto></div>
<script src="@devmetrics/embed/dist/index.mjs"></script>
```

## Responsive Design

All pages are fully functional at:
- **Mobile**: 375px (iPhone SE)
- **Tablet**: 768px (iPad)
- **Desktop**: 1440px (standard desktop)

Container queries are used for component-level responsive behavior.

## Authentication

- Edge Middleware protects `/dashboard` and `/leaderboard`
- JWT tokens stored in cookies
- Demo login: any email/password combination
- Token includes expiration claim

## Performance

- Tailwind CSS v4 with `@theme` blocks
- Optimized images in public directory
- CSS-first styling (no runtime CSS-in-JS)
- Server-side rendering where appropriate
- Streaming with Suspense boundaries
- 90+ Lighthouse Performance score target

## Dark Mode

- Server-side theme detection from cookie
- No flash of wrong theme on load
- CSS custom properties for theming
- Persisted preference across sessions

## TypeScript

- Strict mode enabled
- Zero TypeScript errors: `pnpm tsc --noEmit`
- All environment variables typed in `env.d.ts`
- Fully typed API client and components

## Testing

### Unit Tests

Located in `__tests__/unit/`
- API client functions
- Utility functions
- Date formatting
- Embed SDK

Run with: `pnpm test`

### E2E Tests

Located in `__tests__/e2e/`
- Page navigation
- Form interactions
- Responsive layouts (375px, 768px, 1440px)
- Theme switching
- API integration

Run with: `pnpm test:e2e` (requires running dev server)

## Deployment

### Vercel

1. Connect repository to Vercel
2. Set environment variables
3. Deploy (automatic builds with Turbopack)

### Self-hosted

```bash
# Build
pnpm build

# Start
pnpm start
```

## Performance Tips

- Use ISR for semi-static content (leaderboard)
- Use SSG for truly static content (docs)
- Use SSR sparingly for personalized content
- Leverage Suspense for long-running operations
- Implement proper caching headers

## Contributing

1. Follow TypeScript strict mode
2. Ensure `pnpm tsc --noEmit` passes
3. Add tests for new features
4. Run `pnpm lint` before committing

## License

MIT
