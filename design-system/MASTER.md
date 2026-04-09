# GlowCompare — Master Design System

> Global Source of Truth. Page-specific overrides live in `design-system/pages/`.

---

## Product Profile

| Attribute | Value |
|---|---|
| Product type | Beauty e-commerce / price comparison |
| Industry | Beauty & personal care (India) |
| Target users | Everyday beauty shoppers, 18–35, mobile-first |
| Core actions | Browse trending, compare prices, wishlist, price alerts |
| Tone | Fresh, trustworthy, aspirational but approachable |

---

## Style

**Pattern:** Clean E-commerce with editorial accents
**Style keywords:** Soft feminine, modern minimal, warm whites, accent blush/rose

### Rationale
Beauty shoppers respond to clean, airy layouts that let product imagery breathe.
Price comparison demands clarity — data must be scannable, not decorative.
Indian market context: high mobile usage, value-consciousness → clear "Best Price" signalling is critical.

### Anti-patterns to avoid
- Heavy glassmorphism (obscures price data)
- Dark mode as default (beauty products need true-color rendering)
- Overcrowded grids (use generous whitespace)
- Emojis as UI icons (use Lucide or Heroicons SVG)

---

## Color Palette

### Primary Brand Colors
| Role | Name | Hex | Tailwind |
|---|---|---|---|
| Primary | Rose Pink | `#E8476A` | `rose-500` |
| Primary Dark | Deep Rose | `#C4304F` | `rose-700` |
| Primary Light | Blush | `#FDE8ED` | `rose-50` |

### Neutral Colors
| Role | Hex | Tailwind |
|---|---|---|
| Background | `#FAFAF9` | `stone-50` |
| Surface / Card | `#FFFFFF` | `white` |
| Border | `#E7E5E4` | `stone-200` |
| Text Primary | `#1C1917` | `stone-900` |
| Text Secondary | `#57534E` | `stone-600` |
| Text Muted | `#A8A29E` | `stone-400` |

### Accent & Semantic Colors
| Role | Hex | Tailwind | Usage |
|---|---|---|---|
| Best Price Badge | `#16A34A` | `green-600` | Lowest price highlight |
| Price Drop | `#EA580C` | `orange-600` | Discount / alert |
| Trending | `#7C3AED` | `violet-600` | Trending score badge |
| Info | `#0284C7` | `sky-600` | Availability, info |
| Wishlist Active | `#E8476A` | `rose-500` | Saved/filled heart |

---

## Typography

### Font Pairing
| Role | Font | Weight | Notes |
|---|---|---|---|
| Heading | **DM Sans** | 600–700 | Clean, modern, slightly rounded — approachable authority |
| Body | **Inter** | 400–500 | Highly legible at small sizes, great for price data |
| Accent / Brand | **DM Sans** | 800 | Logo / hero statements |

