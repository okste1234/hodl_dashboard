"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Repeat,
  Send,
  Flame,
  type LucideIcon,
} from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { TransactionType, type AdminTransactionItem } from "@/types/admin"
import { formatUsd, formatDateTime, formatTokenAmount, txTokenSymbol, userDisplayName } from "@/lib/format"
import { TransactionBreakdownCard } from "@/components/dashboard/transaction-breakdown"
import {
  TableLoadingRows,
  TableEmptyRow,
  TableErrorRow,
  TablePagination,
} from "@/components/dashboard/data-state"

const PAGE_SIZE = 20
const TYPE_ALL = "all"
const STATUS_ALL = "all"

const typeIcons: Record<string, LucideIcon> = {
  BORROW: ArrowDownLeft,
  REPAY: ArrowUpRight,
  DEPOSIT: ArrowUpRight,
  USD_DEPOSIT: ArrowUpRight,
  WITHDRAW: ArrowDownLeft,
  USD_WITHDRAWAL: ArrowDownLeft,
  SWAP: Repeat,
  CROSS_CHAIN_SWAP: Repeat,
  SEND: Send,
  LIQUIDATION: Flame,
  INTEREST_ACCRUAL: RefreshCw,
}

function getStatusBadge(status: string) {
  const s = status?.toUpperCase()
  if (s === "SUCCESS" || s === "COMPLETED") {
    return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Success</Badge>
  }
  if (s === "PENDING" || s === "PROCESSING") {
    return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">Pending</Badge>
  }
  if (s === "FAILED" || s === "REJECTED") {
    return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Failed</Badge>
  }
  return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px] capitalize">{status || "—"}</Badge>
}

function prettyType(type: string) {
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

function exportCsv(rows: AdminTransactionItem[]) {
  const header = ["transactionType", "userName", "userEmail", "amount", "tokenSymbol", "fromTokenSymbol", "toTokenSymbol", "fee", "status", "createdAt"]
  const body = rows.map((r) =>
    [
      r.transactionType,
      r.user.name ?? "",
      r.user.email,
      r.amount,
      r.tokenSymbol ?? "",
      r.fromTokenSymbol ?? "",
      r.toTokenSymbol ?? "",
      r.fee,
      r.status,
      r.createdAt,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  )
  const csv = [header.join(","), ...body].join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const a = document.createElement("a")
  a.href = url
  a.download = "transactions.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export function TransactionsPage() {
  const [type, setType] = useState<string>(TYPE_ALL)
  const [status, setStatus] = useState<string>(STATUS_ALL)
  const [offset, setOffset] = useState(0)

  const filters = useMemo(
    () => ({
      transactionType: type === TYPE_ALL ? undefined : (type as TransactionType),
      status: status === STATUS_ALL ? undefined : status,
      limit: PAGE_SIZE,
      offset,
    }),
    [type, status, offset]
  )

  const { data, isLoading, isError, isFetching, refetch } = useTransactions(filters)

  const stats = data?.stats
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const colCount = 6

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Transaction Monitoring</h1>
        <p className="text-sm text-muted-foreground">Real-time view of all platform transactions across borrowing, lending, and conversions.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Today&apos;s Volume</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stats ? formatUsd(stats.todayTransactionVolumeUsd) : "—"}</p>
            {stats && (
              <p className={`mt-1 text-xs ${stats.volumePercentChange.startsWith("-") ? "text-destructive" : "text-success"}`}>
                {stats.volumePercentChange.startsWith("-") ? "" : "+"}{stats.volumePercentChange}% vs yesterday
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Transactions Today</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stats ? stats.totalTransactionsToday.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Fees Collected</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{stats ? formatUsd(stats.feesCollectedTodayUsd) : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <TransactionBreakdownCard breakdown={stats?.breakdown} isLoading={isLoading} />

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">All Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={type}
                onValueChange={(v) => {
                  setType(v)
                  setOffset(0)
                }}
              >
                <SelectTrigger className="h-8 w-[150px] bg-secondary border-border text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={TYPE_ALL}>All Types</SelectItem>
                  {Object.values(TransactionType).map((t) => (
                    <SelectItem key={t} value={t}>{prettyType(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v)
                  setOffset(0)
                }}
              >
                <SelectTrigger className="h-8 w-[120px] bg-secondary border-border text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={STATUS_ALL}>All Status</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCsv(items)}
                disabled={items.length === 0}
                className="h-8 border-border bg-secondary text-foreground"
              >
                <Download className="mr-1 size-3" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Transaction</TableHead>
                <TableHead className="text-xs text-muted-foreground">User</TableHead>
                <TableHead className="text-xs text-muted-foreground">Amount</TableHead>
                <TableHead className="text-xs text-muted-foreground">Fee</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoadingRows cols={colCount} />
              ) : isError ? (
                <TableErrorRow colSpan={colCount} onRetry={() => refetch()} message="Failed to load transactions." />
              ) : items.length === 0 ? (
                <TableEmptyRow colSpan={colCount} message="No transactions match your filters." />
              ) : (
                items.map((tx, i) => {
                  const Icon = typeIcons[tx.transactionType?.toUpperCase()] ?? RefreshCw
                  return (
                    <TableRow key={`${tx.createdAt}-${i}`} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-primary">
                            <Icon className="size-3.5" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{prettyType(tx.transactionType)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-foreground">{userDisplayName(tx.user.name, tx.user.email)}</span>
                          <span className="text-xs text-muted-foreground">{tx.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono font-medium text-foreground">
                        {formatTokenAmount(tx.amount, txTokenSymbol(tx))}
                        {tx.toTokenSymbol && (
                          <span className="text-muted-foreground"> → {tx.toTokenSymbol}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">{tx.fee ?? "—"}</TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{formatDateTime(tx.createdAt)}</TableCell>
                    </TableRow>
                  )
                })
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
