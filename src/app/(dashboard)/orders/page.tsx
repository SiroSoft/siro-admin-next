"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { OrderTable } from "@/modules/orders/components/order-table";
import { OrderFormDialog } from "@/modules/orders/components/order-form-dialog";
import { useCreateOrder, useUpdateOrder } from "@/hooks/use-orders";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { components } from "@/types/api";

type Order = components["schemas"]["Order"];

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const debouncedSearch = useDebounce(search);

  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder(editOrder?.id ?? 0);

  const params = { page, search: debouncedSearch || undefined, status: status || undefined, per_page: 10 };

  const handleEdit = useCallback((order: Order) => setEditOrder(order), []);

  const handleCreateSubmit = useCallback(
    (data: any) => createMutation.mutate(data, { onSuccess: () => setShowCreate(false) }),
    [createMutation],
  );

  const handleEditSubmit = useCallback(
    (data: any) => updateMutation.mutate(data, { onSuccess: () => setEditOrder(null) }),
    [updateMutation],
  );

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Orders" description="Manage customer orders">
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search orders..." />
      </div>

      <div className="flex flex-wrap gap-1">
        {STATUS_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={status === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(opt.value)}
            className={cn(status === opt.value && "")}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <OrderTable
        onEdit={handleEdit}
        onCreate={() => setShowCreate(true)}
        params={params}
        onParamsChange={(p) => { if (p.page) setPage(p.page as number); }}
      />

      <OrderFormDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
      />

      {editOrder && (
        <OrderFormDialog
          open={!!editOrder}
          onOpenChange={() => setEditOrder(null)}
          order={editOrder}
          onSubmit={handleEditSubmit}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}
