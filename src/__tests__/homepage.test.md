# GlowCompare — Manual Test Cases
> UI Changes: US-036 to US-039 | Phase 1 UI Polish | April 2026

---

## TC-001 — Category Pill: Happy Path (All → Skincare)
**Story:** US-036
**Type:** Functional / Interaction
**Preconditions:** Homepage loaded at `/`. All products visible (default "All" state).

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load homepage | "All", "Skincare", "Makeup" pills visible above product grid. "All" pill is active (black fill + black border). |
| 2 | Click "Skincare" pill | Grid instantly filters to show only skincare products. No page reload. |
| 3 | Observe pill state | "Skincare" pill becomes active (black fill). "All" pill becomes inactive (outlined). |
| 4 | Observe sub-category pills | Skincare sub-category pills appear: Cleanser, Moisturiser, Serum, Sunscreen, Toner, Eye Cream. |
| 5 | Click "Makeup" pill | Grid switches to makeup products only. Makeup sub-category pills appear. Skincare sub-categories disappear. |
| 6 | Click "All" pill | All products return. Sub-category pills disappear. |

**Pass Criteria:** Grid updates instantly on each click. Correct products shown. Active pill styling is bold black fill. Sub-cats appear/disappear in sync with category.
**Fail Criteria:** Page reloads, wrong products shown, pills don't respond, sub-cats don't update.

---

## TC-002 — Category Pill: Sub-category Multi-select
**Story:** US-036
**Type:** Functional
**Preconditions:** Homepage loaded. "Skincare" pill selected.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Serum" sub-category pill | Grid filters to serums only. "Serum" pill becomes active. |
| 2 | Click "Toner" sub-category pill | Grid shows both serums AND toners. Both pills are active simultaneously. |
| 3 | Click "Serum" again | Serum deselects. Grid shows only toners. |
| 4 | Observe "Clear all filters" | Link is visible when any sub-category is active. |
| 5 | Click "Clear all filters" | All filters reset. All products show. Pills return to default state. |

**Pass Criteria:** Multiple sub-cats can be active at once. Grid reflects union of selections. Clear all resets everything.
**Fail Criteria:** Only one sub-cat active at a time, grid doesn't update on multi-select, clear doesn't reset.

---

## TC-003 — Category Pill: Edge Case — No Results
**Story:** US-036
**Type:** Functional / Edge Case
**Preconditions:** Homepage loaded. A sub-category selected that may yield few/no products.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select "Makeup" category | Makeup products shown. |
| 2 | Select a sub-category with no products (e.g. "Blush" if none seeded) | Empty state shown: "No products found" message + "Clear filters" button. |
| 3 | Click "Clear filters" in empty state | All filters reset. Full grid returns. |

**Pass Criteria:** Empty state renders cleanly, never crashes. Clear button works from empty state.
**Fail Criteria:** Blank screen with no message, crash, or clear button doesn't work.

---

## TC-004 — Category Pill: Mobile Behaviour
**Story:** US-036
**Type:** Visual / Interaction
**Preconditions:** DevTools open. Viewport set to 375px (iPhone SE).

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load homepage on mobile viewport | Category pills wrap or scroll horizontally — not cut off. |
| 2 | Tap "Skincare" | Grid filters correctly on touch. No hover state stuck. |
| 3 | Tap sub-category pills | Sub-cats are tap-sized (at least 44px touch target). Respond correctly. |

**Pass Criteria:** Pills usable on touch. No overflow clipping. Grid updates on tap.
**Fail Criteria:** Pills overflow viewport, unresponsive to touch, grid doesn't update.

---

## TC-005 — Category Pill: Keyboard Accessibility
**Story:** US-036
**Type:** Accessibility
**Preconditions:** Homepage loaded. Keyboard only (no mouse).

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tab to "Skincare" pill | Pill receives visible focus ring. |
| 2 | Press Enter / Space | Grid filters to skincare. Pill becomes active. |
| 3 | Tab to a sub-category pill | Focus moves to sub-cat pill. |
| 4 | Press Enter | Sub-category filter applies. |

