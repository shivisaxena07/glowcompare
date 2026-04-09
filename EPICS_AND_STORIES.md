# GlowCompare — Epics & User Stories

> Derived from PRD v1.0 | Phase: Architect → Develop
> Status: Ready for sprint planning

---

## How to Read This

Each Epic maps to a feature area from the PRD.
Each User Story follows the format:
**"As a [user], I want to [action] so that [benefit]."**

Acceptance Criteria (AC) define what "done" looks like.
Story Points are relative (1 = trivial, 2 = small, 3 = medium, 5 = large, 8 = complex).

---

## Epic Overview

| # | Epic | Phase | Stories |
|---|------|-------|---------|
| E1 | Product Catalogue & Browsing | 1 | 6 |
| E2 | Trending Score & Rankings | 1 | 4 |
| E3 | Price Comparison | 1 | 4 |
| E4 | Search & Filtering | 1 | 4 |
| E5 | Authentication | 1 | 3 |
| E6 | Wishlist / Favourites | 1 | 4 |
| E7 | Price Drop Alerts | 2 | 3 |
| E8 | Product Detail Page | 1 | 4 |
| E9 | Seed Data & Admin | 1 | 3 |
| E10 | Homepage UI Enhancements | 1 | 4 |

---

## E1 — Product Catalogue & Browsing

> Goal: Users can discover and browse beauty products organised by category.

---

### US-001 — View Homepage with Trending Products
**As a** shopper,
**I want to** land on a homepage that shows trending beauty products,
**so that** I can immediately discover what's popular without any effort.

**Acceptance Criteria:**
- [ ] Homepage loads within 2 seconds
- [ ] Displays at least 12 products on initial load
- [ ] Each product card shows: image, name, brand, category, trending score badge, and starting price
- [ ] Products are sorted by composite trending score (highest first) by default
- [ ] Page is responsive on mobile and desktop

**Story Points:** 3
**Phase:** 1

---

### US-002 — Browse by Category
**As a** shopper,
**I want to** filter products by Skincare or Makeup,
**so that** I only see products relevant to what I'm looking for.

**Acceptance Criteria:**
- [ ] Category tabs/buttons visible on homepage (Skincare, Makeup, All)
- [ ] Selecting a category filters the product grid instantly (no full page reload)
- [ ] Active category is visually highlighted
- [ ] Product count updates to reflect filtered results
- [ ] URL updates to reflect selected category (e.g. `/category/skincare`)

**Story Points:** 2
**Phase:** 1

---

### US-003 — Browse by Sub-Category
**As a** shopper,
**I want to** filter by sub-categories like Serums, Sunscreens, Foundations,
**so that** I can narrow down to the exact product type I need.

**Acceptance Criteria:**
- [ ] Sub-category options appear after a category is selected
- [ ] Skincare sub-categories: Cleanser, Moisturiser, Serum, Sunscreen, Toner, Eye Cream
- [ ] Makeup sub-categories: Foundation, Concealer, Blush, Lipstick, Mascara, Eyeshadow
- [ ] Multiple sub-categories can be selected simultaneously
- [ ] Selecting a sub-category filters the product grid

**Story Points:** 3
**Phase:** 1

---

### US-004 — View Product Card
**As a** shopper,
**I want to** see a clean product card in the browse grid,
**so that** I can quickly evaluate a product before clicking into it.

**Acceptance Criteria:**
- [ ] Card displays: product image, brand name, product name, sub-category tag, trending score badge, lowest price across platforms, "Best on [platform]" label
- [ ] Card is tappable/clickable and navigates to product detail page
- [ ] Wishlist heart icon visible on card (filled if saved, empty if not)
- [ ] Image has fallback placeholder if URL is broken

**Story Points:** 2
**Phase:** 1

---

### US-005 — Infinite Scroll / Pagination
**As a** shopper,
**I want to** load more products as I scroll,
**so that** I can browse the full catalogue without clicking through pages.

