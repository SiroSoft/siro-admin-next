"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsService } from "@/services/tags.service";
import { toast } from "@/hooks/use-toast";

export function useTags(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ["tags", params],
    queryFn: () => tagsService.list(params),
  });

  return {
    tags: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useTag(id: number) {
  return useQuery({
    queryKey: ["tags", id],
    queryFn: () => tagsService.get(id),
    enabled: !!id,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => tagsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast({ title: "Tag created", description: "Tag has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create tag.", variant: "destructive" });
    },
  });
}

export function useUpdateTag(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => tagsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast({ title: "Tag updated", description: "Tag has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update tag.", variant: "destructive" });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tagsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast({ title: "Tag deleted", description: "Tag has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete tag.", variant: "destructive" });
    },
  });
}