**Pass Criteria:** All pills reachable and activatable via keyboard. `aria-pressed` state reflects active status.
**Fail Criteria:** Pills not focusable, Enter doesn't activate, no visible focus indicator.

---

## TC-006 — Card Flip: Happy Path
**Story:** US-037
**Type:** Functional / Visual
**Preconditions:** Homepage loaded with product cards visible.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover over any product card | Card flips 180° over 0.5s. Back face slides into view smoothly. |
| 2 | Observe back face | "💰 Price Comparison" heading visible. Table with 5 platform rows (Nykaa, Tira, Amazon, Flipkart, Purplle). |
| 3 | Observe lowest price | Row with lowest available price is highlighted (pink background, bold pink text). |
| 4 | Observe platform names | Each platform name is underlined/clickable. |
| 5 | Click a platform name | New tab opens to Google search: `google.com/search?q=[Product Name]+on+[Platform]`. |
| 6 | Click "View Details →" button | Navigates to product detail page. |
| 7 | Move mouse away from card | Card flips back to front face smoothly. |

**Pass Criteria:** Flip animation smooth (no jank). Back face data correct. Lowest price highlighted. Links open correct Google searches in new tab.
**Fail Criteria:** No animation, card doesn't flip, data missing, links broken or open in same tab.

---

## TC-007 — Card Flip: Layout Stability
**Story:** US-037
**Type:** Visual
**Preconditions:** Homepage loaded. Grid of cards visible.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Note the grid layout before hovering | Cards aligned in grid, uniform height. |
| 2 | Hover over a card | Card flips but surrounding cards do not move. Grid layout unchanged. |
| 3 | Move to another card | First card flips back, second flips — no layout shift at any point. |

**Pass Criteria:** Zero layout shift during flip. Fixed 380px card height maintained.
**Fail Criteria:** Neighbouring cards shift, grid reflows, content jumps.

---

## TC-008 — Card Flip: Wishlist Button Stays Functional
**Story:** US-037
**Type:** Functional
**Preconditions:** Homepage loaded. User not logged in.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover over card (front face) | Card starts to flip. |
| 2 | Before full flip, click the heart (wishlist) button | Login modal appears. Card does NOT navigate to product detail. |

**Pass Criteria:** Wishlist button click is isolated — doesn't trigger navigation.
**Fail Criteria:** Clicking heart navigates to product page, or heart unresponsive.

---

## TC-009 — Card Flip: Mobile Behaviour
**Story:** US-037
**Type:** Visual / Interaction
**Preconditions:** DevTools open. Viewport 375px.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load homepage on mobile | Cards display correctly at fixed height. No overflow. |
| 2 | Tap a product card | Card does NOT flip (hover not available on touch). Navigates to product detail page instead. |

**Pass Criteria:** On touch devices, card tap = navigation (no accidental flip). Front face always visible on mobile.
**Fail Criteria:** Card stuck in flipped state on mobile, navigation broken, layout broken.

---

## TC-010 — Card Flip: Edge Case — No Prices Available
**Story:** US-037
**Type:** Edge Case
**Preconditions:** A product with no available platform prices (all `availability: false`).

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover over card with unavailable product | Card flips to back face. |
| 2 | Observe price table | Platforms listed with "—" for price. No row highlighted as lowest. |
| 3 | Front face price | Shows "Unavailable" text. |

**Pass Criteria:** Back face renders without crash. No phantom "lowest price" highlight. Graceful empty state.
**Fail Criteria:** JavaScript error, blank back face, or wrong row highlighted.

---

## TC-011 — Score Marquee: Continuous Scroll
**Story:** US-038
**Type:** Visual / Functional
**Preconditions:** Homepage loaded.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load homepage | Pink ticker strip visible directly below navbar. |
| 2 | Observe for 5 seconds | Text scrolls continuously left with no gaps or jumps. |
| 3 | Observe content | "🔥 Trending Score = Social Buzz (30%) · Bestseller Rank (25%) · Ratings & Reviews (20%) · Search Volume (15%) · Editorial Picks (10%) · Updated Weekly" |
| 4 | Wait for one full loop | Text loops back seamlessly — no visible reset flash. |

