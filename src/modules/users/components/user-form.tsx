"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/modules/users/schemas/user.schema";
import type { components } from "@/types/api";

type User = components["schemas"]["User"];

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void;
  isPending: boolean;
}

export function UserForm({ user, onSubmit, isPending }: UserFormProps) {
  const isEdit = !!user;
  const schema = isEdit ? updateUserSchema : createUserSchema;
  type FormData = typeof schema extends typeof updateUserSchema ? UpdateUserFormData : CreateUserFormData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      ...(isEdit ? {} : { password: "", password_confirmation: "" }),
      role: user?.role ?? "viewer",
      status: user?.status ?? "active",
    } as any,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} placeholder="John Doe" disabled={isPending} />
        {(errors as any).name && <p className="text-sm text-destructive">{(errors as any).name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} placeholder="john@example.com" disabled={isPending} />
        {(errors as any).email && <p className="text-sm text-destructive">{(errors as any).email.message}</p>}
      </div>

      {!isEdit && (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password" as any)} placeholder="••••••••" disabled={isPending} />
            {(errors as any).password && (
              <p className="text-sm text-destructive">{(errors as any).password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input id="password_confirmation" type="password" {...register("password_confirmation" as any)} placeholder="••••••••" disabled={isPending} />
            {(errors as any).password_confirmation && (
              <p className="text-sm text-destructive">{(errors as any).password_confirmation.message}</p>
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={watch("role" as any)}
            onValueChange={(v) => setValue("role" as any, v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          {(errors as any).role && <p className="text-sm text-destructive">{(errors as any).role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch("status" as any)}
            onValueChange={(v) => setValue("status" as any, v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          {(errors as any).status && <p className="text-sm text-destructive">{(errors as any).status.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Create"} User
        </Button>
      </div>
    </form>
  );
}
