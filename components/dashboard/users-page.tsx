"use client"

import { useState } from "react"
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

const users = [
  { id: "USR-001", name: "Jasper Okwu", email: "jasper@mail.com", wallet: "$22,199.09", vault: "$22,199.00", loans: 2, status: "active", kyc: "verified", joined: "Jan 12, 2025" },
  { id: "USR-002", name: "Amara Obi", email: "amara@mail.com", wallet: "$15,420.50", vault: "$45,000.00", loans: 1, status: "active", kyc: "verified", joined: "Feb 08, 2025" },
  { id: "USR-003", name: "Kola Adeyemi", email: "kola@mail.com", wallet: "$8,750.00", vault: "$12,300.00", loans: 0, status: "active", kyc: "pending", joined: "Mar 15, 2025" },
  { id: "USR-004", name: "Fatima Bello", email: "fatima@mail.com", wallet: "$31,200.00", vault: "$68,500.00", loans: 3, status: "active", kyc: "verified", joined: "Jan 22, 2025" },
  { id: "USR-005", name: "Chidi Eze", email: "chidi@mail.com", wallet: "$2,100.00", vault: "$5,000.00", loans: 1, status: "suspended", kyc: "verified", joined: "Apr 01, 2025" },
  { id: "USR-006", name: "Ngozi Mba", email: "ngozi@mail.com", wallet: "$54,800.00", vault: "$120,000.00", loans: 4, status: "active", kyc: "verified", joined: "Dec 18, 2024" },
  { id: "USR-007", name: "Emeka Udo", email: "emeka@mail.com", wallet: "$900.00", vault: "$0.00", loans: 0, status: "active", kyc: "rejected", joined: "May 03, 2025" },
  { id: "USR-008", name: "Aisha Suleiman", email: "aisha@mail.com", wallet: "$18,600.00", vault: "$35,750.00", loans: 2, status: "active", kyc: "verified", joined: "Feb 28, 2025" },
]

function getKycBadge(kyc: string) {
  switch (kyc) {
    case "verified":
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Verified</Badge>
    case "pending":
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">Pending</Badge>
    case "rejected":
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Rejected</Badge>
    default:
      return null
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Active</Badge>
    case "suspended":
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Suspended</Badge>
    default:
      return null
  }
}

export function UsersPage() {
  const [search, setSearch] = useState("")

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  )

  const { data: usersData } = useUsers()
  console.log(useState);
  
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
            <p className="mt-1 text-2xl font-semibold text-foreground">24,521</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Today</p>
            <p className="mt-1 text-2xl font-semibold text-primary">8,432</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">KYC Pending</p>
            <p className="mt-1 text-2xl font-semibold text-warning">342</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Suspended</p>
            <p className="mt-1 text-2xl font-semibold text-destructive">18</p>
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-[200px] bg-secondary border-border pl-8 text-sm"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 w-[120px] bg-secondary border-border text-sm">
                  <Filter className="mr-1 size-3" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 border-border bg-secondary text-foreground">
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
              {filtered.map((user) => (
                <TableRow key={user.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono text-foreground">{user.wallet}</TableCell>
                  <TableCell className="text-sm font-mono text-foreground">{user.vault}</TableCell>
                  <TableCell className="text-sm text-foreground">{user.loans}</TableCell>
                  <TableCell>{getKycBadge(user.kyc)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="size-7 p-0 text-muted-foreground">
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem className="text-foreground">
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
