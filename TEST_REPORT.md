# HODL Admin Dashboard — Test Report

**Date:** 2026-06-08
**Scope:** Smoke level (per request) — unit/hook tests + Playwright happy-path E2E.
**Tooling added:** Vitest 2, @testing-library/react, jsdom, @playwright/test (Chromium).

---

## 1. Unit / Hook / React Query tests — `npm test`

```
✓ test/auth.test.ts          (4 tests)   — token helpers, single-key invariant, "null"/"undefined" guards
✓ test/query-params.test.ts  (6 tests)   — buildQuery: empties dropped, offset=0 kept, encoding, booleans
✓ test/useUsers.test.tsx     (3 tests)   — URL building, filter encoding, error surfacing (api mocked)

Test Files  3 passed (3)
     Tests  13 passed (13)
```

**Result: 13/13 passing.** `tsc --noEmit` clean. `next build` succeeds.

What they cover:
- **Auth invariant** — the exact regression that was broken in `main` (token key). Guards against `"null"`/`"undefined"` strings.
- **Query param construction** — proves filters serialize correctly and empty values never hit the wire.
- **`useUsers` hook** — mocked axios; asserts correct endpoint + querystring for no-filter and multi-filter cases, and that errors propagate to `isError`.

---

## 2. End-to-End tests (Playwright) — `npm run test:e2e`

```
✓ logs in via OTP and lands on the overview dashboard      (auth flow + dashboard load)
✓ navigates to the Users tab and renders real data          (navigation + table render)
✓ redirects unauthenticated dashboard access to login       (route guard / session)
✓ logs out back to the login screen                         (logout flow)

4 passed (6.1s)
```

**Result: 4/4 passing.** API is stubbed at the network layer (OTP + admin endpoints) so the suite is
deterministic and needs no live OTP. Covers the requested flows: **admin authentication, dashboard
loading, navigation, real-data render, session/guard, logout.**

---

## 3. Live API verification (manual, against production)

Run with a real admin JWT (`hello@joinhodl.com`):

| Check | Result |
|-------|--------|
| All 7 protected GETs | **200**, shapes match `types/admin.ts` exactly |
| Unauthenticated GET (overview/users) | **401** (guard enforced) |
| `request-otp` non-`@joinhodl.com` | **400** (domain validation) |
| `verify-otp` missing OTP | **400** (length validation) |
| Filtering: `transactions?transactionType=DEPOSIT` | **200**, all items `DEPOSIT` (75 total) |
| Filtering: `loans?status=ACTIVE` | **200**, all items `ACTIVE` (14 total) |
| Validation: `loans?status=BOGUS` | **400** (enum enforced) |
| Empty results: `users?search=zzzznomatch9999` | **200**, `total: 0`, `items: []` |
| **Pagination: `users?limit=2`** | **400 — backend bug** (see Technical Findings) |
| Pagination: `transactions?limit=2` (has `@Type`) | **200** (works) |

---

## 4. Coverage summary

| Area | Coverage |
|------|----------|
| Auth token logic | unit (4) + e2e (login/guard/logout) |
| Query building | unit (6) |
| Data hooks | unit (useUsers) + live 200 for all 7 |
| Pages render real data | e2e (overview, users) + live shape match |
| Error/empty/loading states | implemented all pages; empty verified live (users search) |
| Filtering / validation | live verified (transactions, loans, enum 400) |

**Not covered (smoke scope, by request):** per-page component unit tests for the other 5 tables,
visual regression, and live-network E2E. Hooks for those tables share the identical, tested pattern.
