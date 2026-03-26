'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

type WeeklyActivity = {
  deposits: number
  withdrawals: number
  borrows: number
  repayments: number
  liquidations: number
  swaps: number
}

type ActivityChartProps = {
  userWeeklyActivity: WeeklyActivity
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ value: number; color: string; name: string }>
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ActivityChart({
  userWeeklyActivity,
}: ActivityChartProps) {
  const data = [
    { activity: "Deposits", value: userWeeklyActivity.deposits },
    { activity: "Withdrawals", value: userWeeklyActivity.withdrawals },
    { activity: "Borrows", value: userWeeklyActivity.borrows },
    { activity: "Repayments", value: userWeeklyActivity.repayments },
    { activity: "Liquidations", value: userWeeklyActivity.liquidations },
    { activity: "Swaps", value: userWeeklyActivity.swaps },
  ]

  const colors = [
    "oklch(0.75 0.15 55)",   // Deposits
    "oklch(0.65 0.12 220)",  // Withdrawals
    "oklch(0.72 0.19 155)",  // Borrows
    "oklch(0.60 0.18 300)",  // Repayments
    "oklch(0.85 0.20 90)",   // Liquidations
    "oklch(0.65 0.12 290)",  // Swaps
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">
            Weekly Activity
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            This week
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.24 0.005 260)"
              />

              <XAxis
                dataKey="activity"
                tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }}
                axisLine={{ stroke: "oklch(0.24 0.005 260)" }}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}