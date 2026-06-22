'use client'

import { useApiQuery } from './useApi'

// types/overview.ts
export type StatsOverview = {
  users: {
    total: number
    growthPercentThisWeek: string
  }
  tvl: {
    total: string
    growthPercentThisWeek: string
  }
  activeLoans: {
    total: number
    amountBorrowed: string
    growthPercentThisWeek: string
  }
  platformRevenue: {
    total: string
    growthPercentThisMonth: string
  }
  charts: {
    revenueVsLoanVolume: {
      month: string
      revenue: number
      loanVolume: number
    }[]
    userWeeklyActivity: {
      deposits: number
      withdrawals: number
      borrows: number
      repayments: number
      liquidations: number
      swaps: number
    }
  }
  recentTransactions: {
    transactionType: string
    user: {
      name: string
      email: string
    }
    amount: string
    fee: string
    status: string
    createdAt: string
    tokenSymbol?: string
    fromTokenSymbol?: string
    toTokenSymbol?: string
  }[]
  vaultPerformances: {
    name: string
    apy: string
    tvl: string
    status: string
  }[]
  riskOverview: {
    avgLtvRatio: string
    liquidationQueue: number
    defaultersRate: string
    systemHealth: string
    collateralCoverage: string
  }
}

export function useStatsOverview() {
  return useApiQuery<StatsOverview>(['overview'], '/overview')
}