### Google Fonts import
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
```

### Scale
| Element | Size | Line Height | Weight |
|---|---|---|---|
| Hero heading | 40–56px | 1.1 | 800 |
| Section heading | 28–36px | 1.2 | 700 |
| Card heading | 18–20px | 1.3 | 600 |
| Body text | 16px | 1.6 | 400 |
| Small / label | 13–14px | 1.4 | 500 |
| Price display | 20–24px | 1.2 | 700 |

### Rules
- Minimum 16px body text (mobile)
- Line length: 60–72 characters for body
- Never use font-size below 12px

---

## Spacing & Layout

### Container
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Grid
| Context | Columns |
|---|---|
| Product grid (desktop) | 4 cols |
| Product grid (tablet) | 3 cols |
| Product grid (mobile) | 2 cols |
| Price comparison table | Full width, 6 cols (platform + 5 platforms) |

### Spacing scale (Tailwind)
- Card padding: `p-4` (mobile) / `p-6` (desktop)
- Section gap: `py-12` (mobile) / `py-20` (desktop)
- Card gap in grid: `gap-4` (mobile) / `gap-6` (desktop)

---

## Component Patterns

### Product Card
- White background, `rounded-2xl`, `shadow-sm` default, `shadow-md` on hover
- Product image: 1:1 aspect ratio, object-cover, `rounded-xl`
- Trending badge: top-left, violet, pill shape
- Wishlist icon: top-right, heart SVG, `cursor-pointer`
- Best price shown in green below product name
- `transition-shadow duration-200` on hover

### Price Comparison Table
- Sticky header row with platform logos
- "Best Price" row highlighted with green left border + green text
- Availability shown as green dot (in stock) / gray dot (OOS)
- "View on Platform" CTA button per row: outline style, brand color on hover
- "Sample data" footnote in muted text

### Best Price Badge
```
bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full
```

### Trending Score Badge
```
bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full
```

### Discount Badge
```
bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full
```

### CTA Button (Primary)
```
bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl px-6 py-3 transition-colors duration-200 cursor-pointer
```

### CTA Button (Outline)
```
border border-rose-500 text-rose-600 hover:bg-rose-50 font-semibold rounded-xl px-6 py-3 transition-colors duration-200 cursor-pointer
```

---

## Navigation

- Floating navbar: `top-4 left-4 right-4`, `rounded-2xl`, `bg-white/90 backdrop-blur-sm`, `shadow-sm`
- Logo: DM Sans 800, rose-500 color
- Links: stone-600, hover:rose-500, `transition-colors duration-150`
- Search bar: always visible on desktop, icon-only on mobile (expands on tap)
- Auth: ghost button for Sign in, filled for Sign up

---

## Icons

- Library: **Lucide React** (`lucide-react`)
- Size: `w-5 h-5` standard, `w-4 h-4` small, `w-6 h-6` large
- Never use emojis as icons
- Platform logos: use official SVGs (Simple Icons)

---

## Effects & Elevation

| Level | Usage | Tailwind |
|---|---|---|
| 0 | Flat surfaces, backgrounds | `shadow-none` |
| 1 | Cards at rest | `shadow-sm` |
| 2 | Cards on hover, dropdowns | `shadow-md` |
| 3 | Modals, floating navbar | `shadow-lg` |

- Border radius: `rounded-xl` for cards, `rounded-2xl` for large cards/modals, `rounded-full` for badges/pills
- Transitions: `duration-150` for color changes, `duration-200` for shadows

---

## Accessibility

- Color contrast: minimum 4.5:1 for all text
- Focus rings: `focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2`
- All images: descriptive `alt` text
- Icon-only buttons: `aria-label` required
- Form inputs: always paired with `<label>`
- Tab order: matches visual left-to-right, top-to-bottom order
- `prefers-reduced-motion`: wrap animations in `@media (prefers-reduced-motion: no-preference)`

---

## Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | 375px | Primary design target (Indian market) |
| Tablet | 768px | iPad portrait |
| Desktop | 1024px | Laptop |
| Wide | 1440px | Large screens |

---

## Platform Brand Colors (for comparison table)

| Platform | Color | Hex |
|---|---|---|
| Nykaa | Hot Pink | `#FC2779` |
| Tira | Black | `#1A1A1A` |
| Amazon | Orange | `#FF9900` |
| Flipkart | Blue | `#2874F0` |
| Purplle | Purple | `#7B2D8B` |

---

## Data Labeling

- All seed/mock data must show: `"Sample data — prices updated weekly"` in `text-stone-400 text-xs` below price comparison tables
- Trending scores labeled as `"Trend Score (sample)"` on hover tooltip

---

## Z-Index Scale

| Layer | Value | Usage |
|---|---|---|
| Base | 0 | Normal content |
| Raised | 10 | Cards on hover |
| Dropdown | 20 | Menus, tooltips |
| Sticky | 30 | Sticky headers |
| Navbar | 40 | Floating navbar |
| Modal | 50 | Modals, overlays |