**Acceptance Criteria:**
- [ ] Initial load shows 12 products
- [ ] Next 12 products load automatically when user reaches bottom of grid
- [ ] Loading indicator shown while fetching next batch
- [ ] Works correctly with active category/filter selections

**Story Points:** 3
**Phase:** 1

---

### US-006 — Empty State for No Results
**As a** shopper,
**I want to** see a helpful message when no products match my filters,
**so that** I'm not confused by a blank screen.

**Acceptance Criteria:**
- [ ] Empty state shows an illustration or icon, a message ("No products found"), and a "Clear filters" button
- [ ] Clearing filters resets to full catalogue

**Story Points:** 1
**Phase:** 1

---

## E2 — Trending Score & Rankings

> Goal: Users understand why a product is trending and trust the ranking.

---

### US-007 — See Trending Score on Product Card
**As a** shopper,
**I want to** see a trending score badge on each product card,
**so that** I can quickly gauge how popular a product is right now.

**Acceptance Criteria:**
- [ ] Score displayed as a number (0–100) with a flame/star icon
- [ ] Score badge uses colour coding: 80–100 = hot (red/orange), 50–79 = rising (yellow), below 50 = neutral (grey)
- [ ] Badge is visible without hovering on both mobile and desktop

**Story Points:** 2
**Phase:** 1

---

### US-008 — See Trending Score Breakdown
**As a** shopper,
**I want to** see what signals make up a product's trending score,
**so that** I can understand why it's ranked the way it is.

**Acceptance Criteria:**
- [ ] Score breakdown visible on product detail page
- [ ] Shows all 5 signals with their individual scores: Social Buzz, Bestseller Rank, Ratings, Search Volume, Editorial Picks
- [ ] Each signal shows its weighted contribution
- [ ] Tooltip or expandable section (not cluttering the main UI)

**Story Points:** 3
**Phase:** 1

---

### US-009 — "Trending This Week" Section
**As a** shopper,
**I want to** see a dedicated "Trending This Week" section on the homepage,
**so that** I can discover what's newly popular without browsing the full catalogue.

**Acceptance Criteria:**
- [ ] Section shows top 6 products by composite score
- [ ] Visually distinct from the main product grid (e.g. horizontal scroll or highlighted section)
- [ ] Section label shows last updated date

**Story Points:** 2
**Phase:** 1

---

### US-010 — Data Freshness Label
**As a** shopper,
**I want to** see when the trending data and prices were last updated,
**so that** I know how current the information is.

**Acceptance Criteria:**
- [ ] "Last updated: [date]" label visible on homepage and product detail page
- [ ] Label clearly states data is sample/mock in MVP (e.g. "Sample data — updated weekly")

**Story Points:** 1
**Phase:** 1

---

## E3 — Price Comparison

> Goal: Users can compare prices across all 5 platforms at a glance.

---

### US-011 — View Price Comparison Table
**As a** shopper,
**I want to** see prices for a product across all 5 platforms in one table,
**so that** I don't have to open multiple apps to find the best deal.

**Acceptance Criteria:**
- [ ] Table shows: Platform name (with logo), Current price, Original price (struck through if discounted), Discount %, Availability status, "Visit" button linking to platform URL
- [ ] Platforms shown: Nykaa, Tira, Amazon, Flipkart, Purplle
- [ ] Table is visible on product detail page without scrolling (above the fold on desktop)
- [ ] Unavailable products are greyed out but still shown

**Story Points:** 3
**Phase:** 1

---

### US-012 — Best Price Badge
**As a** shopper,
**I want to** see which platform has the lowest price highlighted automatically,
**so that** I don't have to compare numbers myself.

**Acceptance Criteria:**
- [ ] "Best Price" badge appears next to the platform with the lowest current price
- [ ] Badge updates correctly if prices change
- [ ] If multiple platforms have the same lowest price, badge shows on all of them

**Story Points:** 2
**Phase:** 1

---

