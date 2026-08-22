"use client";

import { useState } from "react";
import {
  ArrowRight,
  Boxes,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Megaphone,
  PenLine,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OPERATION_CATEGORIES } from "@/data/categories";
import { getSubcategories } from "@/data/subcategories";
import { cn } from "@/lib/utils";
import type { OperationType } from "@/types/user-profile";
import type { CustomSubcategory } from "@/types/workflow";

const CATEGORY_ICONS: Record<OperationType, LucideIcon> = {
  market_operations: Megaphone,
  content_operations: PenLine,
  user_operations: Users,
  event_operations: CalendarDays,
  growth_operations: TrendingUp,
  ecommerce_operations: ShoppingCart,
  product_operations: Boxes,
  enterprise_operations: Building2
};

interface CategorySelectorProps {
  selectedOperationTypes: OperationType[];
  selectedSubcategoryIds: string[];
  customSubcategories: CustomSubcategory[];
  onToggleOperationType: (id: OperationType) => void;
  onToggleSubcategory: (id: string) => void;
  onAddCustomSubcategory: (operationType: OperationType, name: string) => void;
  onRemoveCustomSubcategory: (operationType: OperationType) => void;
  onSelectAll: (operationType: OperationType) => void;
  onClear: (operationType: OperationType) => void;
  onNext: () => void;
}

export function CategorySelector({
  selectedOperationTypes,
  selectedSubcategoryIds,
  customSubcategories,
  onToggleOperationType,
  onToggleSubcategory,
  onAddCustomSubcategory,
  onRemoveCustomSubcategory,
  onSelectAll,
  onClear,
  onNext
}: CategorySelectorProps) {
  const [customDrafts, setCustomDrafts] = useState<Record<string, string>>({});
  const selectedCount = selectedOperationTypes.length;
  const subcategoryCount = selectedSubcategoryIds.length + customSubcategories.length;

  return (
    <div className="space-y-4 pb-2">
      <div className="space-y-3">
        {OPERATION_CATEGORIES.map((category, index) => {
          const selected = selectedOperationTypes.includes(category.id);
          const subcategories = getSubcategories(category.id);
          const selectedSubs = subcategories.filter((item) => selectedSubcategoryIds.includes(item.id));
          const customSub = customSubcategories.find((item) => item.operationType === category.id);
          const Icon = CATEGORY_ICONS[category.id];

          return (
            <div
              key={category.id}
              className={cn(
                "overflow-hidden rounded-xl border bg-card shadow-sm transition-all",
                selected ? "border-primary shadow-md ring-1 ring-primary/10" : "hover:border-primary/40"
              )}
            >
              <button
                type="button"
                onClick={() => onToggleOperationType(category.id)}
                className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
              >
                <span className="w-6 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    selected ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-muted/40 text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="block text-base font-medium">{category.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">{category.description}</span>
                </span>
                <span className="hidden shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground sm:inline-block">
                  {category.category}
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
                  )}
                >
                  {selected ? <Check className="h-3 w-3" /> : null}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    selected ? "rotate-180" : ""
                  )}
                />
              </button>

              {selected ? (
                <div className="animate-fade-in-down border-t bg-muted/20 p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      选择子类
                      <span className="ml-2 text-xs">已选 {selectedSubs.length + (customSub ? 1 : 0)} 项</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => onSelectAll(category.id)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        全选
                      </button>
                      <span className="text-border">/</span>
                      <button
                        type="button"
                        onClick={() => onClear(category.id)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        清空
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map((subcategory) => {
                      const subSelected = selectedSubcategoryIds.includes(subcategory.id);

                      return (
                        <button
                          key={subcategory.id}
                          type="button"
                          onClick={() => onToggleSubcategory(subcategory.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                            subSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-input bg-background text-foreground hover:border-primary/50"
                          )}
                        >
                          {subSelected ? <Check className="h-3.5 w-3.5" /> : null}
                          {subcategory.name}
                        </button>
                      );
                    })}
                    {customSub ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-primary px-3 py-1.5 text-sm text-primary-foreground shadow-sm">
                        {customSub.name}
                        <button
                          type="button"
                          onClick={() => onRemoveCustomSubcategory(category.id)}
                          className="rounded-full transition-opacity hover:opacity-70"
                          aria-label="删除自定义子类"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <input
                          value={customDrafts[category.id] ?? ""}
                          onChange={(event) =>
                            setCustomDrafts((current) => ({
                              ...current,
                              [category.id]: event.target.value
                            }))
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              const name = (customDrafts[category.id] ?? "").trim();
                              if (name) {
                                onAddCustomSubcategory(category.id, name);
                                setCustomDrafts((current) => ({ ...current, [category.id]: "" }));
                              }
                            }
                          }}
                          placeholder="添加其他子类"
                          className="h-9 w-40 rounded-full border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const name = (customDrafts[category.id] ?? "").trim();
                            if (name) {
                              onAddCustomSubcategory(category.id, name);
                              setCustomDrafts((current) => ({ ...current, [category.id]: "" }));
                            }
                          }}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          添加
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 rounded-xl border bg-background/90 p-4 shadow-lg backdrop-blur">
        <div className="text-sm text-muted-foreground">
          已选 <span className="font-semibold text-foreground">{selectedCount}</span> 个大类
          <span className="mx-2 text-border">·</span>
          <span className="font-semibold text-foreground">{subcategoryCount}</span> 个子类
        </div>
        <Button disabled={selectedOperationTypes.length === 0} onClick={onNext}>
          下一步
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
