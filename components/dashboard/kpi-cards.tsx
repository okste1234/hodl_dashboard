"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const kpis = [
  {
    title: "Total Users",
    value: "24,521",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    subtitle: "432 new this week",
  },
  {
    title: "Total Value Locked",
    value: "$18.4M",
    change: "+8.2%",
    trend: "up" as const,
    icon: Wallet,
    subtitle: "Across all vaults",
  },
  {
    title: "Active Loans",
    value: "1,847",
    change: "+3.1%",
    trend: "up" as const,
    icon: CreditCard,
    subtitle: "$4.2M outstanding",
  },
  {
    title: "Platform Revenue",
    value: "$284,200",
    change: "-2.4%",
    trend: "down" as const,
    icon: TrendingUp,
    subtitle: "This month",
  },
]

export function KPICards() {
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
