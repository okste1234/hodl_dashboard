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
  Wallet,
  Sprout,
  Banknote,
  Gift,
  Megaphone,
  LifeBuoy,
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
import { logout } from "@/lib/auth"

const mainNav = [
  { title: "Overview", icon: LayoutDashboard, id: "overview", badge: null },
  { title: "Users", icon: Users, id: "users", badge: null },
  { title: "Wallets", icon: Wallet, id: "wallets", badge: null },
  { title: "Loans", icon: CreditCard, id: "loans", badge: null },
  { title: "Transactions", icon: ArrowLeftRight, id: "transactions", badge: null },
  { title: "Vaults & Earnings", icon: Vault, id: "vaults", badge: null },
  { title: "Yield Markets", icon: Sprout, id: "yield", badge: null },
  { title: "Cash & Ramps", icon: Banknote, id: "cash", badge: null },
]

const growthNav = [
  { title: "Referrals", icon: Gift, id: "referrals", badge: null },
  { title: "Announcements", icon: Megaphone, id: "announcements", badge: null },
  { title: "Support", icon: LifeBuoy, id: "support", badge: null },
]

const secondaryNav = [
  { title: "Compliance", icon: Shield, id: "compliance", badge: null },
  { title: "Analytics", icon: TrendingUp, id: "analytics", badge: null },
  { title: "Settings", icon: Settings, id: "settings", badge: null },
]

type Admin = {
  id: string;
  email: string;
  name: string | null;
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

  const handleLogout = () => {
    queryClient.clear()
    logout()
  }

  const initials = admin?.name
    ? admin.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD"

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
          <SidebarGroupLabel>Growth</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {growthNav.map((item) => (
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
                <AvatarFallback className="bg-primary/20 text-primary text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{admin?.name || "Admin"}</span>
                <span className="text-xs text-muted-foreground">{admin?.email || "@.com"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
