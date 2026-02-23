"use client"

import { KPICards } from "./kpi-cards"
import { RevenueChart } from "./revenue-chart"
import { ActivityChart } from "./activity-chart"
import { RecentTransactions } from "./recent-transactions"
import { PlatformStats } from "./platform-stats"

export function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Welcome back, Admin</h1>
        <p className="text-sm text-muted-foreground">Here is what is happening across the Hodl platform today.</p>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueChart />
        <ActivityChart />
      </div>

      <PlatformStats />

      <RecentTransactions />
    </div>
  )
}
