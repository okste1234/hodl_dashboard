'use client'

import { useEffect, useState } from 'react'

export type MockState<T> = {
  data: T | undefined
  isLoading: boolean
  isError: boolean
}

/**
 * Simulates an async data source for the UI-only expansion screens so that
 * loading skeletons and (optional) error states render genuinely — without any
 * network, backend, or global state. Purely local component state.
 *
 * Pass `failingMode` to demonstrate the error edge-state path.
 */
export function useMockData<T>(value: T, opts?: { delay?: number; failingMode?: boolean }): MockState<T> {
  const { delay = 450, failingMode = false } = opts ?? {}
  const [state, setState] = useState<MockState<T>>({
    data: undefined,
    isLoading: true,
    isError: false,
  })

  useEffect(() => {
    let active = true
    setState({ data: undefined, isLoading: true, isError: false })
    const t = setTimeout(() => {
      if (!active) return
      if (failingMode) {
        setState({ data: undefined, isLoading: false, isError: true })
      } else {
        setState({ data: value, isLoading: false, isError: false })
      }
    }, delay)
    return () => {
      active = false
      clearTimeout(t)
    }
    // value is intentionally excluded — mock data is module-stable; re-running on
    // identity changes would re-trigger the fake load on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, failingMode])

  return state
}
