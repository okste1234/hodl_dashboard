// Mock data for the Cash & Ramps screen — USD virtual accounts, fiat ramp
// orders (on/offramp settlement ops), and linked bank accounts.

import { MOCK_USERS } from "./shared"

// ---------------------------------------------------------------------------
// USD virtual accounts
// ---------------------------------------------------------------------------

export type VirtualAccountStatus = "active" | "pending" | "frozen"

export interface VirtualAccount {
  id: string
  userId: string
  currency: "USD"
  status: VirtualAccountStatus
  accountNumber: string
  bankName: string
  availableBalanceUsd: number
  ledgerBalanceUsd: number
  createdAt: string
}

export const VIRTUAL_ACCOUNTS: VirtualAccount[] = [
  { id: "va_01", userId: MOCK_USERS[0].id, currency: "USD", status: "active", accountNumber: "8310042291", bankName: "Lead Bank", availableBalanceUsd: 12450.32, ledgerBalanceUsd: 12450.32, createdAt: "2026-01-14T09:12:00Z" },
  { id: "va_02", userId: MOCK_USERS[1].id, currency: "USD", status: "active", accountNumber: "8310044120", bankName: "Lead Bank", availableBalanceUsd: 3820.0, ledgerBalanceUsd: 4020.0, createdAt: "2026-02-02T11:40:00Z" },
  { id: "va_03", userId: MOCK_USERS[3].id, currency: "USD", status: "frozen", accountNumber: "8310049981", bankName: "Lead Bank", availableBalanceUsd: 0, ledgerBalanceUsd: 510.0, createdAt: "2026-02-20T15:05:00Z" },
  { id: "va_04", userId: MOCK_USERS[5].id, currency: "USD", status: "active", accountNumber: "8310051002", bankName: "Lead Bank", availableBalanceUsd: 54800.0, ledgerBalanceUsd: 54800.0, createdAt: "2025-12-18T08:30:00Z" },
  { id: "va_05", userId: MOCK_USERS[6].id, currency: "USD", status: "pending", accountNumber: "—", bankName: "Lead Bank", availableBalanceUsd: 0, ledgerBalanceUsd: 0, createdAt: "2026-03-01T10:00:00Z" },
]

// ---------------------------------------------------------------------------
// Ramp orders (onramp NGN→crypto, offramp crypto→NGN)
// ---------------------------------------------------------------------------

export type RampDirection = "onramp" | "offramp"
export type RampStatus = "initiated" | "validated" | "completed" | "refunded" | "failed"

export interface RampOrder {
  id: string
  reference: string
  userId: string
  direction: RampDirection
  /** fiat leg */
  fiatCurrency: "NGN"
  fiatAmount: number
  /** crypto leg */
  asset: string
  cryptoAmount: number
  rate: number
  feeUsd: number
  status: RampStatus
  createdAt: string
}

