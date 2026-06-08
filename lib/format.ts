// Display formatting helpers. The backend returns monetary amounts as decimal
// strings (e.g. "22199.09") and dates as ISO strings; these render them safely
// without throwing on null/empty values.

// Default platform currency is the Nigerian Naira (₦). The symbol is prefixed
// manually rather than via Intl `style: "currency"` so it renders consistently
// regardless of the runtime's ICU/locale data.
export const NAIRA = "₦"

export function formatNaira(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  const n = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(n)) return "—"
  return `${NAIRA}${n.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
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
