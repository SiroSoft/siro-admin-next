import api from "./api";
import type { components } from "@/types/api";

type Tag = components["schemas"]["Tag"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

export interface TagsResponse {
  data: Tag[];
  meta: PaginationMeta;
}

export const tagsService = {
  async list(params?: Record<string, unknown>) {
    const res = await api.get<TagsResponse>("/api/tags", { params });
    return res.data;
  },

  async get(id: number) {
    const res = await api.get<components["schemas"]["SuccessResponse_Tag"]>(`/api/tags/${id}`);
    return res.data.data;
  },

  async create(data: components["schemas"]["CreateTagRequest"]) {
    const res = await api.post<components["schemas"]["SuccessResponse_Tag"]>("/api/tags", data);
    return res.data.data;
  },

  async update(id: number, data: components["schemas"]["UpdateTagRequest"]) {
    const res = await api.put<components["schemas"]["SuccessResponse_Tag"]>(`/api/tags/${id}`, data);
    return res.data.data;
  },

  async delete(id: number) {
    await api.delete(`/api/tags/${id}`);
  },
};
