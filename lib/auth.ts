// Single source of truth for admin auth-token storage.
//
// NOTE: previously the login page wrote `adm:accessToken` while the axios
// interceptor read `accessToken`, so the Bearer token was never attached and
// every authenticated request 401'd. All token access now goes through here.

export const TOKEN_STORAGE_KEY = "adm:accessToken"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!token || token === "undefined" || token === "null") return null
  return token
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}

/** Clear the session and send the user back to the login screen. */
export function logout(): void {
  clearToken()
  if (typeof window !== "undefined" && window.location.pathname !== "/") {
    window.location.href = "/"
  }
}
