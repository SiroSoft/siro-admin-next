"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsService } from "@/services/posts.service";
import { toast } from "@/hooks/use-toast";

export function usePosts(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ["posts", params],
    queryFn: () => postsService.list(params),
  });

  return {
    posts: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => postsService.get(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ title: "Post created", description: "Post has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create post.", variant: "destructive" });
    },
  });
}

export function useUpdatePost(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ title: "Post updated", description: "Post has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update post.", variant: "destructive" });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ title: "Post deleted", description: "Post has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
    },
  });
}
