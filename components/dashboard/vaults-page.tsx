"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Lock, TrendingUp, Coins, Users } from "lucide-react"

const vaults = [
  { name: "BTC Vault", asset: "Bitcoin", tvl: "$8,200,000", apy: "4.5%", depositors: 4210, utilization: 78, status: "active", earningsDistributed: "$368,400" },
  { name: "ETH Vault", asset: "Ethereum", tvl: "$4,100,000", apy: "3.8%", depositors: 3120, utilization: 65, status: "active", earningsDistributed: "$155,800" },
  { name: "USDT Vault", asset: "Tether", tvl: "$3,800,000", apy: "8.2%", depositors: 5840, utilization: 92, status: "active", earningsDistributed: "$311,600" },
  { name: "USDC Vault", asset: "USD Coin", tvl: "$2,300,000", apy: "7.6%", depositors: 3650, utilization: 84, status: "active", earningsDistributed: "$174,800" },
]

const pieData = [
  { name: "BTC", value: 8200000, color: "oklch(0.75 0.15 55)" },
  { name: "ETH", value: 4100000, color: "oklch(0.65 0.15 220)" },
  { name: "USDT", value: 3800000, color: "oklch(0.72 0.19 155)" },
  { name: "USDC", value: 2300000, color: "oklch(0.65 0.12 290)" },
]

const earningsHistory = [
  { user: "Ngozi Mba", vault: "BTC Vault", earned: "+$842.30", period: "30 days", locked: "$120,000" },
  { user: "Fatima Bello", vault: "USDT Vault", earned: "+$468.50", period: "30 days", locked: "$68,500" },
  { user: "Aisha Suleiman", vault: "ETH Vault", earned: "+$112.80", period: "30 days", locked: "$35,750" },
  { user: "Amara Obi", vault: "USDC Vault", earned: "+$285.00", period: "30 days", locked: "$45,000" },
  { user: "Jasper Okwu", vault: "USDT Vault", earned: "+$151.20", period: "30 days", locked: "$22,199" },
]

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-2 shadow-lg">
        <p className="text-xs text-foreground font-medium">{payload[0].name}</p>
        <p className="text-xs text-muted-foreground">${(payload[0].value / 1000000).toFixed(1)}M</p>
      </div>
    )
  }
  return null
}

export function VaultsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Vaults & Earnings</h1>
        <p className="text-sm text-muted-foreground">Manage vault strategies, monitor TVL, and track user earnings distributions.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total TVL</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">$18.4M</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg APY</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-primary">6.02%</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Earnings Paid</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">$1.01M</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Unique Depositors</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">16,820</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Vault Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Vault</TableHead>
                    <TableHead className="text-xs text-muted-foreground">TVL</TableHead>
                    <TableHead className="text-xs text-muted-foreground">APY</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Depositors</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Utilization</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Earnings Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaults.map((vault) => (
                    <TableRow key={vault.name} className="border-border">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{vault.name}</span>
                          <span className="text-xs text-muted-foreground">{vault.asset}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono font-medium text-foreground">{vault.tvl}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                          {vault.apy}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{vault.depositors.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={vault.utilization}
                            className={`h-1.5 w-16 bg-secondary ${
                              vault.utilization >= 90
                                ? "[&>div]:bg-warning"
                                : "[&>div]:bg-primary"
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">{vault.utilization}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-success">{vault.earningsDistributed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground">TVL Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-0">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">Top Earners (30 days)</CardTitle>
            <button className="text-xs font-medium text-primary hover:underline">View all</button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">User</TableHead>
                <TableHead className="text-xs text-muted-foreground">Vault</TableHead>
                <TableHead className="text-xs text-muted-foreground">Amount Locked</TableHead>
                <TableHead className="text-xs text-muted-foreground">Earnings</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsHistory.map((entry, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="text-sm font-medium text-foreground">{entry.user}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.vault}</TableCell>
                  <TableCell className="text-sm font-mono text-foreground">{entry.locked}</TableCell>
                  <TableCell className="text-sm font-mono font-medium text-success">{entry.earned}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{entry.period}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
