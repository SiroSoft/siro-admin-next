import api from "./api";
import type { components } from "@/types/api";

export const profileService = {
  async get() {
    const res = await api.get<components["schemas"]["SuccessResponse_User"]>("/api/profile");
    return res.data.data;
  },

  async update(data: components["schemas"]["UpdateProfileRequest"]) {
    const res = await api.put<components["schemas"]["SuccessResponse_User"]>("/api/profile", data);
    return res.data.data;
  },

  async changePassword(data: components["schemas"]["ChangePasswordRequest"]) {
    await api.put("/api/profile/password", data);
  },
};
