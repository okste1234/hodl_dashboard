// Mock data for the Wallets screen — multi-chain crypto holdings inspector.
// Mirrors the mini-app's wallet token-balance entity.

import { MOCK_USERS } from "./shared"

export interface TokenHolding {
  id: string
  userId: string
  chainKey: string
  symbol: string
  name: string
  contractAddress: string
  balance: number
  decimals: number
  priceUsd: number
  valueUsd: number
  variation24h: number
  isNative: boolean
}

export interface WalletStats {
  totalWalletValueUsd: number
  trackedWallets: number
  distinctTokens: number
  activeChains: number
}

const token = (
  id: string,
  userIdx: number,
  chainKey: string,
  symbol: string,
  name: string,
  balance: number,
  priceUsd: number,
  variation24h: number,
  isNative = false
): TokenHolding => {
  const valueUsd = balance * priceUsd
  return {
    id,
    userId: MOCK_USERS[userIdx].id,
    chainKey,
    symbol,
    name,
    contractAddress: isNative ? "N/A" : `0x${id.replace(/[^a-f0-9]/gi, "").padEnd(8, "0").slice(0, 8)}…`,
    balance,
    decimals: symbol === "USDC" || symbol === "USDT" ? 6 : 18,
    priceUsd,
    valueUsd,
    variation24h,
    isNative,
  }
}

export const WALLET_HOLDINGS: TokenHolding[] = [
  token("h01", 0, "ethereum", "ETH", "Ethereum", 6.42, 3450.12, 2.1, true),
  token("h02", 0, "base", "USDC", "USD Coin", 22199.09, 1.0, 0.0),
  token("h03", 0, "base", "cNGN", "Compliant Naira", 4_200_000, 0.00064, -0.3),
  token("h04", 1, "ethereum", "USDT", "Tether", 15420.5, 1.0, 0.01),
  token("h05", 1, "bsc", "BNB", "BNB", 12.8, 612.4, -1.4, true),
  token("h06", 2, "base", "ETH", "Ethereum", 1.05, 3450.12, 2.1, true),
  token("h07", 2, "base", "cNGN", "Compliant Naira", 1_850_000, 0.00064, -0.3),
  token("h08", 3, "mantle", "MNT", "Mantle", 9800, 0.78, 4.6, true),
  token("h09", 3, "ethereum", "WBTC", "Wrapped BTC", 0.92, 64200.0, 1.2),
  token("h10", 4, "solana", "SOL", "Solana", 145.6, 152.3, -2.8, true),
  token("h11", 4, "solana", "USDC", "USD Coin", 2100.0, 1.0, 0.0),
  token("h12", 5, "base", "USDC", "USD Coin", 54800.0, 1.0, 0.0),
  token("h13", 5, "lisk", "LSK", "Lisk", 12000, 1.42, 6.1, true),
  token("h14", 6, "base", "cNGN", "Compliant Naira", 320_000, 0.00064, -0.3),
  token("h15", 7, "ethereum", "ETH", "Ethereum", 5.4, 3450.12, 2.1, true),
  token("h16", 7, "base", "USDT", "Tether", 18600.0, 1.0, 0.01),
]

export const WALLET_STATS: WalletStats = {
  totalWalletValueUsd: WALLET_HOLDINGS.reduce((s, h) => s + h.valueUsd, 0),
  trackedWallets: new Set(WALLET_HOLDINGS.map((h) => h.userId)).size,
  distinctTokens: new Set(WALLET_HOLDINGS.map((h) => h.symbol)).size,
  activeChains: new Set(WALLET_HOLDINGS.map((h) => h.chainKey)).size,
}
