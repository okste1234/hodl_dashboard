import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await api.post('/auth/login', payload)
      return data
    },
    onSuccess: () => {
      // Cookie already set by backend
      window.location.href = '/dashboard'
    },
  })
}