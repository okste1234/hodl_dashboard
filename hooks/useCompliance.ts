'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQuery } from '@/lib/query-params'
import type { ComplianceFilters, ComplianceResponse } from '@/types/admin'

export function useCompliance(filters: ComplianceFilters = {}) {
  const { status, limit, offset } = filters
  return useQuery<ComplianceResponse>({
    queryKey: ['compliance', { status, limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ status, limit, offset })
      const { data } = await api.get<ComplianceResponse>(`/admin/compliance${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}
