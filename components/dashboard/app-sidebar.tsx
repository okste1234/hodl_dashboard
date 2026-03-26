"use client"

import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  Vault,
  Settings,
  Shield,
  TrendingUp,
  LogOut,
  Bell,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const mainNav = [
  { title: "Overview", icon: LayoutDashboard, id: "overview", badge: null },
  { title: "Users", icon: Users, id: "users", badge: "2.4k" },
  { title: "Loans", icon: CreditCard, id: "loans", badge: "156" },
  { title: "Transactions", icon: ArrowLeftRight, id: "transactions", badge: "3.2k" },
  { title: "Vaults & Earnings", icon: Vault, id: "vaults", badge: null },
]

const secondaryNav = [
  { title: "Compliance", icon: Shield, id: "compliance", badge: "3" },
  { title: "Analytics", icon: TrendingUp, id: "analytics", badge: null },
  { title: "Settings", icon: Settings, id: "settings", badge: null },
]

type Admin = {
  id: string;
  email: string;
  name: string;
};

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const queryClient = useQueryClient();

  const { data: admin } = useQuery<Admin>({
    queryKey: ["admin"],
    initialData: () => queryClient.getQueryData(["admin"]), // optional
    enabled: false,
  });
  console.log("Admin data in sidebar:", admin) // Debug log to check admin data
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
            <img src="/logos/App_Icon.png" className="w-6 h-6" alt="HODL" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notifications">
              <Bell className="size-4" />
              <span>Notifications</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>5</SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Admin Account">
              <Avatar className="size-6">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{admin?.name || "Admin"}</span>
                <span className="text-xs text-muted-foreground">{admin?.email || "@.com"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" className="text-muted-foreground hover:text-destructive">
              <LogOut className="size-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
