import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useRequestOtp() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const { data } = await api.post('admin/auth/request-otp', payload)
      return data
    },
    onSuccess: () => {
      console.log("OTP requested successfully")
    },
  })
}