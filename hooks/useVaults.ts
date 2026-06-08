'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQuery } from '@/lib/query-params'
import type { VaultsFilters, VaultsResponse } from '@/types/admin'

export function useVaults(filters: VaultsFilters = {}) {
  const { limit, offset } = filters
  return useQuery<VaultsResponse>({
    queryKey: ['vaults', { limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ limit, offset })
      const { data } = await api.get<VaultsResponse>(`/admin/vaults${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}
