import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Optional: attach token later
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (process.env.NODE_ENV === "development") {
        console.error("Network error or server unavailable");
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url || "";

    const isAuthRoute = url.includes("/users/auth") 

    if (status === 401 && !isAuthRoute) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
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