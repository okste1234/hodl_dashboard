'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQuery } from '@/lib/query-params'
import type { LoansFilters, LoansResponse } from '@/types/admin'

export function useLoans(filters: LoansFilters = {}) {
  const { status, limit, offset } = filters
  return useQuery<LoansResponse>({
    queryKey: ['loans', { status, limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ status, limit, offset })
      const { data } = await api.get<LoansResponse>(`/admin/loans${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}