### US-013 — Price History Chart (Mock)
**As a** shopper,
**I want to** see how a product's price has changed over time,
**so that** I can decide if now is a good time to buy.

**Acceptance Criteria:**
- [ ] Line chart showing price history for the last 30 days (mock data)
- [ ] Chart is per-platform (user can toggle between platforms)
- [ ] Chart uses a clean, minimal design — not overwhelming the page
- [ ] Clearly labelled as "Sample data"

**Story Points:** 5
**Phase:** 2

---

### US-014 — External Platform Link
**As a** shopper,
**I want to** click through to a product directly on a platform,
**so that** I can complete my purchase there.

**Acceptance Criteria:**
- [ ] "Visit" or "Buy on [Platform]" button on each row of the price table
- [ ] Link opens in a new tab
- [ ] Link points to correct product URL (from seed data)

**Story Points:** 1
**Phase:** 1

---

## E4 — Search & Filtering

> Goal: Users can find specific products quickly.

---

### US-015 — Search by Product Name or Brand
**As a** shopper,
**I want to** search for a product by name or brand,
**so that** I can find it directly without browsing.

**Acceptance Criteria:**
- [ ] Search bar visible in the header/navbar on all pages
- [ ] Results appear as the user types (debounced, min 2 characters)
- [ ] Results show product name, brand, image thumbnail, and category
- [ ] Clicking a result navigates to the product detail page
- [ ] "No results found" state shown if nothing matches

**Story Points:** 3
**Phase:** 1

---

### US-016 — Filter by Brand
**As a** shopper,
**I want to** filter products by brand,
**so that** I can explore the full catalogue of a brand I trust.

**Acceptance Criteria:**
- [ ] Brand filter available in the filter panel
- [ ] Multiple brands can be selected simultaneously
- [ ] Brand list is dynamically generated from the product catalogue
- [ ] Active filters shown as removable tags above the product grid

**Story Points:** 2
**Phase:** 1

---

### US-017 — Filter by Price Range
**As a** shopper,
**I want to** filter products by price range,
**so that** I only see products within my budget.

**Acceptance Criteria:**
- [ ] Price range slider or min/max input fields
- [ ] Price range based on lowest platform price for each product
- [ ] Filter applies in real time without page reload

**Story Points:** 2
**Phase:** 1

---

### US-018 — Filter by Skin Type
**As a** shopper,
**I want to** filter skincare products by my skin type,
**so that** I only see products suited to me.

**Acceptance Criteria:**
- [ ] Skin type options: Oily, Dry, Combination, Sensitive, Normal
- [ ] Filter only appears when Skincare category is selected
- [ ] Products tagged with skin type in seed data

**Story Points:** 3
**Phase:** 2

---

## E5 — Authentication

> Goal: Users can create accounts to access wishlist and alert features.

---

### US-019 — Sign Up with Email
**As a** new user,
**I want to** create an account with my email and password,
**so that** I can save products and set price alerts.

**Acceptance Criteria:**
- [ ] Sign up form with email + password fields
- [ ] Password validation: min 8 characters
- [ ] Confirmation email sent via Supabase Auth
- [ ] User redirected to homepage after successful signup
- [ ] Error messages shown for duplicate email or weak password

**Story Points:** 3
**Phase:** 1

---

### US-020 — Log In and Log Out
**As a** returning user,
**I want to** log in to my account and log out when done,
**so that** my wishlist and alerts are private to me.

**Acceptance Criteria:**
- [ ] Login form with email + password
- [ ] Session persists across browser sessions (Supabase handles this)
- [ ] Logout clears session and redirects to homepage
- [ ] Auth state reflected in navbar (show avatar/name when logged in, Login button when not)

**Story Points:** 2
**Phase:** 1

---

### US-021 — Browse Without Account
**As a** visitor,
**I want to** browse and compare products without creating an account,
**so that** I'm not blocked by a login wall.

