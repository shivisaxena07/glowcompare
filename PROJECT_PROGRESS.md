# GlowCompare — Project Progress

> Complete build log — what has been built, what's pending, file locations, and key decisions made during development.

## Current Phase
**Phase 1 complete + post-launch polish ongoing (April 2026).** App is live on Vercel with auto-deploy on push to main. GitHub: `shivisaxena07/glowcompare`. All auth bugs fixed, mobile responsiveness added, UI enhanced with gamified scroll, redesigned marquee, redesigned auth pages, and favicon.

---

## What Is Built

### Foundation & Config
- `.env.local` — Supabase URL, anon key, service role key configured (no spaces after `=`)
- `next.config.mjs` — `placehold.co` in `remotePatterns` with `pathname: '/**'` (required in Next.js 16); `dangerouslyAllowSVG: true` + `contentDispositionType: 'attachment'`
- `declarations.d.ts` — global `declare module '*.css'` for TypeScript 5.x strict side-effect import check
- `vitest.config.ts` + `vitest.setup.ts` — Vitest + jsdom + Testing Library configured
- `package.json` scripts: `seed`, `test`, `test:run` added
- Dependencies added: `@supabase/supabase-js`, `tsx`, `dotenv-cli`, `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`

### Design System
- **Primary color**: Hot pink `#FF2D95` — CSS token `--color-glow-primary` → Tailwind class `glow-primary`
- **Black**: `#0F172A` — CSS token `--color-glow-black` → Tailwind class `glow-black`
- **Background**: `#FAFAF8` off-white
- **Display font**: Space Grotesk (500/600/700) — CSS variable `--font-display` → Tailwind class `font-display`. Used for all headings, prices, logo.
- **Body font**: DM Sans — existing `--font-sans`
- **Card language**: 2px black borders, sharp (no border-radius), hover = pink border + `4px 4px 0 #0F172A` offset shadow + `-translate-y-0.5` lift
- **Trending badges**: solid blocks (no pills) — hot 80+ = pink/white, rising 50–79 = amber/black, neutral = stone
- Both fonts loaded in `app/layout.tsx` and registered in `app/globals.css` via `@theme inline`

### Data Layer
- `data/schema.sql` — full PostgreSQL schema (products, platform_prices, trending_signals, wishlist + RLS)
- `data/seed/products.json` — 20 sample products with platform prices and trending signals
- `scripts/seed.ts` — idempotent seed script; clears and re-inserts all data; run with `npm run seed`
- Supabase seeded: 20 products, 100 platform price rows, 20 trending signal rows

### Type System & Lib
- `src/types/index.ts` — `Product`, `PlatformPrice`, `TrendingSignals`, `WishlistItem`, `ProductWithPrices`, `ProductWithAll`
- `src/lib/supabase.ts` — browser client (`supabase`) + `createServerClient()` for service-role use
- `lib/utils.ts` — `cn()`, `formatPrice()` (INR, no paise), `getBestPrice()` (ignores unavailable platforms)

### Auth & Wishlist (Sprint 5 + post-launch fixes)
- `src/context/auth-context.tsx` — React Context; exposes `user`, `session`, `loading`, `wishlistIds` (Set), `signUp`, `signIn`, `signOut`, `addToWishlistIds`, `removeFromWishlistIds`. `signUp()` returns `needsConfirmation: boolean` and passes dynamic `emailRedirectTo` using `window.location.origin`.
- `app/auth/callback/route.ts` — GET handler for Supabase PKCE email confirmation; exchanges `?code=` for session; redirects to `/`
- `app/auth/signup/page.tsx` — **Redesigned**: split-panel layout. Left: black brand panel with perks checklist + platform strip. Right: form panel. Only auto-redirects if `needsConfirmation` is false.
- `app/auth/login/page.tsx` — **Redesigned**: split-panel layout. Left: black brand panel with bold headline + trend score bars + stats. Right: form panel. Responsive — left panel hidden on mobile.
- `components/login-modal.tsx` — Modal for unauthenticated wishlist tap (US-021)
- `components/wishlist-button.tsx` — Client component; optimistic toggle; shows login modal if not authed
- `app/api/wishlist/route.ts` — GET + POST; auth via `Authorization: Bearer <token>`
- `app/api/wishlist/[product_id]/route.ts` — DELETE; auth-gated
- `app/wishlist/page.tsx` — Wishlist page; redirects to `/auth/login` if not authed; optimistic remove; empty state

