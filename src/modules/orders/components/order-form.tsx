"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  createOrderSchema,
  updateOrderSchema,
  type CreateOrderFormData,
  type UpdateOrderFormData,
} from "@/modules/orders/schemas/order.schema";
import { useProducts } from "@/hooks/use-products";
import { useUsers } from "@/hooks/use-users";
import type { components } from "@/types/api";

type Order = components["schemas"]["Order"];

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: CreateOrderFormData | UpdateOrderFormData) => void;
  isPending: boolean;
}

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export function OrderForm({ order, onSubmit, isPending }: OrderFormProps) {
  const isEdit = !!order;
  const { products } = useProducts({ per_page: 200 });
  const { users } = useUsers({ per_page: 200 });

  const productOptions = products.map((p) => ({
    label: `${p.name} (${p.sku})`,
    value: String(p.id),
  }));

  const userOptions = users.map((u) => ({
    label: `${u.name} (${u.email})`,
    value: String(u.id),
  }));

  const methods = useForm<CreateOrderFormData | UpdateOrderFormData>({
    resolver: zodResolver(isEdit ? updateOrderSchema : createOrderSchema),
    defaultValues: isEdit
      ? {
          status: order?.status ?? "pending",
          shipping_address: order?.shipping_address ?? "",
          billing_address: order?.billing_address ?? "",
          notes: order?.notes ?? "",
        }
      : {
          items: [{ product_id: undefined as unknown as number, quantity: 1 }],
          status: "pending",
          customer_id: undefined,
          shipping_address: "",
          billing_address: "",
          notes: "",
        },
  });

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const statusField = (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select value={watch("status") ?? "pending"} onValueChange={(v) => setValue("status", v)} disabled={isPending}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {isEdit ? (
        <>
          {statusField}
          <div className="space-y-2">
            <Label htmlFor="shipping_address">Shipping Address</Label>
            <Textarea id="shipping_address" {...register("shipping_address")} disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billing_address">Billing Address</Label>
            <Textarea id="billing_address" {...register("billing_address")} disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register("notes")} disabled={isPending} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Order
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-3">
            <Label>Order Items</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Product</Label>
                  <Controller
                    control={control}
                    name={`items.${index}.product_id`}
                    render={({ field: itemField }) => (
                      <SearchableSelect
                        options={productOptions}
                        value={itemField.value ? String(itemField.value) : ""}
                        onValueChange={(v) => itemField.onChange(Number(v))}
                        placeholder="Search product..."
                        disabled={isPending}
                      />
                    )}
                  />
                </div>
                <div className="w-24 space-y-1">
                  <Label className="text-xs">Qty</Label>
                  <Input type="number" {...register(`items.${index}.quantity` as const)} placeholder="1" disabled={isPending} />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ product_id: undefined as unknown as number, quantity: 1 })} disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            {"items" in errors && errors.items && <p className="text-sm text-destructive">{(errors.items as { message?: string }).message || "Items validation error"}</p>}
          </div>

          {statusField}

          <div className="space-y-2">
            <Label>Customer</Label>
            <Controller
              control={control}
              name="customer_id"
              render={({ field }) => (
                <SearchableSelect
                  options={userOptions}
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                  placeholder="Search customer..."
                  disabled={isPending}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping_address">Shipping Address</Label>
            <Textarea id="shipping_address" {...register("shipping_address")} disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billing_address">Billing Address</Label>
            <Textarea id="billing_address" {...register("billing_address")} disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register("notes")} disabled={isPending} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
