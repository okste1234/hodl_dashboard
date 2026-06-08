// Shared mock primitives for the dashboard expansion screens.
// UI-only — no network, no backend. All entity types live alongside their data
// in this `mocks/` folder so components never hardcode data inline.

/** Chains supported by the HODL mini-app wallet. */
export interface ChainMeta {
  /** hex chain id (or "solana" sentinel) */
  id: string
  key: string
  name: string
  nativeSymbol: string
  /** oklch token used across the existing charts/badges */
  color: string
}

export const CHAINS: ChainMeta[] = [
  { id: "0x1", key: "ethereum", name: "Ethereum", nativeSymbol: "ETH", color: "oklch(0.65 0.15 220)" },
  { id: "0x2105", key: "base", name: "Base", nativeSymbol: "ETH", color: "oklch(0.55 0.18 265)" },
  { id: "0x38", key: "bsc", name: "BNB Chain", nativeSymbol: "BNB", color: "oklch(0.82 0.17 90)" },
  { id: "0x1388", key: "mantle", name: "Mantle", nativeSymbol: "MNT", color: "oklch(0.72 0.04 200)" },
  { id: "0x46f", key: "lisk", name: "Lisk", nativeSymbol: "LSK", color: "oklch(0.60 0.16 25)" },
  { id: "solana", key: "solana", name: "Solana", nativeSymbol: "SOL", color: "oklch(0.72 0.19 155)" },
]

export const CHAIN_BY_KEY: Record<string, ChainMeta> = Object.fromEntries(
  CHAINS.map((c) => [c.key, c])
)

/** A minimal user reference shared by mock rows (mirrors the real UserRef). */
export interface MockUserRef {
  id: string
  name: string | null
  username: string
  email: string
  /** truncated EVM address for display */
  walletAddress: string
}

export const MOCK_USERS: MockUserRef[] = [
  { id: "usr_01", name: "Jasper Okwu", username: "jasper", email: "jasper@joinhodl.com", walletAddress: "0x4F2a…9c1B" },
  { id: "usr_02", name: "Amara Obi", username: "amara", email: "amara@gmail.com", walletAddress: "0x9bC1…2eF4" },
  { id: "usr_03", name: "Kola Adeyemi", username: "kola", email: "kola@gmail.com", walletAddress: "0x71De…aa08" },
  { id: "usr_04", name: "Fatima Bello", username: "fatima", email: "fatima@outlook.com", walletAddress: "0x18cF…77b2" },
  { id: "usr_05", name: "Chidi Eze", username: "chidi", email: "chidi@gmail.com", walletAddress: "0x3aE9…01dd" },
  { id: "usr_06", name: "Ngozi Mba", username: "ngozi", email: "ngozi@gmail.com", walletAddress: "0x5C77…b3a9" },
  { id: "usr_07", name: null, username: "Hodler-4F8A21", email: "emeka@gmail.com", walletAddress: "0x2D1b…f0c7" },
  { id: "usr_08", name: "Aisha Suleiman", username: "aisha", email: "aisha@gmail.com", walletAddress: "0x88aa…4d2e" },
]

export function userById(id: string): MockUserRef | undefined {
  return MOCK_USERS.find((u) => u.id === id)
}
