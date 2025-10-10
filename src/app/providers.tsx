"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // Memoize client to prevent recreation on re-renders
  const client = useMemo(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
    }
    return new ConvexReactClient(convexUrl);
  }, []);

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
