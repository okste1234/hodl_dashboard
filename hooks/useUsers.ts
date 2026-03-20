'use client'

import { useApiQuery } from './useApi'

export type User = {
  id: string
  email: string
  name?: string
}

export function useUsers() {
  return useApiQuery<User[]>(['users'], '/users')
}
