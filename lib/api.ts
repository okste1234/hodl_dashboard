import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // ❌ remove for now (only needed for cookies)
  // withCredentials: true,
});

// ✅ Request interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

    // 🔒 prevent "null"/"undefined"
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔌 Network error
    if (!error.response) {
      if (process.env.NODE_ENV === "development") {
        console.error("Network error or server unavailable");
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url || "";

    // 🔐 More flexible auth route detection
    const isAuthRoute =
      url.includes("/auth") || url.includes("/login") || url.includes("/verify");

    if (status === 401 && !isAuthRoute) {
      if (typeof window !== "undefined") {
        // 🧹 Clear bad token
        localStorage.removeItem("accessToken");

        // 🚫 Prevent redirect loop
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.error(
        "API Error:",
        error.response.data || error.message
      );
    }

    return Promise.reject(error);
  }
);