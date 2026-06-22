'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type RevenueChartProps = {
  revenueVsLoanVolume: {
    month: string
    revenue: number
    loanVolume: number
  }[]
}

// NOTE: the two series are in DIFFERENT currencies — `revenue` is USD ($),
// `loanVolume` is NGN (₦) — so they get separate Y axes and per-series currency
// formatting. They must never share one axis or one currency symbol.
const REVENUE_COLOR = "oklch(0.72 0.19 155)"
const LOAN_COLOR = "oklch(0.65 0.15 220)"

// Tooltip values — exact figure with a currency-appropriate level of detail.
// Revenue is tiny today ($0–cents) but must read cleanly when it grows to k/M.
function fmtUsd(v: number): string {
  if (!Number.isFinite(v)) return "$0"
  const a = Math.abs(v)
  if (a === 0) return "$0"
  if (a < 1) return `$${v.toFixed(2)}` // e.g. $0.01
  if (a < 1_000) return `$${v.toFixed(2).replace(/\.00$/, "")}`
  if (a < 1_000_000) return `$${(v / 1_000).toFixed(2)}k`
  return `$${(v / 1_000_000).toFixed(2)}M`
}

function fmtNgn(v: number): string {
  if (!Number.isFinite(v)) return "₦0"
  return `₦${Math.round(v).toLocaleString("en-US")}`
}

// Axis ticks — compact and magnitude-adaptive so the same axis works whether
// revenue is $0.01 this month or $250k next year.
function usdAxisTick(v: number): string {
  const a = Math.abs(v)
  if (a === 0) return "$0"
  if (a < 1) return `$${v.toFixed(2)}`
  if (a < 1_000) return `$${v.toFixed(0)}`
  if (a < 1_000_000) return `$${(v / 1_000).toFixed(0)}k`
  return `$${(v / 1_000_000).toFixed(1)}M`
}

function ngnAxisTick(v: number): string {
  const a = Math.abs(v)
  if (a < 1_000) return `₦${v.toFixed(0)}`
  if (a < 1_000_000) return `₦${(v / 1_000).toFixed(0)}k`
  return `₦${(v / 1_000_000).toFixed(1)}M`
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; color: string; name: string; dataKey?: string | number }>
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
            <span className="font-medium text-foreground">
              {entry.dataKey === "revenue" ? fmtUsd(entry.value) : fmtNgn(entry.value)}
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
          <span className="text-xs text-muted-foreground">Revenue ($) vs loan volume (₦)</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueVsLoanVolume} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={REVENUE_COLOR} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={REVENUE_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={LOAN_COLOR} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={LOAN_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.005 260)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }}
                axisLine={{ stroke: "oklch(0.24 0.005 260)" }}
                tickLine={false}
              />
              {/* Left axis — Revenue in USD. Anchored at 0 and auto-scaling its
                  top bound to the data, so it adapts as revenue grows. */}
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={[0, "auto"]}
                allowDecimals
                tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={usdAxisTick}
                width={52}
              />
              {/* Right axis — Loan Volume in NGN */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, "auto"]}
                tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={ngnAxisTick}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={28}
                iconType="circle"
                wrapperStyle={{ fontSize: 11, color: "oklch(0.60 0 0)" }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue (USD)"
                stroke={REVENUE_COLOR}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="loanVolume"
                name="Loan Volume (NGN)"
                stroke={LOAN_COLOR}
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
