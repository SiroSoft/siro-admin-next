import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL, STORAGE_KEYS } from "@/lib/constants";
import { getLocaleDictionary } from "@/lib/i18n";
import type { components } from "@/types/api";

function tApi(key: string): string {
  const locale =
    typeof window !== "undefined"
      ? localStorage.getItem("siro_locale") || "en"
      : "en";
  const dict = getLocaleDictionary(locale) as unknown as Record<string, unknown>;
  const fallback = getLocaleDictionary("en") as unknown as Record<string, unknown>;
  const parts = key.split(".");
  const lookup = (obj: Record<string, unknown>): string | null => {
    let current: unknown = obj;
    for (const part of parts) {
      if (current == null || typeof current !== "object") return null;
      current = (current as Record<string, unknown>)[part];
    }
    return typeof current === "string" ? current : null;
  };
  return lookup(dict) ?? lookup(fallback) ?? key;
}

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
    const feToken =
      typeof process !== "undefined" ? process.env.NEXT_PUBLIC_FE_TOKEN : undefined;
    if (feToken) {
      config.headers.set("X-Siro-FE", feToken);
    }
    const locale =
      typeof window !== "undefined"
        ? localStorage.getItem("siro_locale") || "en"
        : "en";
    config.headers.set("X-Locale", locale);
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
          title: tApi("errors.networkTitle"),
          description: tApi("errors.networkDescription"),
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
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
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
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: tApi("errors.accessDeniedTitle"),
          description: tApi("errors.accessDeniedDescription"),
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
    }

    if (status === 404) {
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: tApi("errors.notFoundTitle"),
          description: tApi("errors.notFoundDescription"),
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
    }

    if (status === 422) {
      const body = error.response.data as { errors?: Record<string, string[]>; meta?: { errors?: Record<string, string[]> }; message?: string }
      // skeleton envelope is meta.errors, legacy openapi is top-level errors
      const fieldErrors = (body as { errors?: Record<string,string[]> })?.errors ?? body?.meta?.errors
      const values = fieldErrors ? Object.values(fieldErrors) : []
      const firstError = values[0]?.[0]
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: tApi("errors.validationTitle"),
          description: firstError ?? body?.message ?? tApi("errors.validationFallback"),
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
    }

    if (status === 429) {
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: tApi("errors.rateLimitTitle"),
          description: tApi("errors.rateLimitDescription"),
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
    }

    if (status >= 500) {
      const toastEvent = new CustomEvent("app:toast", {
        detail: {
          title: tApi("errors.serverTitle"),
          description: tApi("errors.serverDescription"),
          variant: "destructive",
        },
      });
      if (typeof window !== "undefined") window.dispatchEvent(toastEvent);
    }

    return Promise.reject(error);
  },
);

export default api;
