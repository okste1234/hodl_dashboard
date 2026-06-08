'use client'

import { KPICards } from './kpi-cards'
import { RevenueChart } from './revenue-chart'
import { ActivityChart } from './activity-chart'
import { RecentTransactions } from './recent-transactions'
import { PlatformStats } from './platform-stats'
import { useStatsOverview } from '@/hooks/useStatsOverview'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-6 w-48 bg-secondary" />
        <Skeleton className="h-4 w-72 bg-secondary" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-24 bg-secondary" />
              <Skeleton className="mt-3 h-7 w-28 bg-secondary" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[340px] w-full bg-secondary" />
        <Skeleton className="h-[340px] w-full bg-secondary" />
      </div>
    </div>
  )
}

export function OverviewPage() {
  const { data, isLoading, error, refetch } = useStatsOverview()

  if (isLoading) {
    return <OverviewSkeleton />
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-destructive">Failed to load overview data.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="border-border bg-secondary text-foreground"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Welcome back, Admin</h1>
        <p className="text-sm text-muted-foreground">
          Here is what is happening across the Hodl platform today.
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards stats={data} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueChart revenueVsLoanVolume={data.charts.revenueVsLoanVolume} />
        <ActivityChart userWeeklyActivity={data.charts.userWeeklyActivity} />
      </div>

      {/* Platform Stats / Risk Overview */}
      <PlatformStats
        vaultPerformances={data.vaultPerformances}
        riskOverview={data.riskOverview}
      />
      

      {/* Recent Transactions */}
      <RecentTransactions transactions={data.recentTransactions} />
    </div>
  )
}
