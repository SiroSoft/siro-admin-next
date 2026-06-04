import api from "./api";
import type { components } from "@/types/api";

export const authService = {
  async login(data: components["schemas"]["LoginRequest"]) {
    const res = await api.post<components["schemas"]["AuthTokenResponse"]>("/api/auth/login", data);
    return res.data;
  },

  async refresh(refreshToken: string) {
    const res = await api.post<components["schemas"]["AuthTokenResponse"]>("/api/auth/refresh", {
      refresh_token: refreshToken,
    });
    return res.data;
  },

  async me() {
    const res = await api.get<components["schemas"]["SuccessResponse_User"]>("/api/auth/me");
    return res.data.data ?? null;
  },

  async forgotPassword(email: string) {
    const res = await api.post<components["schemas"]["SuccessResponse_null"]>("/api/auth/forgot-password", { email });
    return res.data;
  },

  async register(data: components["schemas"]["RegisterRequest"]) {
    const res = await api.post<components["schemas"]["SuccessResponse_null"]>("/api/auth/register", data);
    return res.data;
  },

  async resetPassword(data: components["schemas"]["ResetPasswordRequest"]) {
    const res = await api.post<components["schemas"]["SuccessResponse_null"]>("/api/auth/reset-password", data);
    return res.data;
  },

  async verifyEmail(data: components["schemas"]["VerifyEmailRequest"]) {
    const res = await api.post<components["schemas"]["SuccessResponse_null"]>("/api/auth/verify-email", data);
    return res.data;
  },

  async logout() {
    await api.post("/api/auth/logout");
  },
};
