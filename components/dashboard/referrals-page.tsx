"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Users, UserPlus, TrendingUp, Gift } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { TableLoadingRows, TableEmptyRow } from "@/components/dashboard/data-state"
import { useMockData } from "@/hooks/useMockData"
import { userById } from "@/mocks/shared"
import { formatNaira } from "@/lib/format"
import {
  REFERRAL_STATS,
  REFERRERS,
  REFERRAL_REWARDS,
  REFERRAL_FUNNEL,
  type Referrer,
  type RewardStatus,
} from "@/mocks/referrals"

const tabTrigger = "text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
const funnelColors = ["oklch(0.65 0.15 220)", "oklch(0.55 0.18 265)", "oklch(0.72 0.19 155)", "oklch(0.82 0.17 90)"]

function tierBadge(tier: Referrer["tier"]) {
  const map: Record<Referrer["tier"], string> = {
    Gold: "bg-warning/10 text-warning border-warning/20",
    Silver: "bg-muted text-muted-foreground border-border",
    Bronze: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  }
  return <Badge variant="outline" className={`text-[10px] ${map[tier]}`}>{tier}</Badge>
}

function rewardStatusBadge(status: RewardStatus) {
  const map: Record<RewardStatus, string> = {
    paid: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    clawed_back: "bg-destructive/10 text-destructive border-destructive/20",
  }
  const label = status === "clawed_back" ? "Clawed back" : status
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[status]}`}>{label}</Badge>
}

function FunnelTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-2 shadow-lg">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{payload[0].value.toLocaleString()} users</p>
      </div>
    )
  }
  return null
}

export function ReferralsPage() {
  const stats = useMockData(REFERRAL_STATS)
  const referrers = useMockData(REFERRERS)
  const rewards = useMockData(REFERRAL_REWARDS)
  const funnel = useMockData(REFERRAL_FUNNEL)
  const s = stats.data

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Referrals</h1>
        <p className="text-sm text-muted-foreground">Referral program performance, top referrers, and rewards ledger.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Referrers" value={s ? s.totalReferrers.toLocaleString() : "—"} icon={Users} isLoading={stats.isLoading} />
        <StatCard label="Invited" value={s ? s.totalInvited.toLocaleString() : "—"} icon={UserPlus} tone="primary" isLoading={stats.isLoading} />
        <StatCard label="Signups" value={s ? s.totalSignups.toLocaleString() : "—"} icon={TrendingUp} tone="success" isLoading={stats.isLoading} />
        <StatCard label="Rewards Paid" value={s ? formatNaira(s.rewardsPaidUsd) : "—"} icon={Gift} isLoading={stats.isLoading} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel.data ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.005 260)" />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<FunnelTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {(funnel.data ?? []).map((_, i) => (
                    <Cell key={i} fill={funnelColors[i % funnelColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="referrers" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="referrers" className={tabTrigger}>Top Referrers</TabsTrigger>
          <TabsTrigger value="rewards" className={tabTrigger}>Rewards Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="referrers" className="mt-4">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Referrer</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Code</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Invited</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Funded</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Earned</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrers.isLoading ? (
                    <TableLoadingRows cols={6} />
                  ) : (referrers.data ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={6} message="No referrers yet." />
                  ) : (
                    (referrers.data ?? []).map((r) => {
                      const user = userById(r.userId)
                      return (
                        <TableRow key={r.id} className="border-border">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground">{user?.name ?? user?.username ?? "—"}</span>
                              <span className="text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-mono text-primary">{r.code}</TableCell>
                          <TableCell className="text-sm text-foreground">{r.invited}</TableCell>
                          <TableCell className="text-sm text-foreground">{r.funded}</TableCell>
                          <TableCell className="text-sm font-mono text-success">{formatNaira(r.rewardEarnedUsd)}</TableCell>
                          <TableCell className="text-right">{tierBadge(r.tier)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="mt-4">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Referred User</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Milestone</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.isLoading ? (
                    <TableLoadingRows cols={4} />
                  ) : (rewards.data ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={4} message="No rewards recorded." />
                  ) : (
                    (rewards.data ?? []).map((rw) => (
                      <TableRow key={rw.id} className="border-border">
                        <TableCell className="text-sm text-foreground">{rw.referredUserLabel}</TableCell>
                        <TableCell className="text-sm text-muted-foreground capitalize">{rw.milestone.replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-sm font-mono text-foreground">{formatNaira(rw.amountUsd)}</TableCell>
                        <TableCell className="text-right">{rewardStatusBadge(rw.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
