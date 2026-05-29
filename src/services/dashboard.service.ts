import api from "./api";
import type { components } from "@/types/api";

type DashboardStatsResponse = components["schemas"]["DashboardStatsResponse"];

export const dashboardService = {
  async getStats() {
    const res = await api.get<DashboardStatsResponse>("/api/dashboard/stats");
    return res.data;
  },
};
