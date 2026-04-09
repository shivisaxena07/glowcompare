# GlowCompare — Project Context for Claude Code

## What This Is
GlowCompare is a B2C web + mobile app that helps everyday beauty shoppers in India discover trending skincare and makeup products and compare prices across 5 platforms: **Nykaa, Tira, Amazon, Flipkart, and Purplle**.

Built as a solo portfolio project following the **AIDLC (AI-assisted Integrated Development Lifecycle)** methodology.

---

## Current Phase
**Phase 2 — Architect** (Phase 1 / Ideate is complete. PRD is finalized.)

---

## Tech Stack (Decided)

| Layer | Choice |
|---|---|
| Frontend (Web) | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Mobile | React Native (Expo) — Phase 2 |
| Backend | Next.js API Routes → Node.js + Express (Phase 2) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| Email Alerts | Resend |
| Hosting | Vercel (web) + Supabase (DB) |
| State Management | Zustand or React Context |
| Version Control | GitHub |

---

## Core Data Model

### products
```
id, name, brand, category (skincare | makeup), sub_category,
description, image_url, trending_score, ingredients_summary, created_at
```

### platform_prices
```
id, product_id (FK), platform (nykaa | tira | amazon | flipkart | purplle),
price, original_price, discount_pct, url, availability, last_updated
```

### users
```
id, email, created_at  ← managed by Supabase Auth
```

### wishlist
```
id, user_id (FK), product_id (FK), alert_price (nullable),
alert_active (boolean), created_at
```

### trending_signals
```
id, product_id (FK), social_score, bestseller_score, rating_score,
search_score, editorial_score, composite_score, updated_at
```

---

## MVP Feature Scope

### Must Have (Phase 1)
- Browse trending products (sorted by composite trending score)
- Price comparison across 5 platforms on product detail page
- Product detail page (description, ingredients summary, prices)
- Category + filter navigation (brand, sub-category, price range, skin type)
- Search by product name or brand

### Should Have (Phase 1–2)
- Wishlist / favourites (requires auth)
- Price drop alerts via email (Resend)

### Out of Scope for MVP
- Live pricing (scraping or APIs) — mock/seed data only
- Native iOS/Android app — web-first
- User reviews or community features
- Haircare, fragrance, wellness categories
- Monetisation (affiliate links) — architecture supports it, not activated

---

## Trending Score Logic
Composite 0–100 score from 5 weighted signals. MVP values are manually seeded.

| Signal | Weight |
|---|---|
| Social media buzz (Instagram, YouTube) | 30% |
| Platform bestseller rank | 25% |
| User ratings & reviews | 20% |
| Search volume (Google Trends) | 15% |
| Editorial / influencer picks | 10% |

---

## Key User Flows

**Discovery:** Home → Trending products → Filter by category → Product detail → Compare prices → Save to wishlist

**Price Comparison:** Search product → Product detail → See prices across all 5 platforms → "Best Price" badge highlights cheapest → Set price alert

**Price Alert:** Save to wishlist → Set target price → Weekly check (mock job) → Email when price drops

---

## UX Decisions
- Browse without account (no auth wall for discovery)
- Auth required only for wishlist + price alerts
- "Best Price" badge auto-highlights lowest price on comparison table
- Trending score breakdown visible on hover/tap
- Data labeled as "sample data" in UI (MVP transparency)

---

## Coding Conventions
- TypeScript strict mode
- Functional components only (no class components)
- API routes in `/app/api/`
- DB queries via Supabase JS client
- Environment variables in `.env.local` (never committed)
- Components in `/components`, pages in `/app`
- Seed data in `/data/seed/`

---

## What NOT to Build Yet
- Do not implement scraping logic
- Do not build admin dashboard (Phase 2)
- Do not activate affiliate link logic
- Do not build React Native app yet
- Do not add haircare/fragrance categories

---

## Open Decisions (To Resolve During Build)
- Final app name (GlowCompare is placeholder)
- Initial product seed list (200 products across skincare + makeup)
- Whether price alerts are email-only or also in-app (lean: email only for MVP)
- Trending score update cadence (lean: weekly cron job)
