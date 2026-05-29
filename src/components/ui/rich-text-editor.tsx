"use client";

import { useCallback, type ReactNode } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Undo, Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  minHeight?: number;
}

function ToolbarButton({ editor, icon, command, active, label, disabled }: {
  editor: Editor; icon: ReactNode; command: () => void; active?: boolean; label: string; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={command}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "rounded p-1.5 transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {icon}
    </button>
  );
}

export function RichTextEditor({
  value, onChange, placeholder = "Write something...", disabled, error, minHeight = 200,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor: ed }) => onChange?.(ed.getHTML()),
  });

  const setContent = useCallback((html: string) => {
    editor?.commands.setContent(html || "");
  }, [editor]);

  return (
    <div className={cn(
      "rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      error ? "border-destructive" : "border-input",
    )}>
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1.5" role="toolbar" aria-label="Text formatting">
        <ToolbarButton editor={editor!} icon={<Bold className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} label="Bold" disabled={disabled} />
        <ToolbarButton editor={editor!} icon={<Italic className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} label="Italic" disabled={disabled} />
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton editor={editor!} icon={<Heading1 className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })} label="Heading 1" disabled={disabled} />
        <ToolbarButton editor={editor!} icon={<Heading2 className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} label="Heading 2" disabled={disabled} />
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton editor={editor!} icon={<List className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} label="Bullet list" disabled={disabled} />
        <ToolbarButton editor={editor!} icon={<ListOrdered className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} label="Ordered list" disabled={disabled} />
        <ToolbarButton editor={editor!} icon={<Quote className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} label="Quote" disabled={disabled} />
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton editor={editor!} icon={<Undo className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().undo().run()} label="Undo" disabled={disabled} />
        <ToolbarButton editor={editor!} icon={<Redo className="h-3.5 w-3.5" />} command={() => editor?.chain().focus().redo().run()} label="Redo" disabled={disabled} />
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm max-w-none p-3 focus:outline-none",
          disabled && "cursor-not-allowed opacity-60",
        )}
        style={{ minHeight }}
      />
      {error && <p className="px-3 pb-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
