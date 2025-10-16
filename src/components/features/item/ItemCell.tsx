"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ChevronDown, ChevronRight, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Item } from "@/types/inventory";
import ItemDetails from "./ItemDetails";
import ActionButtonGroup from "./ActionButtonGroup";
import AvailabilityBadge from "./AvailabilityBadge";
import StatsDisplay from "./StatsDisplay";
import { createAsyncHandler } from "@/lib/utils";

interface ItemCellProps {
  item: Item;
  onTake: (
    count: number
  ) => Promise<{ success: boolean; newHeldCount: number }>;
  onReturn: (
    count: number
  ) => Promise<{ success: boolean; remainingHeld: number }>;
  onRemoveUnits: (
    count: number
  ) => Promise<{ deleted: boolean; newTotal?: number }>;
  viewMode: "list" | "grid";
}

export default function ItemCell({
  item,
  onTake,
  onReturn,
  onRemoveUnits,
  viewMode,
}: ItemCellProps) {
  const [takeCount, setTakeCount] = useState<number>(1);
  const [returnCount, setReturnCount] = useState<number>(1);
  const [removeCount, setRemoveCount] = useState<number>(1);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Loading states
  const [isTaking, setIsTaking] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleTake = createAsyncHandler(setIsTaking, () => onTake(takeCount));
  const handleReturn = createAsyncHandler(setIsReturning, () =>
    onReturn(returnCount)
  );
  const handleRemove = createAsyncHandler(setIsRemoving, () =>
    onRemoveUnits(removeCount)
  );

  const isAnyActionLoading = isTaking || isReturning || isRemoving;

  const details = useQuery(
    api.inventory.getItemDetails,
    expanded ? { itemId: item._id } : "skip"
  );

  const available = item.available ?? 0;
  const held = (item.totalCount ?? 0) - available;

  const isCompact = viewMode === "list";

  // Common action buttons
  const renderActionButtons = () => (
    <div
      className={
        isCompact ? "flex flex-wrap gap-1.5" : "flex flex-col sm:flex-row gap-2"
      }
      onClick={(e) => e.stopPropagation()}
    >
      <ActionButtonGroup
        type="take"
        count={takeCount}
        onCountChange={setTakeCount}
        onAction={handleTake}
        isLoading={isTaking}
        isDisabled={available <= 0 || isAnyActionLoading}
        maxCount={available}
        compact={isCompact}
      />
      <ActionButtonGroup
        type="return"
        count={returnCount}
        onCountChange={setReturnCount}
        onAction={handleReturn}
        isLoading={isReturning}
        isDisabled={isAnyActionLoading}
        compact={isCompact}
      />
      <ActionButtonGroup
        type="remove"
        count={removeCount}
        onCountChange={setRemoveCount}
        onAction={handleRemove}
        isLoading={isRemoving}
        isDisabled={available <= 0 || isAnyActionLoading}
        maxCount={available}
        compact={isCompact}
      />
    </div>
  );

  // Common expand/collapse icon
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  // ============================================================================
  // List View
  // ============================================================================

  if (isCompact) {
    return (
      <Card className="overflow-hidden hover:border-primary/50 transition-all duration-200 p-0">
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CardContent className="p-0">
            <CollapsibleTrigger asChild>
              <div className="p-3 flex">
                <div className="h-auto w-full justify-start gap-3 p-0 hover:bg-transparent flex items-center">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Package2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                        {item.body}
                      </h3>
                      <AvailabilityBadge available={available} compact />
                    </div>
                  </div>
                  <div className="shrink-0">
                    <StatsDisplay
                      totalCount={item.totalCount}
                      available={available}
                      held={held}
                      compact
                    />
                  </div>
                  <div className="p-1 rounded hover:bg-accent transition-colors">
                    <ChevronIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="pt-2.5 border-t space-y-2.5 p-3">
                {renderActionButtons()}
                <ItemDetails details={details} item={item} compact />
              </div>
            </CollapsibleContent>
          </CardContent>
        </Collapsible>
      </Card>
    );
  }

  // ============================================================================
  // Grid View
  // ============================================================================

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-200 p-0">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger asChild>
          <div className="h-auto w-full text-left p-0 hover:bg-transparent">
            <CardContent className="w-full p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Package2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 w-full">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {item.body}
                        </h3>
                        <AvailabilityBadge available={available} />
                      </div>
                      <StatsDisplay
                        totalCount={item.totalCount}
                        available={available}
                        held={held}
                      />
                    </div>
                    <div className="mt-1 p-1 rounded hover:bg-accent transition-colors">
                      <ChevronIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              {renderActionButtons()}
            </CardContent>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <ItemDetails details={details} item={item} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
