"use client";

import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddItemFormProps {
  newItemText: string;
  setNewItemText: (text: string) => void;
  newItemCount: number;
  setNewItemCount: (count: number) => void;
  createCategoryId: string;
  setCreateCategoryId: (id: string) => void;
  categories: any[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function AddItemForm({
  newItemText,
  setNewItemText,
  newItemCount,
  setNewItemCount,
  createCategoryId,
  setCreateCategoryId,
  categories,
  onSubmit,
}: AddItemFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Add New Item</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-end">
        <div className="space-y-2">
          <Label htmlFor="item-category">Category</Label>
          <Select
            value={createCategoryId}
            onValueChange={setCreateCategoryId}
            required
          >
            <SelectTrigger id="item-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c: any) => (
                <SelectItem key={c.category._id} value={c.category._id}>
                  {c.category.name}
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-name">Item Name *</Label>
          <Input
            id="item-name"
            placeholder="e.g., Laptop, Monitor"
            value={newItemText}
            onChange={(e) => setNewItemText(e.currentTarget.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-count">Quantity</Label>
          <Input
            id="item-count"
            type="number"
            min={1}
            value={newItemCount}
            onChange={(e) =>
              setNewItemCount(parseInt(e.currentTarget.value || "1", 10))
            }
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
    </form>
  );
}