**Pass Criteria:** Infinite, seamless scroll. Correct content. Pink background, black text, monospace font, black borders top and bottom.
**Fail Criteria:** Marquee stops, jumps, shows gap, wrong content, wrong styling.

---

## TC-012 — Score Marquee: Not on Other Pages
**Story:** US-038
**Type:** Functional
**Preconditions:** Homepage loaded.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/category/skincare` | Marquee NOT visible on category page. |
| 2 | Navigate to a product detail page | Marquee NOT visible on product page. |
| 3 | Navigate back to `/` | Marquee reappears below navbar. |

**Pass Criteria:** Marquee only on homepage.
**Fail Criteria:** Marquee appears on category or product pages.

---

## TC-013 — Score Marquee: Mobile Behaviour
**Story:** US-038
**Type:** Visual
**Preconditions:** DevTools open. Viewport 375px.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load homepage on mobile | Marquee visible and full-width. Text readable at mobile font size. |
| 2 | Observe scroll behaviour | Marquee scrolls correctly. Does not cause horizontal page scroll. |

**Pass Criteria:** Full-width, readable, no horizontal overflow on page.
**Fail Criteria:** Marquee causes page to scroll horizontally, text unreadable, missing on mobile.

---

## TC-014 — Google Search Links: Card Flip Back Face
**Story:** US-039
**Type:** Functional
**Preconditions:** Homepage loaded. Desktop (hover available).

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover over "Minimalist Niacinamide 10% + Zinc 1% Serum" card | Card flips to back face. |
| 2 | Click "Nykaa" link | New tab opens to: `https://www.google.com/search?q=Minimalist+Niacinamide+10%25+%2B+Zinc+1%25+Serum+on+Nykaa` |
| 3 | Click "Amazon" link | New tab opens to correct Google search for Amazon. |
| 4 | Verify all 5 links | Each platform opens a correctly formatted Google search in a new tab. |

**Pass Criteria:** All 5 links open correct Google searches. Product name is URL-encoded. All open in new tab.
**Fail Criteria:** Links navigate in same tab, wrong URL format, product name not encoded, 404s.

---

## TC-015 — Google Search Links: Product Detail Price Table
**Story:** US-039
**Type:** Functional
**Preconditions:** Navigate to any product detail page.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to "Compare Prices" table | Table visible with all 5 platforms. |
| 2 | Click "Visit" button next to Nykaa | New tab: `google.com/search?q=[Product Name]+on+Nykaa` |
| 3 | Click "Visit" for an unavailable platform | Link either disabled or still opens Google search (no crash). |
| 4 | Check `target` and `rel` attributes | All links have `target="_blank"` and `rel="noopener noreferrer"`. |

**Pass Criteria:** All Visit buttons link to correct Google searches. Security attributes present. Unavailable platforms handled gracefully.
**Fail Criteria:** Links use old direct platform URLs, open in same tab, missing security attributes.

---

## TC-016 — Google Search Links: Special Characters in Product Name
**Story:** US-039
**Type:** Edge Case
**Preconditions:** Navigate to a product with special characters in name (e.g. "Niacinamide 10% + Zinc 1%").

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open card flip or price table | Platform links visible. |
| 2 | Click any platform link | URL contains encoded characters: `%25` for `%`, `%2B` for `+`. |
| 3 | Verify Google search results | Google returns relevant results for the product. |

**Pass Criteria:** `encodeURIComponent()` correctly encodes all special characters. Google search works.
**Fail Criteria:** Raw `%` or `+` in URL breaks the search, malformed URL, browser error.

---

## TC-017 — Google Search Links: Accessibility
**Story:** US-039
**Type:** Accessibility
**Preconditions:** Product detail page open. Keyboard only.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tab to "Visit" button in price table | Button receives visible focus ring. |
| 2 | Press Enter | New tab opens to Google search. |
| 3 | Check `aria-label` | Each Visit button has descriptive label e.g. "Search Nykaa for this product". |

**Pass Criteria:** Links keyboard-navigable. Descriptive aria-labels present. New tab opens on Enter.
**Fail Criteria:** Not reachable by keyboard, no aria-label, Enter doesn't activate.
