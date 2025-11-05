import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";

export default function Inventory() {
  const inventoryItems = [
    {
      id: 1,
      name: "Organic Milk",
      category: "Dairy",
      quantity: 24,
      unit: "units",
      expiryDate: "2025-11-07",
      status: "critical",
      price: 3.99,
    },
    {
      id: 2,
      name: "Fresh Bread",
      category: "Bakery",
      quantity: 18,
      unit: "units",
      expiryDate: "2025-11-06",
      status: "critical",
      price: 2.49,
    },
    {
      id: 3,
      name: "Mixed Vegetables",
      category: "Produce",
      quantity: 35,
      unit: "kg",
      expiryDate: "2025-11-08",
      status: "warning",
      price: 1.99,
    },
    {
      id: 4,
      name: "Chicken Breast",
      category: "Meat",
      quantity: 12,
      unit: "kg",
      expiryDate: "2025-11-07",
      status: "critical",
      price: 8.99,
    },
    {
      id: 5,
      name: "Yogurt Cups",
      category: "Dairy",
      quantity: 48,
      unit: "units",
      expiryDate: "2025-11-12",
      status: "good",
      price: 1.29,
    },
    {
      id: 6,
      name: "Fresh Apples",
      category: "Produce",
      quantity: 28,
      unit: "kg",
      expiryDate: "2025-11-10",
      status: "warning",
      price: 2.99,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      critical: "destructive",
      warning: "warning",
      good: "secondary",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Inventory Management</h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage all inventory items
            </p>
          </div>
          <Button className="bg-gradient-primary shadow-elevated">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>All Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Expiry
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {getDaysUntilExpiry(item.expiryDate)} days
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        ${item.price}
                      </td>
                      <td className="px-4 py-4">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
