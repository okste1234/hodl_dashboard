'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQuery } from '@/lib/query-params'
import type {
  YieldPositionsResponse,
  YieldProtocolsResponse,
  YieldPositionsFilters,
} from '@/types/admin'

/** GET /admin/yield/positions — yield KPIs + paginated positions across all users. */
export function useYieldPositions(filters: YieldPositionsFilters = {}) {
  const { status, limit, offset } = filters
  return useQuery<YieldPositionsResponse>({
    queryKey: ['yield', 'positions', { status, limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ status, limit, offset })
      const { data } = await api.get<YieldPositionsResponse>(`/admin/yield/positions${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}

/** GET /admin/yield/protocols — protocol usage aggregated from active positions. */
export function useYieldProtocols() {
  return useQuery<YieldProtocolsResponse>({
    queryKey: ['yield', 'protocols'],
    queryFn: async () => {
      const { data } = await api.get<YieldProtocolsResponse>('/admin/yield/protocols')
      return data
    },
  })
}