**Acceptance Criteria:**
- [ ] All browsing, search, filtering, and price comparison features accessible without auth
- [ ] Wishlist and alert features prompt login only when user tries to use them
- [ ] Prompt is a modal/sheet — not a full page redirect

**Story Points:** 2
**Phase:** 1

---

## E6 — Wishlist / Favourites

> Goal: Users can save products they're interested in.

---

### US-022 — Save a Product to Wishlist
**As a** logged-in shopper,
**I want to** save a product to my wishlist,
**so that** I can find it again easily later.

**Acceptance Criteria:**
- [ ] Heart icon on product card and product detail page
- [ ] Tapping heart saves product to wishlist (optimistic UI — instant feedback)
- [ ] Tapping again removes it from wishlist
- [ ] Unauthenticated users see a login prompt when tapping heart

**Story Points:** 3
**Phase:** 1

---

### US-023 — View Wishlist
**As a** logged-in shopper,
**I want to** see all my saved products in one place,
**so that** I can review and compare them easily.

**Acceptance Criteria:**
- [ ] Dedicated `/wishlist` page accessible from navbar
- [ ] Shows all saved products as cards with current lowest price
- [ ] Products can be removed from wishlist from this page
- [ ] Empty state shown if no products saved

**Story Points:** 2
**Phase:** 1

---

### US-024 — Wishlist Persists Across Sessions
**As a** logged-in shopper,
**I want to** see my wishlist items when I log back in,
**so that** I don't lose my saved products.

**Acceptance Criteria:**
- [ ] Wishlist data stored in Supabase against user ID
- [ ] Wishlist loads correctly after logout and login
- [ ] No data loss if user clears browser cache

**Story Points:** 2
**Phase:** 1

---

### US-025 — Wishlist Count in Navbar
**As a** logged-in shopper,
**I want to** see how many items are in my wishlist from the navbar,
**so that** I always know my saved count without navigating away.

**Acceptance Criteria:**
- [ ] Badge on wishlist icon in navbar shows count
- [ ] Count updates in real time when items are added/removed
- [ ] Badge hidden or shows 0 when wishlist is empty

**Story Points:** 1
**Phase:** 1

---

## E7 — Price Drop Alerts

> Goal: Users get notified when a saved product drops in price.

---

### US-026 — Set a Price Alert
**As a** logged-in shopper,
**I want to** set a target price for a product in my wishlist,
**so that** I get notified when it drops to a price I'm happy with.

**Acceptance Criteria:**
- [ ] "Set Alert" option on product detail page and wishlist page
- [ ] User enters a target price (must be lower than current lowest price)
- [ ] Alert saved to database against user + product
- [ ] Confirmation shown after alert is set

**Story Points:** 3
**Phase:** 2

---

### US-027 — Receive Price Drop Email
**As a** shopper with an active alert,
**I want to** receive an email when a product hits my target price,
**so that** I never miss a deal.

**Acceptance Criteria:**
- [ ] Email sent via Resend when mock price update drops at/below target
- [ ] Email contains: product name, image, old price, new price, platform, direct link to product
- [ ] Email is clean and mobile-friendly
- [ ] Only one email per price drop event (no spam)

**Story Points:** 5
**Phase:** 2

---

### US-028 — Manage Active Alerts
**As a** shopper,
**I want to** see and cancel my active price alerts,
**so that** I stay in control of what I'm being notified about.

**Acceptance Criteria:**
- [ ] Alerts visible on wishlist page alongside each product
- [ ] User can delete an alert
- [ ] Alert status shown: Active / Triggered

**Story Points:** 2
**Phase:** 2

---

## E8 — Product Detail Page

> Goal: Users get a complete picture of a product before deciding to buy.

---

### US-029 — View Full Product Detail
**As a** shopper,
**I want to** see complete information about a product on its detail page,
**so that** I can make an informed purchase decision.

