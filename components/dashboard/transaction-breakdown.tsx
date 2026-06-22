"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart } from "lucide-react"
import type { TransactionBreakdown } from "@/types/admin"
import { formatUsd } from "@/lib/format"

// Same category palette as the Weekly Activity chart so the breakdown reads
// consistently across the dashboard.
const CATEGORIES: { key: keyof TransactionBreakdown; label: string; color: string }[] = [
  { key: "deposits", label: "Deposits", color: "oklch(0.75 0.15 55)" },
  { key: "withdrawals", label: "Withdrawals", color: "oklch(0.65 0.12 220)" },
  { key: "borrows", label: "Borrows", color: "oklch(0.72 0.19 155)" },
  { key: "repayments", label: "Repayments", color: "oklch(0.60 0.18 300)" },
  { key: "liquidations", label: "Liquidations", color: "oklch(0.85 0.20 90)" },
  { key: "swaps", label: "Swaps", color: "oklch(0.65 0.12 290)" },
]

export function TransactionBreakdownCard({
  breakdown,
  isLoading,
}: {
  breakdown?: TransactionBreakdown
  isLoading?: boolean
}) {
  const rows = CATEGORIES.map((c) => ({
    ...c,
    value: breakdown ? Number(breakdown[c.key]) || 0 : 0,
  }))
  const total = rows.reduce((sum, r) => sum + r.value, 0)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="size-4 text-primary" />
            <CardTitle className="text-sm font-medium text-foreground">Volume by Type</CardTitle>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          {!isLoading && total > 0 && (
            <span className="text-sm font-mono font-medium text-foreground">{formatUsd(total)}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-2.5 w-full rounded-full bg-secondary" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <Skeleton key={c.key} className="h-8 w-full bg-secondary" />
              ))}
            </div>
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 py-6 text-center">
            <p className="text-sm text-muted-foreground">No transaction volume today.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Stacked composition bar */}
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              {rows
                .filter((r) => r.value > 0)
                .map((r) => (
                  <div
                    key={r.key}
                    title={`${r.label}: ${formatUsd(r.value)} (${((r.value / total) * 100).toFixed(1)}%)`}
                    style={{ width: `${(r.value / total) * 100}%`, backgroundColor: r.color }}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                  />
                ))}
            </div>

            {/* Legend grid — value + share per category */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              {rows.map((r) => {
                const pct = total > 0 ? (r.value / total) * 100 : 0
                return (
                  <div key={r.key} className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="truncate text-xs text-muted-foreground">{r.label}</span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                      <span className="text-xs font-mono font-medium text-foreground">{formatUsd(r.value)}</span>
                      <span className="text-[10px] text-muted-foreground">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
