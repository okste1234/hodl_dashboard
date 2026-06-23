// Admin API contract types.
//
// These mirror the backend DTOs / controller responses exactly
// (localised-backend `src/admin`). Endpoints carry NO global wrapper — each
// returns the raw object documented here. List endpoints return a `stats`
// object alongside a `Paginated<T>` body (`total/limit/offset/items`).

/** Common limit/offset pagination envelope used by all admin list endpoints. */
export interface Paginated<T> {
  total: number
  limit: number
  offset: number
  items: T[]
}

// ---------------------------------------------------------------------------
// Enums (sourced from backend entities)
// ---------------------------------------------------------------------------

/** KYC status on the user entity — used by the /admin/users filter. */
export enum UserKycStatus {
  NOT_STARTED = "NOT_STARTED",
  TIER_0 = "TIER_0",
  TIER_1 = "TIER_1",
  TIER_2 = "TIER_2",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

/** KYC verification status (smile-id) — used by the /admin/compliance filter. */
export enum ComplianceKycStatus {
  CREATED = "created",
  PENDING = "pending",
  COMPLETED = "completed",
  APPROVED = "approved",
  DECLINED = "declined",
  FAILED = "failed",
  EXPIRED = "expired",
}

/** Transaction type — used by the /admin/transactions filter. */
export enum TransactionType {
  BORROW = "BORROW",
  REPAY = "REPAY",
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  LIQUIDATION = "LIQUIDATION",
  INTEREST_ACCRUAL = "INTEREST_ACCRUAL",
  SEND = "SEND",
  SWAP = "SWAP",
  CROSS_CHAIN_SWAP = "CROSS_CHAIN_SWAP",
  USD_DEPOSIT = "USD_DEPOSIT",
  USD_WITHDRAWAL = "USD_WITHDRAWAL",
}

export enum LoanStatusSort {
  ACTIVE = "ACTIVE",
  REPAID = "REPAID",
}

/** Minimal user reference embedded in list rows. */
export interface UserRef {
  name: string | null
  email: string
}

// ---------------------------------------------------------------------------
// GET /admin/users
// ---------------------------------------------------------------------------

export interface UserStats {
  totalUsers: number
  activeToday: number
  kycPending: number
  suspended: number
}

export interface AdminUserItem {
  id: string
  name: string | null
  username: string | null
  email: string
  kycStatus: string
  status: "Active" | "Suspended"
  joinedAt: string
  walletUsd: string
  vaultUsd: string
  loansCount: number
}

export type UsersResponse = { stats: UserStats } & Paginated<AdminUserItem>

export interface UsersFilters {
  search?: string
  kycStatus?: UserKycStatus
  country?: string
  isEmailVerified?: boolean
  limit?: number
  offset?: number
}

// ---------------------------------------------------------------------------
// GET /admin/transactions
// ---------------------------------------------------------------------------

export interface TransactionBreakdown {
  deposits: string
  withdrawals: string
  borrows: string
  repayments: string
  liquidations: string
  swaps: string
}

export interface TransactionStats {
  todayTransactionVolumeUsd: string
  volumePercentChange: string
  totalTransactionsToday: number
  breakdown: TransactionBreakdown
  feesCollectedTodayUsd: string
}

export interface AdminTransactionItem {
  transactionType: string
  user: UserRef
  amount: string
  fee: string
  status: string
  createdAt: string
  // Token symbols as returned by the backend receipt parser. Most rails carry
  // `tokenSymbol`; swaps / cross-chain / USD→fiat carry `fromTokenSymbol` +
  // `toTokenSymbol`. Optional because older receipts (no remark) omit them.
  tokenSymbol?: string
  fromTokenSymbol?: string
  toTokenSymbol?: string
}

export type TransactionsResponse = { stats: TransactionStats } & Paginated<AdminTransactionItem>

export interface TransactionsFilters {
  transactionType?: TransactionType
  status?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}

// ---------------------------------------------------------------------------
// GET /admin/compliance
// ---------------------------------------------------------------------------

export interface ComplianceStats {
  totalKycPending: number
  flaggedTransactions: number
  usersVerifiedToday: number
  riskedScore: string
}

export interface AdminKycItem {
  user: UserRef
  kycTier: string
  status: string
  createdAt: string
}

export type ComplianceResponse = { stats: ComplianceStats } & Paginated<AdminKycItem>

export interface ComplianceFilters {
  status?: ComplianceKycStatus
  limit?: number
  offset?: number
}

// ---------------------------------------------------------------------------
// GET /admin/loans
// ---------------------------------------------------------------------------

export interface LoanStats {
  totalLoans: number
  averageInterestRate: number | null
  positionsAtRisk: number
  totalDefaulters: number
}

export interface AdminLoanItem {
  user: UserRef
  loanId: string
  collateralAmount: string
  loanAmount: string
  interestRate: number | null
  healthFactor: number | null
  status: string
  dueDate: string | null
  createdAt: string
}

export type LoansResponse = { stats: LoanStats } & Paginated<AdminLoanItem>

export interface LoansFilters {
  status?: LoanStatusSort
  limit?: number
  offset?: number
}

// ---------------------------------------------------------------------------
// GET /admin/vaults
// ---------------------------------------------------------------------------

export interface VaultDetails {
  totalVaultValue: string
  totalEarnings: string
  totalAPY: string
  utilisation: string
  numberOfDepositors: number
}

export interface VaultStats {
  totalVaultValue: string
  totalTVL: string
  totalEarnings: string
  totalFees: number
  totalAPY: string
  vaultDetails: VaultDetails
}

export interface VaultEarnerItem {
  user: UserRef
  vaultBalance: string
  amountLocked: string
  earnings: string
  status: string
  period: string
}

export interface VaultsResponse {
  stats: VaultStats
  earners: Paginated<VaultEarnerItem>
}

export interface VaultsFilters {
  limit?: number
  offset?: number
}

// ---------------------------------------------------------------------------
// GET /admin/analytics
// ---------------------------------------------------------------------------

export interface AnalyticsPoint {
  month: string
  value: number
}

export interface AnalyticsResponse {
  userGrowth: AnalyticsPoint[]
  loanVolume: AnalyticsPoint[]
  conversionActivity: AnalyticsPoint[]
  feeRevenue: AnalyticsPoint[]
}

// ---------------------------------------------------------------------------
// POST /admin/reconcile/paycrest
// Reconciles on/off-ramp transactions stuck on INITIATED/PENDING by polling
// Paycrest for their authoritative status. No request body.
// ---------------------------------------------------------------------------

export type ReconcileOutcome = "updated" | "unchanged" | "failed"

export interface ReconcileDetail {
  transactionId: string
  transactionNo: string
  from: string
  to?: string
  paycrestStatus?: string
  outcome: ReconcileOutcome
  error?: string
}

export interface ReconciliationResult {
  checked: number
  updated: number
  unchanged: number
  failed: number
  details: ReconcileDetail[]
}

// ---------------------------------------------------------------------------
// Cash & Ramps — GET /admin/cash/{virtual-accounts,ramps,linked-banks}
// ---------------------------------------------------------------------------

/** User ref that may be absent on a row (backend returns null when unlinked). */
export type MaybeUserRef = UserRef | null

export interface CashStats {
  totalUsdHeld: string
  activeAccounts: number
  pendingRamps: number
  rampVolume24hUsd: string
}

export interface AdminVirtualAccount {
  id: string
  user: MaybeUserRef
  currency: string
  status: string
  bankName: string
  accountNumberMasked: string | null
  availableBalanceUsd: string
  createdAt: string
}

export type VirtualAccountsResponse = { stats: CashStats } & Paginated<AdminVirtualAccount>

export type RampDirection = "onramp" | "offramp"

export interface RampReceiver {
  name: string
  accountNumberMasked: string | null
  bankName: string
  currency: string
}

export interface AdminRampOrder {
  id: string
  reference: string
  transactionType: string
  direction: RampDirection
  provider: string | null
  amount: string | null
  tokenSymbol: string | null
  fromTokenSymbol: string | null
  toTokenSymbol: string | null
  usdValue: string | null
  status: string
  user: MaybeUserRef
  receiver: RampReceiver | null
  createdAt: string
}

export type RampOrdersResponse = Paginated<AdminRampOrder>

export interface RampFilters {
  status?: string
  limit?: number
  offset?: number
}

export interface AdminLinkedBank {
  id: string
  user: MaybeUserRef
  bankName: string
  accountNumberMasked: string | null
  accountName: string
  currency: string
  bankCode: string
  bankType: string
  status: string
  createdAt: string
}

export type LinkedBanksResponse = Paginated<AdminLinkedBank>

export interface BankFilters {
  status?: string
  limit?: number
  offset?: number
}

// ---------------------------------------------------------------------------
// Yield Markets — GET /admin/yield/{positions,protocols}
// ---------------------------------------------------------------------------

export interface YieldStats {
  totalValueLockedUsd: string
  activePositions: number
  depositors: number
  totalEarnedUsd: string
}

export interface AdminYieldPosition {
  id: string
  user: MaybeUserRef
  protocol: string
  chain: string
  asset: string
  balanceUsd: string
  earnedUsd: string
  status: string
  openedAt: string
}

export type YieldPositionsResponse = { stats: YieldStats } & Paginated<AdminYieldPosition>

export interface YieldPositionsFilters {
  status?: string
  limit?: number
  offset?: number
}

export interface AdminYieldProtocol {
  protocol: string
  chain: string
  asset: string
  tvlUsd: string
  earnedUsd: string
  positions: number
  depositors: number
}

export interface YieldProtocolsResponse {
  total: number
  items: AdminYieldProtocol[]
}

// ---------------------------------------------------------------------------
// Wallets — GET /admin/wallets
// ---------------------------------------------------------------------------

export interface WalletStats {
  totalWalletValueUsd: string
  trackedWallets: number
  distinctTokens: number
  activeChains: number
}

export interface AdminWalletHolding {
  id: string
  user: MaybeUserRef
  walletAddress: string | null
  network: string
  symbol: string
  balance: string
  usdValue: string
}

export type WalletHoldingsResponse = {
  stats: WalletStats
  /** Distinct networks present in the data — drives the chain filter. */
  chains: string[]
} & Paginated<AdminWalletHolding>

export interface WalletFilters {
  network?: string
  search?: string
  limit?: number
  offset?: number
}
