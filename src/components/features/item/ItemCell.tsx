"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Package2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ButtonGroup, ButtonGroupSeparator } from "../../ui/button-group";
import { Item } from "@/types/inventory";
import ItemDetails from "./ItemDetails";

interface ItemCellProps {
  item: Item;
  user: string;
  onTake: (
    count: number
  ) => Promise<{ success: boolean; newHeldCount: number }>;
  onReturn: (
    count: number
  ) => Promise<{ success: boolean; remainingHeld: number }>;
  onRemoveUnits: (
    count: number
  ) => Promise<{ deleted: boolean; newTotal?: number }>;
}

export default function ItemCell({
  item,
  user,
  onTake,
  onReturn,
  onRemoveUnits,
}: ItemCellProps) {
  const [takeCount, setTakeCount] = useState<number>(1);
  const [returnCount, setReturnCount] = useState<number>(1);
  const [removeCount, setRemoveCount] = useState<number>(1);
  const [expanded, setExpanded] = useState<boolean>(false);

  const details = useQuery(
    api.inventory.getItemDetails,
    expanded ? { itemId: item._id } : "skip"
  );

  const available = item.available ?? 0;
  const held = (item.totalCount ?? 0) - available;

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-200 p-0">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        {/* Main Item Content */}
        <CollapsibleTrigger asChild>
          <div className="bg-card">
            <CardContent className="p-5 space-y-4">
              {/* Header with icon and expand trigger */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Package2 className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    className="flex items-start gap-2 text-left w-full group"
                    aria-expanded={expanded}
                    aria-label={`${expanded ? "Collapse" : "Expand"} ${item.body} details`}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {item.body}
                        </h3>
                        {available > 0 ? (
                          <Badge variant="secondary" className="gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-white" />
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {item.totalCount}
                          </span>{" "}
                          total
                        </span>
                        <span className="text-green-600 font-medium">
                          {available} available
                        </span>
                        <span className="text-orange-600 font-medium">
                          {held} held
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 p-1 rounded hover:bg-accent transition-colors">
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Take */}
                <ButtonGroup orientation="horizontal" className="flex-1">
                  <Input
                    size={1}
                    type="number"
                    min={1}
                    max={available}
                    value={takeCount}
                    onChange={(e) =>
                      setTakeCount(parseInt(e.currentTarget.value || "1", 10))
                    }
                    className="h-9 flex-1"
                    disabled={available <= 0}
                    aria-label="Quantity to take"
                  />
                  <ButtonGroupSeparator />
                  <Button
                    onClick={() => onTake(takeCount)}
                    disabled={available <= 0}
                    className="flex-2 h-9"
                    size="sm"
                    aria-label={`Take ${takeCount} ${item.body}`}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Take
                  </Button>
                </ButtonGroup>

                {/* Return */}
                <ButtonGroup orientation="horizontal" className="flex-1">
                  <Input
                    type="number"
                    min={1}
                    value={returnCount}
                    onChange={(e) =>
                      setReturnCount(parseInt(e.currentTarget.value || "1", 10))
                    }
                    className="h-9 flex-1"
                    aria-label="Quantity to return"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => onReturn(returnCount)}
                    className="flex-2 h-9"
                    size="sm"
                    aria-label={`Return ${returnCount} ${item.body}`}
                  >
                    <Minus className="mr-1.5 h-3.5 w-3.5" />
                    Return
                  </Button>
                </ButtonGroup>

                {/* Remove */}
                <ButtonGroup orientation="horizontal" className="flex flex-1">
                  <Input
                    type="number"
                    min={1}
                    max={available}
                    value={removeCount}
                    onChange={(e) =>
                      setRemoveCount(parseInt(e.currentTarget.value || "1", 10))
                    }
                    className="h-9 flex-1"
                    disabled={available <= 0}
                    aria-label="Quantity to remove"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => onRemoveUnits(removeCount)}
                    disabled={available <= 0}
                    className="flex-2 h-9"
                    size="sm"
                    aria-label={`Remove ${removeCount} ${item.body}`}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Remove
                  </Button>
                </ButtonGroup>
              </div>
            </CardContent>
          </div>
        </CollapsibleTrigger>

        {/* Collapsible Details */}
        <CollapsibleContent>
          <ItemDetails details={details} item={item} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
