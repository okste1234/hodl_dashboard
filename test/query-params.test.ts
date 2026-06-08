import { describe, it, expect } from "vitest"
import { buildQuery } from "@/lib/query-params"

describe("buildQuery", () => {
  it("returns empty string for no params", () => {
    expect(buildQuery({})).toBe("")
  })

  it("drops undefined, null and empty-string values", () => {
    expect(buildQuery({ a: undefined, b: null, c: "" })).toBe("")
  })

  it("serializes present values and prefixes with ?", () => {
    expect(buildQuery({ limit: 20, offset: 0, search: "jane" })).toBe(
      "?limit=20&offset=0&search=jane"
    )
  })

  it("keeps offset=0 but omits empty search", () => {
    expect(buildQuery({ offset: 0, search: "" })).toBe("?offset=0")
  })

  it("encodes special characters", () => {
    expect(buildQuery({ search: "a b@c" })).toBe("?search=a+b%40c")
  })

  it("serializes booleans", () => {
    expect(buildQuery({ isEmailVerified: true })).toBe("?isEmailVerified=true")
  })
})
