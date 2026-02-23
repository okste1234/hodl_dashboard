"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, AlertTriangle, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const loans = [
  { id: "LN-0001", user: "Jasper Okwu", principal: "\u20A6500,000", collateral: "$450", ltv: 65, rate: "12%", status: "active", due: "Mar 15, 2026", health: 92 },
  { id: "LN-0002", user: "Amara Obi", principal: "\u20A61,200,000", collateral: "$1,200", ltv: 70, rate: "14%", status: "active", due: "Apr 20, 2026", health: 85 },
  { id: "LN-0003", user: "Fatima Bello", principal: "\u20A6800,000", collateral: "$680", ltv: 75, rate: "15%", status: "at-risk", due: "Feb 28, 2026", health: 42 },
  { id: "LN-0004", user: "Ngozi Mba", principal: "\u20A62,000,000", collateral: "$2,100", ltv: 60, rate: "11%", status: "active", due: "Jun 10, 2026", health: 96 },
  { id: "LN-0005", user: "Chidi Eze", principal: "\u20A6350,000", collateral: "$280", ltv: 80, rate: "16%", status: "defaulted", due: "Jan 05, 2026", health: 0 },
  { id: "LN-0006", user: "Aisha Suleiman", principal: "\u20A6900,000", collateral: "$900", ltv: 68, rate: "13%", status: "active", due: "May 18, 2026", health: 88 },
  { id: "LN-0007", user: "Emeka Udo", principal: "\u20A6150,000", collateral: "$120", ltv: 72, rate: "14%", status: "repaid", due: "Dec 01, 2025", health: 100 },
  { id: "LN-0008", user: "Kola Adeyemi", principal: "\u20A6600,000", collateral: "$520", ltv: 78, rate: "15%", status: "at-risk", due: "Mar 01, 2026", health: 38 },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Active</Badge>
    case "at-risk":
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">At Risk</Badge>
    case "defaulted":
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Defaulted</Badge>
    case "repaid":
      return <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20 text-[10px]">Repaid</Badge>
    default:
      return null
  }
}

function getHealthColor(health: number) {
  if (health >= 80) return "[&>div]:bg-success"
  if (health >= 50) return "[&>div]:bg-warning"
  return "[&>div]:bg-destructive"
}

export function LoansPage() {
  const [search, setSearch] = useState("")

  const filtered = loans.filter(
    (l) =>
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Loan Management</h1>
        <p className="text-sm text-muted-foreground">Monitor active loans, collateral health, and manage defaults.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Loans</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">1,847</p>
            <p className="mt-1 text-xs text-muted-foreground">\u20A64.2B outstanding</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Interest Rate</p>
            <p className="mt-1 text-2xl font-semibold text-primary">13.5%</p>
            <p className="mt-1 text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">At-Risk Loans</p>
            <div className="flex items-center gap-2">
              <p className="mt-1 text-2xl font-semibold text-warning">23</p>
              <AlertTriangle className="size-4 text-warning" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">LTV {'>'} 75%</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Defaults (MTD)</p>
            <p className="mt-1 text-2xl font-semibold text-destructive">4</p>
            <p className="mt-1 text-xs text-muted-foreground">\u20A618.5M total</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">All Loans</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search loans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-[200px] bg-secondary border-border pl-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Loan ID</TableHead>
                <TableHead className="text-xs text-muted-foreground">Borrower</TableHead>
                <TableHead className="text-xs text-muted-foreground">Principal</TableHead>
                <TableHead className="text-xs text-muted-foreground">Collateral</TableHead>
                <TableHead className="text-xs text-muted-foreground">LTV</TableHead>
                <TableHead className="text-xs text-muted-foreground">Rate</TableHead>
                <TableHead className="text-xs text-muted-foreground">Health</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground">Due Date</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((loan) => (
                <TableRow key={loan.id} className="border-border">
                  <TableCell className="text-sm font-mono text-primary">{loan.id}</TableCell>
                  <TableCell className="text-sm text-foreground">{loan.user}</TableCell>
                  <TableCell className="text-sm font-mono text-foreground">{loan.principal}</TableCell>
                  <TableCell className="text-sm font-mono text-foreground">{loan.collateral}</TableCell>
                  <TableCell className="text-sm text-foreground">{loan.ltv}%</TableCell>
                  <TableCell className="text-sm text-foreground">{loan.rate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={loan.health} className={`h-1.5 w-16 bg-secondary ${getHealthColor(loan.health)}`} />
                      <span className="text-xs text-muted-foreground">{loan.health}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(loan.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{loan.due}</TableCell>
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
                        <DropdownMenuItem className="text-foreground">
                          Adjust Terms
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Liquidate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
