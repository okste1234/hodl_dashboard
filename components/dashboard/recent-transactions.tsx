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
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Repeat } from "lucide-react"

const transactions = [
  {
    id: "TXN-001",
    user: "Jasper Okwu",
    type: "Borrow",
    amount: "-\u20A6500,000.00",
    usdAmount: "$333.33",
    status: "success",
    time: "2 min ago",
    icon: ArrowDownLeft,
  },
  {
    id: "TXN-002",
    user: "Amara Obi",
    type: "Repay",
    amount: "+\u20A6250,000.00",
    usdAmount: "$166.67",
    status: "success",
    time: "5 min ago",
    icon: ArrowUpRight,
  },
  {
    id: "TXN-003",
    user: "Kola Adeyemi",
    type: "Swap",
    amount: "$1,200.00",
    usdAmount: "BTC 0.024",
    status: "pending",
    time: "8 min ago",
    icon: Repeat,
  },
  {
    id: "TXN-004",
    user: "Fatima Bello",
    type: "Deposit",
    amount: "+$5,000.00",
    usdAmount: "Vault",
    status: "success",
    time: "12 min ago",
    icon: ArrowUpRight,
  },
  {
    id: "TXN-005",
    user: "Chidi Eze",
    type: "Borrow",
    amount: "-\u20A61,000,000.00",
    usdAmount: "$666.67",
    status: "failed",
    time: "15 min ago",
    icon: ArrowDownLeft,
  },
  {
    id: "TXN-006",
    user: "Ngozi Mba",
    type: "Earn",
    amount: "+$120.50",
    usdAmount: "Interest",
    status: "success",
    time: "18 min ago",
    icon: RefreshCw,
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "success":
      return "bg-success/10 text-success border-success/20"
    case "pending":
      return "bg-warning/10 text-warning border-warning/20"
    case "failed":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "Borrow":
      return "text-chart-2"
    case "Repay":
      return "text-success"
    case "Swap":
      return "text-chart-5"
    case "Deposit":
      return "text-primary"
    case "Earn":
      return "text-chart-3"
    default:
      return "text-muted-foreground"
  }
}

export function RecentTransactions() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Recent Transactions</CardTitle>
          <button className="text-xs font-medium text-primary hover:underline">View all</button>
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
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-border">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className={`flex size-7 items-center justify-center rounded-md bg-secondary ${getTypeColor(tx.type)}`}>
                      <tx.icon className="size-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{tx.type}</span>
                      <span className="text-xs text-muted-foreground font-mono">{tx.id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground">{tx.user}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{tx.amount}</span>
                    <span className="text-xs text-muted-foreground">{tx.usdAmount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] capitalize ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">{tx.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
