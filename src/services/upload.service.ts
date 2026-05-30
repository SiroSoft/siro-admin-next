import api from "./api";

export const uploadService = {
  async upload(file: File, path = "uploads"): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<{ success: boolean; data: { url: string } }>(`/api/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.url;
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await api.post<{ success: boolean; data: { url: string } }>(`/api/upload/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.url;
  },
};
