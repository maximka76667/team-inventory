"use client";

import dynamic from "next/dynamic";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ItemCell from "@/components/features/item/ItemCell";
import { Item } from "@/types/inventory";
import { Id } from "../../../../convex/_generated/dataModel";

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
  user: string;
  onTake: (params: {
    itemId: Id<"items">;
    user: string;
    count: number;
  }) => Promise<any>;
  onReturn: (params: {
    itemId: Id<"items">;
    user: string;
    count: number;
  }) => Promise<any>;
  onRemoveUnits: (params: {
    itemId: Id<"items">;
    count: number;
  }) => Promise<any>;
}

export default function InventoryGrid({
  items,
  selectedCategory,
  categories,
  user,
  onTake,
  onReturn,
  onRemoveUnits,
}: InventoryGridProps) {
  const categoryName =
    selectedCategory === "all"
      ? "All Items"
      : (categories.find((c: any) => c.category._id === selectedCategory)
          ?.category.name ?? "Other");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold mt-4">{categoryName}</h2>
        <span className="text-sm text-muted-foreground mt-4">
          {items?.length ?? 0} items
        </span>
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
              <p className="text-muted-foreground">
                No items in this category yet
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ResponsiveMasonry columnsCountBreakPoints={{ 700: 1, 1200: 2 }}>
          <Masonry>
            {items.map((item: Item) => (
              <div key={item._id} className="w-full">
                <ItemCell
                  item={item}
                  user={user}
                  onTake={async (count) =>
                    onTake({ itemId: item._id, user, count })
                  }
                  onReturn={async (count) =>
                    onReturn({ itemId: item._id, user, count })
                  }
                  onRemoveUnits={async (count) =>
                    onRemoveUnits({ itemId: item._id, count })
                  }
                />
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
}
