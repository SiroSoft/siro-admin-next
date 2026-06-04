"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostForm } from "@/modules/posts/components/post-form";
import { useI18n } from "@/providers/i18n-provider";
import type { components } from "@/types/api";

type Post = components["schemas"]["Post"];

interface PostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function PostFormDialog({ open, onOpenChange, post, onSubmit, isPending }: PostFormDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? t("posts.edit") : t("posts.create")}</DialogTitle>
          <DialogDescription>
            {post ? t("posts.edit") : t("posts.create")}
          </DialogDescription>
        </DialogHeader>
        <PostForm post={post} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
