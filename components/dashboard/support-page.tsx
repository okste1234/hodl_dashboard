"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LifeBuoy, AlertTriangle, Clock, CheckCircle, Filter } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { TableLoadingRows, TableEmptyRow } from "@/components/dashboard/data-state"
import { useMockData } from "@/hooks/useMockData"
import { userById } from "@/mocks/shared"
import { formatDateTime } from "@/lib/format"
import {
  SUPPORT_STATS,
  SUPPORT_TICKETS,
  type SupportTicket,
  type TicketStatus,
  type TicketPriority,
} from "@/mocks/support"

const STATUS_ALL = "all"
const PRIORITY_ALL = "all"

function priorityBadge(p: TicketPriority) {
  const map: Record<TicketPriority, string> = {
    urgent: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-warning/10 text-warning border-warning/20",
    medium: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    low: "bg-muted text-muted-foreground border-border",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[p]}`}>{p}</Badge>
}

function statusBadge(st: TicketStatus) {
  const map: Record<TicketStatus, string> = {
    open: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    resolved: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    closed: "bg-muted text-muted-foreground border-border",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[st]}`}>{st}</Badge>
}

export function SupportPage() {
  const stats = useMockData(SUPPORT_STATS)
  const tickets = useMockData(SUPPORT_TICKETS)
  const s = stats.data

  const [status, setStatus] = useState<string>(STATUS_ALL)
  const [priority, setPriority] = useState<string>(PRIORITY_ALL)
  const [selected, setSelected] = useState<SupportTicket | null>(null)

  const filtered = useMemo(() => {
    return (tickets.data ?? []).filter((t) => {
      const matchStatus = status === STATUS_ALL || t.status === status
      const matchPriority = priority === PRIORITY_ALL || t.priority === priority
      return matchStatus && matchPriority
    })
  }, [tickets.data, status, priority])

  const colCount = 6

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Support</h1>
        <p className="text-sm text-muted-foreground">User support ticket queue, priorities, and SLA tracking.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Open" value={s ? s.openTickets.toLocaleString() : "—"} icon={LifeBuoy} tone="success" isLoading={stats.isLoading} />
        <StatCard label="SLA Breaches" value={s ? s.slaBreaches.toLocaleString() : "—"} icon={AlertTriangle} tone="destructive" isLoading={stats.isLoading} />
        <StatCard label="Pending" value={s ? s.pending.toLocaleString() : "—"} icon={Clock} tone="warning" isLoading={stats.isLoading} />
        <StatCard label="Resolved Today" value={s ? s.resolvedToday.toLocaleString() : "—"} icon={CheckCircle} tone="primary" isLoading={stats.isLoading} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">Ticket Queue</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 w-[130px] bg-secondary border-border text-sm">
                  <Filter className="mr-1 size-3" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={STATUS_ALL}>All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-8 w-[130px] bg-secondary border-border text-sm">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={PRIORITY_ALL}>All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Ref</TableHead>
                <TableHead className="text-xs text-muted-foreground">User</TableHead>
                <TableHead className="text-xs text-muted-foreground">Subject</TableHead>
                <TableHead className="text-xs text-muted-foreground">Priority</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.isLoading ? (
                <TableLoadingRows cols={colCount} />
              ) : filtered.length === 0 ? (
                <TableEmptyRow colSpan={colCount} message="No tickets match your filters." />
              ) : (
                filtered.map((t) => {
                  const user = userById(t.userId)
                  return (
                    <TableRow
                      key={t.id}
                      className="cursor-pointer border-border"
                      onClick={() => setSelected(t)}
                    >
                      <TableCell className="text-sm font-mono text-primary">{t.reference}</TableCell>
                      <TableCell className="text-sm text-foreground">{user?.name ?? user?.email ?? "—"}</TableCell>
                      <TableCell className="max-w-[280px]">
                        <div className="flex items-center gap-2">
                          {t.slaBreached && <AlertTriangle className="size-3 shrink-0 text-destructive" />}
                          <span className="truncate text-sm text-foreground">{t.subject}</span>
                        </div>
                      </TableCell>
                      <TableCell>{priorityBadge(t.priority)}</TableCell>
                      <TableCell>{statusBadge(t.status)}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{formatDateTime(t.updatedAt)}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ticket detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="flex w-full flex-col gap-0 border-border bg-card sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-foreground">{selected.reference}</SheetTitle>
                  {priorityBadge(selected.priority)}
                  {statusBadge(selected.status)}
                </div>
                <SheetDescription>{selected.subject}</SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">User</span>
                    <span className="text-foreground">{userById(selected.userId)?.email ?? "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Category</span>
                    <span className="capitalize text-foreground">{selected.category}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Assignee</span>
                    <span className="text-foreground">{selected.assignee ?? "Unassigned"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Opened</span>
                    <span className="text-foreground">{formatDateTime(selected.createdAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {selected.thread.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col gap-1 rounded-lg border p-3 ${
                        m.author === "agent"
                          ? "border-primary/20 bg-primary/5"
                          : "border-border bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium capitalize text-foreground">{m.author}</span>
                        <span className="text-[10px] text-muted-foreground">{formatDateTime(m.at)}</span>
                      </div>
                      <p className="text-sm text-foreground">{m.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="flex-col gap-2">
                <Textarea placeholder="Write a reply…" className="min-h-[72px] bg-secondary border-border" />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-border bg-secondary text-foreground">Resolve</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Reply</Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
