'use client'

import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { formatUsd } from "@/lib/format"

type OverviewStats = {
  users: {
    total: number
    growthPercentThisWeek: string
  }
  tvl: {
    total: string
    growthPercentThisWeek: string
  }
  activeLoans: {
    total: number
    amountBorrowed: string
    growthPercentThisWeek: string
  }
  platformRevenue: {
    total: string
    growthPercentThisMonth: string
  }
}

type KPICardsProps = {
  stats: OverviewStats
}

export function KPICards({ stats }: KPICardsProps) {
  const kpis = [
    {
      title: "Total Users",
      value: stats.users.total.toLocaleString(),
      change: stats.users.growthPercentThisWeek,
      trend: stats.users.growthPercentThisWeek.startsWith("+") ? "up" : "down" as const,
      icon: Users,
      subtitle: `${Math.floor((stats.users.total * parseFloat(stats.users.growthPercentThisWeek)) / 100)} new this week`,
    },
    {
      title: "Total Value Locked",
      value: formatUsd(stats.tvl.total),
      change: stats.tvl.growthPercentThisWeek,
      trend: stats.tvl.growthPercentThisWeek.startsWith("+") ? "up" : "down" as const,
      icon: Wallet,
      subtitle: "Across all vaults",
    },
    {
      title: "Active Loans",
      value: stats.activeLoans.total.toLocaleString(),
      change: stats.activeLoans.growthPercentThisWeek,
      trend: stats.activeLoans.growthPercentThisWeek.startsWith("+") ? "up" : "down" as const,
      icon: CreditCard,
      subtitle: `${formatUsd(stats.activeLoans.amountBorrowed)} outstanding`,
    },
    {
      title: "Platform Revenue",
      value: formatUsd(stats.platformRevenue.total),
      change: stats.platformRevenue.growthPercentThisMonth,
      trend: stats.platformRevenue.growthPercentThisMonth.startsWith("+") ? "up" : "down" as const,
      icon: TrendingUp,
      subtitle: "This month",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {kpi.title}
                </span>
                <span className="text-2xl font-semibold text-foreground tracking-tight">
                  {kpi.value}
                </span>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <kpi.icon className="size-5 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                  kpi.trend === "up"
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {kpi.change}
              </span>
              <span className="text-xs text-muted-foreground">{kpi.subtitle}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}