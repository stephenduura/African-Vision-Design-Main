# Papi Foundation

A world-class digital platform for the Papi Foundation — a global African humanitarian foundation funding education, clean water, healthcare, and community empowerment projects across Africa.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/papi-foundation run dev` — run the frontend (port 24545)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `SUPABASE_DB_URL` or `DATABASE_URL` — Supabase Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Wouter, Lucide React
- Fonts: Playfair Display (headlines) + Plus Jakarta Sans (body) via Google Fonts
- API: Express 5
- DB: PostgreSQL + Drizzle ORM on Supabase
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- **OpenAPI spec**: `lib/api-spec/openapi.yaml` — single source of truth for API contracts
- **DB schema**: `lib/db/src/schema/` — one file per domain (projects, donations, team, partners, events, community, blog, contact)
- **API routes**: `artifacts/api-server/src/routes/` — one file per domain
- **Frontend pages**: `artifacts/papi-foundation/src/pages/` 
- **Design tokens**: `artifacts/papi-foundation/src/index.css` — gold + dark charcoal palette
- **Africa logo**: `attached_assets/africa_nobg.png` — background-removed, used in hero via `@assets` alias

## Architecture decisions

- Contract-first OpenAPI spec drives both typed React Query hooks (frontend) and Zod validators (backend)
- Single API server serves all routes under `/api` prefix
- Background-removed Africa PNG floats in the hero with Framer Motion animation
- Gold (#D4AF37) + deep charcoal + warm white palette — luxury institutional aesthetic
- All data is real (seeded from the database), no mocks

## Product

Pages: Home, About, Projects, Project Detail, Donate, Community, Team, Partners, Events, Blog, Blog Post Detail, Roadmap, Impact, Contact

Key features:
- Hero with floating animated Africa map
- Live impact counters (animated)
- Projects with progress bars, before/after photos, country filters
- Donation system (one-time / monthly, project selection, donor wall)
- Community join form with member grid
- Team: leadership / volunteers / ambassadors
- Partners by category (company, NGO, government, sponsor)
- Events & updates feed
- Blog with story/report/press/impact categories
- Roadmap timeline (2024-2028)
- Impact page with global stats
- Contact form + newsletter

## User preferences

- Premium aesthetic: Gold + black + warm white
- No emojis anywhere in the UI
- NABC-style structure but more advanced
- Africa image (background removed) must float in hero
- World-class, investor-grade design

## Gotchas

- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` before building frontend
- The `@assets` alias in Vite resolves to `attached_assets/` — use it to import the Africa PNG
- The `projects/stats` route must come BEFORE `projects/:id` in Express routing

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
