"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Package, LayoutGrid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ItemCell from "@/components/features/item/ItemCell";
import { Item } from "@/types/inventory";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

const ResponsiveMasonry = dynamic(
  () => import("react-responsive-masonry").then((mod) => mod.ResponsiveMasonry),
  { ssr: false, loading: () => <div>Loading grid...</div> }
);

const Masonry = dynamic(
  () => import("react-responsive-masonry").then((mod) => mod.default),
  { ssr: false }
);

interface InventoryGridProps {
  items: Item[] | undefined;
  selectedCategory: string;
  categories: any[];
  onTake: (params: { itemId: Id<"items">; count: number }) => Promise<any>;
  onReturn: (params: { itemId: Id<"items">; count: number }) => Promise<any>;
  onRemoveUnits: (params: {
    itemId: Id<"items">;
    count: number;
  }) => Promise<any>;
  onLoadMore: (numItems: number) => void;
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
}

type ViewMode = "grid" | "list";

export default function InventoryGrid({
  items,
  selectedCategory,
  categories,
  onTake,
  onReturn,
  onRemoveUnits,
  onLoadMore,
  status,
}: InventoryGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const categoryName =
    selectedCategory === "all"
      ? "All Items"
      : (categories.find((c: any) => c.category._id === selectedCategory)
          ?.category.name ?? "Other");

  return (
    <div>
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold mt-4">{categoryName}</h2>

        <div className="flex items-center gap-3 mt-4">
          <span className="text-sm text-muted-foreground">
            {items?.length ?? 0} items
          </span>

          {/* View Toggle Buttons */}
          <ButtonGroup orientation="horizontal">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-3"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-3"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {!items ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Loading inventory...</p>
            </div>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No items found</p>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        // Grid View (existing masonry layout)
        <ResponsiveMasonry columnsCountBreakPoints={{ 700: 1, 1200: 2 }}>
          <Masonry>
            {items.map((item: Item) => (
              <div key={item._id} className="w-full">
                <ItemCell
                  item={item}
                  viewMode="grid"
                  onTake={async (count) => onTake({ itemId: item._id, count })}
                  onReturn={async (count) =>
                    onReturn({ itemId: item._id, count })
                  }
                  onRemoveUnits={async (count) =>
                    onRemoveUnits({ itemId: item._id, count })
                  }
                />
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        // List View (compact vertical list)
        <div className="space-y-2">
          {items.map((item: Item) => (
            <ItemCell
              key={item._id}
              item={item}
              viewMode="list"
              onTake={async (count) => onTake({ itemId: item._id, count })}
              onReturn={async (count) => onReturn({ itemId: item._id, count })}
              onRemoveUnits={async (count) =>
                onRemoveUnits({ itemId: item._id, count })
              }
            />
          ))}
        </div>
      )}

      {status === "CanLoadMore" && (
        <div className="flex w-full justify-center py-4">
          <Button onClick={() => onLoadMore(20)}>Load More</Button>
        </div>
      )}
      {status === "LoadingFirstPage" && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      {status === "LoadingMore" && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
}
