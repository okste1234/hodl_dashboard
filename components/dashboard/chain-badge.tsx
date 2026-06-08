"use client"

import { CHAIN_BY_KEY } from "@/mocks/shared"

/** Small colored chip identifying a chain, reused across wallet/yield/cash screens. */
export function ChainBadge({ chainKey }: { chainKey: string }) {
  const chain = CHAIN_BY_KEY[chainKey]
  const label = chain?.name ?? chainKey
  const color = chain?.color ?? "oklch(0.6 0 0)"
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
