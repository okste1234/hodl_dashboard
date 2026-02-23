"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "Mon", borrows: 45, repays: 32, deposits: 28, swaps: 18 },
  { day: "Tue", borrows: 52, repays: 38, deposits: 35, swaps: 22 },
  { day: "Wed", borrows: 48, repays: 41, deposits: 30, swaps: 25 },
  { day: "Thu", borrows: 61, repays: 45, deposits: 42, swaps: 19 },
  { day: "Fri", borrows: 55, repays: 50, deposits: 38, swaps: 31 },
  { day: "Sat", borrows: 38, repays: 28, deposits: 22, swaps: 15 },
  { day: "Sun", borrows: 32, repays: 24, deposits: 18, swaps: 12 },
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
            <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ActivityChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Weekly Activity</CardTitle>
          <span className="text-xs text-muted-foreground">This week</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.005 260)" />
              <XAxis
                dataKey="day"
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
              <Bar dataKey="borrows" name="Borrows" fill="oklch(0.72 0.19 155)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="repays" name="Repays" fill="oklch(0.65 0.15 220)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="deposits" name="Deposits" fill="oklch(0.75 0.15 55)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="swaps" name="Swaps" fill="oklch(0.65 0.12 290)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
