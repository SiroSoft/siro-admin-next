import { create } from "zustand";
import type { components } from "@/types/api";
import { STORAGE_KEYS } from "@/lib/constants";

type User = components["schemas"]["User"];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  restoreSession: () => User | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  restoreSession: () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({ user, isAuthenticated: true, isLoading: false });
        return user;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    set({ isLoading: false });
    return null;
  },
}));
