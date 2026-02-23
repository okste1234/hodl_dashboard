"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const userGrowth = [
  { month: "Jul", users: 12400 },
  { month: "Aug", users: 14200 },
  { month: "Sep", users: 15800 },
  { month: "Oct", users: 17600 },
  { month: "Nov", users: 20100 },
  { month: "Dec", users: 21800 },
  { month: "Jan", users: 23200 },
  { month: "Feb", users: 24521 },
]

const loanVolume = [
  { month: "Jul", volume: 2800000, count: 1200 },
  { month: "Aug", volume: 3100000, count: 1350 },
  { month: "Sep", volume: 3400000, count: 1480 },
  { month: "Oct", volume: 3200000, count: 1400 },
  { month: "Nov", volume: 3800000, count: 1620 },
  { month: "Dec", volume: 4000000, count: 1720 },
  { month: "Jan", volume: 4100000, count: 1790 },
  { month: "Feb", volume: 4200000, count: 1847 },
]

const conversionRates = [
  { month: "Jul", ngn_usd: 1500, btc_volume: 45 },
  { month: "Aug", ngn_usd: 1520, btc_volume: 52 },
  { month: "Sep", ngn_usd: 1550, btc_volume: 48 },
  { month: "Oct", ngn_usd: 1580, btc_volume: 61 },
  { month: "Nov", ngn_usd: 1600, btc_volume: 58 },
  { month: "Dec", ngn_usd: 1620, btc_volume: 55 },
  { month: "Jan", ngn_usd: 1640, btc_volume: 63 },
  { month: "Feb", ngn_usd: 1650, btc_volume: 68 },
]

const feeRevenue = [
  { month: "Jul", borrow: 42000, swap: 18000, withdraw: 8000 },
  { month: "Aug", borrow: 48000, swap: 22000, withdraw: 9500 },
  { month: "Sep", borrow: 52000, swap: 25000, withdraw: 10000 },
  { month: "Oct", borrow: 49000, swap: 21000, withdraw: 9200 },
  { month: "Nov", borrow: 58000, swap: 28000, withdraw: 11000 },
  { month: "Dec", borrow: 62000, swap: 30000, withdraw: 12000 },
  { month: "Jan", borrow: 65000, swap: 32000, withdraw: 12500 },
  { month: "Feb", borrow: 68000, swap: 34000, withdraw: 13000 },
]

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string; name: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {typeof entry.value === "number" && entry.value > 1000
                ? entry.value > 100000
                  ? `$${(entry.value / 1000).toFixed(0)}k`
                  : entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights into platform performance, growth, and financial metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">User Growth</CardTitle>
              <span className="text-xs text-primary font-medium">+97.7% YoY</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.005 260)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="users" name="Users" stroke="oklch(0.72 0.19 155)" fill="url(#userGrowthGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Loan Volume</CardTitle>
              <span className="text-xs text-muted-foreground">Monthly disbursement</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanVolume} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.005 260)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="volume" name="Volume" fill="oklch(0.65 0.15 220)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Conversion Activity</CardTitle>
              <span className="text-xs text-muted-foreground">BTC trade volume (daily avg)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionRates} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.005 260)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="btc_volume" name="BTC Trades" stroke="oklch(0.75 0.15 55)" strokeWidth={2} dot={{ r: 3, fill: "oklch(0.75 0.15 55)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Fee Revenue Breakdown</CardTitle>
              <span className="text-xs text-muted-foreground">By category</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.005 260)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="borrow" name="Borrow Fees" fill="oklch(0.72 0.19 155)" radius={[2, 2, 0, 0]} stackId="fees" />
                  <Bar dataKey="swap" name="Swap Fees" fill="oklch(0.65 0.15 220)" radius={[2, 2, 0, 0]} stackId="fees" />
                  <Bar dataKey="withdraw" name="Withdraw Fees" fill="oklch(0.65 0.12 290)" radius={[2, 2, 0, 0]} stackId="fees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
