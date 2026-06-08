"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const pageTitles: Record<string, { title: string; description: string }> = {
  overview: { title: "Dashboard Overview", description: "Platform-wide metrics and real-time activity" },
  users: { title: "User Management", description: "Manage users, KYC, and accounts" },
  wallets: { title: "Wallets", description: "Multi-chain crypto holdings" },
  loans: { title: "Loan Management", description: "Monitor and manage all platform loans" },
  transactions: { title: "Transactions", description: "Real-time transaction monitoring" },
  vaults: { title: "Vaults & Earnings", description: "Vault performance and earnings" },
  yield: { title: "Yield Markets", description: "DeFi yield protocols and positions" },
  cash: { title: "Cash & Ramps", description: "USD accounts and fiat ramps" },
  referrals: { title: "Referrals", description: "Referral program and rewards" },
  announcements: { title: "Announcements", description: "Broadcast campaigns" },
  support: { title: "Support", description: "User support ticket queue" },
  compliance: { title: "Compliance", description: "KYC queue and AML alerts" },
  analytics: { title: "Analytics", description: "Platform analytics and insights" },
  settings: { title: "Settings", description: "Platform configuration" },
}

interface DashboardHeaderProps {
  activeTab: string
}

export function DashboardHeader({ activeTab }: DashboardHeaderProps) {
  const page = pageTitles[activeTab] || pageTitles.overview

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-5 bg-border" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-foreground">{page.title}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">{page.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search anything..."
              className="h-8 w-[200px] bg-secondary border-border pl-8 text-sm"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative size-8 text-muted-foreground hover:text-foreground">
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">5</span>
          </Button>
          <Badge variant="outline" className="hidden border-success/20 bg-success/10 text-success text-[10px] sm:inline-flex">
            System Healthy
          </Badge>
        </div>
      </div>
    </header>
  )
}
