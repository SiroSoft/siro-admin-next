import api from "./api";
import type { components } from "@/types/api";

type Order = components["schemas"]["Order"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

export interface OrdersResponse {
  data: Order[];
  meta: PaginationMeta;
}

export const ordersService = {
  async list(params?: Record<string, unknown>) {
    const res = await api.get<OrdersResponse>("/api/orders", { params });
    return res.data;
  },

  async get(id: number) {
    const res = await api.get<components["schemas"]["SuccessResponse_Order"]>(`/api/orders/${id}`);
    return res.data;
  },

  async create(data: components["schemas"]["CreateOrderRequest"]) {
    const res = await api.post<components["schemas"]["SuccessResponse_Order"]>("/api/orders", data);
    return res.data;
  },

  async update(id: number, data: components["schemas"]["UpdateOrderRequest"]) {
    const res = await api.put<components["schemas"]["SuccessResponse_Order"]>(`/api/orders/${id}`, data);
    return res.data;
  },

  async delete(id: number) {
    await api.delete(`/api/orders/${id}`);
  },

  async updateStatus(id: number, status: string) {
    const res = await api.patch<components["schemas"]["SuccessResponse_Order"]>(`/api/orders/${id}/status`, { status });
    return res.data;
  },
};
