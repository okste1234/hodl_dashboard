"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Shield, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react"

const kycRequests = [
  { id: "KYC-401", user: "Kola Adeyemi", submitted: "Feb 22, 2026", docType: "National ID", status: "pending", risk: "low" },
  { id: "KYC-402", user: "Tunde Balogun", submitted: "Feb 22, 2026", docType: "Passport", status: "pending", risk: "medium" },
  { id: "KYC-403", user: "Grace Nwosu", submitted: "Feb 21, 2026", docType: "Driver License", status: "pending", risk: "low" },
  { id: "KYC-404", user: "Ibrahim Musa", submitted: "Feb 21, 2026", docType: "Voter Card", status: "under-review", risk: "high" },
  { id: "KYC-405", user: "Blessing Okafor", submitted: "Feb 20, 2026", docType: "National ID", status: "pending", risk: "low" },
]

const flaggedTransactions = [
  { id: "FLG-101", user: "Unknown Wallet", amount: "$25,000", reason: "Velocity check exceeded", severity: "high", time: "1 hour ago" },
  { id: "FLG-102", user: "Chidi Eze", amount: "\u20A68,000,000", reason: "Above daily limit", severity: "medium", time: "3 hours ago" },
  { id: "FLG-103", user: "New Account", amount: "$12,500", reason: "Large first transaction", severity: "medium", time: "5 hours ago" },
]

export function CompliancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Compliance & Risk</h1>
        <p className="text-sm text-muted-foreground">KYC verification queue, AML alerts, and risk monitoring.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-warning" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">KYC Pending</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-warning">342</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Flagged Tx</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-destructive">3</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-success" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Verified Today</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-success">28</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk Score</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-primary">Low</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">KYC Verification Queue</CardTitle>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">
              {kycRequests.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">ID</TableHead>
                <TableHead className="text-xs text-muted-foreground">User</TableHead>
                <TableHead className="text-xs text-muted-foreground">Document</TableHead>
                <TableHead className="text-xs text-muted-foreground">Submitted</TableHead>
                <TableHead className="text-xs text-muted-foreground">Risk</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kycRequests.map((req) => (
                <TableRow key={req.id} className="border-border">
                  <TableCell className="text-sm font-mono text-primary">{req.id}</TableCell>
                  <TableCell className="text-sm text-foreground">{req.user}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{req.docType}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{req.submitted}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        req.risk === "high"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : req.risk === "medium"
                          ? "bg-warning/10 text-warning border-warning/20"
                          : "bg-success/10 text-success border-success/20"
                      }`}
                    >
                      {req.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        req.status === "pending"
                          ? "bg-warning/10 text-warning border-warning/20"
                          : "bg-chart-2/10 text-chart-2 border-chart-2/20"
                      }`}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-foreground">
                        <Eye className="mr-1 size-3" /> Review
                      </Button>
                      <Button size="sm" className="h-7 bg-primary text-primary-foreground text-xs">
                        Approve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">Flagged Transactions (AML)</CardTitle>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">
              {flaggedTransactions.length} alerts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-3">
            {flaggedTransactions.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex size-8 items-center justify-center rounded-lg ${
                    flag.severity === "high" ? "bg-destructive/10" : "bg-warning/10"
                  }`}>
                    <AlertTriangle className={`size-4 ${
                      flag.severity === "high" ? "text-destructive" : "text-warning"
                    }`} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{flag.user}</span>
                      <span className="text-sm font-mono text-foreground">{flag.amount}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{flag.reason}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{flag.time}</span>
                  <Button size="sm" variant="outline" className="h-7 border-border bg-secondary text-xs text-foreground">
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
