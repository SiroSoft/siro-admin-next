"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { UserForm } from "@/modules/users/components/user-form";
import { useI18n } from "@/providers/i18n-provider";
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
  const { t } = useI18n();
  const [dirty, setDirty] = useState(false);

  const requestClose = () => {
    if (dirty && !window.confirm(t("common.unsavedChanges"))) {
      return;
    }
    setDirty(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) requestClose(); else onOpenChange(next); }}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{user ? t("users.edit") : t("users.create")}</DialogTitle>
          <DialogDescription>
            {user ? t("users.edit") : t("users.create")}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          user={user}
          onSubmit={(data) => { setDirty(false); onSubmit(data); }}
          isPending={isPending}
          onCancel={requestClose}
          onDirtyChange={setDirty}
        />
      </DialogContent>
    </Dialog>
  );
}
