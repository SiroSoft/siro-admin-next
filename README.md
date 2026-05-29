# Siro Admin Starter

Production-ready admin frontend starter for [SiroPHP](https://sirophp.com) APIs.

Built with Next.js 15, TypeScript, TailwindCSS, shadcn/ui, React Query, and Zustand.

## Features

- **Authentication** — JWT login, refresh token, auto-persistence, Axios interceptor
- **Dashboard** — Stats cards, activity feed, API status widget
- **CRUD System** — Reusable data table, search, sort, pagination, filters, form dialogs, delete confirmation
- **Users Module** — Full example: list, create, edit, delete, search, filter, pagination, role/status badges
- **Dark Mode** — System-aware theme with toggle
- **Responsive** — Mobile sidebar, adaptive layouts
- **Type-Safe** — Full TypeScript with Zod validation
- **Clean Architecture** — Services, hooks, store, modules pattern

## Quick Start

```bash
# 1. Clone
git clone <repo-url> siro-admin
cd siro-admin

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your SiroPHP backend

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=Siro Admin
```

## API Connection

The admin expects a SiroPHP backend at `NEXT_PUBLIC_API_URL` with these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login |
| `/api/auth/refresh` | POST | Refresh token |
| `/api/auth/me` | GET | Current user |
| `/api/auth/logout` | POST | Logout |
| `/api/users` | GET | List users |
| `/api/users` | POST | Create user |
| `/api/users/{id}` | GET | Get user |
| `/api/users/{id}` | PUT | Update user |
| `/api/users/{id}` | DELETE | Delete user |
| `/api/dashboard/stats` | GET | Dashboard stats |

## Auth Flow

1. User logs in → backend returns `access_token`, `refresh_token`, `user`
2. Tokens stored in `localStorage`
3. Axios interceptor injects `Bearer` token on every request
4. On 401, interceptor automatically tries refresh token
5. If refresh fails, user is redirected to `/login`
6. On page load, `restoreSession()` checks for stored tokens

## Project Structure

```
src/
├── app/
│   ├── (auth)/                # Auth pages (login, forgot-password)
│   │   └── login/
│   ├── (dashboard)/           # Dashboard pages
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── users/             # Users CRUD module
│   │   ├── orders/            # Placeholder modules
│   │   ├── products/
│   │   ├── posts/
│   │   └── settings/
│   └── api/auth/refresh       # BFF refresh token route
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── data-table.tsx         # Reusable data table (TanStack Table)
│   ├── pagination.tsx         # Pagination component
│   ├── search-input.tsx       # Debounced search
│   ├── delete-dialog.tsx      # Delete confirmation
│   ├── loading-skeleton.tsx   # Loading skeletons
│   ├── empty-state.tsx        # Empty state display
│   ├── error-state.tsx        # Error state with retry
│   ├── page-header.tsx        # Page title + actions
│   └── status-badge.tsx       # Role/status badges
├── hooks/
│   ├── use-auth.ts            # Auth hooks + React Query
│   ├── use-users.ts           # Users CRUD hooks
│   ├── use-dashboard.ts       # Dashboard stats hook
│   ├── use-debounce.ts        # Debounce hook
│   └── use-toast.ts           # Toast notifications
├── layouts/
│   ├── dashboard-layout.tsx   # Main layout wrapper
│   ├── sidebar.tsx            # Desktop sidebar
│   ├── mobile-sidebar.tsx     # Mobile sidebar
│   ├── header.tsx             # Top header bar
│   └── user-nav.tsx           # User dropdown
├── modules/users/             # Example CRUD module
│   ├── components/
│   │   ├── user-table.tsx     # Users data table
│   │   ├── user-form.tsx      # User form (React Hook Form + Zod)
│   │   └── user-form-dialog.tsx
│   └── schemas/
│       └── user.schema.ts     # Zod validation schemas
├── providers/
│   ├── providers.tsx          # Providers composition
│   ├── query-provider.tsx     # TanStack Query
│   ├── theme-provider.tsx     # next-themes
│   └── auth-provider.tsx      # Route protection
├── services/
│   ├── api.ts                 # Axios instance + interceptors
│   ├── auth.service.ts        # Auth API calls
│   ├── users.service.ts       # Users API calls
│   └── dashboard.service.ts   # Dashboard API calls
├── store/
│   └── auth.store.ts          # Zustand auth store
├── types/
│   ├── api.ts                 # API response types
│   ├── auth.ts                # Auth types
│   ├── user.ts                # User types
│   └── dashboard.ts           # Dashboard types
└── lib/
    ├── utils.ts               # cn(), formatDate(), formatNumber()
    └── constants.ts           # App constants
```

## Adding a New Module

1. **Types** — Add type in `src/types/`
2. **Service** — Add API calls in `src/services/`
3. **Hooks** — Add React Query hooks in `src/hooks/`
4. **Schema** — Add Zod validation in `src/modules/{module}/schemas/`
5. **Components** — Create table, form, dialog in `src/modules/{module}/components/`
6. **Page** — Create page in `src/app/(dashboard)/{module}/`

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Lint check
npm run typecheck # TypeScript check
```

## Architecture

- **API Layer** — Axios with interceptors for auth, refresh, error handling
- **State** — Zustand for auth (persisted to localStorage), React Query for server state
- **Forms** — React Hook Form + Zod for type-safe validation
- **Tables** — TanStack Table for sortable, paginated data tables
- **Styling** — TailwindCSS + shadcn/ui with CSS variables for theming

## Future Integrations

- SiroTrace — Debug request viewer and replay
- API metrics dashboard
- Role-based permissions
- Multi-tenant SaaS support
- ERP modules (orders, inventory, invoicing)
