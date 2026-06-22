"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Lock, TrendingUp, Coins, Users } from "lucide-react"
import { useVaults } from "@/hooks/useVaults"
import { formatUsd, formatPercent, userDisplayName } from "@/lib/format"
import {
  TableLoadingRows,
  TableEmptyRow,
  TableErrorRow,
  TablePagination,
} from "@/components/dashboard/data-state"

const PAGE_SIZE = 20

export function VaultsPage() {
  const [offset, setOffset] = useState(0)

  const { data, isLoading, isError, isFetching, refetch } = useVaults({ limit: PAGE_SIZE, offset })

  const stats = data?.stats
  const details = stats?.vaultDetails
  const earners = data?.earners.items ?? []
  const earnersTotal = data?.earners.total ?? 0
  const utilisation = details ? Number(details.utilisation) : 0
  const colCount = 5

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Vaults & Earnings</h1>
        <p className="text-sm text-muted-foreground">Monitor vault TVL, utilisation, and track user earnings distributions.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total TVL</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stats ? formatUsd(stats.totalTVL) : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg APY</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-primary">{stats ? formatPercent(stats.totalAPY) : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Earnings Paid</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stats ? formatUsd(stats.totalEarnings) : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Depositors</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">{details ? details.numberOfDepositors.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Vault Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <p className="py-4 text-sm text-muted-foreground">Loading vault overview…</p>
          ) : isError || !details ? (
            <p className="py-4 text-sm text-destructive">Failed to load vault overview.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Vault Value</span>
                  <span className="text-sm font-mono font-medium text-foreground">{formatUsd(details.totalVaultValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Earnings</span>
                  <span className="text-sm font-mono font-medium text-success">{formatUsd(details.totalEarnings)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">APY</span>
                  <span className="text-sm font-medium text-primary">{formatPercent(details.totalAPY)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Utilisation</span>
                  <span className="text-sm font-medium text-foreground">{formatPercent(details.utilisation)}</span>
                </div>
                <Progress
                  value={Math.max(0, Math.min(100, utilisation))}
                  className={`h-1.5 bg-secondary ${utilisation >= 90 ? "[&>div]:bg-warning" : "[&>div]:bg-primary"}`}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Depositors</span>
                  <span className="text-sm font-medium text-foreground">{details.numberOfDepositors.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Top Earners (30 days)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">User</TableHead>
                <TableHead className="text-xs text-muted-foreground">Vault Balance</TableHead>
                <TableHead className="text-xs text-muted-foreground">Amount Locked</TableHead>
                <TableHead className="text-xs text-muted-foreground">Earnings</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoadingRows cols={colCount} />
              ) : isError ? (
                <TableErrorRow colSpan={colCount} onRetry={() => refetch()} message="Failed to load top earners." />
              ) : earners.length === 0 ? (
                <TableEmptyRow colSpan={colCount} message="No earners to display." />
              ) : (
                earners.map((entry, i) => (
                  <TableRow key={`${entry.user.email}-${i}`} className="border-border">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{userDisplayName(entry.user.name, entry.user.email)}</span>
                        <span className="text-xs text-muted-foreground">{entry.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-foreground">{formatUsd(entry.vaultBalance)}</TableCell>
                    <TableCell className="text-sm font-mono text-foreground">{formatUsd(entry.amountLocked)}</TableCell>
                    <TableCell className="text-sm font-mono font-medium text-success">{formatUsd(entry.earnings)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{entry.period}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!isLoading && !isError && earnersTotal > 0 && (
            <TablePagination
              total={earnersTotal}
              limit={PAGE_SIZE}
              offset={offset}
              onPageChange={setOffset}
              isFetching={isFetching}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
