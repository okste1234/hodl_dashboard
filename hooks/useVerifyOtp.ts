import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type VerifyOtpResponse = {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    name: string | null;
  };
};

export function useVerifyOtp() {
  return useMutation<VerifyOtpResponse, AxiosError<{ message?: string }>, VerifyOtpPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<VerifyOtpResponse>(
        "admin/auth/verify-otp",
        payload
      );
      return data;
    },
  });
}
