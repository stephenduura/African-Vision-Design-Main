---
name: Community feed + Clerk auth
description: Durable decisions for the social community feed (posts/reactions/comments) and its Clerk-backed auth.
---

# Community feed + Clerk auth

The /community page (Community.tsx) embeds a social feed component (`src/components/community/CommunityFeed.tsx`) below the hero/stats; the original join-form + member-grid sections are kept below it. Backend lives in `artifacts/api-server/src/routes/communityFeed.ts`.

## Reaction toggle must be conflict-safe
Reactions (post + comment) have a UNIQUE constraint on (postId|commentId, userId). A naive read-then-insert toggle races under rapid taps / multi-tab and throws 500 on the duplicate insert.
**Rule:** if an existing reaction of the *same* type is found → delete it (toggle off); otherwise `insert(...).onConflictDoUpdate({ target: [<entity>Id, userId], set: { type } })`. This collapses "switch type" and "first reaction" into one conflict-safe upsert.
**Why:** unique constraint + concurrent requests turn the add path into a 500 generator without upsert.

## Validate user-supplied image URLs server-side
Posts accept an optional `imageUrl` rendered directly in `<img src>`. Sanitize on write: parse with `new URL()`, allow only `http:`/`https:`, else store null. Never trust the client value.
**Why:** untrusted URL sink (data:/javascript: schemes); React text rendering is safe but `<img src>` is not.

## Auth model
Clerk web auth is **cookie/proxy-based — no bearer tokens in the web custom-fetch.** Backend reads identity via `getAuth(req).userId`; writes return 401 when absent, 403 on non-author delete. Author name/image are denormalized onto posts/comments at write time via `clerkClient.users.getUser`. Reads are public (myReaction only filled when authed). After sign-in/out, a Clerk addListener clears the React Query cache so myReaction doesn't leak across users.
