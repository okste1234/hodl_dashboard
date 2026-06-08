import { describe, it, expect, beforeEach } from "vitest"
import {
  TOKEN_STORAGE_KEY,
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
} from "@/lib/auth"

describe("auth token helpers", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("stores and reads the token under the single canonical key", () => {
    setToken("abc.def.ghi")
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("abc.def.ghi")
    expect(getToken()).toBe("abc.def.ghi")
    expect(isAuthenticated()).toBe(true)
  })

  it("returns null when no token is present", () => {
    expect(getToken()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('treats the literal strings "null"/"undefined" as no token', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "null")
    expect(getToken()).toBeNull()
    localStorage.setItem(TOKEN_STORAGE_KEY, "undefined")
    expect(getToken()).toBeNull()
  })

  it("clears the token", () => {
    setToken("xyz")
    clearToken()
    expect(getToken()).toBeNull()
  })
})
