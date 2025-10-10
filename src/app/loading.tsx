import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        <div className="space-y-2 animate-pulse">
          <div className="h-10 w-64 bg-muted rounded" />
          <div className="h-5 w-96 bg-muted rounded" />
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Package className="h-12 w-12 mx-auto text-muted-foreground animate-spin" />
              <p className="text-muted-foreground">Loading inventory...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
