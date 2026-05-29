"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories.service";
import { toast } from "@/hooks/use-toast";

export function useCategories(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoriesService.list(params),
  });

  return {
    categories: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoriesService.get(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category created", description: "Category has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create category.", variant: "destructive" });
    },
  });
}

export function useUpdateCategory(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category updated", description: "Category has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update category.", variant: "destructive" });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category deleted", description: "Category has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    },
  });
}
