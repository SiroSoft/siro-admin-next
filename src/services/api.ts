import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL, STORAGE_KEYS } from "@/lib/constants";
import type { components } from "@/types/api";

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];
let isRefreshing = false;

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set("X-Request-Id", generateRequestId());
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: "Network Error",
          description: "Unable to connect to the server. Please check your connection.",
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(toastEvent);
      }
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
          : null;

      if (!refreshToken) {
        processQueue(error);
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<
          components["schemas"]["AuthTokenResponse"]
        >(`${API_URL}/api/auth/refresh`, { refresh_token: refreshToken });
        const payload = data.data!;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.token!);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refresh_token!);
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: "Access Denied",
          description: "You do not have permission to perform this action.",
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
    }

    if (status === 422) {
      const data = error.response.data as any;
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0] as string[];
        const toastEvent = new CustomEvent("app:toast", {
          detail: {
            title: "Validation Error",
            description: firstError?.[0] ?? data.message ?? "Please check your input.",
            variant: "destructive",
          },
        });
        if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
      }
    }

    if (status === 429) {
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: "Too Many Requests",
          description: "Please slow down and try again shortly.",
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
    }

    if (status >= 500) {
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: "Server Error",
          description: "An unexpected server error occurred. Please try again later.",
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
    }

    return Promise.reject(error);
  },
);

export default api;
