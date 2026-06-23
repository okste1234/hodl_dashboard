"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Banknote,
  Wallet,
  Clock,
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Filter,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  TableLoadingRows,
  TableEmptyRow,
  TableErrorRow,
  TablePagination,
} from "@/components/dashboard/data-state"
import { useVirtualAccounts, useRampOrders, useLinkedBanks } from "@/hooks/useCash"
import { useReconcilePaycrest } from "@/hooks/useReconcilePaycrest"
import {
  formatUsd,
  formatDate,
  formatDateTime,
  formatTokenAmount,
  txTokenSymbol,
  userDisplayName,
} from "@/lib/format"

const PAGE_SIZE = 20
const ALL = "all"
const tabTrigger = "text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"

function vaStatusBadge(status: string) {
  return status?.toLowerCase() === "active" ? (
    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] capitalize">{status}</Badge>
  ) : (
    <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px] capitalize">{status || "—"}</Badge>
  )
}

function rampStatusBadge(status: string) {
  const s = status?.toUpperCase()
  if (s === "COMPLETED" || s === "SUCCESS") return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] capitalize">{status}</Badge>
  if (s === "VALIDATED") return <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20 text-[10px] capitalize">{status}</Badge>
  if (s === "PENDING" || s === "INITIATED") return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px] capitalize">{status}</Badge>
  if (s === "FAILED") return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] capitalize">{status}</Badge>
  return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px] capitalize">{status || "—"}</Badge>
}

function bankStatusBadge(status: string) {
  const s = status?.toUpperCase()
  if (s === "VERIFIED") return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] capitalize">{status}</Badge>
  if (s === "PENDING") return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px] capitalize">{status}</Badge>
  return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] capitalize">{status || "—"}</Badge>
}

function userLabel(u: { name: string | null; email: string } | null): string {
  return u ? userDisplayName(u.name, u.email) : "—"
}

