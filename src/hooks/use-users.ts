"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import type { components } from "@/types/api";
import { toast } from "@/hooks/use-toast";

export function useUsers(params?: Record<string, unknown>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["users", params],
    queryFn: () => usersService.list(params),
  });

  return {
    users: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersService.get(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "User created", description: "User has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create user.", variant: "destructive" });
    },
  });
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "User updated", description: "User has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update user.", variant: "destructive" });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "User deleted", description: "User has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    },
  });
}
