"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { AlertCircle } from "lucide-react"
import { useAnalytics } from "@/hooks/useAnalytics"
import type { AnalyticsPoint } from "@/types/admin"

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; color: string; name: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function ChartCard({
  title,
  subtitle,
  isLoading,
  isError,
  hasData,
  children,
}: {
  title: string
  subtitle: string
  isLoading: boolean
  isError: boolean
  hasData: boolean
  children: React.ReactNode
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[250px]">
          {isLoading ? (
            <Skeleton className="h-full w-full bg-secondary" />
          ) : isError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <AlertCircle className="size-6 text-destructive" />
              <p className="text-sm text-destructive">Failed to load chart.</p>
            </div>
          ) : !hasData ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">No data available.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {children as React.ReactElement}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const axisTick = { fontSize: 11, fill: "oklch(0.60 0 0)" }
const gridStroke = "oklch(0.24 0.005 260)"

export function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalytics()

  const userGrowth: AnalyticsPoint[] = data?.userGrowth ?? []
  const loanVolume: AnalyticsPoint[] = data?.loanVolume ?? []
  const conversionActivity: AnalyticsPoint[] = data?.conversionActivity ?? []
  const feeRevenue: AnalyticsPoint[] = data?.feeRevenue ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights into platform performance, growth, and financial metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="User Growth" subtitle="Monthly" isLoading={isLoading} isError={isError} hasData={userGrowth.length > 0}>
          <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="value" name="Users" stroke="oklch(0.72 0.19 155)" fill="url(#userGrowthGrad)" strokeWidth={2} />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Loan Volume" subtitle="Monthly disbursement" isLoading={isLoading} isError={isError} hasData={loanVolume.length > 0}>
          <BarChart data={loanVolume} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" name="Volume" fill="oklch(0.65 0.15 220)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Conversion Activity" subtitle="Monthly" isLoading={isLoading} isError={isError} hasData={conversionActivity.length > 0}>
          <LineChart data={conversionActivity} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="value" name="Conversions" stroke="oklch(0.75 0.15 55)" strokeWidth={2} dot={{ r: 3, fill: "oklch(0.75 0.15 55)" }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Fee Revenue" subtitle="Monthly" isLoading={isLoading} isError={isError} hasData={feeRevenue.length > 0}>
          <BarChart data={feeRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" name="Revenue" fill="oklch(0.72 0.19 155)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  )
}
