---
name: Framer Motion ease tuple typing
description: Why cubic-bezier ease arrays break TS in this repo and how to type them
---

# Framer Motion `ease` tuple typing

Cubic-bezier easing arrays like `ease: [0.22, 1, 0.36, 1]` get inferred as `number[]`, which is NOT assignable to Framer's `Easing` type. This throws `TS2322` whenever the object is used as `Variants` or passed to a `transition`/`variants` prop.

**Fix:** declare the tuple once as `const EASE = [0.22, 1, 0.36, 1] as const;` and reuse it, and annotate variant objects as `: Variants` (import `type Variants` from `framer-motion`).

**Why:** `tsc -p tsconfig.json --noEmit` fails the package typecheck on these. `tail`-ing typecheck output can hide them — grep for the specific filename instead.

**How to apply:** any new page using framer variants/transitions in `artifacts/papi-foundation`. Note: `Home.tsx`, `Projects.tsx`, `ProjectDetail.tsx` still carry pre-existing typecheck errors (the ease one in Home, plus unrelated codegen/import issues) — not introduced by insights work.
