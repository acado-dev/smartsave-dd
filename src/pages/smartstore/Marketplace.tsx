import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store } from "lucide-react";

export default function SmartStoreMarketplace() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">B2B Marketplace</h1>
          <p className="text-muted-foreground mt-1">Sell surplus inventory to other businesses</p>
        </div>
        <Button>
          <Store className="h-4 w-4 mr-2" />
          List Items
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available for Bulk Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Sample Product {item}</p>
                  <p className="text-sm text-muted-foreground">Available for bulk orders</p>
                </div>
                <Badge>Available</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
