"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { toast } from "@/hooks/use-toast";

export function useOrders(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersService.list(params),
  });

  return {
    orders: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersService.get(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ordersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order created", description: "Order has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create order.", variant: "destructive" });
    },
  });
}

export function useUpdateOrder(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ordersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order updated", description: "Order has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update order.", variant: "destructive" });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order deleted", description: "Order has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete order.", variant: "destructive" });
    },
  });
}
