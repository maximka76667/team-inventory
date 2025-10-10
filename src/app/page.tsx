import PageContainer from "@/components/layout/PageContainer";
import AppHeader from "@/components/layout/AppHeader";
import SkipToContent from "@/components/layout/SkipToContent";
import InventoryClient from "@/components/features/inventory/InventoryClient";
import AppFooter from "@/components/layout/AppFooter";

export default function Home() {
  return (
    <>
      <SkipToContent />
      <PageContainer>
        <AppHeader
          title="Team Inventory"
          description="Manage and track your team's equipment and resources"
        />

        <main id="main-content">
          <InventoryClient />
        </main>
      </PageContainer>
      <AppFooter />
    </>
  );
}
