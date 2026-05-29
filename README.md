# Siro Admin — Next.js 15 Enterprise Starter

> **Production-ready admin panel for [SiroPHP](https://sirophp.com) — the zero-dependency PHP API framework.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery)](https://tanstack.com/query)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000000?logo=shadcnui)](https://ui.shadcn.com)

---

## ✨ Features

### Enterprise-Grade Dashboard
- **Real-time charts** — Revenue trends with interactive bar charts (Recharts)
- **Stats overview** — Users, orders, products, revenue at a glance
- **Activity feed** — Recent user signups and order activity
- **API health monitor** — Backend status, uptime, response time

### Complete Authentication
- JWT login with access + refresh token rotation
- Auto-persistent session with `Remember me` option
- Axios interceptor with automatic 401 → refresh → retry queue
- Route protection via AuthProvider middleware
- Forgot password flow ready to connect

### CRUD Modules
| Module   | List | Search | Sort | Paginate | Create | Edit | Delete |
|----------|------|--------|------|----------|--------|------|--------|
| Users    | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Orders   | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Products | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Posts    | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Categories | ✅ | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Tags     | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |

### Type Safety
- **OpenAPI-generated types** — `npm run generate:types` syncs TypeScript types from the backend OpenAPI spec
- **Zod validation** — All forms validated client-side before submission
- **End-to-end type safety** — From API response to UI component

### User Experience
- ⚡ **Shimmer skeletons** — Premium loading states matching content shape
- 🌓 **Dark mode** — System-aware with manual toggle, persistent preference
- 📱 **Fully responsive** — Adaptive sidebar, mobile overlay, scrollable tables
- ♿ **Accessible** — ARIA labels, focus-visible rings, keyboard navigation
- 🎯 **Toast notifications** — 4 variants (success, error, warning, info) with auto-dismiss
- 🧭 **Breadcrumbs** — Dynamic navigation path with every page

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/SiroSoft/siro-admin-next.git siro-admin
cd siro-admin

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your SiroPHP backend
# Default: http://localhost:8080

# 4. Generate types (sync with backend)
npm run generate:types

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — login with your SiroPHP backend credentials.

---

## 📸 What's Inside

### Dashboard
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  👥 Users    │  📦 Orders   │  🏷️ Products  │  💰 Revenue   │
│  1,234       │  456         │  789         │  $12,345     │
├──────────────┴──────────────┴──────────────┴──────────────┤
│  📊 Monthly Revenue Chart (Recharts)                      │
├───────────────────────────────────────────────────────────┤
│  🔄 Recent Activity                     │  ❤️ API Status  │
│  John joined • Order #123 created      │  ● Connected    │
│  ...
└───────────────────────────────────────────────────────────┘
```

### User Management
```
┌──────┬──────────┬────────────────┬──────────┬──────────┐
│  ID  │  Name    │  Email         │  Role    │  Status  │
├──────┼──────────┼────────────────┼──────────┼──────────┤
│  1   │  John    │  john@ex.com   │  Admin   │  Active  │
│  2   │  Jane    │  jane@ex.com   │  User    │  Active  │
│  ... │          │                │          │          │
└──────┴──────────┴────────────────┴──────────┴──────────┘
  < 1 | 2 | 3 ... 10 >    🔍 Search    ➕ New User
```

---

## 🔧 Architecture

```
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Login, forgot password
│   └── (dashboard)/         # Dashboard + all CRUD pages
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, input, table, etc.)
│   ├── data-table.tsx       # Reusable TanStack Table wrapper
│   ├── delete-dialog.tsx    # Confirm delete modal
│   ├── loading-skeleton.tsx # Shimmer loading states
│   ├── empty-state.tsx      # Empty data display
│   ├── error-state.tsx      # Error with retry button
│   └── status-badge.tsx     # Role/status colored badges
├── hooks/                   # React Query hooks per resource
├── layouts/                 # Dashboard shell, sidebar, header
├── modules/{resource}/      # Feature modules (form, table, schemas)
├── providers/               # React Context providers
├── services/                # Axios API service layer
├── store/                   # Zustand auth store
├── types/                   # OpenAPI-generated TypeScript types
└── lib/                     # Utilities (cn, formatDate, constants)
```

---

## 🔐 Auth Flow

```
┌─────────┐     POST /api/auth/login     ┌──────────┐
│  Login   │ ──────────────────────────→  │  SiroPHP  │
│  Page    │ ←──────────────────────────  │  Backend  │
└─────────┘     { token, refresh, user }  └──────────┘
                                                  │
                                          ┌───────┴───────┐
                                          │  localStorage  │
                                          │  access_token  │
                                          │  refresh_token │
                                          └───────┬───────┘
                                                  │
┌─────────┐     Axios Interceptor           ┌──────┴──────┐
│  Every   │ ────────────────────────────→  │  Attach     │
│  Request │                                │  Bearer     │
└─────────┘                                 │  Token      │
                                            └──────┬──────┘
                                                   │
                                          401? ────┤
                                                   │
                                          ┌────────┴────────┐
                                          │  POST /api/auth/ │
                                          │  refresh         │
                                          └────────┬────────┘
                                                   │
                                          ┌────────┴────────┐
                                          │  Retry original  │
                                          │  request         │
                                          └─────────────────┘
```

---

## 🔗 Integration with SiroPHP

This starter is designed for [**SiroPHP**](https://sirophp.com) — the production-first PHP API framework.

```bash
# Install SiroPHP backend
iwr https://sirophp.com/downloads/install.ps1 -UseBasicParsing | iex   # Windows
curl -sS https://sirophp.com/downloads/install.sh | bash               # Linux/macOS

# Generate resources & run
cd my-api
php siro serve  # → http://localhost:8080
```

**Auto-generated API types:**
```bash
# After updating your backend, regenerate types:
npm run generate:types
```
This runs `openapi-typescript` against your backend's OpenAPI spec, keeping frontend types always in sync.

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run generate:types` | Regenerate API types from backend OpenAPI spec |

---

## 🧰 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | [Next.js](https://nextjs.org) | 15 (App Router) |
| UI Engine | [React](https://react.dev) | 19 |
| Language | [TypeScript](https://www.typescriptlang.org) | 5.7 |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 3.4 |
| UI Library | [shadcn/ui](https://ui.shadcn.com) (Radix UI) | Latest |
| Data Fetching | [TanStack React Query](https://tanstack.com/query) | 5 |
| Tables | [TanStack React Table](https://tanstack.com/table) | 8 |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Latest |
| State | [Zustand](https://zustand-demo.pmnd.rs) | 5 |
| Charts | [Recharts](https://recharts.org) | Latest |
| HTTP Client | [Axios](https://axios-http.com) | Latest |
| Icons | [Lucide](https://lucide.dev) | Latest |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) | Latest |
| API Types | [openapi-typescript](https://openapi-ts.dev) | 7 |

---

## 📄 License

MIT — built for [SiroPHP](https://sirophp.com).

---

<p align="center">
  <a href="https://sirophp.com">
    <img src="https://sirophp.com/favicon.ico" width="32" height="32" alt="SiroPHP">
  </a>
  <br>
  <strong>Powered by <a href="https://sirophp.com">SiroPHP</a></strong> — 1 command, 0 dependency.
</p>
