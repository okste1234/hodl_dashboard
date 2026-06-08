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
import { Lock, Layers, Power, Percent, Star } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChainBadge } from "@/components/dashboard/chain-badge"
import { TableLoadingRows, TableEmptyRow } from "@/components/dashboard/data-state"
import { useMockData } from "@/hooks/useMockData"
import { userById } from "@/mocks/shared"
import { formatNaira, formatPercent } from "@/lib/format"
import {
  YIELD_STATS,
  YIELD_PROTOCOLS,
  YIELD_POSITIONS,
  type ProtocolRisk,
  type ProtocolStatus,
} from "@/mocks/yield"

const tabTrigger = "text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"

function riskBadge(risk: ProtocolRisk) {
  const map: Record<ProtocolRisk, string> = {
    low: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[risk]}`}>{risk}</Badge>
}

function protocolStatusBadge(status: ProtocolStatus) {
  const map: Record<ProtocolStatus, string> = {
    enabled: "bg-success/10 text-success border-success/20",
    paused: "bg-warning/10 text-warning border-warning/20",
    disabled: "bg-muted text-muted-foreground border-border",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[status]}`}>{status}</Badge>
}

export function YieldPage() {
  const stats = useMockData(YIELD_STATS)
  const protocols = useMockData(YIELD_PROTOCOLS)
  const positions = useMockData(YIELD_POSITIONS)
  const s = stats.data

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Yield Markets</h1>
        <p className="text-sm text-muted-foreground">DeFi yield protocols and user positions across chains.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Total Value Locked" value={s ? formatNaira(s.totalValueLockedUsd) : "—"} icon={Lock} isLoading={stats.isLoading} />
        <StatCard label="Active Positions" value={s ? s.activePositions.toLocaleString() : "—"} icon={Layers} tone="primary" isLoading={stats.isLoading} />
        <StatCard label="Enabled Protocols" value={s ? s.enabledProtocols.toLocaleString() : "—"} icon={Power} tone="success" isLoading={stats.isLoading} />
        <StatCard label="Avg APY" value={s ? `${s.avgApy}%` : "—"} icon={Percent} tone="primary" isLoading={stats.isLoading} />
      </div>

      <Tabs defaultValue="protocols" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="protocols" className={tabTrigger}>Protocols</TabsTrigger>
          <TabsTrigger value="positions" className={tabTrigger}>Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="protocols" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Protocol Whitelist</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Protocol</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Chain</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Asset</TableHead>
                    <TableHead className="text-xs text-muted-foreground">APY</TableHead>
                    <TableHead className="text-xs text-muted-foreground">TVL</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Risk</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {protocols.isLoading ? (
                    <TableLoadingRows cols={7} />
                  ) : (protocols.data ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={7} message="No protocols configured." />
                  ) : (
                    (protocols.data ?? []).map((p) => (
                      <TableRow key={p.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {p.featured && <Star className="size-3 fill-warning text-warning" />}
                            <span className="text-sm font-medium text-foreground">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell><ChainBadge chainKey={p.chainKey} /></TableCell>
                        <TableCell className="text-sm text-foreground">{p.asset}</TableCell>
                        <TableCell className="text-sm font-medium text-primary">{formatPercent(p.apy)}</TableCell>
                        <TableCell className="text-sm font-mono text-foreground">{formatNaira(p.tvlUsd)}</TableCell>
                        <TableCell>{riskBadge(p.risk)}</TableCell>
                        <TableCell className="text-right">{protocolStatusBadge(p.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">User Positions</CardTitle>
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
                    <TableHead className="text-xs text-muted-foreground text-right">Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.isLoading ? (
                    <TableLoadingRows cols={6} />
                  ) : (positions.data ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={6} message="No active positions." />
                  ) : (
                    (positions.data ?? []).map((p) => {
                      const user = userById(p.userId)
                      return (
                        <TableRow key={p.id} className="border-border">
                          <TableCell className="text-sm text-foreground">{user?.name ?? user?.email ?? "—"}</TableCell>
                          <TableCell className="text-sm text-foreground">{p.protocolName}</TableCell>
                          <TableCell><ChainBadge chainKey={p.chainKey} /></TableCell>
                          <TableCell className="text-sm text-foreground">{p.asset}</TableCell>
                          <TableCell className="text-sm font-mono text-foreground">{formatNaira(p.balanceUsd)}</TableCell>
                          <TableCell className="text-right text-sm font-mono text-success">{formatNaira(p.earnedUsd)}</TableCell>
                        </TableRow>
                      )
                    })
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
