"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      ...(isEdit ? {} : { password: "", password_confirmation: "" }),
      role: user?.role ?? "viewer",
      status: user?.status ?? "active",
      avatar: user?.avatar ?? "",
      phone: user?.["phone" as keyof User] ?? "",
    } as CreateUserFormData | UpdateUserFormData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Avatar</Label>
        <ImageUpload value={watch("avatar") ?? ""} onChange={(v) => setValue("avatar", v)} disabled={isPending} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} placeholder="John Doe" disabled={isPending} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} placeholder="john@example.com" disabled={isPending} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" {...register("phone")} placeholder="+1 (555) 000-0000" disabled={isPending} />
      </div>

      {!isEdit && (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} placeholder="••••••••" disabled={isPending} />
            {"password" in errors && <p className="text-sm text-destructive">{String((errors as { password?: { message?: string } }).password?.message)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input id="password_confirmation" type="password" {...register("password_confirmation")} placeholder="••••••••" disabled={isPending} />
            {"password_confirmation" in errors && <p className="text-sm text-destructive">{String((errors as { password_confirmation?: { message?: string } }).password_confirmation?.message)}</p>}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={watch("role")}
            onValueChange={(v) => setValue("role", v)}
            disabled={isPending}
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
          {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(v) => setValue("status", v)}
            disabled={isPending}
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
          {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
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
