"use client";

import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Holding, Item } from "@/types/inventory";
import { getCurrentUser } from "../../../../convex/auth";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

interface ItemDetailsProps {
  details:
    | {
        holdings: Holding[];
        available: number;
      }
    | undefined;
  item: Item;
}

export default function ItemDetails({ details, item }: ItemDetailsProps) {
  if (!details) {
    return (
      <div className="bg-muted/40 border-t-2 border-dashed border-border px-5 py-4">
        <p className="text-sm text-muted-foreground text-center py-4">
          Loading details...
        </p>
      </div>
    );
  }

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
