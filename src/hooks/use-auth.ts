"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { components } from "@/types/api";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, logout, setLoading } =
    useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: components["schemas"]["LoginRequest"]) => authService.login(data),
    onSuccess: (res) => {
      const payload = res.data!;
      login(payload.user!, payload.token!, payload.refresh_token!);
      router.push("/");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
      router.push("/login");
    },
  });

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      setLoading(true);
      try {
        const userData = await authService.me();
        useAuthStore.getState().setUser(userData ?? null);
        return userData;
      } catch {
        useAuthStore.getState().logout();
        return null;
      } finally {
        setLoading(false);
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
  });

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || sessionQuery.isLoading,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    isLoginPending: loginMutation.isPending,
    logout: logoutMutation.mutate,
    refetchSession: sessionQuery.refetch,
  };
}
