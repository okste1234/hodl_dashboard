# HODL Admin Dashboard — Technical Findings

**Date:** 2026-06-08
Findings from integrating the admin API, verified against backend source and live production.

---

## 🔴 Critical

### F1. Frontend auth was fully broken (token-key mismatch) — FIXED
- **Where:** `app/page.tsx` wrote `localStorage["adm:accessToken"]`; `lib/api.ts` read `localStorage["accessToken"]`.
- **Impact:** the Bearer token was never attached → **every** authenticated `/admin/*` request returned 401. The dashboard could not load any protected data.
- **Fix:** centralized in `lib/auth.ts` (single key `adm:accessToken`); interceptor, login, logout, and route guard all use it. Covered by `test/auth.test.ts`.

### F2. `limit`/`offset` query params 400 on TWO endpoints (DTO bug) — BACKEND FIX RECOMMENDED
Two filter DTOs are missing the `@Type(() => Number)` coercion that their siblings have, so any
numeric query param arrives as a string and fails validation under the global non-transforming pipe.

**(a) `/admin/users`** — `src/admin/dto/user-filter.dto.ts`: `limit`/`offset` use `@IsNumber()` without
`@Type`, and `isEmailVerified` uses `@IsBoolean()` without a transform.
- Live: `users?limit=2` → `400 "limit must be a number…"`; `users?isEmailVerified=true` → 400.

**(b) `/admin/compliance`** — `src/admin/dto/kyc-filter.dto.ts` (the `KycRequestsFilterDto` the controller
actually imports): `limit`/`offset` use `@IsInt() @Min() @Max()` without `@Type`.
- Live: `compliance?limit=20&offset=0` → `400 ["limit must not be greater than 100","limit must not be less than 1", …]`.

**Working by contrast:** `TransactionFilterDto`, `LoanFilterDto`, `PaginationDto` all include
`@Type(() => Number)` → `transactions?limit=2`, `loans?limit=3`, `vaults?limit=20` all return 200.

- **Impact:** Users and Compliance pages cannot do server-side pagination (and Users cannot filter by email-verified).
- **Decision taken:** frontend workaround on both pages — omit `limit`/`offset`, render the server's
  default first page, show a note. Status/search/KYC/country filters (non-numeric) still work.
- **Recommended backend patch:**
  ```ts
  // user-filter.dto.ts
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
  @IsOptional() @Type(() => Number) @IsNumber() offset?: number;
  @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() isEmailVerified?: boolean;

  // kyc-filter.dto.ts
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) offset?: number;
  ```

---

## 🟠 Backend inconsistencies & DTO mismatches

### F3. No mutation endpoints exist
The admin controller is **read-only**. `reviewKyc`, `updateSettings`, `promoteToAdmin`, etc. exist in
`admin.service.ts` but have no routes. So Settings cannot save, KYC cannot be approved/rejected, and
there are no user actions. UI now reflects this honestly (disabled save, deferred review actions).
**Recommend** exposing these as `PATCH /admin/kyc/:userId`, `GET/PATCH /admin/settings`,
`POST /admin/users/:id/promote` (your deferred backend phase).

### F4. Duplicate `KycRequestsFilterDto`
Two classes named `KycRequestsFilterDto` exist: `dto/kyc-filter.dto.ts` (enum `status`, with `@Min/@Max`)
and `dto/kyc-requests-filter.dto.ts` (string `status`). The controller imports the **enum** one. The
string-based duplicate is dead/confusing — **remove it** to avoid future mis-imports.

### F5. `verify-otp` returns `admin.name: null`
- **Live:** `{ admin: { id, email, name: null } }`. The pre-existing FE type declared `name: string`.
- **Fix:** typed as `string | null` (`useVerifyOtp.ts`, sidebar). Sidebar already falls back to initials/"Admin".

### F6. Pervasive nullable fields not signalled in Swagger examples
Live data returns `null` for: every `user.name` (across users/transactions/compliance/loans/overview),
loan `interestRate`/`healthFactor`/`dueDate`, and `stats.averageInterestRate`. Swagger examples show
populated values, which is misleading. Types now model these as nullable and the UI renders `—`.
**Recommend** `nullable: true` in the `@ApiProperty` examples and, ideally, backfilling `user.name`.

### F7. Several "stats" are stubbed server-side
`getAnalytics()` returns static 12-month data; parts of loan/risk stats are hardcoded or `null`
(`averageInterestRate`, `positionsAtRisk`, `totalDefaulters` were 0/null). The frontend faithfully
renders whatever the backend sends — these are **backend data gaps**, not UI bugs.

---

## 🟡 Swagger / contract accuracy

### F8. No global response wrapper
Endpoints return raw objects (list endpoints spread `stats` + `Paginated<T>`; vaults nests `earners`).
There is **no** `{ data, statusCode, message }` envelope. Confirmed in source and live. Hooks read the
body directly. (Worth documenting explicitly for future API consumers.)

### F9. `/admin/vaults` exposes only aggregates
There is no per-asset vault breakdown endpoint — only aggregate `vaultDetails` + paginated `earners`.
The old mock UI implied a per-vault table + TVL pie; those were removed (no data source). If per-vault
analytics is desired, a new endpoint is needed.

---

## 🔐 Security observations

- **S1.** Admin access is correctly gated: JWT required (401 without), role checked in `AdminJwtGuard`,
  domain locked to `@joinhodl.com`, 1-day token expiry. Verified live.
- **S2. CORS `origin: true` with `credentials: true`** (`main-admin.ts`) reflects any origin. Tokens are
  in `localStorage` (not cookies), so CSRF exposure is limited, but the reflective CORS is broad —
  **recommend** an explicit allowlist of admin origins.
- **S3. Tokens in `localStorage`** are readable by any XSS. Acceptable for an internal admin tool, but
  consider httpOnly cookies + CSRF tokens if threat model warrants.
- **S4.** OTP request returns 200 even for non-existent (but valid-domain) addresses — good (no user
  enumeration). Bad-domain returns 400, which does reveal the domain rule (acceptable).

---

## ⚡ Performance observations

- **P1.** List endpoints compute `stats` and the page in parallel (`Promise.all`) — good.
- **P2.** `walletUsd`/`vaultUsd`/`loansCount` per user appear to be derived from wallet-transaction scans
  (per DTO comments). At scale this risks N+1 / heavy aggregation per request — **recommend** verifying
  query plans and adding indexes / materialized stats if the users table grows.
- **P3.** Frontend uses React Query with `staleTime: 60s` + `keepPreviousData`, so pagination/filter
  changes don't fl— caching is in place. No client-side perf concern.

---

## ✅ Recommended improvements (priority order)

1. **F2** — add `@Type`/transform to `UserFilterDto` (unblocks Users pagination). *One-line-per-field.*
2. **F3** — expose KYC review + settings + promote mutations (your deferred phase).
3. **F6** — backfill `user.name` / mark nullable fields in Swagger.
4. **F4** — delete the duplicate `KycRequestsFilterDto`.
5. **S2** — tighten CORS to an explicit admin-origin allowlist.
6. **F9** — add a per-asset vault breakdown endpoint if that UI is wanted.
