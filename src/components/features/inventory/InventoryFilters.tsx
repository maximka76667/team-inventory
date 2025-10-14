"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "../../../../convex/_generated/dataModel";

interface InventoryFiltersProps {
  user:
    | {
        _id: Id<"users">;
        _creationTime: number;
        role?: string | undefined;
        approved?: boolean | undefined;
        name: string;
        email: string;
        tokenIdentifier: string;
      }
    | null
    | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: any[];
  uncategorizedCount: number;
  totalItems: number;
}

export default function InventoryFilters({
  user,
  // setUser,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  uncategorizedCount,
  totalItems,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div className="space-y-2 w-full sm:w-64">
        <Label htmlFor="user">Current User</Label>
        <Input
          id="user"
          placeholder="Enter your name"
          value={user?.name}
          // onChange={(e) => setUser(e.currentTarget.value)}
        />
      </div>

      <div className="space-y-2 w-full sm:flex-1">
        <Label htmlFor="search">Search Items</Label>
        <Input
          id="search"
          placeholder="Filter by item name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </div>

      <div className="space-y-2 w-full sm:w-64">
        <Label htmlFor="category-filter">Filter by Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories ({totalItems})</SelectItem>
            {categories.map((c: any) => (
              <SelectItem key={c.category._id} value={c.category._id}>
                {c.category.name} ({c.itemCount})
              </SelectItem>
            ))}
            <SelectItem value="other">Other ({uncategorizedCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
