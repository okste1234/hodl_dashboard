import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: { email: string; isEmailVerified: boolean }) => {
      const { data } = await api.post('users/auth', payload)
      return data
    },
    onSuccess: () => {
      window.location.href = '/dashboard'
    },
  })
}