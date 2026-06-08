import { test, expect, type Page } from "@playwright/test"

// ---------------------------------------------------------------------------
// Network stubs — keep the smoke suite deterministic & offline (no live OTP).
// ---------------------------------------------------------------------------

const overviewPayload = {
  users: { total: 24521, growthPercentThisWeek: "+12.5%" },
  tvl: { total: "18400000.00", growthPercentThisWeek: "+5.2%" },
  activeLoans: { total: 421, amountBorrowed: "640000.00", growthPercentThisWeek: "+8.1%" },
  platformRevenue: { total: "125430.00", growthPercentThisMonth: "+15.4%" },
  charts: {
    revenueVsLoanVolume: [
      { month: "Jan", revenue: 12000, loanVolume: 154000 },
      { month: "Feb", revenue: 15000, loanVolume: 180000 },
    ],
    userWeeklyActivity: {
      deposits: 1420, withdrawals: 840, borrows: 310,
      repayments: 280, liquidations: 12, swaps: 540,
    },
  },
  recentTransactions: [
    {
      transactionType: "DEPOSIT",
      user: { name: "Jasper Okwu", email: "jasper@joinhodl.com" },
      amount: "5000.00", fee: "0", status: "SUCCESS",
      createdAt: "2026-02-20T00:11:03.778Z",
    },
  ],
  vaultPerformances: [{ name: "CNGN Core", apy: "5.5%", tvl: "18400000.00", status: "Active" }],
  riskOverview: {
    avgLtvRatio: "68%", liquidationQueue: 5, defaultersRate: "1.2%",
    systemHealth: "98%", collateralCoverage: "145%",
  },
}

const usersPayload = {
  stats: { totalUsers: 24521, activeToday: 847, kycPending: 342, suspended: 12 },
  total: 1, limit: 20, offset: 0,
  items: [
    {
      id: "u1", name: "Jasper Okwu", username: "jasper", email: "jasper@joinhodl.com",
      kycStatus: "VERIFIED", status: "Active", joinedAt: "2025-01-12T00:00:00.000Z",
      walletUsd: "22199.09", vaultUsd: "22199.00", loansCount: 2,
    },
  ],
}

async function stubApi(page: Page) {
  await page.route("**/admin/auth/request-otp", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ message: "OTP dispatched" }) })
  )
  await page.route("**/admin/auth/verify-otp", (route) =>
    route.fulfill({
      status: 200, contentType: "application/json",
      body: JSON.stringify({
        accessToken: "test.jwt.token",
        admin: { id: "admin-1", email: "hello@joinhodl.com", name: "Hodl Admin" },
      }),
    })
  )
  await page.route("**/admin/overview", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(overviewPayload) })
  )
  await page.route("**/admin/users**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(usersPayload) })
  )
}

async function login(page: Page) {
  await page.goto("/")
  await page.getByPlaceholder("you@example.com").fill("hello@joinhodl.com")
  await page.getByRole("button", { name: "Send OTP" }).click()
  await page.getByPlaceholder("123456").fill("123456")
  await page.getByRole("button", { name: "Verify OTP" }).click()
  await page.waitForURL("**/dashboard")
}

test.describe("admin dashboard smoke", () => {
  test.beforeEach(async ({ page }) => {
    await stubApi(page)
  })

  test("logs in via OTP and lands on the overview dashboard", async ({ page }) => {
    await login(page)
    await expect(page.getByRole("heading", { name: "Welcome back, Admin" })).toBeVisible()
    await expect(page.getByText("Total Users")).toBeVisible()
    await expect(page.getByText("24,521")).toBeVisible()
  })

  test("navigates to the Users tab and renders real data", async ({ page }) => {
    await login(page)
    await page.getByRole("button", { name: "Users" }).click()
    await expect(page.getByText("All Users")).toBeVisible()
    await expect(page.getByText("jasper@joinhodl.com")).toBeVisible()
  })

  test("redirects unauthenticated dashboard access to login", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL("http://localhost:3100/")
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible()
  })

  test("logs out back to the login screen", async ({ page }) => {
    await login(page)
    await page.getByRole("button", { name: "Log out" }).click()
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible()
  })
})
