"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, Eye, MoreHorizontal, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLoans } from "@/hooks/useLoans"
import { LoanStatusSort } from "@/types/admin"
import { formatUsd, formatNaira, formatDate, formatPercent, userDisplayName } from "@/lib/format"

// Loan principals come back as raw cNGN (6 decimals); divide to get the human
// Naira figure, e.g. "700000000.00" → ₦700.
const CNGN_DECIMALS = 1_000_000
function loanAmountNaira(raw: string): string {
  const n = Number(raw)
  return Number.isFinite(n) ? formatNaira(n / CNGN_DECIMALS) : "—"
}
import {
  TableLoadingRows,
  TableEmptyRow,
  TableErrorRow,
  TablePagination,
} from "@/components/dashboard/data-state"

const PAGE_SIZE = 10
const STATUS_ALL = "all"

function getStatusBadge(status: string) {
  const s = status?.toUpperCase()
  if (s === "ACTIVE") {
    return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Active</Badge>
  }
  if (s === "REPAID") {
    return <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20 text-[10px]">Repaid</Badge>
  }
  return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">{status || "—"}</Badge>
}

function getHealthColor(health: number) {
  if (health >= 80) return "[&>div]:bg-success"
  if (health >= 50) return "[&>div]:bg-warning"
  return "[&>div]:bg-destructive"
}

export function LoansPage() {
  const [status, setStatus] = useState<string>(STATUS_ALL)
  const [offset, setOffset] = useState(0)

  const filters = useMemo(
    () => ({
      status: status === STATUS_ALL ? undefined : (status as LoanStatusSort),
      limit: PAGE_SIZE,
      offset,
    }),
    [status, offset]
  )

  const { data, isLoading, isError, isFetching, refetch } = useLoans(filters)

  const stats = data?.stats
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const colCount = 8

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Loan Management</h1>
        <p className="text-sm text-muted-foreground">Monitor active loans, collateral health, and manage defaults.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Loans</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stats ? stats.totalLoans.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Interest Rate</p>
            <p className="mt-1 text-2xl font-semibold text-primary">
              {stats && stats.averageInterestRate !== null ? formatPercent(stats.averageInterestRate) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Positions At Risk</p>
            <div className="flex items-center gap-2">
              <p className="mt-1 text-2xl font-semibold text-warning">{stats ? stats.positionsAtRisk.toLocaleString() : "—"}</p>
              {stats && stats.positionsAtRisk > 0 && <AlertTriangle className="size-4 text-warning" />}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Defaulters</p>
            <p className="mt-1 text-2xl font-semibold text-destructive">{stats ? stats.totalDefaulters.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">All Loans</CardTitle>
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
                {Object.values(LoanStatusSort).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Loan ID</TableHead>
                <TableHead className="text-xs text-muted-foreground">Borrower</TableHead>
                <TableHead className="text-xs text-muted-foreground">Collateral</TableHead>
                <TableHead className="text-xs text-muted-foreground">Loan Amount</TableHead>
                <TableHead className="text-xs text-muted-foreground">Rate</TableHead>
                <TableHead className="text-xs text-muted-foreground">Health</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoadingRows cols={colCount} />
              ) : isError ? (
                <TableErrorRow colSpan={colCount} onRetry={() => refetch()} message="Failed to load loans." />
              ) : items.length === 0 ? (
                <TableEmptyRow colSpan={colCount} message="No loans match your filters." />
              ) : (
                items.map((loan) => (
                  <TableRow key={loan.loanId} className="border-border">
                    <TableCell className="text-sm font-mono text-primary">{loan.loanId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">{userDisplayName(loan.user.name, loan.user.email)}</span>
                        <span className="text-xs text-muted-foreground">{loan.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-foreground">{formatUsd(loan.collateralAmount)}</TableCell>
                    <TableCell className="text-sm font-mono text-foreground">{loanAmountNaira(loan.loanAmount)}</TableCell>
                    <TableCell className="text-sm text-foreground">
                      {loan.interestRate !== null ? formatPercent(loan.interestRate) : "—"}
                    </TableCell>
                    <TableCell>
                      {loan.healthFactor !== null ? (
                        <div className="flex items-center gap-2">
                          <Progress
                            value={Math.max(0, Math.min(100, loan.healthFactor))}
                            className={`h-1.5 w-16 bg-secondary ${getHealthColor(loan.healthFactor)}`}
                          />
                          <span className="text-xs text-muted-foreground">{loan.healthFactor}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="size-7 p-0 text-muted-foreground">
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem className="text-foreground">
                            <Eye className="mr-2 size-3.5" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground">Adjust Terms</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Liquidate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!isLoading && !isError && total > 0 && (
            <TablePagination
              total={total}
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
