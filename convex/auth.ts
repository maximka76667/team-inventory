import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import GitHub from "@auth/core/providers/github";
import { v } from "convex/values";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    GitHub,
    // Google({
    //   clientId: process.env.AUTH_GOOGLE_ID,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET,
    // }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const email = args.profile?.email;

      if (!email) {
        throw new Error("Email is required for authentication");
      }

      console.log("Auth attempt for email:", email);

      // First, check if this email is in the allowlist
      const allowedUser = await ctx.db
        .query("users")
        // @ts-ignore-next-line
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (!allowedUser) {
        console.log("Email not in allowlist:", email);
        throw new Error(
          "Access denied. Your email is not authorized. Contact your team admin."
        );
      }

      console.log("Found allowed user:", allowedUser._id);

      const subject = args.profile.email ?? args.profile.phone;
      const tokenIdentifier = `${args.provider.id}|${subject}`;

      console.log("tokenIdentifier:", tokenIdentifier);

      await ctx.db.patch(allowedUser._id, {
        name: args.profile?.name ?? allowedUser.name,
        tokenIdentifier: tokenIdentifier,
      });

      return allowedUser._id;
    },
  },
});

/**
 * Get the current authenticated user
 * Throws error if not authenticated
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Get the full user object
  const user = await ctx.db.get(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.approved) {
    throw new Error("User not authorized");
  }

  return user;
}

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const updateUserName = mutation({
  args: {
    userId: v.id("users"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (currentUser._id !== args.userId) {
      throw new Error("You are not authorized to update this user's name");
    }

    const { userId, newName } = args;

    // Update the user's name
    await ctx.db.patch(userId, { name: newName });

    // Find all holdings for this user
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Update userName in all holdings
    for (const holding of holdings) {
      await ctx.db.patch(holding._id, { userName: newName });
    }

    return { success: true, updatedHoldings: holdings.length };
  },
});
