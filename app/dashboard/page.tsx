"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OverviewPage } from "@/components/dashboard/overview-page"
import { UsersPage } from "@/components/dashboard/users-page"
import { LoansPage } from "@/components/dashboard/loans-page"
import { TransactionsPage } from "@/components/dashboard/transactions-page"
import { VaultsPage } from "@/components/dashboard/vaults-page"
import { CompliancePage } from "@/components/dashboard/compliance-page"
import { AnalyticsPage } from "@/components/dashboard/analytics-page"
import { SettingsPage } from "@/components/dashboard/settings-page"
import { ScrollArea } from "@/components/ui/scroll-area"

function DashboardContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case "overview":
      return <OverviewPage />
    case "users":
      return <UsersPage />
    case "loans":
      return <LoansPage />
    case "transactions":
      return <TransactionsPage />
    case "vaults":
      return <VaultsPage />
    case "compliance":
      return <CompliancePage />
    case "analytics":
      return <AnalyticsPage />
    case "settings":
      return <SettingsPage />
    default:
      return <OverviewPage />
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <DashboardHeader activeTab={activeTab} />
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6">
            <DashboardContent activeTab={activeTab} />
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
