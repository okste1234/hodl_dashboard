"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const vaultStats = [
  { name: "BTC Vault", tvl: "$8.2M", apy: "4.5%", utilization: 78 },
  { name: "ETH Vault", tvl: "$4.1M", apy: "3.8%", utilization: 65 },
  { name: "USDT Vault", tvl: "$3.8M", apy: "8.2%", utilization: 92 },
  { name: "USDC Vault", tvl: "$2.3M", apy: "7.6%", utilization: 84 },
]

const riskMetrics = [
  { label: "Avg LTV Ratio", value: "65%", status: "healthy" },
  { label: "Liquidation Queue", value: "3", status: "warning" },
  { label: "Default Rate", value: "0.8%", status: "healthy" },
  { label: "System Health", value: "98.2%", status: "healthy" },
]

export function PlatformStats() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Vault Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-0">
          {vaultStats.map((vault) => (
            <div key={vault.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{vault.name}</span>
                  <span className="text-xs text-muted-foreground">TVL: {vault.tvl}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-primary">{vault.apy} APY</span>
                  <span className="text-xs text-muted-foreground">{vault.utilization}% utilized</span>
                </div>
              </div>
              <Progress value={vault.utilization} className="h-1.5 bg-secondary [&>div]:bg-primary" />
            </div>
          ))}
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{metric.value}</span>
                <span
                  className={`size-2 rounded-full ${
                    metric.status === "healthy" ? "bg-success" : "bg-warning"
                  }`}
                />
              </div>
            </div>
          ))}
          <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">Collateral Coverage</span>
              <span className="text-sm font-bold text-primary">156%</span>
            </div>
            <Progress value={78} className="mt-2 h-1.5 bg-primary/10 [&>div]:bg-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
