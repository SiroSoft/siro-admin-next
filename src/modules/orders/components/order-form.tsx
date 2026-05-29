"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createOrderSchema,
  updateOrderSchema,
  type CreateOrderFormData,
  type UpdateOrderFormData,
} from "@/modules/orders/schemas/order.schema";
import type { components } from "@/types/api";

type Order = components["schemas"]["Order"];

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: CreateOrderFormData | UpdateOrderFormData) => void;
  isPending: boolean;
}

export function OrderForm({ order, onSubmit, isPending }: OrderFormProps) {
  const isEdit = !!order;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEdit ? updateOrderSchema : createOrderSchema),
    defaultValues: isEdit
      ? {
          status: order?.status ?? "pending",
          shipping_address: order?.shipping_address ?? "",
          billing_address: order?.billing_address ?? "",
          notes: order?.notes ?? "",
        }
      : { items: [{ product_id: undefined, quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  if (isEdit) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={watch("status")} onValueChange={(v) => setValue("status", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" {...register("notes")} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Order
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        <Label>Order Items</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-xs">Product ID</Label>
              <Input type="number" {...register(`items.${index}.product_id` as any)} placeholder="Product ID" />
            </div>
            <div className="w-24">
              <Label className="text-xs">Qty</Label>
              <Input type="number" {...register(`items.${index}.quantity` as any)} placeholder="1" />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ product_id: undefined, quantity: 1 })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
        {(errors as any).items && <p className="text-sm text-destructive">{(errors as any).items.message || "Items validation error"}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shipping_address">Shipping Address</Label>
        <Input id="shipping_address" {...register("shipping_address")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="billing_address">Billing Address</Label>
        <Input id="billing_address" {...register("billing_address")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" {...register("notes")} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Order
        </Button>
      </div>
    </form>
  );
}
