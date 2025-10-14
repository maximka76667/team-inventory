"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInventory } from "@/hooks/useInventory";
import { Id } from "../../../../convex/_generated/dataModel";
import { Item } from "@/types/inventory";
import InventoryFilters from "./InventoryFilters";
import AddItemForm from "./AddItemForm";
import InventoryGrid from "./InventoryGrid";

export default function InventoryClient() {
  const {
    categories,
    uncategorizedCount,
    items,
    addItem,
    takeItem,
    returnItem,
    removeItemUnits,
  } = useInventory();

  const user = useQuery(api.auth.currentUser);

  // Create item form state
  const [newItemText, setNewItemText] = useState<string>("");
  const [newItemCount, setNewItemCount] = useState<number>(1);
  const [createCategoryId, setCreateCategoryId] = useState<string>("");

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = useQuery(
    api.inventory.getItemsByCategory,
    selectedCategory === "all"
      ? "skip"
      : {
          categoryId:
            selectedCategory === "other"
              ? null
              : (selectedCategory as Id<"categories"> | null),
        }
  );

  const displayItems = selectedCategory === "all" ? items : filteredItems;

  // Apply search filter on top of category filter
  const searchFilteredItems = displayItems?.filter((item: Item) =>
    item.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = newItemText.trim();
    if (!body || !createCategoryId) return;

    await addItem({
      body,
      count: newItemCount || 1,
      categoryId:
        createCategoryId === "other"
          ? null
          : (createCategoryId as Id<"categories"> | null),
    });

    setNewItemText("");
    setNewItemCount(1);
  };

  return (
    <>
      {/* Controls Card */}
      <Card>
        <CardHeader>
          <CardTitle>Control Panel</CardTitle>
          <CardDescription>
            Select your user, filter items, and add new inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Selection & Filters */}
          <InventoryFilters
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            uncategorizedCount={uncategorizedCount}
            totalItems={items?.length ?? 0}
          />

          <Separator />

          {/* Add Item Form */}
          <AddItemForm
            newItemText={newItemText}
            setNewItemText={setNewItemText}
            newItemCount={newItemCount}
            setNewItemCount={setNewItemCount}
            createCategoryId={createCategoryId}
            setCreateCategoryId={setCreateCategoryId}
            categories={categories}
            onSubmit={handleAddItem}
          />
        </CardContent>
      </Card>

      {/* Items Grid */}
      <InventoryGrid
        items={searchFilteredItems}
        selectedCategory={selectedCategory}
        categories={categories}
        onTake={takeItem}
        onReturn={returnItem}
        onRemoveUnits={removeItemUnits}
      />
    </>
  );
}
