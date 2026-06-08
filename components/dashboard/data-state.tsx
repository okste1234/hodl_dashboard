"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"
import { AlertCircle, Inbox } from "lucide-react"

/** Skeleton placeholder rows shown while a table query is loading. */
export function TableLoadingRows({ rows = 6, cols }: { rows?: number; cols: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <TableRow key={r} className="border-border hover:bg-transparent">
          {Array.from({ length: cols }).map((_, c) => (
            <TableCell key={c}>
              <Skeleton className="h-4 w-full max-w-[120px] bg-secondary" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

/** Full-width message row (error / empty) spanning every column. */
export function TableMessageRow({
  colSpan,
  children,
}: {
  colSpan: number
  children: React.ReactNode
}) {
  return (
    <TableRow className="border-border hover:bg-transparent">
      <TableCell colSpan={colSpan} className="py-10">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {children}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function TableEmptyRow({
  colSpan,
  message = "No records found.",
}: {
  colSpan: number
  message?: string
}) {
  return (
    <TableMessageRow colSpan={colSpan}>
      <Inbox className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </TableMessageRow>
  )
}

export function TableErrorRow({
  colSpan,
  onRetry,
  message = "Failed to load data.",
}: {
  colSpan: number
  onRetry?: () => void
  message?: string
}) {
  return (
    <TableMessageRow colSpan={colSpan}>
      <AlertCircle className="size-6 text-destructive" />
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-1 h-7 border-border bg-secondary text-xs text-foreground"
        >
          Retry
        </Button>
      )}
    </TableMessageRow>
  )
}

/** Offset-based pagination footer: range label + prev/next controls. */
export function TablePagination({
  total,
  limit,
  offset,
  onPageChange,
  isFetching = false,
}: {
  total: number
  limit: number
  offset: number
  onPageChange: (nextOffset: number) => void
  isFetching?: boolean
}) {
  const from = total === 0 ? 0 : offset + 1
  const to = Math.min(offset + limit, total)
  const canPrev = offset > 0
  const canNext = offset + limit < total

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border px-1 pt-3">
      <p className="text-xs text-muted-foreground">
        {total === 0 ? "0 results" : `Showing ${from}–${to} of ${total.toLocaleString()}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev || isFetching}
          onClick={() => onPageChange(Math.max(offset - limit, 0))}
          className="h-7 border-border bg-secondary text-xs text-foreground"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext || isFetching}
          onClick={() => onPageChange(offset + limit)}
          className="h-7 border-border bg-secondary text-xs text-foreground"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
