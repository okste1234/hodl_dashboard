import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type VerifyOtpPayload = {
  email: string;
  otp: string;
};

type VerifyOtpResponse = {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
};

export function useVerifyOtp() {
  return useMutation<VerifyOtpResponse, any, VerifyOtpPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        "admin/auth/verify-otp",
        payload
      );
      return data;
    },
  });
}