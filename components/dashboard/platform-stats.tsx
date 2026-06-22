"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StatsOverview } from "@/hooks/useStatsOverview"
import { formatUsd, formatPercent } from "@/lib/format"

type PlatformStatsProps = {
  vaultPerformances: StatsOverview["vaultPerformances"]
  riskOverview: StatsOverview["riskOverview"]
}

export function PlatformStats({ vaultPerformances, riskOverview }: PlatformStatsProps) {
  const riskMetrics = [
    { label: "Avg LTV Ratio", value: formatPercent(riskOverview.avgLtvRatio) },
    { label: "Liquidation Queue", value: riskOverview.liquidationQueue.toLocaleString() },
    { label: "Default Rate", value: formatPercent(riskOverview.defaultersRate) },
    { label: "System Health", value: formatPercent(riskOverview.systemHealth) },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Vault Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-0">
          {vaultPerformances.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">No vault performance data.</p>
          ) : (
            vaultPerformances.map((vault) => (
              <div key={vault.name} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{vault.name}</span>
                  <span className="text-xs text-muted-foreground">TVL: {formatUsd(vault.tvl)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">{formatPercent(vault.apy)} APY</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      vault.status?.toLowerCase() === "active"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {vault.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Risk Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-0">
          {riskMetrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3"
            >
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <span className="text-sm font-semibold text-foreground">{metric.value}</span>
            </div>
          ))}
          <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">Collateral Coverage</span>
              <span className="text-sm font-bold text-primary">{formatPercent(riskOverview.collateralCoverage)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
