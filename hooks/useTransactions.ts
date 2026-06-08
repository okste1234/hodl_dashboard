'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQuery } from '@/lib/query-params'
import type { TransactionsFilters, TransactionsResponse } from '@/types/admin'

export function useTransactions(filters: TransactionsFilters = {}) {
  const { transactionType, status, dateFrom, dateTo, limit, offset } = filters
  return useQuery<TransactionsResponse>({
    queryKey: ['transactions', { transactionType, status, dateFrom, dateTo, limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ transactionType, status, dateFrom, dateTo, limit, offset })
      const { data } = await api.get<TransactionsResponse>(`/admin/transactions${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}
