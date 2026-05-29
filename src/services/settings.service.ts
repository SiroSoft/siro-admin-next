import api from "./api";
import type { components } from "@/types/api";

export const settingsService = {
  async get() {
    const res = await api.get<{ data: components["schemas"]["Settings"]; message?: string }>("/api/settings");
    return res.data.data;
  },

  async update(data: components["schemas"]["UpdateSettingsRequest"]) {
    const res = await api.put<components["schemas"]["SuccessResponse_Settings"]>("/api/settings", data);
    return res.data.data;
  },
};
