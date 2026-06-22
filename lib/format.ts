// Display formatting helpers. The backend returns monetary amounts as decimal
// strings (e.g. "22199.09") and dates as ISO strings; these render them safely
// without throwing on null/empty values.

export function formatUsd(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  const n = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(n)) return "—"
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  })
}

/**
 * Naira-denominated amount with the ₦ symbol. Used for inherently NGN values
 * (e.g. loan principals in cNGN) regardless of the dashboard's default currency.
 */
export function formatNaira(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  const n = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(n)) return "—"
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—"
  return value.toLocaleString("en-US")
}

/** Token amount with its symbol, e.g. "6.42 ETH" (trims to 4 dp). */
export function formatToken(amount: number | null | undefined, symbol: string): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "—"
  return `${amount.toLocaleString("en-US", { maximumFractionDigits: 4 })} ${symbol}`
}

/**
 * Render a (possibly string) amount alongside the backend-provided token symbol.
 * The backend already token-formats `amount`, so we only add grouping when it
 * parses cleanly and append the symbol verbatim. Falls back to the bare amount
 * when no symbol is present.
 */
export function formatTokenAmount(
  amount: string | number | null | undefined,
  symbol?: string | null
): string {
  if (amount === null || amount === undefined || amount === "") return "—"
  const n = typeof amount === "number" ? amount : Number(amount)
  const formatted = Number.isFinite(n)
    ? n.toLocaleString("en-US", { maximumFractionDigits: 6 })
    : String(amount)
  return symbol ? `${formatted} ${symbol}` : formatted
}

/** Pick the symbol the backend returns for a transaction: swap legs first, else tokenSymbol. */
export function txTokenSymbol(tx: {
  fromTokenSymbol?: string
  tokenSymbol?: string
}): string | undefined {
  return tx.fromTokenSymbol ?? tx.tokenSymbol
}

/** Signed percentage for 24h-change style deltas, e.g. "+2.1%" / "-1.4%". */
export function formatDelta(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

export function formatPercent(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  const s = String(value)
  return s.includes("%") ? s : `${s}%`
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Display label for a user. Falls back to the email when the name is missing,
 * a placeholder, or literally "Anonymous" (in any case) — those are never shown
 * as a real name.
 */
export function userDisplayName(name: string | null | undefined, email: string): string {
  const n = name?.trim()
  if (!n || n === "—" || n.toLowerCase() === "anonymous") return email
  return n
}

export function initialsFrom(name: string | null | undefined, fallback = "?"): string {
  if (!name) return fallback
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
