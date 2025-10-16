import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    email: v.string(),
    approved: v.boolean(),
    role: v.string(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),

  items: defineTable({
    body: v.string(),
    totalCount: v.number(),
    createdBy: v.id("users"),
    categoryId: v.union(v.id("categories"), v.null()),
  })
    .index("by_category", ["categoryId"])
    .index("by_body", ["body"])
    .searchIndex("search_body", {
      searchField: "body",
      filterFields: ["categoryId"],
    }),

  holdings: defineTable({
    itemId: v.id("items"),
    userId: v.id("users"),
    userName: v.string(),
    count: v.number(),
  })
    .index("by_item", ["itemId"])
    .index("by_user", ["userId"]),
});
