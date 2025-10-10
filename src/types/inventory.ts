import { Id } from "../../convex/_generated/dataModel";

export interface Item {
  _id: Id<"items">;
  body: string;
  totalCount: number;
  available: number;
  categoryId: Id<"categories"> | null;
}

export interface Category {
  _id: Id<"categories">;
  name: string;
}

export interface Holding {
  _id: Id<"holdings">;
  user: string;
  count: number;
}
