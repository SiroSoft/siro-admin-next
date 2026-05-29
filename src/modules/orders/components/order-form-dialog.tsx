"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderForm } from "@/modules/orders/components/order-form";
import type { components } from "@/types/api";

type Order = components["schemas"]["Order"];

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function OrderFormDialog({ open, onOpenChange, order, onSubmit, isPending }: OrderFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Create Order"}</DialogTitle>
          <DialogDescription>
            {order ? "Update the order details below." : "Fill in the details to create a new order."}
          </DialogDescription>
        </DialogHeader>
        <OrderForm order={order} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
