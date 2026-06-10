---
name: Replit deployment bot-shield blocks XHR
description: Deployed apps 307-redirect API calls to /__replshield unless they carry X-Requested-With.
---

# Replit deployment bot-shield blocks programmatic API calls

In a **published/deployed** Replit app (not dev), the bot-shield intercepts
requests that look non-browser and serves an HTML interstitial: it responds
`307` with `location: https://replit.com/__replshield?redirect=...`, and that
endpoint returns `403 "Expected X-Requested-With header"`.

Symptom: a fetch/XHR (especially POST mutations) fails in production while the
same call works in dev. The request never reaches the server (no entry in
deployment logs). User-facing code shows a generic "could not start / request
failed" error.

**Fix:** send `X-Requested-With: XMLHttpRequest` on every API request. In this
repo that is done centrally in `lib/api-client-react/src/custom-fetch.ts`.

**Why:** the shield uses that header to distinguish legitimate AJAX from bots.

**How to apply / debugging:** reproduce with `curl -i -X POST <prod-url>/api/...`
— a `307 -> /__replshield` confirms it. Note plain cookie-less curl will 307
even GETs (no shield cookie); the real signal is that the browser's GETs reach
the server but its POSTs do not. The header change requires a **redeploy** to
take effect in production. If the client ever calls a cross-origin API from a
browser, the backend CORS must allow `X-Requested-With`.
