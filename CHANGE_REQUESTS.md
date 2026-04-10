# GlowCompare — Change Requests Log

> Tracks post-launch scope changes that were not part of the original PRD or sprint plan.
> Each CR links to the user story it generated and the rationale for the change.

---

## How to Read This

| Field | Meaning |
|---|---|
| **Raised by** | Who identified the need |
| **Type** | Enhancement / Bug-driven / Design / UX |
| **Priority** | High / Medium / Low |
| **Status** | ✅ Implemented / 🔄 In Progress / ⏳ Backlog |
| **Linked Story** | User story created as a result of this CR |

---

## CR-001 — Branded Favicon

**Raised by:** Shivi (April 2026)
**Type:** Enhancement
**Priority:** Low
**Status:** ✅ Implemented

**Description:**
The app was using the default Next.js favicon. A branded favicon representing GlowCompare was requested to reinforce brand identity in the browser tab.

**Decision:**
Implement a custom GC favicon using Next.js App Router's `app/icon.tsx` with ImageResponse — "G" in black, "C" in white on a hot pink block, mirroring the logo treatment.

**Linked Story:** US-040
**File:** `app/icon.tsx`

---

## CR-002 — Mobile-Responsive Web Layout

**Raised by:** Shivi (April 2026)
**Type:** UX / Enhancement
**Priority:** High
**Status:** ✅ Implemented

**Description:**
The web app was not usable on mobile — the navbar cramped all elements into one row, making the search bar unusable (~55px wide). The hero spotlight also had oversized images and loose padding on small screens.

**Decision:**
- Navbar: use `flex-wrap` + `order-last w-full` so search bar drops to its own full-width row on mobile; logo and actions stay on row 1.
- HeroSpotlight: reduce image from `w-64` to `w-48` on mobile, tighten padding, step down heading from `text-3xl` to `text-2xl`.

**Note:** React Native mobile app (Expo) remains in Phase 2 scope — this CR covers web responsiveness only.

**Linked Story:** US-041
**Files:** `components/navbar.tsx`, `components/hero-spotlight.tsx`

---

## CR-003 — Auth Pages Visual Redesign

**Raised by:** Shivi (April 2026)
**Type:** Design
**Priority:** Medium
**Status:** ✅ Implemented

**Description:**
The sign in and sign up pages were plain white centered forms with no visual identity — they did not reflect the GlowCompare brand at all.

**Decision:**
Redesign both pages with a split-panel layout:
- **Left panel (desktop only):** black background, bold brand headline, trend score bars (login) or perks checklist (signup), platform strip, geometric pink accent shapes.
- **Right panel:** off-white form with sharp-bordered inputs and pink CTA.
- **Mobile:** left panel hidden, form takes full width with a compact platform strip below the form.
All existing form logic (state, validation, error handling, auth flow) preserved unchanged.

**Linked Story:** US-042
**Files:** `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`

---

## CR-004 — Gamified Scroll Progress Indicator

**Raised by:** Shivi (April 2026)
**Type:** UX / Enhancement
**Priority:** Medium
**Status:** ✅ Implemented

**Description:**
The default browser scrollbar was non-engaging. For a Gen Z beauty discovery platform, the browsing experience should feel more interactive and rewarding — inspired by TikTok/Instagram micro-reward patterns.

**Decision:**
Implement a "Glow Trail Scroll" — a fixed 3px hot pink progress bar at the top of the viewport with:
- Shimmer (lip-gloss texture) animation on the fill
- Pulsing glow orb at the leading edge
- Milestone badges at 25/50/75/100% scroll with beauty-themed copy, appearing in the bottom-right and auto-dismissing after ~2s

Implemented in pure CSS (`@keyframes`) — no Framer Motion — to keep the bundle lean.

**Linked Story:** US-043
**File:** `components/scroll-progress.tsx`, `app/layout.tsx`

---

## CR-005 — ScoreMarquee Redesign

**Raised by:** Shivi (April 2026)
**Type:** Design
**Priority:** Medium
**Status:** ✅ Implemented

**Description:**
The original marquee strip used a full hot pink (`#FF2D95`) background, which was visually too heavy and clashed with the HeroSpotlight section directly below it (which is also pink). The content was also a single flat string — not visually engaging.

**Decision:**
Redesign the marquee to:
- **Background:** black (`#0F172A`) with a 3px hot pink top border — editorial, on-brand, and visually distinct from the pink hero.
- **Content:** each of the 5 trending signals rendered as individual interactive pills (icon + label + pink percentage badge), separated by `✦` dividers.
- **Leading label:** "How we rank →" makes the purpose immediately clear to new users.

**Linked Story:** US-044
**File:** `components/ScoreMarquee.tsx`

---

*GlowCompare — Change Requests Log | Phase 1 post-launch | April 2026*
