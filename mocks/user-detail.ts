// Mock 360° detail for the User detail sheet (opened from the Users table).
// The Users list itself is REAL API data; this supplements it with the
// per-user panels the backend has no detail endpoint for. UI-only.

export interface UserDetailWallet {
  chain: string
  symbol: string
  balance: string
  valueUsd: number
}

export interface UserDetailLoan {
  loanId: string
  collateral: string
  borrowedUsd: number
  status: "ACTIVE" | "REPAID"
  healthFactor: number | null
}

export interface UserDetailActivity {
  label: string
  at: string
}

export interface UserDetail {
  walletAddress: string
  country: string
  pinSet: boolean
  twoFactor: boolean
  wallets: UserDetailWallet[]
  loans: UserDetailLoan[]
  activity: UserDetailActivity[]
}

/**
 * Build a deterministic, illustrative detail payload for a given user. Values
 * are seeded off the email so the same user always renders the same panels
 * (no randomness), while still differing between users.
 */
export function buildUserDetail(seed: { email: string }): UserDetail {
  const n = seed.email.length
  const f = (base: number) => Math.round(base * (1 + (n % 7) / 20) * 100) / 100

  return {
    walletAddress: `0x${(n * 7).toString(16).padStart(4, "0")}…${(n * 13).toString(16).slice(-4)}`,
    country: "Nigeria",
    pinSet: n % 2 === 0,
    twoFactor: n % 3 === 0,
    wallets: [
      { chain: "Base", symbol: "USDC", balance: f(2200).toLocaleString(), valueUsd: f(2200) },
      { chain: "Base", symbol: "cNGN", balance: f(1_850_000).toLocaleString(), valueUsd: f(1184) },
      { chain: "Ethereum", symbol: "ETH", balance: (f(1.2)).toString(), valueUsd: f(4140) },
    ],
    loans: [
      { loanId: `LN-${1000 + (n % 900)}`, collateral: "ETH", borrowedUsd: f(800), status: "ACTIVE", healthFactor: f(1.4) },
      { loanId: `LN-${500 + (n % 400)}`, collateral: "USDC", borrowedUsd: f(300), status: "REPAID", healthFactor: null },
    ],
    activity: [
      { label: "Signed in", at: "2026-02-23T14:32:00Z" },
      { label: "Borrowed ₦500,000 against ETH", at: "2026-02-22T09:11:00Z" },
      { label: "Completed KYC Tier 1", at: "2026-02-10T16:05:00Z" },
      { label: "Linked GTBank account", at: "2026-02-09T12:20:00Z" },
    ],
  }
}