### Components
- `components/theme-provider.tsx` — next-themes wrapper
- `components/ui/button.tsx` + `components/ui/badge.tsx` — shadcn primitives
- `components/hero-spotlight.tsx` — full-width #1 trending product spotlight; mobile: smaller image (w-48), tighter padding
- `components/navbar.tsx` — Auth-aware; wishlist count badge. Mobile: flex-wrap + order-last so search drops to its own full-width row; logo + actions stay on row 1
- `components/search-bar.tsx` — debounced, dropdown with offset shadow
- `components/category-tabs.tsx` — square tabs; active = black fill
- `components/product-card.tsx` — 3D CSS flip on hover; front = card; back = price comparison table with Google search links
- `components/filter-panel.tsx` — sub-category chips, brand checkboxes, price range, active filter tags
- `components/product-grid.tsx` — owns filter state + interactive category pills; wishlist toggle logic + infinite scroll
- `components/ScoreMarquee.tsx` — Redesigned: black background (`#0F172A`), pink top border. Each of the 5 trending signals rendered as individual pill (icon + label + pink % badge). "How we rank →" label leads each loop. CSS marquee 32s loop.
- `components/scroll-progress.tsx` — Fixed 3px pink progress bar at top of viewport. Shimmer animation on fill, pulsing glow orb at leading edge. Milestone badges (25/50/75/100%) appear briefly in bottom-right with beauty-themed copy. Pure CSS, no Framer Motion.
- `components/price-comparison-table.tsx` — all 5 platforms, Best Price badge, Google search links
- `components/trending-breakdown.tsx` — expandable `<details>/<summary>`, 5 signals with score bars
- `components/trending-this-week.tsx` — full-bleed black section; top 6 products; horizontal scroll. px moved from section to children so last card is no longer clipped (B-008)

### Pages & API
- `app/layout.tsx` — DM Sans + Space Grotesk, ThemeProvider → AuthProvider → `<ScrollProgress />` → Navbar → children
- `app/icon.tsx` — GC favicon via Next.js ImageResponse. Off-white bg, "G" in black, "C" in white on pink block.
- `app/page.tsx` — RSC; ScoreMarquee → HeroSpotlight → TrendingThisWeek → Browse All (ProductGrid)
- `app/category/[slug]/page.tsx` — RSC; validates slug; fetches by category
- `app/products/[id]/page.tsx` — RSC; full detail page with WishlistButton + PriceComparisonTable
- `app/api/products/route.ts` — GET with `?q`, `?category`, `?sub_category`, `?brand`, `?page`, `?limit`

### Tests (`__tests__/`)
- 69 tests across 7 files (utils, product-card, filter-panel, product-grid, price-comparison-table, trending-breakdown, trending-this-week)
- **Not yet updated for post-launch UI changes or auth fixes. Need review before Phase 2.**

---

## Key Decisions Made

