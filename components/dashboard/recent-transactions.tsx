"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Repeat,
  Send,
  Flame,
  type LucideIcon,
} from "lucide-react"
import type { AdminTransactionItem } from "@/types/admin"
import { formatDateTime, formatTokenAmount, txTokenSymbol, userDisplayName } from "@/lib/format"

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

function getStatusColor(status: string) {
  const s = status?.toUpperCase()
  if (s === "SUCCESS" || s === "COMPLETED") return "bg-success/10 text-success border-success/20"
  if (s === "PENDING" || s === "PROCESSING") return "bg-warning/10 text-warning border-warning/20"
  if (s === "FAILED" || s === "REJECTED") return "bg-destructive/10 text-destructive border-destructive/20"
  return "bg-muted text-muted-foreground border-border"
}

function prettyType(type: string) {
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

type RecentTransactionsProps = {
  transactions: AdminTransactionItem[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Recent Transactions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium">Transaction</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">User</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Amount</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No recent transactions.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx, i) => {
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
                    <TableCell className="text-sm text-foreground">{userDisplayName(tx.user.name, tx.user.email)}</TableCell>
                    <TableCell className="text-sm font-medium font-mono text-foreground">
                      {formatTokenAmount(tx.amount, txTokenSymbol(tx))}
                      {tx.toTokenSymbol && (
                        <span className="text-muted-foreground"> → {tx.toTokenSymbol}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] capitalize ${getStatusColor(tx.status)}`}>
                        {tx.status?.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{formatDateTime(tx.createdAt)}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
