'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ReconciliationResult } from '@/types/admin'

/**
 * POST /admin/reconcile/paycrest — on-demand reconciliation of Paycrest
 * on/off-ramp transactions stuck on INITIATED/PENDING. Returns a run summary.
 */
export function useReconcilePaycrest() {
  return useMutation<ReconciliationResult, unknown, void>({
    mutationFn: async () => {
      const { data } = await api.post<ReconciliationResult>('/admin/reconcile/paycrest')
      return data
    },
  })
}
