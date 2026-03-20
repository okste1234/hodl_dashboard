import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      console.error('Network error or server unavailable')
      return Promise.reject(error)
    }

    const status = error.response.status
    const url = error.config?.url || ''

    // Handle unauthorized (exclude auth routes)
    if (status === 401 && !url.includes('/auth')) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('unauthorized'))
      }
        // if (typeof window !== 'undefined') {
        //     window.location.href = '/login'
        // }
    }

    console.error('API Error:', error.response.data || error.message)

    return Promise.reject(error)
  }
)