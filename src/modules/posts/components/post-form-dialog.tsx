"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostForm } from "@/modules/posts/components/post-form";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Create Post"}</DialogTitle>
          <DialogDescription>
            {post ? "Update the post details below." : "Fill in the details to create a new post."}
          </DialogDescription>
        </DialogHeader>
        <PostForm post={post} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
