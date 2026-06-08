import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

// Mock the axios instance so the hook never hits the network.
vi.mock("@/lib/api", () => ({
  api: { get: vi.fn() },
}))

import { api } from "@/lib/api"
import { useUsers } from "@/hooks/useUsers"
import { UserKycStatus, type UsersResponse } from "@/types/admin"

const mockGet = api.get as unknown as ReturnType<typeof vi.fn>

const sample: UsersResponse = {
  stats: { totalUsers: 2, activeToday: 1, kycPending: 1, suspended: 0 },
  total: 2,
  limit: 20,
  offset: 0,
  items: [
    {
      id: "u1",
      name: "Jane Doe",
      username: "jane",
      email: "jane@joinhodl.com",
      kycStatus: "VERIFIED",
      status: "Active",
      joinedAt: "2025-01-12T00:00:00.000Z",
      walletUsd: "100.00",
      vaultUsd: "50.00",
      loansCount: 1,
    },
  ],
}

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe("useUsers", () => {
  beforeEach(() => {
    mockGet.mockReset()
  })

  it("requests /admin/users with no query string when no filters are set", async () => {
    mockGet.mockResolvedValueOnce({ data: sample })
    const { result } = renderHook(() => useUsers(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGet).toHaveBeenCalledWith("/admin/users")
    expect(result.current.data?.total).toBe(2)
    expect(result.current.data?.items[0].email).toBe("jane@joinhodl.com")
  })

  it("encodes filters into the query string", async () => {
    mockGet.mockResolvedValueOnce({ data: sample })
    const { result } = renderHook(
      () =>
        useUsers({
          search: "jane",
          kycStatus: UserKycStatus.VERIFIED,
          limit: 20,
          offset: 20,
        }),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGet).toHaveBeenCalledWith(
      "/admin/users?search=jane&kycStatus=VERIFIED&limit=20&offset=20"
    )
  })

  it("surfaces errors", async () => {
    mockGet.mockRejectedValueOnce(new Error("boom"))
    const { result } = renderHook(() => useUsers(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
