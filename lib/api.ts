import axios from "axios";
import { getToken, clearToken } from "@/lib/auth";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach the admin Bearer token (single source of truth).
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — on 401 to a protected route, clear the session and
// bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error / server unreachable
    if (!error.response) {
      if (process.env.NODE_ENV === "development") {
        console.error("Network error or server unavailable");
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url || "";

    const isAuthRoute =
      url.includes("/auth") || url.includes("/login") || url.includes("/verify");

    if (status === 401 && !isAuthRoute) {
      if (typeof window !== "undefined") {
        clearToken();
        // Prevent redirect loop
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response.data || error.message);
    }

    return Promise.reject(error);
  }
);
