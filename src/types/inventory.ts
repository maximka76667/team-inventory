import { Id } from "../../convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  _creationTime: number;
  role?: string | undefined;
  approved?: boolean | undefined;
  name: string;
  email: string;
  tokenIdentifier: string;
}

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
  userId: Id<"users">;
  userName: string;
  count: number;
}
