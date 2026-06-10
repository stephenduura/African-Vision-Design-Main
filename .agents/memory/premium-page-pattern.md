---
name: Papi Foundation premium page redesign pattern
description: The shared "world-class" page structure used across redesigned marketing pages — follow it for consistency when redesigning any other page.
---

# Premium page redesign pattern

The reference implementation is `AfricanInsights.tsx`. Redesigned pages (Team, DoingBusiness, Roadmap/Track Record) all follow the same skeleton so the site feels cohesive. When asked to make another page "world-class / premium / addictive," reuse this structure rather than inventing a new one.

**Rule:** keep these conventions consistent across pages.

**Structure (top to bottom):**
1. Cinematic parallax hero — full-bleed background image at `inset-[-8%]`, forest-green gradient overlay `linear-gradient(180deg, rgba(15,38,28,0.55) ... 0.96)`, eyebrow (gold rule + uppercase tracked label), large `font-serif` headline with one word in `text-primary italic`, intro paragraph, two CTAs (gold solid + outline). Parallax via `useScroll`/`useTransform`, disabled when `useReducedMotion()`.
2. Forest-green stats/progress band (`bg-secondary text-secondary-foreground`) with animated `Counter` components. Stat labels must be `text-secondary-foreground/80` (NOT `/55` — `/55` fails WCAG AA contrast on the dark band).
3. Editorial body sections — alternating image/text, or grids with `gap-px bg-border` hairline dividers, gold numerals/eyebrows.
4. CTA section with background image + heavy forest-green gradient + top gold hairline.

**Always:**
- Wrap the page in `<MotionConfig reducedMotion="user">`.
- `const EASE = [0.22,1,0.36,1] as const;` and type variants `: Variants` (see framer-ease-typing.md).
- Generate page-specific images into `public/<page>/` (served at root, e.g. `/roadmap/hero.png`).
- Palette only: warm ivory `#F5F0E5`, forest green `rgba(15,38,28,*)`, gold `primary`/`#D4AF37`. NO black, NO emojis.
- Hover-reveal/interactive content must be keyboard- and touch-accessible (`group-focus-within`, `[@media(hover:none)]`, focus-visible rings).

**Gotcha:** the screenshot tool captures from the top only (no scroll); an 82vh parallax hero dominates the frame. Verify lower sections by checking data fetch (200) + no runtime errors in logs, or temporarily use a short viewport height.
