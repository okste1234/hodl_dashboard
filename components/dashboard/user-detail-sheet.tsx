"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChainBadge } from "@/components/dashboard/chain-badge"
import type { AdminUserItem } from "@/types/admin"
import { buildUserDetail } from "@/mocks/user-detail"
import { formatUsd, formatDate, formatDateTime, initialsFrom, userDisplayName } from "@/lib/format"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

/**
 * 360° user detail. The header fields come from the REAL Users API row; the
 * wallet/loan/activity panels are illustrative mock detail (no backend endpoint).
 */
export function UserDetailSheet({
  user,
  onOpenChange,
}: {
  user: AdminUserItem | null
  onOpenChange: (open: boolean) => void
}) {
  const detail = user ? buildUserDetail({ email: user.email }) : null

  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 border-border bg-card sm:max-w-lg">
        {user && detail && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {initialsFrom(user.name ?? user.username ?? user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <SheetTitle className="text-foreground">{userDisplayName(user.name ?? user.username, user.email)}</SheetTitle>
                  <SheetDescription>{user.email}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              {/* Account summary (real API data) */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Wallet</span>
                  <span className="font-mono text-foreground">{formatUsd(user.walletUsd)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Vault</span>
                  <span className="font-mono text-foreground">{formatUsd(user.vaultUsd)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">KYC</span>
                  <span className="text-foreground">{user.kycStatus}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className="text-foreground">{user.status}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Loans</span>
                  <span className="text-foreground">{user.loansCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Joined</span>
                  <span className="text-foreground">{formatDate(user.joinedAt)}</span>
                </div>
              </div>

              <Section title="Security & Profile">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-border bg-secondary/50 text-[10px] text-muted-foreground">
                    {detail.country}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] ${detail.pinSet ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}`}>
                    PIN {detail.pinSet ? "set" : "not set"}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] ${detail.twoFactor ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}`}>
                    2FA {detail.twoFactor ? "on" : "off"}
                  </Badge>
                  <Badge variant="outline" className="border-border bg-secondary/50 font-mono text-[10px] text-muted-foreground">
                    {detail.walletAddress}
                  </Badge>
                </div>
              </Section>

              <Section title="Wallets">
                <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
                  {detail.wallets.map((w, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5">
                      <div className="flex items-center gap-2">
                        <ChainBadge chainKey={w.chain.toLowerCase()} />
                        <span className="text-sm text-foreground">{w.symbol}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-mono text-foreground">{formatUsd(w.valueUsd)}</span>
                        <span className="text-[10px] text-muted-foreground">{w.balance} {w.symbol}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Loans">
                <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
                  {detail.loans.map((l) => (
                    <div key={l.loanId} className="flex items-center justify-between p-2.5">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm text-primary">{l.loanId}</span>
                        <span className="text-[10px] text-muted-foreground">Collateral: {l.collateral}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-foreground">{formatUsd(l.borrowedUsd)}</span>
                        <Badge variant="outline" className={`text-[10px] ${l.status === "ACTIVE" ? "bg-success/10 text-success border-success/20" : "bg-chart-2/10 text-chart-2 border-chart-2/20"}`}>
                          {l.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Recent Activity">
                <div className="flex flex-col gap-2">
                  {detail.activity.map((a, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{a.label}</span>
                      <span className="text-[10px] text-muted-foreground">{formatDateTime(a.at)}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <p className="text-[10px] text-muted-foreground">
                Wallet, loan and activity panels are illustrative — no per-user detail endpoint exists yet.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
