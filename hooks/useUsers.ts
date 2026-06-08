'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQuery } from '@/lib/query-params'
import type { UsersFilters, UsersResponse } from '@/types/admin'

export function useUsers(filters: UsersFilters = {}) {
  const { search, kycStatus, country, isEmailVerified, limit, offset } = filters
  return useQuery<UsersResponse>({
    queryKey: ['users', { search, kycStatus, country, isEmailVerified, limit, offset }],
    queryFn: async () => {
      const qs = buildQuery({ search, kycStatus, country, isEmailVerified, limit, offset })
      const { data } = await api.get<UsersResponse>(`/admin/users${qs}`)
      return data
    },
    placeholderData: keepPreviousData,
  })
}
