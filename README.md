<p align="center">
  <img src="public/logo.svg" width="80" height="80" alt="Siro Admin">
</p>

<h1 align="center">Siro Admin — Next.js</h1>

<p align="center">
  <strong>Enterprise admin panel for <a href="https://sirophp.com">SiroPHP</a> — the zero-dependency PHP API framework.</strong>
  <br>
  One backend. Two frontends. Zero duplication.
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/🚀-Features-2563eb" alt="Features"></a>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/⚡-Quick_Start-16a34a" alt="Quick Start"></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/🏗️-Architecture-dc2626" alt="Architecture"></a>
  <a href="#-api-contract"><img src="https://img.shields.io/badge/📋-API_Contract-ca8a04" alt="API Contract"></a>
</p>

<p align="center">
  <a href="https://github.com/SiroSoft/siro-admin-nuxt"><img src="https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt" alt="Nuxt 3"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js" alt="Next.js 15"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript 5.7"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS"></a>
  <a href="https://ui.shadcn.com"><img src="https://img.shields.io/badge/shadcn/ui-latest-000000?logo=shadcnui" alt="shadcn/ui"></a>
  <a href="https://tanstack.com/query"><img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery" alt="TanStack Query 5"></a>
</p>

<br>

---

```bash
# One command to start:
cp .env.example .env.local && npm install && npm run dev
# → http://localhost:3000
```

---

## 🚀 Features

### 📊 Enterprise Dashboard
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  👥 Users    │  📦 Orders   │  🏷️ Products  │  💰 Revenue   │
│  1,234       │  456         │  789         │  $12,345     │
├──────────────┴──────────────┴──────────────┴──────────────┤
│  📈 Monthly Revenue (Bar Chart - Recharts)                │
├───────────────────────────────────────────────────────────┤
│  🔄 Recent Activity              │  ❤️ API Health          │
│  John joined 2m ago             │  ● Connected 0.2ms     │
│  Order #1234 created 5m ago     │  v0.32.0               │
│  ...                            │                        │
└───────────────────────────────────────────────────────────┘
```

### 🔐 Complete Auth System
- JWT login with access + refresh token rotation
- Auto-persistent session with "Remember me"
- Axios interceptor: auto-retry with token refresh queue
- Route guards protect all pages
- Forgot password flow ready

### 📋 6 Full CRUD Modules
| Module | List | Search | Sort | Paginate | Create | Edit | Delete | Bulk |
|--------|------|--------|------|----------|--------|------|--------|------|
| Users | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Products | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Posts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Categories | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Tags | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |

### 🎨 Enterprise UI/UX
- **Rich Text Editor** — Tiptap-based with Bold/Italic/Headings/Lists/Quote
- **Image Upload** — Drag & drop, URL paste, preview with remove
- **Searchable Select** — Combobox for products, users, categories
- **Dark Mode** — System-aware with manual toggle
- **Responsive** — Mobile, tablet, desktop adaptive layouts
- **Accessibility** — ARIA labels, focus rings, keyboard nav, reduced motion
- **Micro-interactions** — Button press, card hover lift, toast zoom, page transitions

### 🔗 Auto-Generated Types
```bash
npm run generate:types
# → src/types/api.ts  (from OpenAPI spec)
# Frontend & backend types always in sync
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- A running [SiroPHP](https://sirophp.com) backend (or any REST API)

### Setup

```bash
# 1. Clone
git clone https://github.com/SiroSoft/siro-admin-next.git my-admin
cd my-admin

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your backend
# Default: http://localhost:8080

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the login page.

### With SiroPHP Backend

```bash
# Terminal 1: Start the backend
iwr https://sirophp.com/downloads/install.ps1 -UseBasicParsing | iex   # Windows
curl -sS https://sirophp.com/downloads/install.sh | bash               # Linux/macOS
cd my-api
php siro db:seed           # Seed demo data
php siro serve             # → http://localhost:8080

# Terminal 2: Start the admin
cd my-admin
npm run dev                 # → http://localhost:3000
```

**Default login:** Register a new account → first user gets `admin` role automatically.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                     BROWSER                          │
│  ┌────────────────────────────────────────────────┐ │
│  │           React 19 + Next.js 15                │ │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐  │ │
│  │  │  Pages   │ │Components│ │   Providers    │  │ │
│  │  │  (Auth)  │ │ (UI/shadcn)│ │ (Auth, Query,   │ │
│  │  │  (Dash)  │ │ (Modules)│ │  Theme)        │  │ │
│  │  └────┬────┘ └────┬─────┘ └───────┬────────┘  │ │
│  └───────┼───────────┼───────────────┼───────────┘ │
└──────────┼───────────┼───────────────┼─────────────┘
           │           │               │
     ┌─────▼───────────▼───────────────▼──────────┐
     │              Services Layer                │
     │  ┌──────────┐ ┌──────────┐ ┌────────────┐ │
     │  │  Axios   │ │  React   │ │  Zustand   │ │
     │  │ Instance │ │  Query   │ │  (Auth)    │ │
     │  │+Refresh  │ │  Hooks   │ │  Store     │ │
     │  │  Queue   │ │          │ │            │ │
     │  └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
     └───────┼────────────┼──────────────┼────────┘
             │            │              │
     ┌───────▼────────────▼──────────────▼────────┐
     │           OpenAPI Types                    │
     │    src/types/api.ts (auto-generated)       │
     └────────────────┬──────────────────────────┘
                      │ HTTP/JSON
     ┌────────────────▼──────────────────────────┐
     │         SiroPHP API (Backend)              │
     │  sirophp.com/downloads/install.ps1 | iex   │
     └───────────────────────────────────────────┘
```

---

## 📋 API Contract

All endpoints follow the [Siro API Response Contract v1](docs/conventions/responses.md).

### Standard Response Envelope

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "last_page": 5,
    "timestamp": "2026-05-29T12:00:00+00:00"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run lint` | Lint & format check |
| `npm run typecheck` | TypeScript checking |
| `npm run generate:types` | Regenerate API types from OpenAPI spec |

---

## 🧩 Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) | React meta-framework |
| **UI Engine** | [React 19](https://react.dev) | Component rendering |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org) | Type safety |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com) | Utility-first CSS |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com) (Radix UI) | Accessible primitives |
| **Data Fetching** | [TanStack React Query 5](https://tanstack.com/query) | Server state |
| **Tables** | [TanStack React Table 8](https://tanstack.com/table) | Data tables |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Form validation |
| **State** | [Zustand 5](https://zustand-demo.pmnd.rs) | Client state |
| **Rich Text** | [Tiptap](https://tiptap.dev) | WYSIWYG editor |
| **Charts** | [Recharts](https://recharts.org) | Dashboard charts |
| **HTTP** | [Axios](https://axios-http.com) | API client |
| **Icons** | [Lucide](https://lucide.dev) | Icon set |
| **Types** | [openapi-typescript 7](https://openapi-ts.dev) | Auto-generated types |
| **Tests** | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) | Testing |

---

## 🔗 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **SiroPHP** | Zero-dependency PHP API framework | [github.com/SiroSoft/SiroPHP](https://github.com/SiroSoft/SiroPHP) |
| **Siro Admin (Nuxt)** | Vue 3 version of this starter | [github.com/SiroSoft/siro-admin-nuxt](https://github.com/SiroSoft/siro-admin-nuxt) |
| **Siro Installer** | One-liner installer scripts | [github.com/SiroSoft/siro-installer](https://github.com/SiroSoft/siro-installer) |

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/SiroSoft">SiroSoft</a>
  <br>
  <sub>MIT License · 2026</sub>
</p>
