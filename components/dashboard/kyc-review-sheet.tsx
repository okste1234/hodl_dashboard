"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, ShieldCheck, ShieldAlert } from "lucide-react"
import type { AdminKycItem } from "@/types/admin"
import { buildKycDetail, type DocStatus } from "@/mocks/kyc-detail"
import { formatDate } from "@/lib/format"

function docStatusBadge(status: DocStatus) {
  const map: Record<DocStatus, string> = {
    verified: "bg-success/10 text-success border-success/20",
    submitted: "bg-warning/10 text-warning border-warning/20",
    flagged: "bg-destructive/10 text-destructive border-destructive/20",
  }
  return <Badge variant="outline" className={`text-[10px] capitalize ${map[status]}`}>{status}</Badge>
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}

/**
 * KYC review detail. The queue row is REAL API data; documents / source-of-funds
 * / PEP are illustrative mock detail (backend has no KYC detail endpoint). The
 * approve/reject actions are UI-only (the mutation route is not yet exposed).
 */
export function KycReviewSheet({
  request,
  onOpenChange,
}: {
  request: AdminKycItem | null
  onOpenChange: (open: boolean) => void
}) {
  const detail = request ? buildKycDetail({ name: request.user.name, email: request.user.email }) : null

  return (
    <Sheet open={!!request} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 border-border bg-card sm:max-w-lg">
        {request && detail && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-foreground">KYC Review</SheetTitle>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px] capitalize">
                  {request.kycTier?.replace(/_/g, " ")}
                </Badge>
              </div>
              <SheetDescription>{request.user.name ?? request.user.email}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              {/* Risk banner */}
              <div className={`flex items-center gap-3 rounded-lg border p-3 ${
                detail.sanctionsMatch || detail.riskScore === "High"
                  ? "border-destructive/20 bg-destructive/5"
                  : "border-success/20 bg-success/5"
              }`}>
                {detail.sanctionsMatch || detail.riskScore === "High" ? (
                  <ShieldAlert className="size-5 text-destructive" />
                ) : (
                  <ShieldCheck className="size-5 text-success" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Risk score: {detail.riskScore}</span>
                  <span className="text-xs text-muted-foreground">
                    {detail.sanctionsMatch ? "Sanctions match found" : "No sanctions match"} ·{" "}
                    {detail.politicallyExposed ? "Politically exposed" : "Not PEP"}
                  </span>
                </div>
              </div>

              {/* Identity */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <Field label="Full name" value={detail.fullName} />
                <Field label="Date of birth" value={detail.dateOfBirth} />
                <Field label="Country" value={detail.country} />
                <Field label="ID type" value={detail.idType.replace(/_/g, " ")} />
                <Field label="ID number" value={detail.idNumber} />
                <Field label="ID expiry" value={detail.idExpiry} />
                <Field label="Submitted" value={formatDate(request.createdAt)} />
                <Field label="Status" value={request.status} />
              </div>

              {/* Documents */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Documents</p>
                <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
                  {detail.documents.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5">
                      <div className="flex items-center gap-2">
                        {d.type.startsWith("image") ? (
                          <ImageIcon className="size-4 text-muted-foreground" />
                        ) : (
                          <FileText className="size-4 text-muted-foreground" />
                        )}
                        <span className="text-sm text-foreground">{d.label}</span>
                      </div>
                      {docStatusBadge(d.status)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial profile */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <Field label="Employment" value={detail.employmentStatus.replace(/_/g, " ")} />
                <Field label="Source of funds" value={detail.sourceOfFunds} />
                <Field label="Monthly volume" value={detail.expectedMonthlyVolume} />
                <Field label="Account purpose" value={detail.accountPurpose} />
              </div>

              <p className="text-[10px] text-muted-foreground">
                Document and financial-profile detail is illustrative — no KYC detail endpoint exists yet.
              </p>
            </div>

            <SheetFooter className="flex-row gap-2">
              {/* UI-only — KYC review mutation route is not yet exposed by the backend */}
              <Button variant="outline" className="flex-1 border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10">
                Reject
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Approve
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
