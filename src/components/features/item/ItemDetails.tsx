"use client";

import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Holding, Item } from "@/types/inventory";

interface ItemDetailsProps {
  details:
    | {
        holdings: Holding[];
        available: number;
      }
    | undefined;
  item: Item;
  compact?: boolean; // Add this prop for list view
}

export default function ItemDetails({ details, item, compact = false }: ItemDetailsProps) {
  if (!details) {
    return (
      <div className={compact ? "px-3 py-2" : "bg-muted/40 border-t-2 border-dashed border-border px-5 py-4"}>
        <p className="text-sm text-muted-foreground text-center py-2">
          Loading details...
        </p>
      </div>
    );
  }

  // Compact list view version
  if (compact) {
    return (
      <div className="pt-3 space-y-2.5">
        {/* Holdings - Compact horizontal layout */}
        {details.holdings.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
            <User className="h-3.5 w-3.5" />
            <span>No one is holding this item</span>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium">Currently held by:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {details.holdings.map((holding: Holding) => (
                <div
                  key={holding._id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 border text-xs"
                >
                  <span className="font-medium">{holding.userName}</span>
                  <Badge variant="secondary" className="h-4 px-1.5 text-xs font-semibold">
                    {holding.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original grid view version (unchanged)
  return (
    <div className="bg-muted/40 border-t-2 border-dashed border-border px-5 py-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Who's holding this?</h4>
          </div>
          <Badge variant="outline">
            {details.holdings.length}{" "}
            {details.holdings.length === 1 ? "person" : "people"}
          </Badge>
        </div>

        {/* Holdings List */}
        {details.holdings.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-lg bg-background/50 border border-dashed">
            <User className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No one is currently holding this item
            </p>
          </div>
        ) : (
          <div className="space-y-2" role="list" aria-label="Holdings list">
            {details.holdings.map((holding: Holding) => {
              return (
                <div
                  key={holding._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors"
                  role="listitem"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{holding.userName}</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {holding.count} {holding.count === 1 ? "unit" : "units"}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Summary */}
        <Separator />
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Total
            </p>
            <p className="text-2xl font-bold">{item.totalCount}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Available
            </p>
            <p className="text-2xl font-bold text-green-600">
              {details.available}
            </p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Held
            </p>
            <p className="text-2xl font-bold text-orange-600">
              {item.totalCount - details.available}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}