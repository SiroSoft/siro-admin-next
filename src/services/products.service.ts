import api from "./api";
import type { components } from "@/types/api";

type Product = components["schemas"]["Product"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export const productsService = {
  async list(params?: Record<string, unknown>) {
    const res = await api.get<ProductsResponse>("/api/products", { params });
    return res.data;
  },

  async get(id: number) {
    const res = await api.get<components["schemas"]["SuccessResponse_Product"]>(`/api/products/${id}`);
    return res.data.data;
  },

  async create(data: components["schemas"]["CreateProductRequest"]) {
    const res = await api.post<components["schemas"]["SuccessResponse_Product"]>("/api/products", data);
    return res.data.data;
  },

  async update(id: number, data: components["schemas"]["UpdateProductRequest"]) {
    const res = await api.put<components["schemas"]["SuccessResponse_Product"]>(`/api/products/${id}`, data);
    return res.data.data;
  },

  async delete(id: number) {
    await api.delete(`/api/products/${id}`);
  },
};
