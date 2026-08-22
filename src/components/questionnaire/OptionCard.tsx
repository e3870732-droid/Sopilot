"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  description: string;
  flow?: string;
}

export function OptionCard({ selected, onClick, label, description, flow }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-xl border bg-card p-5 text-left shadow-sm transition-all",
        "hover:border-primary/60 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary ring-2 ring-primary/15"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-base font-medium">{label}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
          {flow ? (
            <div className="inline-flex rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {flow}
            </div>
          ) : null}
        </div>
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            selected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
          )}
        >
          {selected ? <Check className="h-3 w-3" /> : null}
        </span>
      </div>
    </button>
  );
}
