// Mock data for the Announcements screen — broadcast / push-notification
// campaign manager.

export type CampaignChannel = "push" | "in_app" | "email"
export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent"
export type AudienceSegment =
  | "all_users"
  | "kyc_pending"
  | "active_borrowers"
  | "vault_depositors"
  | "dormant_30d"

export const SEGMENT_LABELS: Record<AudienceSegment, string> = {
  all_users: "All users",
  kyc_pending: "KYC pending",
  active_borrowers: "Active borrowers",
  vault_depositors: "Vault depositors",
  dormant_30d: "Dormant (30d)",
}

export interface Campaign {
  id: string
  title: string
  body: string
  channel: CampaignChannel
  segment: AudienceSegment
  audienceSize: number
  status: CampaignStatus
  /** delivery metrics (0 until sent) */
  delivered: number
  opened: number
  clicked: number
  scheduledFor: string | null
  createdAt: string
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: "cmp_01",
    title: "Borrow against your crypto — 0% for 7 days",
    body: "Deposit collateral and borrow cNGN instantly. Limited-time 0% intro for new borrowers.",
    channel: "push",
    segment: "all_users",
    audienceSize: 24521,
    status: "sent",
    delivered: 23980,
    opened: 14110,
    clicked: 3120,
    scheduledFor: null,
    createdAt: "2026-02-18T09:00:00Z",
  },
  {
    id: "cmp_02",
    title: "Finish your KYC to unlock USD accounts",
    body: "You're one step away from a USD virtual account. Complete Tier 1 verification today.",
    channel: "in_app",
    segment: "kyc_pending",
    audienceSize: 342,
    status: "sending",
    delivered: 210,
    opened: 96,
    clicked: 41,
    scheduledFor: null,
    createdAt: "2026-02-23T08:30:00Z",
  },
  {
    id: "cmp_03",
    title: "Your vault is earning 5.5% APY",
    body: "Top up your cNGN vault position and watch your earnings grow.",
    channel: "push",
    segment: "vault_depositors",
    audienceSize: 431,
    status: "scheduled",
    delivered: 0,
    opened: 0,
    clicked: 0,
    scheduledFor: "2026-06-12T10:00:00Z",
    createdAt: "2026-06-07T12:00:00Z",
  },
  {
    id: "cmp_04",
    title: "We miss you — here's ₦2,000 to come back",
    body: "Reactivate your account and get a bonus on your next deposit.",
    channel: "email",
    segment: "dormant_30d",
    audienceSize: 1890,
    status: "draft",
    delivered: 0,
    opened: 0,
    clicked: 0,
    scheduledFor: null,
    createdAt: "2026-06-06T16:45:00Z",
  },
  {
    id: "cmp_05",
    title: "Repayment reminder",
    body: "Your loan repayment is due in 3 days. Repay early to save on interest.",
    channel: "push",
    segment: "active_borrowers",
    audienceSize: 421,
    status: "sent",
    delivered: 418,
    opened: 305,
    clicked: 142,
    scheduledFor: null,
    createdAt: "2026-02-15T11:00:00Z",
  },
]

export interface AnnouncementStats {
  totalCampaigns: number
  scheduled: number
  avgOpenRate: number
  reach30d: number
}

const sent = CAMPAIGNS.filter((c) => c.delivered > 0)
export const ANNOUNCEMENT_STATS: AnnouncementStats = {
  totalCampaigns: CAMPAIGNS.length,
  scheduled: CAMPAIGNS.filter((c) => c.status === "scheduled").length,
  avgOpenRate: sent.length
    ? Math.round((sent.reduce((s, c) => s + c.opened / c.delivered, 0) / sent.length) * 1000) / 10
    : 0,
  reach30d: sent.reduce((s, c) => s + c.delivered, 0),
}