| Decision | Choice | Why |
|---|---|---|
| Component location | `./components/` (root) | Matches shadcn `components.json` aliases (`@/components`) |
| Lib location | `./lib/utils.ts` (root) | Matches shadcn alias; `src/lib/` + `src/types/` for project-specific code |
| Category filtering on homepage | Inline pills in ProductGrid (client state) | Interactive, instant UX without navigation |
| Search | Debounced API call → dropdown | Per TECH_DESIGN; navigates to product detail on click |
| Display font | Space Grotesk (headings/prices) + DM Sans (body) | Gen-Z bold aesthetic |
| Primary brand color | Hot pink `#FF2D95` | User chose pink over yellow during UI design session |
| `remotePatterns` | Must include `pathname: '/**'` | Next.js 16 requires explicit pathname |
| Wishlist API auth | `Authorization: Bearer <token>` header | Supabase RLS validates JWT |
| Auth state | React Context (`AuthProvider`) | Zustand not needed at this scope |
| Product images | Local `/public/images/products/` | Unsplash/CDN unreliable; manually downloaded. To update: drop in `public/images/products/`, run `npm run seed`, push. |
| Platform links | Google search links | Direct platform URLs were placeholder/broken |
| Card flip | CSS 3D transform (`rotateY`) only | Keeps bundle lean |
| Email redirect | Dynamic `window.location.origin/auth/callback` | Works on both localhost and Vercel without hardcoding |
| Scroll progress bar | Pure CSS animations, no Framer Motion | Keeps bundle lean; `transform/opacity` only for performance |
| Auth page layout | Split-panel (black brand left, form right) | Blank centered form was off-brand; redesign adds brand identity without rebuilding logic |
| Marquee background | Black with pink top border instead of full pink | Full pink was too visually heavy; black is editorial and on-brand |

---

## Sprint Status

| Sprint | Stories | Status |
|---|---|---|
| Sprint 1 | US-033, US-034, US-001, US-004 | ✅ Complete |
| Sprint 2 | US-002, US-003, US-015, US-016, US-017 | ✅ Complete |
| Sprint 3 | US-029, US-030, US-011, US-012, US-014 | ✅ Complete |
| Sprint 4 | US-007, US-008, US-009, US-010 | ✅ Complete |
| UI Redesign | All homepage components | ✅ Complete |
| Sprint 5 | US-019–US-025 | ✅ Complete |
| Phase 1 stragglers | US-005, US-006, US-035 | ✅ Complete |
| UI Polish (April 2026) | US-036–US-039 (category pills, card flip, marquee, search links) | ✅ Complete |
| Image migration (April 2026) | Unsplash → local product photos | ✅ Complete |
| Auth fixes (April 2026) | B-006 email redirect + B-007 email confirmation enforcement | ✅ Complete |
| US-040 (April 2026) | GC favicon (app/icon.tsx, Next.js ImageResponse) | ✅ Complete |
| US-041 (April 2026) | Mobile-responsive navbar + hero spotlight | ✅ Complete |
| US-042 (April 2026) | Auth pages redesign — split-panel layout | ✅ Complete |
| US-043 (April 2026) | Gamified scroll progress bar (glow trail + milestone badges) | ✅ Complete |
| US-044 (April 2026) | ScoreMarquee redesign — black bg, individual signal pills | ✅ Complete |
| Bug fixes (April 2026) | B-008 last card clipped in Trending This Week | ✅ Complete |

---

## Known Bugs / Observations Log
See `BUGS_AND_OBSERVATIONS.md`. All 8 bugs resolved. Summary:
- B-001: Wishlist button unreachable on flip card — fixed
- B-002: All best prices showed Amazon — fixed (round-robin seed)
- B-003: Marquee not animating — fixed (inline `@keyframes`)
- B-004: Product images mismatched — fixed (local files)
- B-005: Marquee hover-pause removed by design
- B-006: Email verification redirected to localhost — fixed (auth callback route)
- B-007: Sign-up bypassed email verification — fixed (needsConfirmation flag + Supabase toggle)
- B-008: Last card in Trending This Week clipped — fixed (px moved to children)

---

## Remaining Stories

### Phase 2 Backlog
- US-013 — Price History Chart (mock, per-platform toggle)
- US-018 — Filter by Skin Type
- US-026 — Set Price Alert
- US-027 — Receive Price Drop Email (Resend)
- US-028 — Manage Active Alerts
- US-031 — Related Products
- US-032 — Share Product (copy URL to clipboard + toast)