export function CashPage() {
  const [vaOffset, setVaOffset] = useState(0)
  const [rampOffset, setRampOffset] = useState(0)
  const [rampStatus, setRampStatus] = useState<string>(ALL)
  const [bankOffset, setBankOffset] = useState(0)
  const [bankStatus, setBankStatus] = useState<string>(ALL)

  const accounts = useVirtualAccounts({ limit: PAGE_SIZE, offset: vaOffset })
  const ramps = useRampOrders({
    status: rampStatus === ALL ? undefined : rampStatus,
    limit: PAGE_SIZE,
    offset: rampOffset,
  })
  const banks = useLinkedBanks({
    status: bankStatus === ALL ? undefined : bankStatus,
    limit: PAGE_SIZE,
    offset: bankOffset,
  })

  const reconcile = useReconcilePaycrest()
  const stats = accounts.data?.stats

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Cash &amp; Ramps</h1>
        <p className="text-sm text-muted-foreground">USD virtual accounts, fiat ramp settlements, and linked bank accounts.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="USD Held" value={stats ? formatUsd(stats.totalUsdHeld) : "—"} icon={Wallet} isLoading={accounts.isLoading} />
        <StatCard label="Active Accounts" value={stats ? stats.activeAccounts.toLocaleString() : "—"} icon={Banknote} tone="primary" isLoading={accounts.isLoading} />
        <StatCard label="Pending Ramps" value={stats ? stats.pendingRamps.toLocaleString() : "—"} icon={Clock} tone="warning" isLoading={accounts.isLoading} />
        <StatCard label="Ramp Volume (24h)" value={stats ? formatUsd(stats.rampVolume24hUsd) : "—"} icon={ArrowLeftRight} isLoading={accounts.isLoading} />
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
                  ) : accounts.isError ? (
                    <TableErrorRow colSpan={6} onRetry={() => accounts.refetch()} message="Failed to load virtual accounts." />
                  ) : (accounts.data?.items ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={6} message="No virtual accounts." />
                  ) : (
                    (accounts.data?.items ?? []).map((a) => (
                      <TableRow key={a.id} className="border-border">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground">{userLabel(a.user)}</span>
                            {a.user && <span className="text-xs text-muted-foreground">{a.user.email}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-foreground">{a.accountNumberMasked ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{a.bankName}</TableCell>
                        <TableCell className="text-sm font-mono text-foreground">{formatUsd(a.availableBalanceUsd)}</TableCell>
                        <TableCell>{vaStatusBadge(a.status)}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{formatDate(a.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {!accounts.isLoading && !accounts.isError && (accounts.data?.total ?? 0) > 0 && (
                <TablePagination total={accounts.data!.total} limit={PAGE_SIZE} offset={vaOffset} onPageChange={setVaOffset} isFetching={accounts.isFetching} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ramp Orders */}
        <TabsContent value="ramps" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-medium text-foreground">Ramp Orders</CardTitle>
                <div className="flex items-center gap-2">
                  <Select
                    value={rampStatus}
                    onValueChange={(v) => {
                      setRampStatus(v)
                      setRampOffset(0)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[140px] bg-secondary border-border text-sm">
                      <Filter className="mr-1 size-3" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value={ALL}>All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="INITIATED">Initiated</SelectItem>
                      <SelectItem value="VALIDATED">Validated</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reconcile.mutate(undefined, { onSuccess: () => ramps.refetch() })}
                    disabled={reconcile.isPending}
                    className="h-8 border-border bg-secondary text-foreground"
                  >
                    <RefreshCw className={`mr-1 size-3 ${reconcile.isPending ? "animate-spin" : ""}`} />
                    {reconcile.isPending ? "Reconciling…" : "Reconcile Paycrest"}
                  </Button>
                </div>
              </div>

              {reconcile.isError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-2.5 text-xs text-destructive">
                  <AlertCircle className="size-3.5" />
                  Reconciliation failed. Please try again.
                </div>
              )}
              {reconcile.data && (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-2.5 text-xs">
                  <span className="flex items-center gap-1.5 text-success">
                    <CheckCircle2 className="size-3.5" /> Reconciliation complete
                  </span>
                  <span className="text-muted-foreground">Checked <span className="font-medium text-foreground">{reconcile.data.checked}</span></span>
                  <span className="text-muted-foreground">Updated <span className="font-medium text-success">{reconcile.data.updated}</span></span>
                  <span className="text-muted-foreground">Unchanged <span className="font-medium text-foreground">{reconcile.data.unchanged}</span></span>
                  <span className="text-muted-foreground">Failed <span className="font-medium text-destructive">{reconcile.data.failed}</span></span>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Reference</TableHead>
                    <TableHead className="text-xs text-muted-foreground">User</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Direction</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-xs text-muted-foreground">USD Value</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs text-muted-foreground text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ramps.isLoading ? (
                    <TableLoadingRows cols={7} />
                  ) : ramps.isError ? (
                    <TableErrorRow colSpan={7} onRetry={() => ramps.refetch()} message="Failed to load ramp orders." />
                  ) : (ramps.data?.items ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={7} message="No ramp orders match your filters." />
                  ) : (
                    (ramps.data?.items ?? []).map((o) => {
                      const isOn = o.direction === "onramp"
                      return (
                        <TableRow key={o.id} className="border-border">
                          <TableCell className="text-sm font-mono text-primary">{o.reference}</TableCell>
                          <TableCell className="text-sm text-foreground">{userLabel(o.user)}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 text-xs ${isOn ? "text-success" : "text-chart-2"}`}>
                              {isOn ? <ArrowDownLeft className="size-3" /> : <ArrowUpRight className="size-3" />}
                              {isOn ? "Onramp" : "Offramp"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm font-mono text-foreground">
                            {o.amount ? formatTokenAmount(o.amount, txTokenSymbol(o)) : "—"}
                          </TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">{formatUsd(o.usdValue)}</TableCell>
                          <TableCell>{rampStatusBadge(o.status)}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{formatDateTime(o.createdAt)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
              {!ramps.isLoading && !ramps.isError && (ramps.data?.total ?? 0) > 0 && (
                <TablePagination total={ramps.data!.total} limit={PAGE_SIZE} offset={rampOffset} onPageChange={setRampOffset} isFetching={ramps.isFetching} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Linked Banks */}
        <TabsContent value="banks" className="mt-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-medium text-foreground">Linked Bank Accounts</CardTitle>
                <Select
                  value={bankStatus}
                  onValueChange={(v) => {
                    setBankStatus(v)
                    setBankOffset(0)
                  }}
                >
                  <SelectTrigger className="h-8 w-[140px] bg-secondary border-border text-sm">
                    <Filter className="mr-1 size-3" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value={ALL}>All Status</SelectItem>
                    <SelectItem value="VERIFIED">Verified</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  ) : banks.isError ? (
                    <TableErrorRow colSpan={6} onRetry={() => banks.refetch()} message="Failed to load linked banks." />
                  ) : (banks.data?.items ?? []).length === 0 ? (
                    <TableEmptyRow colSpan={6} message="No linked bank accounts match your filters." />
                  ) : (
                    (banks.data?.items ?? []).map((b) => (
                      <TableRow key={b.id} className="border-border">
                        <TableCell className="text-sm text-foreground">{userLabel(b.user)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{b.bankName}</TableCell>
                        <TableCell className="text-sm font-mono text-foreground">{b.accountNumberMasked ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{b.accountName}</TableCell>
                        <TableCell className="text-sm text-foreground">{b.currency}</TableCell>
                        <TableCell className="text-right">{bankStatusBadge(b.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {!banks.isLoading && !banks.isError && (banks.data?.total ?? 0) > 0 && (
                <TablePagination total={banks.data!.total} limit={PAGE_SIZE} offset={bankOffset} onPageChange={setBankOffset} isFetching={banks.isFetching} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
