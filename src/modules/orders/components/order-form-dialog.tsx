"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderForm } from "@/modules/orders/components/order-form";
import { useI18n } from "@/providers/i18n-provider";
import type { components } from "@/types/api";
import type { CreateOrderFormData, UpdateOrderFormData } from "@/modules/orders/schemas/order.schema";

type Order = components["schemas"]["Order"];

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
  onSubmit: (data: CreateOrderFormData | UpdateOrderFormData) => void;
  isPending: boolean;
}

export function OrderFormDialog({ open, onOpenChange, order, onSubmit, isPending }: OrderFormDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{order ? t("orders.create") : t("orders.create")}</DialogTitle>
          <DialogDescription>
            {order ? t("orders.detail") : t("orders.create")}
          </DialogDescription>
        </DialogHeader>
        <OrderForm order={order} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
