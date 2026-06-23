'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQuery } from '@/lib/query-params'
import type { WalletHoldingsResponse, WalletFilters } from '@/types/admin'

/** GET /admin/wallets — wallet KPIs, available chains, and paginated token holdings. */
export function useWalletHoldings(filters: WalletFilters = {}) {
  const { network, search, limit, offset } = filters
  return useQuery<WalletHoldingsResponse>({
    queryKey: ['wallets', { network, search, limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ network, search, limit, offset })
      const { data } = await api.get<WalletHoldingsResponse>(`/admin/wallets${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}
