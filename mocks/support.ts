// Mock data for the Support screen — ticket queue with priority/status/SLA.

import { MOCK_USERS } from "./shared"

export type TicketStatus = "open" | "pending" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "urgent"
export type TicketCategory =
  | "kyc"
  | "deposits"
  | "withdrawals"
  | "loans"
  | "swaps"
  | "account"
  | "other"

export interface SupportMessage {
  id: string
  author: "user" | "agent"
  body: string
  at: string
}

export interface SupportTicket {
  id: string
  reference: string
  userId: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  assignee: string | null
  createdAt: string
  updatedAt: string
  /** SLA breach flag for the queue badge */
  slaBreached: boolean
  thread: SupportMessage[]
}

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "tkt_01",
    reference: "HOD-3041",
    userId: MOCK_USERS[2].id,
    subject: "Onramp deposit not credited",
    category: "deposits",
    priority: "urgent",
    status: "open",
    assignee: null,
    createdAt: "2026-02-23T13:10:00Z",
    updatedAt: "2026-02-23T13:10:00Z",
    slaBreached: true,
    thread: [
      { id: "m1", author: "user", body: "I sent ₦800,000 two hours ago and my cNGN hasn't arrived. Reference ONR-90023.", at: "2026-02-23T13:10:00Z" },
    ],
  },
  {
    id: "tkt_02",
    reference: "HOD-3040",
    userId: MOCK_USERS[3].id,
    subject: "KYC Tier 2 rejected — need help",
    category: "kyc",
    priority: "high",
    status: "pending",
    assignee: "Tola A.",
    createdAt: "2026-02-23T10:42:00Z",
    updatedAt: "2026-02-23T12:01:00Z",
    slaBreached: false,
    thread: [
      { id: "m1", author: "user", body: "My Tier 2 verification was rejected but I uploaded a valid utility bill.", at: "2026-02-23T10:42:00Z" },
      { id: "m2", author: "agent", body: "Thanks — the address proof was older than 3 months. Could you upload one from the last 90 days?", at: "2026-02-23T12:01:00Z" },
    ],
  },
  {
    id: "tkt_03",
    reference: "HOD-3039",
    userId: MOCK_USERS[0].id,
    subject: "Loan health factor question",
    category: "loans",
    priority: "medium",
    status: "open",
    assignee: "Bola K.",
    createdAt: "2026-02-22T18:20:00Z",
    updatedAt: "2026-02-22T18:20:00Z",
    slaBreached: false,
    thread: [
      { id: "m1", author: "user", body: "If ETH drops 10%, will my position be liquidated? Current HF shows 1.4.", at: "2026-02-22T18:20:00Z" },
    ],
  },
  {
    id: "tkt_04",
    reference: "HOD-3038",
    userId: MOCK_USERS[5].id,
    subject: "Offramp to GTBank pending too long",
    category: "withdrawals",
    priority: "high",
    status: "pending",
    assignee: "Tola A.",
    createdAt: "2026-02-22T15:05:00Z",
    updatedAt: "2026-02-23T09:15:00Z",
    slaBreached: false,
    thread: [
      { id: "m1", author: "user", body: "Offramp OFR-90026 failed and the funds are stuck.", at: "2026-02-22T15:05:00Z" },
      { id: "m2", author: "agent", body: "We're reprocessing the payout now, you'll see it within the hour.", at: "2026-02-23T09:15:00Z" },
    ],
  },
  {
    id: "tkt_05",
    reference: "HOD-3035",
    userId: MOCK_USERS[1].id,
    subject: "Can't change my username",
    category: "account",
    priority: "low",
    status: "resolved",
    assignee: "Bola K.",
    createdAt: "2026-02-20T11:00:00Z",
    updatedAt: "2026-02-21T08:30:00Z",
    slaBreached: false,
    thread: [
      { id: "m1", author: "user", body: "The save button does nothing when I change my username.", at: "2026-02-20T11:00:00Z" },
      { id: "m2", author: "agent", body: "Fixed on our end — please refresh and try again. Closing this out.", at: "2026-02-21T08:30:00Z" },
    ],
  },
  {
    id: "tkt_06",
    reference: "HOD-3031",
    userId: MOCK_USERS[7].id,
    subject: "Swap quote expired error",
    category: "swaps",
    priority: "medium",
    status: "closed",
    assignee: "Bola K.",
    createdAt: "2026-02-18T14:25:00Z",
    updatedAt: "2026-02-19T10:00:00Z",
    slaBreached: false,
    thread: [
      { id: "m1", author: "user", body: "Every swap says 'quote expired' before I can confirm.", at: "2026-02-18T14:25:00Z" },
      { id: "m2", author: "agent", body: "This was a slippage setting — bumped to 1% and it works now.", at: "2026-02-19T10:00:00Z" },
    ],
  },
]

export interface SupportStats {
  openTickets: number
  slaBreaches: number
  pending: number
  resolvedToday: number
}

export const SUPPORT_STATS: SupportStats = {
  openTickets: SUPPORT_TICKETS.filter((t) => t.status === "open").length,
  slaBreaches: SUPPORT_TICKETS.filter((t) => t.slaBreached).length,
  pending: SUPPORT_TICKETS.filter((t) => t.status === "pending").length,
  resolvedToday: 4,
}
