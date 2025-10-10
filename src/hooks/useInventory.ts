import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export function useInventory() {
  const items = useQuery(api.inventory.getItems);
  const addItem = useMutation(api.inventory.addItem);
  const takeItem = useMutation(api.inventory.takeItem);
  const returnItem = useMutation(api.inventory.returnItem);
  const removeItemUnits = useMutation(api.inventory.removeItemUnits);

  const { categories, uncategorizedCount } = useQuery(
    api.inventory.getCategoriesWithCounts
  ) ?? { categories: [], uncategorizedCount: 0 };

  return {
    items,
    categories,
    uncategorizedCount,
    addItem,
    takeItem,
    returnItem,
    removeItemUnits,
  };
}
