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
import { Banknote, Wallet, Clock, ArrowLeftRight, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { TableLoadingRows, TableEmptyRow } from "@/components/dashboard/data-state"
import { useMockData } from "@/hooks/useMockData"
import { userById } from "@/mocks/shared"
import { formatNaira, formatDate, formatToken } from "@/lib/format"
import {
  CASH_STATS,
  VIRTUAL_ACCOUNTS,
  RAMP_ORDERS,
  LINKED_BANKS,
  type VirtualAccountStatus,
  type RampStatus,
  type LinkedBankStatus,
} from "@/mocks/cash"

function vaStatusBadge(status: VirtualAccountStatus) {
  const map: Record<VirtualAccountStatus, string> = {
    active: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    frozen: "bg-destructive/10 text-destructive border-destructive/20",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[status]}`}>{status}</Badge>
}

function rampStatusBadge(status: RampStatus) {
  const map: Record<RampStatus, string> = {
    completed: "bg-success/10 text-success border-success/20",
    validated: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    initiated: "bg-warning/10 text-warning border-warning/20",
    refunded: "bg-muted text-muted-foreground border-border",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[status]}`}>{status}</Badge>
}

function bankStatusBadge(status: LinkedBankStatus) {
  const map: Record<LinkedBankStatus, string> = {
    verified: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[status]}`}>{status}</Badge>
}

const tabTrigger = "text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"

export function CashPage() {
  const stats = useMockData(CASH_STATS)
  const accounts = useMockData(VIRTUAL_ACCOUNTS)
  const ramps = useMockData(RAMP_ORDERS)
  const banks = useMockData(LINKED_BANKS)
  const s = stats.data

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Cash &amp; Ramps</h1>
        <p className="text-sm text-muted-foreground">USD virtual accounts, fiat ramp settlements, and linked bank accounts.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="USD Held" value={s ? formatNaira(s.totalUsdHeld) : "—"} icon={Wallet} isLoading={stats.isLoading} />
        <StatCard label="Active Accounts" value={s ? s.activeAccounts.toLocaleString() : "—"} icon={Banknote} tone="primary" isLoading={stats.isLoading} />
        <StatCard label="Pending Ramps" value={s ? s.pendingRamps.toLocaleString() : "—"} icon={Clock} tone="warning" isLoading={stats.isLoading} />
        <StatCard label="Ramp Volume (24h)" value={s ? formatNaira(s.rampVolume24hUsd) : "—"} icon={ArrowLeftRight} isLoading={stats.isLoading} />
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="accounts" className={tabTrigger}>Virtual Accounts</TabsTrigger>
          <TabsTrigger value="ramps" className={tabTrigger}>Ramp Orders</TabsTrigger>
          <TabsTrigger value="banks" className={tabTrigger}>Linked Banks</TabsTrigger>
        </TabsList>

        {/* Virtual Accounts */}
        <TabsContent value="accounts" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">USD Virtual Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">User</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Account #</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Bank</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Available</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.isLoading ? (
                    <TableLoadingRows cols={6} />
                  ) : (accounts.data ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={6} message="No virtual accounts." />
                  ) : (
                    (accounts.data ?? []).map((a) => {
                      const user = userById(a.userId)
                      return (
                        <TableRow key={a.id} className="border-border">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground">{user?.name ?? user?.username ?? "—"}</span>
                              <span className="text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-mono text-foreground">{a.accountNumber}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{a.bankName}</TableCell>
                          <TableCell className="text-sm font-mono text-foreground">{formatNaira(a.availableBalanceUsd)}</TableCell>
                          <TableCell>{vaStatusBadge(a.status)}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{formatDate(a.createdAt)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ramp Orders */}
        <TabsContent value="ramps" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Ramp Orders</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Reference</TableHead>
                    <TableHead className="text-xs text-muted-foreground">User</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Direction</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Fiat</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Crypto</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ramps.isLoading ? (
                    <TableLoadingRows cols={7} />
                  ) : (ramps.data ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={7} message="No ramp orders." />
                  ) : (
                    (ramps.data ?? []).map((o) => {
                      const user = userById(o.userId)
                      const isOn = o.direction === "onramp"
                      return (
                        <TableRow key={o.id} className="border-border">
                          <TableCell className="text-sm font-mono text-primary">{o.reference}</TableCell>
                          <TableCell className="text-sm text-foreground">{user?.name ?? user?.email ?? "—"}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 text-xs ${isOn ? "text-success" : "text-chart-2"}`}>
                              {isOn ? <ArrowDownLeft className="size-3" /> : <ArrowUpRight className="size-3" />}
                              {isOn ? "Onramp" : "Offramp"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm font-mono text-foreground">{formatNaira(o.fiatAmount)}</TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">{formatToken(o.cryptoAmount, o.asset)}</TableCell>
                          <TableCell>{rampStatusBadge(o.status)}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Linked Banks */}
        <TabsContent value="banks" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Linked Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">User</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Bank</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Account #</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Account Name</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Currency</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banks.isLoading ? (
                    <TableLoadingRows cols={6} />
                  ) : (banks.data ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={6} message="No linked bank accounts." />
                  ) : (
                    (banks.data ?? []).map((b) => {
                      const user = userById(b.userId)
                      return (
                        <TableRow key={b.id} className="border-border">
                          <TableCell className="text-sm text-foreground">{user?.name ?? user?.email ?? "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{b.bankName}</TableCell>
                          <TableCell className="text-sm font-mono text-foreground">{b.accountNumber}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{b.accountName}</TableCell>
                          <TableCell className="text-sm text-foreground">{b.currency}</TableCell>
                          <TableCell className="text-right">{bankStatusBadge(b.status)}</TableCell>
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
