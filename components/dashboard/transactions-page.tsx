"use client"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, ArrowDownLeft, ArrowUpRight, RefreshCw, Repeat } from "lucide-react"

const allTransactions = [
  { id: "TXN-20001", user: "Jasper Okwu", type: "Borrow", amount: "-\u20A6500,000.00", usd: "$333.33", status: "success", date: "Feb 23, 2026 14:32", fee: "$1.50", icon: ArrowDownLeft },
  { id: "TXN-20002", user: "Amara Obi", type: "Repay", amount: "+\u20A6250,000.00", usd: "$166.67", status: "success", date: "Feb 23, 2026 14:28", fee: "$0.75", icon: ArrowUpRight },
  { id: "TXN-20003", user: "Kola Adeyemi", type: "Swap", amount: "$1,200.00", usd: "0.024 BTC", status: "pending", date: "Feb 23, 2026 14:25", fee: "$3.60", icon: Repeat },
  { id: "TXN-20004", user: "Fatima Bello", type: "Deposit", amount: "+$5,000.00", usd: "Vault", status: "success", date: "Feb 23, 2026 14:18", fee: "$0.00", icon: ArrowUpRight },
  { id: "TXN-20005", user: "Chidi Eze", type: "Borrow", amount: "-\u20A61,000,000.00", usd: "$666.67", status: "failed", date: "Feb 23, 2026 14:12", fee: "$0.00", icon: ArrowDownLeft },
  { id: "TXN-20006", user: "Ngozi Mba", type: "Earn", amount: "+$120.50", usd: "Interest", status: "success", date: "Feb 23, 2026 14:05", fee: "$0.00", icon: RefreshCw },
  { id: "TXN-20007", user: "Aisha Suleiman", type: "Withdraw", amount: "-$2,500.00", usd: "Wallet", status: "success", date: "Feb 23, 2026 13:58", fee: "$2.50", icon: ArrowDownLeft },
  { id: "TXN-20008", user: "Emeka Udo", type: "Swap", amount: "$800.00", usd: "4.2 ETH", status: "success", date: "Feb 23, 2026 13:45", fee: "$2.40", icon: Repeat },
  { id: "TXN-20009", user: "Jasper Okwu", type: "Repay", amount: "+\u20A6100,000.00", usd: "$66.67", status: "success", date: "Feb 23, 2026 13:30", fee: "$0.50", icon: ArrowUpRight },
  { id: "TXN-20010", user: "Fatima Bello", type: "Borrow", amount: "-\u20A6300,000.00", usd: "$200.00", status: "success", date: "Feb 23, 2026 13:22", fee: "$1.00", icon: ArrowDownLeft },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "success":
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Success</Badge>
    case "pending":
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">Pending</Badge>
    case "failed":
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Failed</Badge>
    default:
      return null
  }
}

export function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = allTransactions.filter((tx) => {
    const matchesSearch =
      tx.user.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || tx.type.toLowerCase() === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Transaction Monitoring</h1>
        <p className="text-sm text-muted-foreground">Real-time view of all platform transactions across borrowing, lending, and conversions.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Today&apos;s Volume</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">$1.2M</p>
            <p className="mt-1 text-xs text-success">+18% vs yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Transactions Today</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">3,241</p>
            <p className="mt-1 text-xs text-muted-foreground">412 borrows, 298 repays</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Fees Collected</p>
            <p className="mt-1 text-2xl font-semibold text-primary">$8,420</p>
            <p className="mt-1 text-xs text-muted-foreground">Avg $2.60/tx</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Failed Rate</p>
            <p className="mt-1 text-2xl font-semibold text-destructive">2.1%</p>
            <p className="mt-1 text-xs text-muted-foreground">68 failed today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="all" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
          <TabsTrigger value="borrows" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Borrows</TabsTrigger>
          <TabsTrigger value="repays" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Repays</TabsTrigger>
          <TabsTrigger value="swaps" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Swaps</TabsTrigger>
          <TabsTrigger value="deposits" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Deposits</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-medium text-foreground">All Transactions</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8 w-[180px] bg-secondary border-border pl-8 text-sm"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-8 w-[100px] bg-secondary border-border text-sm">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="borrow">Borrow</SelectItem>
                      <SelectItem value="repay">Repay</SelectItem>
                      <SelectItem value="swap">Swap</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="earn">Earn</SelectItem>
                      <SelectItem value="withdraw">Withdraw</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8 border-border bg-secondary text-foreground">
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
                  {filtered.map((tx) => (
                    <TableRow key={tx.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-primary">
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
                          <span className="text-sm font-medium font-mono text-foreground">{tx.amount}</span>
                          <span className="text-xs text-muted-foreground">{tx.usd}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">{tx.fee}</TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{tx.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {["borrows", "repays", "swaps", "deposits"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card className="border-border bg-card">
              <CardContent className="p-8">
                <p className="text-center text-sm text-muted-foreground">
                  Showing filtered view for {tab}. Same table structure with type-specific data.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
