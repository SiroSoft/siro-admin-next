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

  async logout() {
    await api.post("/api/auth/logout");
  },
};
