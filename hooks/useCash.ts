'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQuery } from '@/lib/query-params'
import type {
  VirtualAccountsResponse,
  RampOrdersResponse,
  LinkedBanksResponse,
  RampFilters,
  BankFilters,
} from '@/types/admin'

/** GET /admin/cash/virtual-accounts — cash KPIs + paginated USD virtual accounts. */
export function useVirtualAccounts(filters: { limit?: number; offset?: number } = {}) {
  const { limit, offset } = filters
  return useQuery<VirtualAccountsResponse>({
    queryKey: ['cash', 'virtual-accounts', { limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ limit, offset })
      const { data } = await api.get<VirtualAccountsResponse>(`/admin/cash/virtual-accounts${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}

/** GET /admin/cash/ramps — paginated fiat ramp orders. */
export function useRampOrders(filters: RampFilters = {}) {
  const { status, limit, offset } = filters
  return useQuery<RampOrdersResponse>({
    queryKey: ['cash', 'ramps', { status, limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ status, limit, offset })
      const { data } = await api.get<RampOrdersResponse>(`/admin/cash/ramps${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}

/** GET /admin/cash/linked-banks — paginated linked (whitelisted) bank accounts. */
export function useLinkedBanks(filters: BankFilters = {}) {
  const { status, limit, offset } = filters
  return useQuery<LinkedBanksResponse>({
    queryKey: ['cash', 'linked-banks', { status, limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ status, limit, offset })
      const { data } = await api.get<LinkedBanksResponse>(`/admin/cash/linked-banks${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}
