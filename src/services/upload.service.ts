import api from "./api";

interface UploadResponse {
  success: boolean;
  data: { url: string; path: string; original_name: string; size: number; mime: string };
}

/**
 * Enterprise file upload helper.
 *
 * Usage:
 *   const url = await uploadService.upload(file);
 *   const avatarUrl = await uploadService.uploadAvatar(file);
 */
export const uploadService = {
  /** Upload any file to /api/upload. Returns the full public URL. */
  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<UploadResponse>("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.url;
  },

  /** Upload an avatar to /api/upload/avatar. Returns the full public URL. */
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await api.post<UploadResponse>("/api/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.url;
  },
};
