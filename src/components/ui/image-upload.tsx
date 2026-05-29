"use client";
import { useState, useRef } from "react";
import { Upload, X, Link } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, error, disabled }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState("");
  const [preview, setPreview] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      setPreview(urlInput);
      onChange(urlInput);
      setUrlInput("");
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
          preview ? "border-transparent" : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {preview ? (
          <div className="relative w-full">
            <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-md object-contain" />
            {!disabled && (
              <Button type="button" variant="destructive" size="icon" className="absolute -right-2 -top-2 h-6 w-6 rounded-full" onClick={handleRemove}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              disabled={disabled}
            />
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
              Browse
            </Button>
          </>
        )}
      </div>
      {!preview && (
        <div className="flex gap-2">
          <Input placeholder="Or paste image URL..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} disabled={disabled} />
          <Button type="button" variant="outline" size="sm" onClick={handleUrlSubmit} disabled={disabled || !urlInput}>
            <Link className="h-3 w-3 mr-1" /> Set
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
