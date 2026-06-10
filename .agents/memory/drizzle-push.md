---
name: Drizzle push interactive prompt
description: Why `drizzle-kit push` can hang in this environment and the workaround.
---

# Drizzle push hits an interactive TTY prompt

Adding a UNIQUE constraint/index to an existing table makes `drizzle-kit push`
ask an interactive "is this a rename or a new column?" question. It blocks even
with `--force` and there is no TTY in the agent shell, so it hangs.

**Workaround:** apply the column + unique index directly via SQL (`executeSql` /
`psql "$DATABASE_URL"`) instead of `push`, then keep the Drizzle schema file in
sync so types match. Plain additive column pushes (no unique constraint) are fine.
