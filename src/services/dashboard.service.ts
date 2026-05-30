import api from "./api";

export interface DashboardData {
  total_users: number;
  active_users: number;
  total_orders: number;
  total_products: number;
  total_revenue: number;
  recent_activity: Array<{
    id: number;
    action: string;
    description: string;
    user: string;
    created_at: string;
  }>;
  api_status: {
    status: string;
    version: string;
    uptime: number;
    response_time: number;
  };
  monthly_revenue: Array<{ month: string; revenue: number }>;
}

export const dashboardService = {
  async getStats(): Promise<DashboardData> {
    const res = await api.get<{ success: boolean; data: DashboardData }>("/api/dashboard/stats");
    return res.data.data;
  },
};
