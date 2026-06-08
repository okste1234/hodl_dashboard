"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type Tone = "default" | "primary" | "success" | "warning" | "destructive"

const toneClass: Record<Tone, string> = {
  default: "text-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
}

export type StatCardProps = {
  label: string
  value: string | number
  sub?: string
  icon?: LucideIcon
  tone?: Tone
  isLoading?: boolean
}

/**
 * Shared KPI card matching the existing dashboard stat-card pattern (used across
 * Users/Loans/Transactions/etc.) so new screens stay visually consistent.
 */
export function StatCard({ label, value, sub, icon: Icon, tone = "default", isLoading }: StatCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-primary" />}
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        </div>
        {isLoading ? (
          <Skeleton className="mt-2 h-7 w-24 bg-secondary" />
        ) : (
          <p className={cn("mt-1 text-2xl font-semibold", toneClass[tone])}>{value}</p>
        )}
        {sub && !isLoading && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}
