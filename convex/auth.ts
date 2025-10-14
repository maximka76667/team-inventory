import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import GitHub from "@auth/core/providers/github";

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
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (!allowedUser) {
        console.log("Email not in allowlist:", email);
        throw new Error(
          "Access denied. Your email is not authorized. Contact your team admin."
        );
      }

      console.log("Found allowed user:", allowedUser._id);

      const tokenIdentifier = args.tokenIdentifier;

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

/**
 * Get current user (returns null if not authenticated)
 */
// export async function getCurrentUserOrNull(ctx: QueryCtx | MutationCtx) {
//   const identity = await ctx.auth.getUserIdentity();

//   console.log("getCurrentUserOrNull - identity:", identity);

//   if (!identity) return null;

//   const user = await ctx.db
//     .query("users")
//     .withIndex("by_token", (q) =>
//       q.eq("tokenIdentifier", identity.tokenIdentifier)
//     )
//     .first();

//   console.log("getCurrentUserOrNull - found user:", user);

//   return user;
// }

// Query to get current user info
// export const viewer = query({
//   args: {},
//   handler: async (ctx) => {
//     return await getCurrentUserOrNull(ctx);
//   },
// });
