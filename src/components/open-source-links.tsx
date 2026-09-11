"use client";

import { Star, Rocket, Copy, Check } from "lucide-react";
import { useState } from "react";

const UTM = "?utm_source=admin-demo&utm_medium=footer";
const TEMPLATE_URL = `https://github.com/SiroSoft/siro-admin-next${UTM}`;
const SKELETON_URL = `https://github.com/SiroSoft/SiroPHP${UTM}`;
const COMPOSER_CMD = "composer create-project sirosoft/api my-app";

export function OpenSourceLinks({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyCmd = async () => {
    try {
      await navigator.clipboard.writeText(COMPOSER_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <a href={TEMPLATE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
          <Star className="h-3.5 w-3.5" /> Star the template
        </a>
        <a href={SKELETON_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
          <Rocket className="h-3.5 w-3.5" /> Get SiroPHP skeleton
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 text-card-foreground">
      <p className="text-sm font-semibold">Deploy your own</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Liked the demo? Grab the code and run it yourself.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={TEMPLATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <Star className="h-4 w-4" /> Star the template
        </a>
        <a
          href={SKELETON_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Rocket className="h-4 w-4" /> Get SiroPHP skeleton
        </a>
      </div>
      <button
        type="button"
        onClick={copyCmd}
        className="mt-2 flex w-full items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground hover:text-foreground"
        aria-label="Copy composer command"
      >
        <span className="truncate">{COMPOSER_CMD}</span>
        {copied ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
      </button>
    </div>
  );
}
