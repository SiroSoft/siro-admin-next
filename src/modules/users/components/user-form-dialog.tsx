"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "@/modules/users/components/user-form";
import type { components } from "@/types/api";
import type { CreateUserFormData, UpdateUserFormData } from "@/modules/users/schemas/user.schema";

type User = components["schemas"]["User"];

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void;
  isPending: boolean;
}

export function UserFormDialog({ open, onOpenChange, user, onSubmit, isPending }: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update the user details below." : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>
        <UserForm user={user} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