**Acceptance Criteria:**
- [ ] Page shows: product image (large), brand, name, category/sub-category, description, ingredients summary, trending score + breakdown, price comparison table, wishlist button
- [ ] Page URL is `/products/[id]`
- [ ] Page is shareable (OG meta tags for social sharing)
- [ ] Mobile layout stacks sections cleanly (image → prices → details)

**Story Points:** 5
**Phase:** 1

---

### US-030 — Ingredients Summary
**As a** shopper,
**I want to** see a plain-language summary of key ingredients,
**so that** I can quickly understand what's in a product without reading a full INCI list.

**Acceptance Criteria:**
- [ ] Short 2–3 line ingredients summary from seed data
- [ ] Highlights key active ingredients (e.g. "Contains Niacinamide 10% + Zinc 1%")
- [ ] Not a full ingredient dump — just the highlights

**Story Points:** 1
**Phase:** 1

---

### US-031 — Related Products
**As a** shopper,
**I want to** see similar products at the bottom of a product page,
**so that** I can discover alternatives.

**Acceptance Criteria:**
- [ ] "You might also like" section shows 4 products in the same sub-category
- [ ] Related products are clickable and navigate to their detail pages
- [ ] Does not show the current product in its own related list

**Story Points:** 2
**Phase:** 2

---

### US-032 — Share Product
**As a** shopper,
**I want to** share a product page with a friend,
**so that** I can get their opinion or recommend a deal.

**Acceptance Criteria:**
- [ ] Share button on product detail page
- [ ] Copies product URL to clipboard on click
- [ ] Toast notification confirms "Link copied"

**Story Points:** 1
**Phase:** 2

---

## E9 — Seed Data & Admin

> Goal: The app has real-looking data to demonstrate all features.

---

### US-033 — Seed 200 Products
**As a** developer,
**I want to** have 200 products seeded in the database,
**so that** all browsing, filtering, and comparison features work meaningfully.

**Acceptance Criteria:**
- [ ] 200 products across Skincare (120) and Makeup (80)
- [ ] All sub-categories represented with at least 5 products each
- [ ] Each product has prices for all 5 platforms
- [ ] Each product has a trending score and all 5 signal values
- [ ] Seed script is repeatable (`npm run seed`)

**Story Points:** 5
**Phase:** 1

---

### US-034 — Seed Script
**As a** developer,
**I want to** run a single command to populate the database,
**so that** setup is fast and repeatable.

**Acceptance Criteria:**
- [ ] `npm run seed` populates all tables from `/data/seed/products.json`
- [ ] Script clears existing data before re-seeding (idempotent)
- [ ] Success/failure logged to terminal

**Story Points:** 2
**Phase:** 1

---

### US-035 — Sample Data Label
**As a** user,
**I want to** know the pricing data is sample/mock,
**so that** I don't make real purchase decisions based on inaccurate prices.

**Acceptance Criteria:**
- [ ] Subtle "Sample data" label visible on homepage and price comparison table
- [ ] Label does not dominate the UI — small, secondary text
- [ ] Tooltip explains: "Prices are illustrative. Visit platforms for live prices."

**Story Points:** 1
**Phase:** 1

---

## Sprint Suggestion (Phase 1)

| Sprint | Stories | Goal |
|--------|---------|------|
| Sprint 1 | US-033, US-034, US-001, US-004 | Seed data + Homepage working |
| Sprint 2 | US-002, US-003, US-015, US-016, US-017 | Browse + Search + Filters |
| Sprint 3 | US-029, US-030, US-011, US-012, US-014 | Product Detail + Price Comparison |
| Sprint 4 | US-007, US-008, US-009, US-010 | Trending Score + Labels |
| Sprint 5 | US-019, US-020, US-021, US-022, US-023, US-024, US-025 | Auth + Wishlist |

---

## Backlog (Phase 2)

- US-013 — Price History Chart
- US-018 — Filter by Skin Type
- US-026 — Set Price Alert
- US-027 — Receive Price Drop Email
- US-028 — Manage Alerts
- US-031 — Related Products
- US-032 — Share Product

