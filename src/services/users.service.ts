import api from "./api";
import type { components } from "@/types/api";

type User = components["schemas"]["User"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

export interface UsersResponse {
  data: User[];
  meta: PaginationMeta;
}

export const usersService = {
  async list(params?: Record<string, unknown>) {
    const res = await api.get<UsersResponse>("/api/users", { params });
    return res.data;
  },

  async get(id: number) {
    const res = await api.get<components["schemas"]["SuccessResponse_User"]>(`/api/users/${id}`);
    return res.data.data;
  },

  async create(data: components["schemas"]["CreateUserRequest"]) {
    const res = await api.post<components["schemas"]["SuccessResponse_User"]>("/api/users", data);
    return res.data.data;
  },

  async update(id: number, data: components["schemas"]["UpdateUserRequest"]) {
    const res = await api.put<components["schemas"]["SuccessResponse_User"]>(`/api/users/${id}`, data);
    return res.data.data;
  },

  async delete(id: number) {
    await api.delete(`/api/users/${id}`);
  },
};
