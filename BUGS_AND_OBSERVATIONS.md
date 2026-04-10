# GlowCompare — Bugs & Observations Log

> Tracks all bugs, UI observations, and unexpected behaviour found during testing.
> Each entry includes symptom, root cause, fix, and status.

---

## B-001 — Wishlist button unreachable on flipped card
**Reported:** April 2026 — visual review
**Symptom:** Clicking the heart (wishlist) button on a product card had no effect when hovering over the card.
**Root cause:** The wishlist button was inside the flip inner div. On hover the card rotated 180°, taking the button with it — `backface-visibility: hidden` and the rotation made it unclickable.
**Fix:** Moved the button outside the flip inner div onto the card wrapper with `position: absolute` and `z-20`. It now floats above both faces and is always clickable.
**File:** `components/product-card.tsx`
**Status:** ✅ Fixed

---

## B-002 — All "Best Price" badges showed Amazon
**Reported:** April 2026 — visual review
**Symptom:** Every product card showed Amazon as the cheapest platform.
**Root cause:** Seed data was generated with Amazon always having the lowest price (consistent discount pattern across all 20 products).
**Fix:** Redistributed lowest price in round-robin across all 5 platforms via script (Nykaa ×5, Tira ×4, Amazon ×4, Flipkart ×4, Purplle ×3). Re-seeded Supabase.
**File:** `data/seed/products.json`
**Status:** ✅ Fixed

---

## B-003 — Score marquee not animating
**Reported:** April 2026 — visible in screenshot, text was static
**Symptom:** Marquee text appeared but did not scroll.
**Root cause:** `@keyframes marquee` block in `globals.css` was silently dropped by the Tailwind v4 CSS pipeline at build time. The `animation` property referenced a keyframe that didn't exist in the compiled output.
**Fix:** Moved `@keyframes` definition inline into a `<style>` tag inside `ScoreMarquee.tsx`. Removed duplicate from `globals.css`.
**Files:** `components/ScoreMarquee.tsx`, `app/globals.css`
**Status:** ✅ Fixed

---

## B-004 — Product images mismatched product types
**Reported:** April 2026 — visual review
**Symptom:** Product cards showed wrong photos (e.g. food plate for sunscreen, palette for foundation).
**Root cause:** Unsplash photo IDs in `update-images.ts` were mapped by guesswork. Unsplash, Pexels, Amazon, and Nykaa all return 403 to automated fetches — IDs could not be verified programmatically.
**Fix (attempt 1):** Remapped 3 worst offenders within existing verified IDs — partial improvement only.
**Fix (attempt 2 — final):** Migrated entirely to local images. 20 real product photos downloaded manually and placed in `public/images/products/`. `update-images.ts` updated to write local paths. `npm run seed` re-run to update Supabase.
**Files:** `public/images/products/`, `data/seed/products.json`, `scripts/update-images.ts`
**Note:** To update an image in future — drop new file in `public/images/products/`, run `npm run seed`, push.
**Status:** ✅ Fixed

---

## B-005 — Marquee hover-pause removed by design
**Reported:** April 2026 — user preference
**Symptom:** Marquee paused on hover (was intentional in original spec, but unwanted).
**Fix:** Removed `group-hover:[animation-play-state:paused]` class from the inner div.
**File:** `components/ScoreMarquee.tsx`
**Status:** ✅ Fixed (intentional design change)

---

## B-006 — Email verification link redirects to localhost with OTP expired error
**Reported:** April 2026 — observed after sign-up in production
**Symptom:** Clicking "Verify my email" in the confirmation email routed to `http://localhost:3000/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`.
**Root cause:** `supabase.auth.signUp()` was called without a `redirectTo` option, so Supabase used its configured Site URL (`localhost:3000`) as the confirmation redirect. The link pointed to localhost — which fails in production — and no callback route existed to handle the code exchange.
**Fix:**
1. Added `options: { emailRedirectTo: \`${window.location.origin}/auth/callback\` }` to `signUp()` in `auth-context.tsx` so the redirect URL is always dynamic (works on both localhost and Vercel).
2. Created `app/auth/callback/route.ts` — a GET route handler that reads the `?code=` param, calls `exchangeCodeForSession(code)`, then redirects to `/`.

**Also required (manual — Supabase Dashboard):** Add the production Vercel URL (e.g. `https://glowcompare.vercel.app/auth/callback`) to the **Redirect URLs** allowlist under Supabase → Auth → URL Configuration. Without this Supabase rejects the redirect even with the code fix.
**Files:** `src/context/auth-context.tsx`, `app/auth/callback/route.ts`
**Status:** ✅ Fixed

---

## B-007 — Sign-up bypasses email verification entirely
**Reported:** April 2026 — Shivi observed after signing up; was logged in immediately with no email sent
**Symptom:** After submitting the sign-up form, the user was logged in directly without receiving or needing to verify a confirmation email.
**Root cause (1 — Supabase Dashboard):** "Enable email confirmations" was toggled off in Supabase → Authentication → Providers → Email. Supabase immediately creates an active session without sending a confirmation email.
**Root cause (2 — code):** `signUp()` in `auth-context.tsx` didn't return whether a session was created, so the signup page always auto-redirected after 2s regardless of whether confirmation was pending.
**Fix:**
1. `auth-context.tsx` — `signUp()` now returns `needsConfirmation: boolean` (true when Supabase returns a user but no session, i.e. email confirmation is required).
2. `app/auth/signup/page.tsx` — auto-redirect only fires when `needsConfirmation` is false; otherwise the "check your email" message stays on screen.
**Also required (manual — Supabase Dashboard):** Supabase → Authentication → Providers → Email → toggle **"Enable email confirmations"** ON. Without this, Supabase never sends the email and the code fix has no effect.
**Files:** `src/context/auth-context.tsx`, `app/auth/signup/page.tsx`
**Status:** ✅ Fixed

---

## B-008 — Last card in Trending This Week appears smaller
**Reported:** April 2026 — Shivi observed in screenshot; card #6 visually smaller than the others
**Symptom:** The 6th card in the horizontal scroll row looked slightly narrower/clipped compared to cards #1–5.
**Root cause:** The section had `px-5 sm:px-8` padding applied to the section element itself. The horizontal scroll container (`overflow-x-auto`) was a child of the section, so its right boundary ended at the section's inner content edge — 20–32px before the section's visual right edge. The last card hit this boundary and was visually cramped with no trailing breathing room.
**Fix:** Moved horizontal padding off the section onto its children individually — `px-5 sm:px-8` applied to the header div and to the scroll container directly. The scroll container now owns its own left and right padding, so the last card has equal trailing space as the first card has leading space.
**File:** `components/trending-this-week.tsx`
**Status:** ✅ Fixed
