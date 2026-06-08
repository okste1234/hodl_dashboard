'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AnalyticsResponse } from '@/types/admin'

export function useAnalytics() {
  return useQuery<AnalyticsResponse>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get<AnalyticsResponse>('/admin/analytics')
      return data
    },
  })
}
