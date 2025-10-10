import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate how many units of an item are currently held by users
 */
async function getHeldCount(
  ctx: QueryCtx | MutationCtx,
  itemId: Id<"items">
): Promise<number> {
  const holdings = await ctx.db
    .query("holdings")
    .withIndex("by_item", (q) => q.eq("itemId", itemId))
    .collect();
  return holdings.reduce((sum, h) => sum + h.count, 0);
}

/**
 * Enrich items with availability info (available = total - held)
 */
async function enrichItemsWithAvailability(
  ctx: QueryCtx | MutationCtx,
  items: Array<any>
) {
  const results = [];
  for (const item of items) {
    const held = await getHeldCount(ctx, item._id);
    results.push({
      ...item,
      available: Math.max(0, item.totalCount - held),
    });
  }
  return results;
}

/**
 * Normalize and validate count input
 */
function normalizeCount(count: number | undefined, min = 1): number {
  return Math.max(min, Math.floor(count ?? 1));
}

// ============================================================================
// Item Queries
// ============================================================================

export const getItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("items").order("desc").take(200);
    return await enrichItemsWithAvailability(ctx, items);
  },
});

export const getItemsByCategory = query({
  args: { categoryId: v.union(v.id("categories"), v.null()) },
  handler: async (ctx, { categoryId }) => {
    const items = await ctx.db
      .query("items")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId as any))
      .collect();
    return await enrichItemsWithAvailability(ctx, items);
  },
});

export const getItemDetails = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, { itemId }) => {
    const item = await ctx.db.get(itemId);
    if (!item) throw new Error("Item not found");

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_item", (q) => q.eq("itemId", itemId))
      .collect();

    const held = holdings.reduce((sum, h) => sum + h.count, 0);
    const available = Math.max(0, item.totalCount - held);

    return { item, holdings, available };
  },
});

// ============================================================================
// Item Mutations
// ============================================================================

export const addItem = mutation({
  args: {
    body: v.string(),
    user: v.string(),
    categoryId: v.union(v.id("categories"), v.null()),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = normalizeCount(args.count);

    // Check if item already exists (upsert by body)
    const existing = await ctx.db
      .query("items")
      .withIndex("by_body", (q) => q.eq("body", args.body))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        totalCount: existing.totalCount + count,
      });
      return existing._id;
    }

    // Create new item
    return await ctx.db.insert("items", {
      body: args.body,
      totalCount: count,
      createdBy: args.user,
      categoryId: args.categoryId,
    });
  },
});

export const removeItemUnits = mutation({
  args: {
    itemId: v.id("items"),
    count: v.optional(v.number()),
  },
  handler: async (ctx, { itemId, count }) => {
    const item = await ctx.db.get(itemId);
    if (!item) throw new Error("Item not found");

    const held = await getHeldCount(ctx, itemId);
    const available = Math.max(0, item.totalCount - held);
    const removeCount = normalizeCount(count);

    if (removeCount > available) {
      throw new Error(
        `Cannot remove ${removeCount} units; only ${available} available (${held} held by users)`
      );
    }

    const newTotal = item.totalCount - removeCount;

    if (newTotal <= 0) {
      // Delete the item entirely if total reaches zero
      await ctx.db.delete(itemId);
      return { deleted: true };
    }

    await ctx.db.patch(itemId, { totalCount: newTotal });
    return { deleted: false, newTotal };
  },
});

export const takeItem = mutation({
  args: {
    itemId: v.id("items"),
    user: v.string(),
    count: v.optional(v.number()),
  },
  handler: async (ctx, { itemId, user, count }) => {
    const item = await ctx.db.get(itemId);
    if (!item) throw new Error("Item not found");

    const takeCount = normalizeCount(count);
    const held = await getHeldCount(ctx, itemId);
    const available = item.totalCount - held;

    if (takeCount > available) {
      throw new Error(`Only ${available} units available`);
    }

    // Find or create holding record for this user
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_item", (q) => q.eq("itemId", itemId))
      .collect();

    const myHolding = holdings.find((h) => h.user === user);

    if (myHolding) {
      await ctx.db.patch(myHolding._id, {
        count: myHolding.count + takeCount,
      });
    } else {
      await ctx.db.insert("holdings", {
        itemId,
        user,
        count: takeCount,
      });
    }

    return { success: true, newHeldCount: (myHolding?.count ?? 0) + takeCount };
  },
});

export const returnItem = mutation({
  args: {
    itemId: v.id("items"),
    user: v.string(),
    count: v.optional(v.number()),
  },
  handler: async (ctx, { itemId, user, count }) => {
    const returnCount = normalizeCount(count);

    const myHolding = await ctx.db
      .query("holdings")
      .withIndex("by_user", (q) => q.eq("user", user))
      .filter((q) => q.eq(q.field("itemId"), itemId))
      .first();

    if (!myHolding) {
      throw new Error("You don't hold this item");
    }

    if (myHolding.count < returnCount) {
      throw new Error(`You only hold ${myHolding.count} units`);
    }

    const newCount = myHolding.count - returnCount;

    if (newCount === 0) {
      await ctx.db.delete(myHolding._id);
      return { success: true, remainingHeld: 0 };
    }

    await ctx.db.patch(myHolding._id, { count: newCount });
    return { success: true, remainingHeld: newCount };
  },
});

export const setItemCategory = mutation({
  args: {
    itemId: v.id("items"),
    categoryId: v.union(v.id("categories"), v.null()),
  },
  handler: async (ctx, { itemId, categoryId }) => {
    const item = await ctx.db.get(itemId);
    if (!item) throw new Error("Item not found");
    await ctx.db.patch(itemId, { categoryId });
  },
});

// ============================================================================
// Holdings Queries
// ============================================================================

export const getHoldingsByUser = query({
  args: { user: v.string() },
  handler: async (ctx, { user }) => {
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_user", (q) => q.eq("user", user))
      .collect();

    // Enrich with item details
    const enriched = await Promise.all(
      holdings.map(async (h) => {
        const item = await ctx.db.get(h.itemId);
        return { ...h, item };
      })
    );

    return enriched;
  },
});

// ============================================================================
// Category Queries & Mutations
// ============================================================================

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getCategoriesWithCounts = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();

    const counts = await Promise.all(
      categories.map(async (c) => {
        const items = await ctx.db
          .query("items")
          .withIndex("by_category", (q) => q.eq("categoryId", c._id))
          .collect();
        return { category: c, itemCount: items.length };
      })
    );

    const uncategorized = await ctx.db
      .query("items")
      .withIndex("by_category", (q) => q.eq("categoryId", null as any))
      .collect();

    return {
      categories: counts,
      uncategorizedCount: uncategorized.length,
    };
  },
});

export const upsertCategory = mutation({
  args: { name: v.string(), slug: v.string() },
  handler: async (ctx, { name, slug }) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { name });
      return existing._id;
    }

    return await ctx.db.insert("categories", { name, slug });
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, { categoryId }) => {
    // Check if any items use this category
    const items = await ctx.db
      .query("items")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .collect();

    if (items.length > 0) {
      throw new Error(
        `Cannot delete category: ${items.length} items still assigned to it`
      );
    }

    await ctx.db.delete(categoryId);
    return { success: true };
  },
});
