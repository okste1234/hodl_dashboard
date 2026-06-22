"use client"

import { useMemo, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, Filter, Inbox } from "lucide-react"
import { useCompliance } from "@/hooks/useCompliance"
import { ComplianceKycStatus, type AdminKycItem } from "@/types/admin"
import { formatDate, userDisplayName } from "@/lib/format"
import {
  TableLoadingRows,
  TableEmptyRow,
  TableErrorRow,
  TablePagination,
} from "@/components/dashboard/data-state"
import { KycReviewSheet } from "@/components/dashboard/kyc-review-sheet"

const PAGE_SIZE = 20
const STATUS_ALL = "all"

function getKycStatusBadge(status: string) {
  const s = status?.toLowerCase()
  if (s === "approved" || s === "completed") {
    return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] capitalize">{status}</Badge>
  }
  if (s === "declined" || s === "failed" || s === "expired") {
    return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] capitalize">{status}</Badge>
  }
  // created / pending
  return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px] capitalize">{status || "—"}</Badge>
}

export function CompliancePage() {
  const [status, setStatus] = useState<string>(STATUS_ALL)
  const [offset, setOffset] = useState(0)
  const [selectedKyc, setSelectedKyc] = useState<AdminKycItem | null>(null)

  const filters = useMemo(
    () => ({
      status: status === STATUS_ALL ? undefined : (status as ComplianceKycStatus),
      limit: PAGE_SIZE,
      offset,
    }),
    [status, offset]
  )

  const { data, isLoading, isError, isFetching, refetch } = useCompliance(filters)

  const stats = data?.stats
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const colCount = 5

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
            <p className="mt-1 text-2xl font-semibold text-warning">{stats ? stats.totalKycPending.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Flagged Tx</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-destructive">{stats ? stats.flaggedTransactions.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-success" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Verified Today</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-success">{stats ? stats.usersVerifiedToday.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk Score</p>
            </div>
            <p className="mt-1 text-2xl font-semibold text-primary">{stats ? stats.riskedScore : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">KYC Verification Queue</CardTitle>
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
                {Object.values(ComplianceKycStatus).map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">User</TableHead>
                <TableHead className="text-xs text-muted-foreground">KYC Tier</TableHead>
                <TableHead className="text-xs text-muted-foreground">Submitted</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoadingRows cols={colCount} />
              ) : isError ? (
                <TableErrorRow colSpan={colCount} onRetry={() => refetch()} message="Failed to load KYC requests." />
              ) : items.length === 0 ? (
                <TableEmptyRow colSpan={colCount} message="No KYC requests match your filters." />
              ) : (
                items.map((req, i) => (
                  <TableRow key={`${req.user.email}-${i}`} className="border-border">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">{userDisplayName(req.user.name, req.user.email)}</span>
                        <span className="text-xs text-muted-foreground">{req.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">{req.kycTier?.replace(/_/g, " ") ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(req.createdAt)}</TableCell>
                    <TableCell>{getKycStatusBadge(req.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Opens the KYC review sheet. Approve/Reject inside it are UI-only
                            until the backend KYC-review route is added. */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedKyc(req)}
                          className="h-7 text-xs text-foreground"
                        >
                          <Eye className="mr-1 size-3" /> Review
                        </Button>
                      </div>
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

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">Flagged Transactions (AML)</CardTitle>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">
              {stats ? `${stats.flaggedTransactions} alerts` : "—"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Inbox className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No AML alerts feed available yet.</p>
            <p className="text-xs text-muted-foreground">
              The dedicated alerts endpoint is not exposed by the backend. Flagged count above is sourced from compliance stats.
            </p>
          </div>
        </CardContent>
      </Card>

      <KycReviewSheet request={selectedKyc} onOpenChange={(open) => !open && setSelectedKyc(null)} />
    </div>
  )
}
