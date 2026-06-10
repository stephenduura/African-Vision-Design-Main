---
name: Orval generated query hooks
description: How to call the Orval-generated useGet*(id) React Query hooks without triggering a queryKey TS error
---

The Orval-generated `useGet<Entity>(id)` hooks (e.g. `useGetEvent`, `useGetBlogPost`) already build their own query options internally, including `enabled: !!(id)` and a `queryKey`.

**Rule:** Call them with just the id — `useGetEvent(Number(id))`. Do NOT pass `{ query: { enabled: !!id } }`.

**Why:** This codebase's generated `UseQueryOptions` type requires `queryKey`. Passing a partial `{ query: { enabled } }` object omits `queryKey` and produces `TS2741: Property 'queryKey' is missing`. Some older pages (e.g. BlogPostDetail, ProjectDetail) still pass options without `queryKey` and carry this pre-existing type error.

**How to apply:** When adding a detail page that fetches one record by id from a path param, call the hook with no second arg. `Number(undefined)` → `NaN`, and `enabled: !!(NaN)` is false, so the query stays disabled for invalid ids and you can render a not-found state instead of firing a bad request.

**When you DO need query options** (e.g. `refetchInterval`/`staleTime` for live polling on a param-less GET like `useGetDonationSummary`): the generated `getGet<Entity>QueryOptions` defaults `queryKey ?? getGet<Entity>QueryKey()` at runtime, but the react-query `UseQueryOptions` type still demands `queryKey`. So pass it explicitly: `useGetDonationSummary({ query: { queryKey: getGetDonationSummaryQueryKey(), refetchInterval: 6000, staleTime: 0 } })`. The `getGet*QueryKey` helper is exported from `@workspace/api-client-react`.
