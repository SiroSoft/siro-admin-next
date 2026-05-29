import api from "./api";
import type { components } from "@/types/api";

type Category = components["schemas"]["Category"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

export interface CategoriesResponse {
  data: Category[];
  meta: PaginationMeta;
}

export const categoriesService = {
  async list(params?: Record<string, unknown>) {
    const res = await api.get<CategoriesResponse>("/api/categories", { params });
    return res.data;
  },

  async get(id: number) {
    const res = await api.get<components["schemas"]["SuccessResponse_Category"]>(`/api/categories/${id}`);
    return res.data.data;
  },

  async create(data: components["schemas"]["CreateCategoryRequest"]) {
    const res = await api.post<components["schemas"]["SuccessResponse_Category"]>("/api/categories", data);
    return res.data.data;
  },

  async update(id: number, data: components["schemas"]["UpdateCategoryRequest"]) {
    const res = await api.put<components["schemas"]["SuccessResponse_Category"]>(`/api/categories/${id}`, data);
    return res.data.data;
  },

  async delete(id: number) {
    await api.delete(`/api/categories/${id}`);
  },
};
