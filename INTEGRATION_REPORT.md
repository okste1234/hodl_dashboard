# HODL Admin Dashboard — Backend Integration Report

**Date:** 2026-06-08
**Frontend:** `/Users/okste/Documents/hodl_dashboard` (Next.js 16, React 19, React Query v5)
**Backend:** `/Users/okste/Documents/localised-backend` (NestJS, standalone admin app)
**API base:** `https://localised-backend-copy-prod-active.up.railway.app`
**Authenticated as:** `hello@joinhodl.com` (live OTP verified during this session)

---

## 1. Integration Report

### Endpoints discovered

The admin HTTP surface is **9 endpoints total** — 2 auth + 7 protected data reads. There are
**no mutation (POST/PATCH/DELETE) endpoints** beyond auth; the admin controller is read-only.

| # | Method | Path | Auth | Status |
|---|--------|------|------|--------|
| 1 | POST | `/admin/auth/request-otp` | public | ✅ Integrated (pre-existing, verified) |
| 2 | POST | `/admin/auth/verify-otp` | public | ✅ Integrated (pre-existing, verified) |
| 3 | GET | `/admin/overview` | AdminJwtGuard | ✅ Integrated (fully wired incl. subcomponents) |
| 4 | GET | `/admin/users` | AdminJwtGuard | ✅ Integrated (⚠ pagination blocked — see findings) |
| 5 | GET | `/admin/transactions` | AdminJwtGuard | ✅ Integrated |
| 6 | GET | `/admin/compliance` | AdminJwtGuard | ✅ Integrated |
| 7 | GET | `/admin/loans` | AdminJwtGuard | ✅ Integrated |
| 8 | GET | `/admin/vaults` | AdminJwtGuard | ✅ Integrated |
| 9 | GET | `/admin/analytics` | AdminJwtGuard | ✅ Integrated |

### Totals

- **Discovered:** 9
- **Integrated:** 9 / 9 (100%)
- **Missing (no UI before, now built/wired):** transactions, compliance, loans, vaults, analytics were all mock UIs → now real.
- **Blocked:** 0 fully blocked. **1 partially blocked** — `/admin/users` pagination & `isEmailVerified` filter (backend DTO bug; frontend workaround applied per decision).
- **Deprecated:** none observed. `AdminLoginDto` (password login) exists but is unused — superseded by OTP.

### Service methods that exist but are NOT exposed as routes

Found in `admin.service.ts`, no controller route (future mutation work, deferred per your instruction):
`reviewKyc`, `updateSettings`, `getSettings`, `promoteToAdmin`, `getSystemHealth`, `getAmlAlerts`,
`getTransactionDetails`, `getLoanDetails`, `getKycStats`, `getMonthlyVolume`, `getWeeklyActivity`,
`getTodayStats`, `getDailyVolume`, `getKeyMetrics`.

These drive the UI gaps now shown as honest empty/disabled states:
- **Settings** page — no `GET/PATCH /admin/settings` → save disabled + banner.
- **Compliance** — KYC review/approve actions & AML alerts feed → review deferred, AML empty-state.
- **System health** — no endpoint → empty-state card.

---

## 2. What was built (frontend)

### Data layer
- `types/admin.ts` — exact DTO mirrors for all 7 endpoints + shared `Paginated<T>`, plus enums
  (`UserKycStatus`, `ComplianceKycStatus`, `TransactionType`, `LoanStatusSort`) sourced from backend entities. **No `any`.**
- `lib/query-params.ts` — `buildQuery()` (drops empty params, stable keys).
- `lib/format.ts` — `formatUsd/formatNumber/formatPercent/formatDate/formatDateTime/initialsFrom` (null-safe; backend returns decimal **strings**).
- Hooks (React Query, `keepPreviousData`): `useUsers`, `useTransactions`, `useCompliance`, `useLoans`, `useVaults`, `useAnalytics`. Each query key encodes its filters.

### Auth (fixed a pre-existing breakage)
- `lib/auth.ts` — single source of truth for the token (`adm:accessToken`), `getToken/setToken/clearToken/isAuthenticated/logout`.
- `lib/api.ts` — interceptor now reads the same key (was reading `accessToken` while login wrote `adm:accessToken` → **every authed request 401'd**).
- Login (`app/page.tsx`) uses `setToken`; typed error handling (removed `as any`).
- Sidebar **Log out** wired (`queryClient.clear()` + redirect).
- Dashboard **route guard** — unauthenticated `/dashboard` visits redirect to `/`.

### UI layer (mock → real)
- `components/dashboard/data-state.tsx` — reusable loading skeleton rows, empty row, error+retry row, offset pagination footer.
- **Users / Transactions / Compliance / Loans / Vaults / Analytics** pages rewritten to consume real hooks with loading / error / empty states; server-side filters, debounced search (users), and pagination (where supported).
- **Overview** — `PlatformStats` & `RecentTransactions` (previously mock) now fed from the overview payload; nicer skeleton + retry.
- Removed fabricated nav count badges and the fake "System Status" latency table.

---

## 3. Verification (per endpoint)

All checks run live against production with a valid admin JWT.

| Endpoint | Route exists | Types match DTO | Live 200 | UI renders |
|----------|:---:|:---:|:---:|:---:|
| overview | ✅ | ✅ | ✅ | ✅ |
| users | ✅ | ✅ | ✅ (no page params) | ✅ |
| transactions | ✅ | ✅ | ✅ | ✅ |
| compliance | ✅ | ✅ | ✅ | ✅ |
| loans | ✅ | ✅ (nullable fields confirmed) | ✅ | ✅ |
| vaults | ✅ | ✅ (nested `earners`) | ✅ | ✅ |
| analytics | ✅ | ✅ | ✅ | ✅ |
| auth/request-otp | ✅ | ✅ | ✅ | ✅ |
| auth/verify-otp | ✅ | ✅ (`admin.name` nullable) | ✅ | ✅ |

Live response shapes were diffed field-by-field against `types/admin.ts` — **all match**, including
nullable fields (`user.name`, loan `interestRate/healthFactor/dueDate`, `averageInterestRate`).
