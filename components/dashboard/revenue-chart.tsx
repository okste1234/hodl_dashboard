'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type RevenueChartProps = {
  revenueVsLoanVolume: {
    month: string
    revenue: number
    loanVolume: number
  }[]
}

function CustomTooltip({
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
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              ${(entry.value / 1000).toFixed(0)}k
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueChart({ revenueVsLoanVolume }: RevenueChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Revenue Overview</CardTitle>
          <span className="text-xs text-muted-foreground">Last 12 months</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueVsLoanVolume}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.15 220)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.15 220)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.005 260)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }}
                axisLine={{ stroke: "oklch(0.24 0.005 260)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="oklch(0.72 0.19 155)"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="loanVolume"
                name="Loan Volume"
                stroke="oklch(0.65 0.15 220)"
                fillOpacity={1}
                fill="url(#colorLoans)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}