export const RAMP_ORDERS: RampOrder[] = [
  { id: "rmp_01", reference: "ONR-90021", userId: MOCK_USERS[0].id, direction: "onramp", fiatCurrency: "NGN", fiatAmount: 5_000_000, asset: "cNGN", cryptoAmount: 4_996_500, rate: 1.0, feeUsd: 2.24, status: "completed", createdAt: "2026-02-23T14:32:00Z" },
  { id: "rmp_02", reference: "OFR-90022", userId: MOCK_USERS[1].id, direction: "offramp", fiatCurrency: "NGN", fiatAmount: 1_180_000, asset: "USDC", cryptoAmount: 760.0, rate: 1552.6, feeUsd: 1.9, status: "validated", createdAt: "2026-02-23T14:05:00Z" },
  { id: "rmp_03", reference: "ONR-90023", userId: MOCK_USERS[2].id, direction: "onramp", fiatCurrency: "NGN", fiatAmount: 800_000, asset: "cNGN", cryptoAmount: 799_400, rate: 1.0, feeUsd: 0.38, status: "initiated", createdAt: "2026-02-23T13:58:00Z" },
  { id: "rmp_04", reference: "OFR-90024", userId: MOCK_USERS[3].id, direction: "offramp", fiatCurrency: "NGN", fiatAmount: 12_400_000, asset: "USDT", cryptoAmount: 7980.0, rate: 1553.9, feeUsd: 20.1, status: "completed", createdAt: "2026-02-23T11:22:00Z" },
  { id: "rmp_05", reference: "ONR-90025", userId: MOCK_USERS[4].id, direction: "onramp", fiatCurrency: "NGN", fiatAmount: 250_000, asset: "USDC", cryptoAmount: 160.5, rate: 1557.0, feeUsd: 0.6, status: "refunded", createdAt: "2026-02-22T19:40:00Z" },
  { id: "rmp_06", reference: "OFR-90026", userId: MOCK_USERS[5].id, direction: "offramp", fiatCurrency: "NGN", fiatAmount: 3_300_000, asset: "cNGN", cryptoAmount: 3_300_000, rate: 1.0, feeUsd: 1.5, status: "failed", createdAt: "2026-02-22T18:10:00Z" },
  { id: "rmp_07", reference: "ONR-90027", userId: MOCK_USERS[7].id, direction: "onramp", fiatCurrency: "NGN", fiatAmount: 9_500_000, asset: "USDC", cryptoAmount: 6100.0, rate: 1557.4, feeUsd: 14.6, status: "validated", createdAt: "2026-02-22T16:33:00Z" },
]

// ---------------------------------------------------------------------------
// Linked bank accounts (for offramp payouts)
// ---------------------------------------------------------------------------

export type LinkedBankStatus = "verified" | "pending" | "rejected"

export interface LinkedBankAccount {
  id: string
  userId: string
  bankName: string
  accountNumber: string
  accountName: string
  currency: "NGN" | "USD"
  status: LinkedBankStatus
  createdAt: string
}

export const LINKED_BANKS: LinkedBankAccount[] = [
  { id: "bnk_01", userId: MOCK_USERS[0].id, bankName: "Guaranty Trust Bank", accountNumber: "0123456789", accountName: "Jasper Okwu", currency: "NGN", status: "verified", createdAt: "2026-01-15T09:00:00Z" },
  { id: "bnk_02", userId: MOCK_USERS[1].id, bankName: "Access Bank", accountNumber: "0987654321", accountName: "Amara Obi", currency: "NGN", status: "verified", createdAt: "2026-02-03T12:10:00Z" },
  { id: "bnk_03", userId: MOCK_USERS[3].id, bankName: "Zenith Bank", accountNumber: "1122334455", accountName: "Fatima Bello", currency: "NGN", status: "pending", createdAt: "2026-02-21T15:30:00Z" },
  { id: "bnk_04", userId: MOCK_USERS[5].id, bankName: "United Bank for Africa", accountNumber: "2233445566", accountName: "Ngozi Mba", currency: "NGN", status: "verified", createdAt: "2025-12-19T08:45:00Z" },
  { id: "bnk_05", userId: MOCK_USERS[4].id, bankName: "Kuda MFB", accountNumber: "3344556677", accountName: "Chidi E.", currency: "NGN", status: "rejected", createdAt: "2026-02-10T10:20:00Z" },
]

export interface CashStats {
  totalUsdHeld: number
  activeAccounts: number
  pendingRamps: number
  rampVolume24hUsd: number
}

export const CASH_STATS: CashStats = {
  totalUsdHeld: VIRTUAL_ACCOUNTS.reduce((s, a) => s + a.availableBalanceUsd, 0),
  activeAccounts: VIRTUAL_ACCOUNTS.filter((a) => a.status === "active").length,
  pendingRamps: RAMP_ORDERS.filter((o) => o.status === "initiated" || o.status === "validated").length,
  rampVolume24hUsd: 184_200,
}
