"use client"

import { useEffect, useMemo, useState } from "react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Download, MoreHorizontal, Shield, Ban, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUsers } from "@/hooks/useUsers"
import { UserKycStatus, type AdminUserItem } from "@/types/admin"
import { formatUsd, formatDate, initialsFrom, userDisplayName } from "@/lib/format"
import {
  TableLoadingRows,
  TableEmptyRow,
  TableErrorRow,
  TablePagination,
} from "@/components/dashboard/data-state"
import { UserDetailSheet } from "@/components/dashboard/user-detail-sheet"

const PAGE_SIZE = 20
const KYC_ALL = "all"

function getKycBadge(kyc: string) {
  const k = kyc?.toUpperCase()
  if (k === "VERIFIED") {
    return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Verified</Badge>
  }
  if (k === "REJECTED") {
    return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Rejected</Badge>
  }
  if (k === "NOT_STARTED") {
    return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">Not started</Badge>
  }
  // TIER_0 / TIER_1 / TIER_2 and anything in-progress
  return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">{kyc || "—"}</Badge>
}

function getStatusBadge(status: string) {
  if (status === "Suspended") {
    return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Suspended</Badge>
  }
  return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Active</Badge>
}

function exportCsv(rows: AdminUserItem[]) {
  const header = ["id", "name", "username", "email", "kycStatus", "status", "joinedAt", "walletUsd", "vaultUsd", "loansCount"]
  const body = rows.map((r) =>
    [r.id, r.name ?? "", r.username ?? "", r.email, r.kycStatus, r.status, r.joinedAt, r.walletUsd, r.vaultUsd, r.loansCount]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  )
  const csv = [header.join(","), ...body].join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const a = document.createElement("a")
  a.href = url
  a.download = "users.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export function UsersPage() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [kycStatus, setKycStatus] = useState<string>(KYC_ALL)
  const [offset, setOffset] = useState(0)

  // Debounce search input → server query, resetting to the first page on change.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setOffset(0)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const filters = useMemo(
    () => ({
      search: search || undefined,
      kycStatus: kycStatus === KYC_ALL ? undefined : (kycStatus as UserKycStatus),
      limit: PAGE_SIZE,
      offset,
    }),
    [search, kycStatus, offset]
  )

  const { data, isLoading, isError, isFetching, refetch } = useUsers(filters)
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null)

  const stats = data?.stats
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const colCount = 8

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">Manage all registered users, KYC status, and account details.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Users</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stats ? stats.totalUsers.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Today</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{stats ? stats.activeToday.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">KYC Pending</p>
            <p className="mt-1 text-2xl font-semibold text-warning">{stats ? stats.kycPending.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Suspended</p>
            <p className="mt-1 text-2xl font-semibold text-destructive">{stats ? stats.suspended.toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">All Users</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-8 w-[200px] bg-secondary border-border pl-8 text-sm"
                />
              </div>
              <Select
                value={kycStatus}
                onValueChange={(v) => {
                  setKycStatus(v)
                  setOffset(0)
                }}
              >
                <SelectTrigger className="h-8 w-[140px] bg-secondary border-border text-sm">
                  <Filter className="mr-1 size-3" />
                  <SelectValue placeholder="KYC Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={KYC_ALL}>All KYC</SelectItem>
                  {Object.values(UserKycStatus).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
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
                <TableHead className="text-xs text-muted-foreground">User</TableHead>
                <TableHead className="text-xs text-muted-foreground">Wallet</TableHead>
                <TableHead className="text-xs text-muted-foreground">Vault</TableHead>
                <TableHead className="text-xs text-muted-foreground">Loans</TableHead>
                <TableHead className="text-xs text-muted-foreground">KYC</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground">Joined</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoadingRows cols={colCount} />
              ) : isError ? (
                <TableErrorRow colSpan={colCount} onRetry={() => refetch()} message="Failed to load users." />
              ) : items.length === 0 ? (
                <TableEmptyRow colSpan={colCount} message="No users match your filters." />
              ) : (
                items.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                            {initialsFrom(user.name ?? user.username ?? user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{userDisplayName(user.name ?? user.username, user.email)}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-foreground">{formatUsd(user.walletUsd)}</TableCell>
                    <TableCell className="text-sm font-mono text-foreground">{formatUsd(user.vaultUsd)}</TableCell>
                    <TableCell className="text-sm text-foreground">{user.loansCount}</TableCell>
                    <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(user.joinedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="size-7 p-0 text-muted-foreground">
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem className="text-foreground" onClick={() => setSelectedUser(user)}>
                            <Eye className="mr-2 size-3.5" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground">
                            <Shield className="mr-2 size-3.5" /> Verify KYC
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="mr-2 size-3.5" /> Suspend
                          </DropdownMenuItem>
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

      <UserDetailSheet user={selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)} />
    </div>
  )
}
