"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Lock, Layers, Users, Coins, Filter } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChainBadge } from "@/components/dashboard/chain-badge"
import {
  TableLoadingRows,
  TableEmptyRow,
  TableErrorRow,
  TablePagination,
} from "@/components/dashboard/data-state"
import { useYieldPositions, useYieldProtocols } from "@/hooks/useYield"
import { formatUsd, formatDate, userDisplayName } from "@/lib/format"

const PAGE_SIZE = 20
const STATUS_ALL = "all"
const tabTrigger = "text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"

function positionStatusBadge(status: string) {
  return status?.toLowerCase() === "active" ? (
    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] capitalize">{status}</Badge>
  ) : (
    <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px] capitalize">{status || "—"}</Badge>
  )
}

function userLabel(u: { name: string | null; email: string } | null): string {
  return u ? userDisplayName(u.name, u.email) : "—"
}

export function YieldPage() {
  const [status, setStatus] = useState<string>(STATUS_ALL)
  const [offset, setOffset] = useState(0)

  const positions = useYieldPositions({
    status: status === STATUS_ALL ? undefined : status,
    limit: PAGE_SIZE,
    offset,
  })
  const protocols = useYieldProtocols()
  const stats = positions.data?.stats

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Yield Markets</h1>
        <p className="text-sm text-muted-foreground">DeFi yield positions and protocol usage across chains.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Total Value Locked" value={stats ? formatUsd(stats.totalValueLockedUsd) : "—"} icon={Lock} isLoading={positions.isLoading} />
        <StatCard label="Active Positions" value={stats ? stats.activePositions.toLocaleString() : "—"} icon={Layers} tone="primary" isLoading={positions.isLoading} />
        <StatCard label="Depositors" value={stats ? stats.depositors.toLocaleString() : "—"} icon={Users} isLoading={positions.isLoading} />
        <StatCard label="Total Earned" value={stats ? formatUsd(stats.totalEarnedUsd) : "—"} icon={Coins} tone="success" isLoading={positions.isLoading} />
      </div>

      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="positions" className={tabTrigger}>Positions</TabsTrigger>
          <TabsTrigger value="protocols" className={tabTrigger}>Protocols</TabsTrigger>
        </TabsList>

        {/* Protocols — aggregated from active positions */}
        <TabsContent value="protocols" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Protocol Usage</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Protocol</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Chain</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Asset</TableHead>
                    <TableHead className="text-xs text-muted-foreground">TVL</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Depositors</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Positions</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {protocols.isLoading ? (
                    <TableLoadingRows cols={7} />
                  ) : protocols.isError ? (
                    <TableErrorRow colSpan={7} onRetry={() => protocols.refetch()} message="Failed to load protocols." />
                  ) : (protocols.data?.items ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={7} message="No protocol activity yet." />
                  ) : (
                    (protocols.data?.items ?? []).map((p, i) => (
                      <TableRow key={`${p.protocol}-${p.chain}-${p.asset}-${i}`} className="border-border">
                        <TableCell className="text-sm font-medium text-foreground">{p.protocol}</TableCell>
                        <TableCell><ChainBadge chainKey={p.chain.toLowerCase()} /></TableCell>
                        <TableCell className="text-sm text-foreground">{p.asset}</TableCell>
                        <TableCell className="text-sm font-mono text-foreground">{formatUsd(p.tvlUsd)}</TableCell>
                        <TableCell className="text-sm text-foreground">{p.depositors.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-foreground">{p.positions.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-mono text-success">{formatUsd(p.earnedUsd)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions */}
        <TabsContent value="positions" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-medium text-foreground">User Positions</CardTitle>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v)
                    setOffset(0)
                  }}
                >
                  <SelectTrigger className="h-8 w-[140px] bg-secondary border-border text-sm">
                    <Filter className="mr-1 size-3" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value={STATUS_ALL}>All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">User</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Protocol</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Chain</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Asset</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Balance</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Earned</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.isLoading ? (
                    <TableLoadingRows cols={7} />
                  ) : positions.isError ? (
                    <TableErrorRow colSpan={7} onRetry={() => positions.refetch()} message="Failed to load positions." />
                  ) : (positions.data?.items ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={7} message="No positions match your filters." />
                  ) : (
                    (positions.data?.items ?? []).map((p) => (
                      <TableRow key={p.id} className="border-border">
                        <TableCell className="text-sm text-foreground">{userLabel(p.user)}</TableCell>
                        <TableCell className="text-sm text-foreground">{p.protocol}</TableCell>
                        <TableCell><ChainBadge chainKey={p.chain.toLowerCase()} /></TableCell>
                        <TableCell className="text-sm text-foreground">{p.asset}</TableCell>
                        <TableCell className="text-sm font-mono text-foreground">{formatUsd(p.balanceUsd)}</TableCell>
                        <TableCell className="text-sm font-mono text-success">{formatUsd(p.earnedUsd)}</TableCell>
                        <TableCell className="text-right">{positionStatusBadge(p.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {!positions.isLoading && !positions.isError && (positions.data?.total ?? 0) > 0 && (
                <TablePagination total={positions.data!.total} limit={PAGE_SIZE} offset={offset} onPageChange={setOffset} isFetching={positions.isFetching} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
