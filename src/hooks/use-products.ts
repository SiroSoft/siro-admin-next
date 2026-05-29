"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { toast } from "@/hooks/use-toast";

export function useProducts(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.list(params),
  });

  return {
    products: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productsService.get(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product created", description: "Product has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create product.", variant: "destructive" });
    },
  });
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product updated", description: "Product has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update product.", variant: "destructive" });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted", description: "Product has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
    },
  });
}
