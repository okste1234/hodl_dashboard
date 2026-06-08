# HODL Dashboard — Mini-App UI Expansion Report

**Date:** 2026-06-08
**Source of truth:** `/Users/okste/Documents/hodl-mini-app`
**Target:** `/Users/okste/Documents/hodl_dashboard`
**Mode:** UI-only — no backend, no API calls, no auth/state changes. Mock data only.

---

## 1. Feature Coverage Report

### Found in the mini-app (8 product pillars)
Wallet (multi-chain crypto) · Credit Vault (borrow/repay) · Earn/Yield (LP vault + LI.FI yield markets) ·
Fiat Ramps & Cash (NGN↔crypto on/offramp + USD virtual accounts) · P2P transfers · KYC (tier 0/1/2) ·
Referrals · Account (profile, PIN, linked banks, notifications, support).

### Coverage before vs after

| Product area | Before | After |
|---|---|---|
| Users / Loans / Transactions / Vault stats / Analytics / KYC queue | ✅ (real API) | ✅ unchanged |
| **Crypto wallets (multi-chain)** | ❌ | ✅ **Wallets** page |
| **USD virtual accounts** | ❌ | ✅ **Cash & Ramps → Virtual Accounts** |
| **Fiat ramp settlement ops** | ⚠️ lumped in Transactions | ✅ **Cash & Ramps → Ramp Orders** |
| **Linked bank accounts** | ❌ | ✅ **Cash & Ramps → Linked Banks** |
| **Referral program** | ❌ | ✅ **Referrals** page (funnel + referrers + rewards) |
| **Broadcast notifications** | ❌ | ✅ **Announcements** page (+ compose sheet) |
| **DeFi yield markets** | ⚠️ LP vault only | ✅ **Yield Markets** page (protocols + positions) |
| **Support / tickets** | ❌ | ✅ **Support** page (+ ticket detail sheet) |
| **KYC document review** | ⚠️ queue only | ✅ **KYC Review sheet** (extends Compliance) |
| **User 360 view** | ❌ | ✅ **User detail sheet** (extends Users) |

Result: **6 new pages + 2 detail-sheet extensions**, covering every previously-unrepresented product pillar.

---

## 2. UI Additions Summary

### New pages (`components/dashboard/`)
| Page | File | Highlights |
|---|---|---|
| Wallets | `wallets-page.tsx` | KPIs, chain filter, token/user search, holdings table, pagination |
| Cash & Ramps | `cash-page.tsx` | Tabs: Virtual Accounts · Ramp Orders · Linked Banks; status badges |
| Referrals | `referrals-page.tsx` | KPIs, Recharts conversion funnel, Top Referrers + Rewards Ledger tabs |
| Announcements | `announcements-page.tsx` | KPIs, campaign table, **compose Sheet** (UI-only) |
| Yield Markets | `yield-page.tsx` | KPIs, Protocol whitelist + User Positions tabs, risk/status badges |
| Support | `support-page.tsx` | KPIs, status/priority filters, **ticket detail Sheet** with thread |

### Extensions (existing pages — extended, not rewritten)
| Extension | File | Wired into |
|---|---|---|
| User 360 detail | `user-detail-sheet.tsx` | Users table → "View Details" |
| KYC review | `kyc-review-sheet.tsx` | Compliance table → "Review" |

### Shared primitives (new, reusable)
| Component / hook | File | Purpose |
|---|---|---|
| `StatCard` | `components/dashboard/stat-card.tsx` | Consistent KPI card with loading skeleton |
| `ChainBadge` | `components/dashboard/chain-badge.tsx` | Colored chain chip (wallets/yield/cash/user sheet) |
| `useMockData` | `hooks/useMockData.ts` | Simulated async load → genuine loading/empty/error states, no backend |
| `formatToken` / `formatDelta` | `lib/format.ts` | Token-amount + signed-percent formatters |

### Mock data (`mocks/` — dedicated folder, never inline)
`shared.ts` (chains + users), `wallets.ts`, `cash.ts`, `referrals.ts`, `announcements.ts`,
`yield.ts`, `support.ts`, `user-detail.ts`, `kyc-detail.ts`. Each exports typed entities + data; the
detail files expose deterministic builder functions seeded off identity (no randomness).

### Navigation
- Sidebar (`app-sidebar.tsx`): new items under **Platform** (Wallets, Yield Markets, Cash & Ramps) and a
  new **Growth** group (Referrals, Announcements, Support).
- `app/dashboard/page.tsx`: 6 new `switch` cases.
- `dashboard-header.tsx`: 6 new page titles/descriptions.

---

## 3. Design Consistency Notes

### Reused components & patterns
- Existing primitives: `Card`, `Table`, `Badge`, `Tabs`, `Sheet`, `Select`, `Input`, `Textarea`,
  `Avatar`, `Progress`, `DropdownMenu`, plus Recharts for charts.
- My integration-phase helpers reused as-is: `data-state.tsx` (loading skeleton rows, empty row, error row,
  pagination) and `lib/format.ts` (now ₦-aware via `formatNaira`).
- Every new page follows the established page skeleton: `header → 4 KPI cards → filtered/tabbed data table`,
  with the same spacing (`gap-6`/`gap-4`), badge color conventions (`success/warning/destructive/chart-2`
  with `/10` bg + `/20` border), and `text-xs text-muted-foreground` table headers.

### Edge states (mocked, but genuine)
- **Loading:** `useMockData` simulates a ~450ms async load so skeleton rows/`StatCard` skeletons actually render.
- **Empty:** every table renders `TableEmptyRow` when filters exclude all rows (e.g. Support status filter, Wallets chain filter).
- **Error:** `data-state` error rows are wired on the data tables; `useMockData` supports a `failingMode` toggle to exercise them.

### Assumptions made
1. **Currency:** new monetary values render with **₦** (via `formatNaira`) to match the platform-wide default
   you set earlier — even though some underlying figures are nominally USD. No FX conversion is performed (display symbol only).
2. **Mock identity:** all mock rows reference a small shared `MOCK_USERS` set so the same people appear
   coherently across Wallets, Cash, Referrals, Yield, and Support.
3. **Detail sheets** use builder functions seeded off email/name so a given user/applicant always renders the
   same illustrative detail — clearly labelled in-UI as illustrative (no backend detail endpoint exists).
4. **Write actions are UI-only** (Announcements compose, Support reply/resolve, KYC approve/reject): they
   reset/close locally and are labelled as preview-only, consistent with the read-only backend.
5. **Cards** was intentionally excluded per your scoping selection.

### Quality gates
- `tsc --noEmit` clean · `next build` ✓ · **no `any`** · strict TS throughout.
- Regression: existing **13/13 unit tests** and **4/4 Playwright E2E** still pass (nav expansion didn't break the shell).
