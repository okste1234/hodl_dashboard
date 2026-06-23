"use client"

import { useEffect, useMemo, useState } from "react"
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
import { useWalletHoldings } from "@/hooks/useWallets"
import { formatUsd, formatTokenAmount, initialsFrom, userDisplayName } from "@/lib/format"

const PAGE_SIZE = 20
const CHAIN_ALL = "all"

function prettyChain(network: string): string {
  return network.charAt(0) + network.slice(1).toLowerCase()
}

export function WalletsPage() {
  const [chain, setChain] = useState<string>(CHAIN_ALL)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [offset, setOffset] = useState(0)

  // Debounce search → server query, resetting to the first page on change.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setOffset(0)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const filters = useMemo(
    () => ({
      network: chain === CHAIN_ALL ? undefined : chain,
      search: search || undefined,
      limit: PAGE_SIZE,
      offset,
    }),
    [chain, search, offset]
  )

  const { data, isLoading, isError, isFetching, refetch } = useWalletHoldings(filters)

  const stats = data?.stats
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const chains = data?.chains ?? []
  const colCount = 5

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Wallets</h1>
        <p className="text-sm text-muted-foreground">Multi-chain crypto holdings across all user wallets.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Total Wallet Value" value={stats ? formatUsd(stats.totalWalletValueUsd) : "—"} icon={Wallet} isLoading={isLoading} />
        <StatCard label="Tracked Wallets" value={stats ? stats.trackedWallets.toLocaleString() : "—"} icon={Layers} tone="primary" isLoading={isLoading} />
        <StatCard label="Distinct Tokens" value={stats ? stats.distinctTokens.toLocaleString() : "—"} icon={Coins} isLoading={isLoading} />
        <StatCard label="Active Chains" value={stats ? stats.activeChains.toLocaleString() : "—"} icon={Network} isLoading={isLoading} />
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
                  {chains.map((c) => (
                    <SelectItem key={c} value={c}>{prettyChain(c)}</SelectItem>
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
                <TableHead className="text-xs text-muted-foreground text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoadingRows cols={colCount} />
              ) : isError ? (
                <TableErrorRow colSpan={colCount} onRetry={() => refetch()} message="Failed to load wallet holdings." />
              ) : items.length === 0 ? (
                <TableEmptyRow colSpan={colCount} message="No holdings match your filters." />
              ) : (
                items.map((h) => (
                  <TableRow key={h.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                            {initialsFrom(h.user?.name ?? h.user?.email ?? "?")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {h.user ? userDisplayName(h.user.name, h.user.email) : "—"}
                          </span>
                          {h.walletAddress && (
                            <span className="text-xs text-muted-foreground font-mono">{h.walletAddress}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><ChainBadge chainKey={h.network.toLowerCase()} /></TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{h.symbol}</TableCell>
                    <TableCell className="text-sm font-mono text-foreground">{formatTokenAmount(h.balance, h.symbol)}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-foreground">{formatUsd(h.usdValue)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!isLoading && !isError && total > 0 && (
            <TablePagination total={total} limit={PAGE_SIZE} offset={offset} onPageChange={setOffset} isFetching={isFetching} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
