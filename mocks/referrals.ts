// Mock data for the Referrals screen — referral program: top referrers,
// referred-user funnel, and rewards ledger.

import { MOCK_USERS } from "./shared"

export interface Referrer {
  id: string
  userId: string
  code: string
  invited: number
  signedUp: number
  kycCompleted: number
  funded: number
  rewardEarnedUsd: number
  tier: "Bronze" | "Silver" | "Gold"
}

export const REFERRERS: Referrer[] = [
  { id: "ref_01", userId: MOCK_USERS[0].id, code: "JASPER25", invited: 48, signedUp: 31, kycCompleted: 22, funded: 18, rewardEarnedUsd: 540.0, tier: "Gold" },
  { id: "ref_02", userId: MOCK_USERS[5].id, code: "NGOZIVIP", invited: 36, signedUp: 24, kycCompleted: 19, funded: 15, rewardEarnedUsd: 410.5, tier: "Gold" },
  { id: "ref_03", userId: MOCK_USERS[1].id, code: "AMARA10", invited: 22, signedUp: 14, kycCompleted: 9, funded: 6, rewardEarnedUsd: 180.0, tier: "Silver" },
  { id: "ref_04", userId: MOCK_USERS[3].id, code: "FATIMAX", invited: 18, signedUp: 11, kycCompleted: 7, funded: 5, rewardEarnedUsd: 150.0, tier: "Silver" },
  { id: "ref_05", userId: MOCK_USERS[7].id, code: "AISHA01", invited: 9, signedUp: 5, kycCompleted: 3, funded: 2, rewardEarnedUsd: 60.0, tier: "Bronze" },
  { id: "ref_06", userId: MOCK_USERS[2].id, code: "KOLA777", invited: 6, signedUp: 3, kycCompleted: 1, funded: 0, rewardEarnedUsd: 0, tier: "Bronze" },
]

export type RewardStatus = "paid" | "pending" | "clawed_back"

export interface ReferralReward {
  id: string
  referrerId: string
  referredUserLabel: string
  milestone: "signup" | "kyc" | "first_deposit" | "first_loan"
  amountUsd: number
  status: RewardStatus
  createdAt: string
}

export const REFERRAL_REWARDS: ReferralReward[] = [
  { id: "rw_01", referrerId: "ref_01", referredUserLabel: "tunde@gmail.com", milestone: "first_deposit", amountUsd: 30, status: "paid", createdAt: "2026-02-22T10:00:00Z" },
  { id: "rw_02", referrerId: "ref_01", referredUserLabel: "grace@gmail.com", milestone: "kyc", amountUsd: 10, status: "paid", createdAt: "2026-02-21T14:00:00Z" },
  { id: "rw_03", referrerId: "ref_02", referredUserLabel: "ibrahim@gmail.com", milestone: "first_loan", amountUsd: 50, status: "pending", createdAt: "2026-02-23T09:30:00Z" },
  { id: "rw_04", referrerId: "ref_03", referredUserLabel: "blessing@outlook.com", milestone: "signup", amountUsd: 5, status: "paid", createdAt: "2026-02-20T16:20:00Z" },
  { id: "rw_05", referrerId: "ref_05", referredUserLabel: "musa@gmail.com", milestone: "first_deposit", amountUsd: 30, status: "clawed_back", createdAt: "2026-02-19T11:10:00Z" },
  { id: "rw_06", referrerId: "ref_02", referredUserLabel: "deborah@gmail.com", milestone: "kyc", amountUsd: 10, status: "pending", createdAt: "2026-02-23T08:05:00Z" },
]

export interface ReferralStats {
  totalReferrers: number
  totalInvited: number
  totalSignups: number
  rewardsPaidUsd: number
}

export const REFERRAL_STATS: ReferralStats = {
  totalReferrers: REFERRERS.length,
  totalInvited: REFERRERS.reduce((s, r) => s + r.invited, 0),
  totalSignups: REFERRERS.reduce((s, r) => s + r.signedUp, 0),
  rewardsPaidUsd: REFERRAL_REWARDS.filter((r) => r.status === "paid").reduce((s, r) => s + r.amountUsd, 0),
}

/** Funnel for the referral conversion chart. */
export const REFERRAL_FUNNEL: { stage: string; value: number }[] = [
  { stage: "Invited", value: REFERRERS.reduce((s, r) => s + r.invited, 0) },
  { stage: "Signed up", value: REFERRERS.reduce((s, r) => s + r.signedUp, 0) },
  { stage: "KYC", value: REFERRERS.reduce((s, r) => s + r.kycCompleted, 0) },
  { stage: "Funded", value: REFERRERS.reduce((s, r) => s + r.funded, 0) },
]
