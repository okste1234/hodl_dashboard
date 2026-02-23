"use client"

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

const data = [
  { month: "Jan", revenue: 186000, loans: 142000, earnings: 44000 },
  { month: "Feb", revenue: 205000, loans: 158000, earnings: 47000 },
  { month: "Mar", revenue: 237000, loans: 176000, earnings: 61000 },
  { month: "Apr", revenue: 198000, loans: 149000, earnings: 49000 },
  { month: "May", revenue: 256000, loans: 195000, earnings: 61000 },
  { month: "Jun", revenue: 289000, loans: 218000, earnings: 71000 },
  { month: "Jul", revenue: 312000, loans: 240000, earnings: 72000 },
  { month: "Aug", revenue: 278000, loans: 210000, earnings: 68000 },
  { month: "Sep", revenue: 305000, loans: 232000, earnings: 73000 },
  { month: "Oct", revenue: 340000, loans: 260000, earnings: 80000 },
  { month: "Nov", revenue: 318000, loans: 243000, earnings: 75000 },
  { month: "Dec", revenue: 284200, loans: 216000, earnings: 68200 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string; name: string }>; label?: string }) {
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

export function RevenueChart() {
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
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                dataKey="loans"
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
