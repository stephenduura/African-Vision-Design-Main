---
name: Team roster seeding
description: How the Papi Foundation team_members table is populated and why it is code-managed, not SQL-managed.
---

# Team roster seeding

The Team page (`artifacts/papi-foundation/src/pages/Team.tsx`) renders DB rows from
`team_members`: `leadership[0]` = founder spotlight, `leadership[1+]` = PersonCard grid;
also `volunteer` and `ambassador` categories. Member images live in `public/team/`
(the DB `image_url` is a plain path like `/team/benedicta.png`; the founder uses
`/founder.jpg`).

## The rule
The roster is **code-managed**. The single source of truth is the `TEAM_ROSTER`
array in `artifacts/api-server/src/seedTeam.ts`. On every server startup,
`seedTeam()` reconciles the table: inside one transaction it takes a
`pg_advisory_xact_lock`, deletes all rows, then inserts the full canonical roster.
It is wired into `index.ts` startup alongside `initStripe()`.

To change the team: edit the array and restart (dev) / republish (prod). Do **NOT**
edit `team_members` via ad-hoc SQL — the next restart wipes it.

**Why:** Production uses a SEPARATE content database from development. Replit's
publish flow copies code and *schema* diffs, but NOT row/content data. Team edits
made only via SQL against the dev DB never reached prod, so the live Team page kept
showing the original seeded people (Emmanuel Okafor et al. with Unsplash placeholder
photos). Moving the roster into startup-reconciled code makes both dev and prod
converge to the same roster on deploy.

**How to apply:** Any time team content must differ between the live site and what
SQL shows, suspect this — the live site reflects `TEAM_ROSTER` after the next
publish, not whatever was last written to the dev DB by hand. The advisory lock
exists because there is no unique constraint on `team_members`; without it, two
instances booting concurrently could both delete+insert and double the roster.

This same dev-vs-prod content-data gap applies to any other seeded content table,
not just team_members.
