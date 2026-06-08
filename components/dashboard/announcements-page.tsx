"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Megaphone, CalendarClock, MailOpen, Send, Plus, CheckCircle2 } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { TableLoadingRows, TableEmptyRow } from "@/components/dashboard/data-state"
import { useMockData } from "@/hooks/useMockData"
import { formatNumber } from "@/lib/format"
import {
  ANNOUNCEMENT_STATS,
  CAMPAIGNS,
  SEGMENT_LABELS,
  type Campaign,
  type CampaignStatus,
  type AudienceSegment,
  type CampaignChannel,
} from "@/mocks/announcements"

function statusBadge(status: CampaignStatus) {
  const map: Record<CampaignStatus, string> = {
    sent: "bg-success/10 text-success border-success/20",
    sending: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    scheduled: "bg-warning/10 text-warning border-warning/20",
    draft: "bg-muted text-muted-foreground border-border",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[status]}`}>{status}</Badge>
}

function openRate(c: Campaign): string {
  if (c.delivered === 0) return "—"
  return `${Math.round((c.opened / c.delivered) * 100)}%`
}

export function AnnouncementsPage() {
  const stats = useMockData(ANNOUNCEMENT_STATS)
  const campaigns = useMockData(CAMPAIGNS)
  const s = stats.data

  const [open, setOpen] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [channel, setChannel] = useState<CampaignChannel>("push")
  const [segment, setSegment] = useState<AudienceSegment>("all_users")

  function resetForm() {
    setTitle("")
    setBody("")
    setChannel("push")
    setSegment("all_users")
  }

  function handleSave() {
    // UI-only: no persistence. Show a confirmation and reset.
    setJustSaved(true)
    resetForm()
    setTimeout(() => {
      setJustSaved(false)
      setOpen(false)
    }, 1100)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground">Announcements</h1>
          <p className="text-sm text-muted-foreground">Broadcast push, in-app, and email campaigns to user segments.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-1 size-4" /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Campaigns" value={s ? s.totalCampaigns.toLocaleString() : "—"} icon={Megaphone} isLoading={stats.isLoading} />
        <StatCard label="Scheduled" value={s ? s.scheduled.toLocaleString() : "—"} icon={CalendarClock} tone="warning" isLoading={stats.isLoading} />
        <StatCard label="Avg Open Rate" value={s ? `${s.avgOpenRate}%` : "—"} icon={MailOpen} tone="primary" isLoading={stats.isLoading} />
        <StatCard label="Reach (30d)" value={s ? formatNumber(s.reach30d) : "—"} icon={Send} isLoading={stats.isLoading} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Campaign</TableHead>
                <TableHead className="text-xs text-muted-foreground">Channel</TableHead>
                <TableHead className="text-xs text-muted-foreground">Segment</TableHead>
                <TableHead className="text-xs text-muted-foreground">Audience</TableHead>
                <TableHead className="text-xs text-muted-foreground">Open Rate</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.isLoading ? (
                <TableLoadingRows cols={6} />
              ) : (campaigns.data ?? []).length === 0 ? (
                <TableEmptyRow colSpan={6} message="No campaigns yet." />
              ) : (
                (campaigns.data ?? []).map((c) => (
                  <TableRow key={c.id} className="border-border">
                    <TableCell className="max-w-[320px]">
                      <div className="flex flex-col">
                        <span className="truncate text-sm font-medium text-foreground">{c.title}</span>
                        <span className="truncate text-xs text-muted-foreground">{c.body}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">{c.channel.replace("_", "-")}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{SEGMENT_LABELS[c.segment]}</TableCell>
                    <TableCell className="text-sm text-foreground">{formatNumber(c.audienceSize)}</TableCell>
                    <TableCell className="text-sm text-foreground">{openRate(c)}</TableCell>
                    <TableCell className="text-right">{statusBadge(c.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compose sheet — UI only, no persistence */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col gap-0 border-border bg-card sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-foreground">New Campaign</SheetTitle>
            <SheetDescription>Compose a broadcast. This is a preview — drafts are not persisted.</SheetDescription>
          </SheetHeader>

          {justSaved ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <CheckCircle2 className="size-8 text-success" />
              <p className="text-sm text-foreground">Campaign queued</p>
              <p className="text-xs text-muted-foreground">(preview only — nothing was sent)</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-foreground">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Borrow against your crypto" className="bg-secondary border-border" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-foreground">Message</Label>
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the notification body…" className="min-h-[100px] bg-secondary border-border" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-foreground">Channel</Label>
                <Select value={channel} onValueChange={(v) => setChannel(v as CampaignChannel)}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="in_app">In-app</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-foreground">Audience</Label>
                <Select value={segment} onValueChange={(v) => setSegment(v as AudienceSegment)}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {(Object.keys(SEGMENT_LABELS) as AudienceSegment[]).map((k) => (
                      <SelectItem key={k} value={k}>{SEGMENT_LABELS[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {!justSaved && (
            <SheetFooter className="flex-row gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-border bg-secondary text-foreground">Cancel</Button>
              <Button onClick={handleSave} disabled={!title.trim() || !body.trim()} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Schedule
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
