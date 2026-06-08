"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Search, Filter, Wallet, Layers, Coins, Network } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChainBadge } from "@/components/dashboard/chain-badge"
import {
  TableLoadingRows,
  TableEmptyRow,
  TableErrorRow,
  TablePagination,
} from "@/components/dashboard/data-state"
import { useMockData } from "@/hooks/useMockData"
import { WALLET_HOLDINGS, WALLET_STATS } from "@/mocks/wallets"
import { CHAINS } from "@/mocks/shared"
import { userById } from "@/mocks/shared"
import { formatNaira, formatToken, formatDelta, initialsFrom } from "@/lib/format"

const PAGE_SIZE = 8
const CHAIN_ALL = "all"

export function WalletsPage() {
  const [chain, setChain] = useState<string>(CHAIN_ALL)
  const [search, setSearch] = useState("")
  const [offset, setOffset] = useState(0)

  const holdings = useMockData(WALLET_HOLDINGS)
  const stats = useMockData(WALLET_STATS)

  const filtered = useMemo(() => {
    const rows = holdings.data ?? []
    const q = search.trim().toLowerCase()
    return rows.filter((h) => {
      const matchChain = chain === CHAIN_ALL || h.chainKey === chain
      const user = userById(h.userId)
      const matchSearch =
        !q ||
        h.symbol.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q) ||
        (user?.email.toLowerCase().includes(q) ?? false) ||
        (user?.name?.toLowerCase().includes(q) ?? false)
      return matchChain && matchSearch
    })
  }, [holdings.data, chain, search])

  const total = filtered.length
  const pageRows = filtered.slice(offset, offset + PAGE_SIZE)
  const colCount = 6
  const s = stats.data

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Wallets</h1>
        <p className="text-sm text-muted-foreground">Multi-chain crypto holdings across all user wallets.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Total Wallet Value" value={s ? formatNaira(s.totalWalletValueUsd) : "—"} icon={Wallet} isLoading={stats.isLoading} />
        <StatCard label="Tracked Wallets" value={s ? s.trackedWallets.toLocaleString() : "—"} icon={Layers} tone="primary" isLoading={stats.isLoading} />
        <StatCard label="Distinct Tokens" value={s ? s.distinctTokens.toLocaleString() : "—"} icon={Coins} isLoading={stats.isLoading} />
        <StatCard label="Active Chains" value={s ? s.activeChains.toLocaleString() : "—"} icon={Network} isLoading={stats.isLoading} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">Holdings</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search token or user..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setOffset(0)
                  }}
                  className="h-8 w-[200px] bg-secondary border-border pl-8 text-sm"
                />
              </div>
              <Select
                value={chain}
                onValueChange={(v) => {
                  setChain(v)
                  setOffset(0)
                }}
              >
                <SelectTrigger className="h-8 w-[150px] bg-secondary border-border text-sm">
                  <Filter className="mr-1 size-3" />
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={CHAIN_ALL}>All Chains</SelectItem>
                  {CHAINS.map((c) => (
                    <SelectItem key={c.key} value={c.key}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">User</TableHead>
                <TableHead className="text-xs text-muted-foreground">Chain</TableHead>
                <TableHead className="text-xs text-muted-foreground">Token</TableHead>
                <TableHead className="text-xs text-muted-foreground">Balance</TableHead>
                <TableHead className="text-xs text-muted-foreground">Value</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">24h</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.isLoading ? (
                <TableLoadingRows cols={colCount} />
              ) : holdings.isError ? (
                <TableErrorRow colSpan={colCount} message="Failed to load wallet holdings." />
              ) : pageRows.length === 0 ? (
                <TableEmptyRow colSpan={colCount} message="No holdings match your filters." />
              ) : (
                pageRows.map((h) => {
                  const user = userById(h.userId)
                  return (
                    <TableRow key={h.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                              {initialsFrom(user?.name ?? user?.username ?? user?.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{user?.name ?? user?.username ?? "—"}</span>
                            <span className="text-xs text-muted-foreground font-mono">{user?.walletAddress}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><ChainBadge chainKey={h.chainKey} /></TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{h.symbol}</span>
                          <span className="text-xs text-muted-foreground">{h.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-foreground">{formatToken(h.balance, h.symbol)}</TableCell>
                      <TableCell className="text-sm font-mono text-foreground">{formatNaira(h.valueUsd)}</TableCell>
                      <TableCell className={`text-right text-xs font-medium ${h.variation24h >= 0 ? "text-success" : "text-destructive"}`}>
                        {formatDelta(h.variation24h)}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
          {!holdings.isLoading && !holdings.isError && total > 0 && (
            <TablePagination total={total} limit={PAGE_SIZE} offset={offset} onPageChange={setOffset} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