---

## E10 — Homepage UI Enhancements

> Goal: Make the homepage more interactive, discoverable, and informative through micro-interactions and contextual UI.

---

### US-036 — Interactive Category & Sub-category Pills
**As a** shopper,
**I want to** filter products by category and sub-category using clickable pills directly on the homepage,
**so that** I can narrow down results instantly without navigating to a separate page.

**Acceptance Criteria:**
- [ ] Category pills (All / Skincare / Makeup) appear above the product grid on the homepage
- [ ] Clicking a category pill filters the grid instantly (no page reload)
- [ ] Sub-category pills appear dynamically based on the selected category
- [ ] Multiple sub-category pills can be active simultaneously
- [ ] Active pill: bold filled black background + black border
- [ ] Inactive pill: outlined, hover fills with light accent colour
- [ ] Smooth transition animation (200ms) on pill state change
- [ ] Selecting a new category resets active sub-category selections
- [ ] "Clear all filters" link appears when any filter is active and resets all state
- [ ] Category pages (`/category/skincare`, `/category/makeup`) are unaffected — they use URL routing as before

**Story Points:** 3
**Phase:** 1

---

### US-037 — Product Card Price Flip
**As a** shopper,
**I want to** see a quick price summary by hovering over a product card,
**so that** I can compare platform prices without leaving the browse view.

**Acceptance Criteria:**
- [ ] Hovering a product card flips it to reveal a price comparison back face (CSS 3D, no JS library)
- [ ] Front face: existing card design (image, trending badge, wishlist button, brand, name, best price)
- [ ] Back face: "💰 Price Comparison" heading, table with 5 platform rows (Platform / Price / Discount)
- [ ] Lowest available price row is highlighted with accent colour and bold text
- [ ] Each platform name is a clickable Google search link: `google.com/search?q=[product]+on+[platform]`
- [ ] Google search links open in a new tab with `rel="noopener noreferrer"`
- [ ] "View Details →" button at the bottom navigates to the product detail page
- [ ] Card has a fixed height (380px) — no layout shift during flip
- [ ] Flip transition: 0.5s ease
- [ ] Wishlist button on the front face remains functional (does not trigger navigation)

**Story Points:** 3
**Phase:** 1

---

### US-038 — Trending Score Marquee
**As a** shopper,
**I want to** understand how the trending score is calculated,
**so that** I trust the rankings and know what signals drive them.

**Acceptance Criteria:**
- [ ] Full-width marquee ticker strip placed directly below the Navbar on the homepage
- [ ] Content: "🔥 Trending Score = Social Buzz (30%) · Bestseller Rank (25%) · Ratings & Reviews (20%) · Search Volume (15%) · Editorial Picks (10%) · Updated Weekly"
- [ ] Scrolls continuously (CSS `@keyframes` only — no JS library)
- [ ] Seamless infinite loop (content repeated for no visible gap)
- [ ] Uses neon accent background (`glow-primary` pink) with black text
- [ ] Monospace font, thin black border top and bottom
- [ ] Animation pauses on hover
- [ ] Does not appear on category or product detail pages

**Story Points:** 2
**Phase:** 1

---

### US-039 — Google Search Links for Platform Discovery
**As a** shopper,
**I want to** be taken to a search results page for a product on a specific platform,
**so that** I can find the actual listing even when direct URLs are unavailable.

**Acceptance Criteria:**
- [ ] All "Visit" buttons in the price comparison table link to `https://www.google.com/search?q=[productName]+on+[Platform]`
- [ ] Product name is URL-encoded via `encodeURIComponent()`
- [ ] All platform links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Platform names on the product card flip back face are also Google search links
- [ ] Applies consistently across: product card flip, product detail price table
- [ ] `PriceComparisonTable` component accepts a `productName: string` prop to generate correct URLs

**Story Points:** 1
**Phase:** 1

---

*GlowCompare — Epics & User Stories v1.0 | April 2026*
