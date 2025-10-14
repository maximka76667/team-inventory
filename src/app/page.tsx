"use client";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { api } from "../../convex/_generated/api";
import PageContainer from "@/components/layout/PageContainer";
import AppHeader from "@/components/layout/AppHeader";
import SkipToContent from "@/components/layout/SkipToContent";
import InventoryClient from "@/components/features/inventory/InventoryClient";
import AppFooter from "@/components/layout/AppFooter";
import { SignInPage } from "@/components/features/auth/SignInPage";

export default function Home() {
  const { isLoading } = useConvexAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Unauthenticated>
        <SignInPage />
      </Unauthenticated>

      <Authenticated>
        <SkipToContent />
        <PageContainer>
          <AppHeader title="Team Inventory" description={`Welcome back!`} />

          <main id="main-content">
            <InventoryClient />
          </main>
        </PageContainer>
        <AppFooter />
      </Authenticated>
    </>
  );
}
