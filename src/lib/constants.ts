export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Siro Admin";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "siro_access_token",
  REFRESH_TOKEN: "siro_refresh_token",
  USER: "siro_user",
} as const;

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;
