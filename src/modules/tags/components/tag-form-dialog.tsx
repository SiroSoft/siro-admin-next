"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TagForm } from "@/modules/tags/components/tag-form";
import { useI18n } from "@/providers/i18n-provider";
import type { components } from "@/types/api";

type Tag = components["schemas"]["Tag"];

interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function TagFormDialog({ open, onOpenChange, tag, onSubmit, isPending }: TagFormDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tag ? t("tags.edit") : t("tags.create")}</DialogTitle>
          <DialogDescription>
            {tag ? t("tags.edit") : t("tags.create")}
          </DialogDescription>
        </DialogHeader>
        <TagForm tag={tag} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
