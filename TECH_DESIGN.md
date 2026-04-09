# GlowCompare — Technical Design

> Phase: Architect → Develop | Last updated: April 2026

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client                          │
│         Next.js 16 App Router (React 19)            │
│         Tailwind CSS 4 + shadcn/ui (radix-nova)     │
└────────────────────┬────────────────────────────────┘
                     │ RSC / fetch / Supabase JS
          ┌──────────┴──────────┐
          │                     │
┌─────────▼──────────┐ ┌───────▼────────────┐
│  Next.js API Routes│ │  Supabase JS Client │
│  /app/api/**       │ │  (direct from RSC)  │
└─────────┬──────────┘ └───────┬────────────┘
          │                    │
┌─────────▼────────────────────▼────────────┐
│              Supabase (hosted)             │
│   PostgreSQL  │  Auth  │  Realtime (RLS)  │
└───────────────────────────────────────────┘
          │
┌─────────▼──────────┐
│   Resend (email)   │  ← Phase 2: price alerts
└────────────────────┘
```

---

## File & Folder Structure

```
glowcompare/
├── app/                          ← Next.js App Router (root, not src/app)
│   ├── layout.tsx                ← Root layout (ThemeProvider, fonts)
│   ├── page.tsx                  ← Home: trending grid
│   ├── globals.css
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx          ← /category/skincare, /category/makeup
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx          ← /products/:id — detail page
│   └── api/
│       ├── products/
│       │   └── route.ts          ← GET /api/products (list, filter, search)
│       └── wishlist/
│           └── route.ts          ← GET/POST/DELETE (auth-gated)
│
├── src/
│   ├── components/
│   │   ├── ui/                   ← shadcn/ui primitives (Button, Badge, etc.)
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── price-comparison-table.tsx
│   │   ├── trending-score-badge.tsx
│   │   ├── trending-breakdown.tsx
│   │   ├── category-tabs.tsx
│   │   ├── filter-panel.tsx
│   │   ├── search-bar.tsx
│   │   ├── navbar.tsx
│   │   └── wishlist-button.tsx
│   ├── lib/
│   │   ├── supabase.ts           ← Supabase client (browser + server)
│   │   └── utils.ts              ← cn(), formatPrice(), getBestPrice()
│   └── types/
│       └── index.ts              ← All TypeScript types
│
├── data/
│   ├── schema.sql                ← Supabase schema (applied)
│   └── seed/
│       └── products.json         ← 20 sample products
│
├── scripts/
│   └── seed.ts                   ← npm run seed
│
├── CLAUDE.md                     ← Project context for Claude Code
├── EPICS_AND_STORIES.md          ← User stories + sprint plan
└── TECH_DESIGN.md                ← This file
```

> **Note:** `@/*` path alias resolves to repo root, so `@/src/lib/supabase` and `@/components/navbar` both work.

---

## Data Flow

**Public browsing (no auth)** — React Server Components query Supabase directly:
```
Page (RSC) → supabase.from('products').select() → render
```

**Wishlist (auth required)** — client action hits API route with session check:
```
Client → POST /api/wishlist → verify Supabase session → insert row → 200
```

**Search** — client-side with debounce, hits API route:
```
SearchBar (client) → debounce 300ms → GET /api/products?q=niacinamide → results
```

---

## Database Schema

| Table | Rows per product | Access |
|---|---|---|
| `products` | 1 | Public read |
| `platform_prices` | 5 (one per platform) | Public read |
| `trending_signals` | 1 | Public read |
| `wishlist` | N (per user) | Auth + RLS |

### Trending Score Formula

```
composite = social×0.30 + bestseller×0.25 + rating×0.20 + search×0.15 + editorial×0.10
```

| Signal | Weight |
|---|---|
| Social media buzz | 30% |
| Platform bestseller rank | 25% |
| User ratings & reviews | 20% |
| Search volume | 15% |
| Editorial / influencer picks | 10% |

### Row Level Security

- `products`, `platform_prices`, `trending_signals` — public SELECT, no auth required
- `wishlist` — all operations restricted to `auth.uid() = user_id`

---

## API Routes

```
GET  /api/products
     ?q=<search>                  ← ilike search on name + brand
     ?category=skincare|makeup
     ?sub_category=serum,cleanser ← comma-separated
     ?brand=Minimalist,Plum       ← comma-separated
     ?min_price=<n>&max_price=<n> ← based on lowest platform price
     ?sort=trending|price_asc|price_desc
     ?page=1&limit=12

GET  /api/products/[id]           ← product + platform_prices + trending_signals

GET  /api/wishlist                ← auth required; returns user's saved products
POST /api/wishlist                ← body: { product_id }
DELETE /api/wishlist/[product_id]
PATCH /api/wishlist/[product_id]  ← body: { alert_price }
```

---

## Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Data fetching on browse pages | RSC + Supabase direct | No extra API hop; better performance |
| Auth-gated actions | Next.js API routes | Server-side session validation via Supabase |
| State management | React Context (auth) + local state | Zustand not needed at this scope |
| Search | API route + `ilike` query | Supabase full-text search is overkill for MVP |
| Styling | Tailwind 4 + radix-nova style | Already configured; consistent with shadcn setup |
| Image fallback | `placehold.co` in seed data | No real CDN/images in MVP |
| Trending score updates | Weekly cron (mock for MVP) | Matches PRD cadence; no live scraping |

---

## Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 16.1.7 |
| Language | TypeScript (strict) | 5.9.3 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.2.1 |
| Components | shadcn/ui (radix-nova) | 4.1.2 |
| Icons | Lucide React | 1.7.0 |
| Database | Supabase (PostgreSQL) | hosted |
| Auth | Supabase Auth | hosted |
| Email | Resend | Phase 2 |
| Hosting | Vercel | Phase 2 |

---

## Environment Variables

```bash
# .env.local — never committed
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # seed script only
RESEND_API_KEY=                 # Phase 2
```

---

## Sprint Plan (Phase 1)

| Sprint | Stories | Goal |
|---|---|---|
| **Sprint 1** | US-033, US-034, US-001, US-004 | Seed data + Homepage |
| Sprint 2 | US-002, US-003, US-015, US-016, US-017 | Browse + Search + Filters |
| Sprint 3 | US-029, US-030, US-011, US-012, US-014 | Product Detail + Prices |
| Sprint 4 | US-007, US-008, US-009, US-010 | Trending Score + Labels |
| Sprint 5 | US-019–US-025 | Auth + Wishlist |

### Sprint 1 Progress

- [x] Supabase schema — `data/schema.sql`
- [x] Seed data — `data/seed/products.json` (20 products)
- [ ] Supabase client — `src/lib/supabase.ts`
- [ ] TypeScript types — `src/types/index.ts`
- [ ] Seed script — `scripts/seed.ts`
- [ ] Homepage — `app/page.tsx`
