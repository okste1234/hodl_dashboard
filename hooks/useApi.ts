'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useApiQuery<TData = unknown>(
  key: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<TData>("/admin" + url)
      return data
    },
    ...options,
  })
}