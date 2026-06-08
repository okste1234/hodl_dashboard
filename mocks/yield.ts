// Mock data for the Yield Markets screen — DeFi yield protocol positions
// (LI.FI / external markets) and a curated protocol whitelist.

import { MOCK_USERS } from "./shared"

export type ProtocolRisk = "low" | "medium" | "high"
export type ProtocolStatus = "enabled" | "paused" | "disabled"

export interface YieldProtocol {
  id: string
  name: string
  chainKey: string
  asset: string
  apy: number
  tvlUsd: number
  risk: ProtocolRisk
  status: ProtocolStatus
  featured: boolean
}

export const YIELD_PROTOCOLS: YieldProtocol[] = [
  { id: "yp_01", name: "Aave v3", chainKey: "base", asset: "USDC", apy: 6.4, tvlUsd: 4_200_000, risk: "low", status: "enabled", featured: true },
  { id: "yp_02", name: "Compound v3", chainKey: "ethereum", asset: "USDC", apy: 5.1, tvlUsd: 2_900_000, risk: "low", status: "enabled", featured: false },
  { id: "yp_03", name: "Morpho Blue", chainKey: "base", asset: "cNGN", apy: 9.8, tvlUsd: 1_150_000, risk: "medium", status: "enabled", featured: true },
  { id: "yp_04", name: "Lido", chainKey: "ethereum", asset: "ETH", apy: 3.2, tvlUsd: 6_800_000, risk: "low", status: "enabled", featured: false },
  { id: "yp_05", name: "Pendle", chainKey: "mantle", asset: "USDT", apy: 14.2, tvlUsd: 540_000, risk: "high", status: "paused", featured: false },
  { id: "yp_06", name: "Yearn v3", chainKey: "ethereum", asset: "DAI", apy: 7.0, tvlUsd: 980_000, risk: "medium", status: "disabled", featured: false },
]

export interface YieldPosition {
  id: string
  userId: string
  protocolId: string
  protocolName: string
  chainKey: string
  asset: string
  balanceUsd: number
  apyAtEntry: number
  earnedUsd: number
  openedAt: string
}

export const YIELD_POSITIONS: YieldPosition[] = [
  { id: "ypos_01", userId: MOCK_USERS[0].id, protocolId: "yp_01", protocolName: "Aave v3", chainKey: "base", asset: "USDC", balanceUsd: 12000, apyAtEntry: 6.1, earnedUsd: 184.2, openedAt: "2026-01-20T00:00:00Z" },
  { id: "ypos_02", userId: MOCK_USERS[5].id, protocolId: "yp_03", protocolName: "Morpho Blue", chainKey: "base", asset: "cNGN", balanceUsd: 8400, apyAtEntry: 9.5, earnedUsd: 268.5, openedAt: "2025-12-30T00:00:00Z" },
  { id: "ypos_03", userId: MOCK_USERS[3].id, protocolId: "yp_04", protocolName: "Lido", chainKey: "ethereum", asset: "ETH", balanceUsd: 21000, apyAtEntry: 3.2, earnedUsd: 312.0, openedAt: "2025-11-15T00:00:00Z" },
  { id: "ypos_04", userId: MOCK_USERS[1].id, protocolId: "yp_02", protocolName: "Compound v3", chainKey: "ethereum", asset: "USDC", balanceUsd: 5200, apyAtEntry: 5.0, earnedUsd: 47.3, openedAt: "2026-02-05T00:00:00Z" },
  { id: "ypos_05", userId: MOCK_USERS[7].id, protocolId: "yp_01", protocolName: "Aave v3", chainKey: "base", asset: "USDC", balanceUsd: 18600, apyAtEntry: 6.4, earnedUsd: 95.1, openedAt: "2026-02-12T00:00:00Z" },
]

export interface YieldStats {
  totalValueLockedUsd: number
  activePositions: number
  enabledProtocols: number
  avgApy: number
}

const enabled = YIELD_PROTOCOLS.filter((p) => p.status === "enabled")
export const YIELD_STATS: YieldStats = {
  totalValueLockedUsd: YIELD_POSITIONS.reduce((s, p) => s + p.balanceUsd, 0),
  activePositions: YIELD_POSITIONS.length,
  enabledProtocols: enabled.length,
  avgApy: enabled.length ? Math.round((enabled.reduce((s, p) => s + p.apy, 0) / enabled.length) * 10) / 10 : 0,
}
