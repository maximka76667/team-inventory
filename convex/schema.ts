import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),
  items: defineTable({
    body: v.string(),
    totalCount: v.number(),
    createdBy: v.union(v.string(), v.null()),
    categoryId: v.union(v.id("categories"), v.null()),
  })
    .index("by_category", ["categoryId"])
    .index("by_body", ["body"]),
  holdings: defineTable({
    itemId: v.id("items"),
    user: v.string(),
    count: v.number(),
  })
    .index("by_item", ["itemId"])
    .index("by_user", ["user"]),
});
