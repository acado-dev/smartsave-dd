import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Percent, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { smartStoreInventory } from "@/data/smartStoreInventory";

const activeDiscounts = [
  { id: 1, product: "Chicken Mayo Sandwich", category: "Food-to-Go", discount: 30, originalPrice: 4.99, newPrice: 3.49, applied: "2 hours ago", sold: 23 },
  { id: 2, product: "Croissant", category: "Fresh Bakery", discount: 20, originalPrice: 2.99, newPrice: 2.39, applied: "5 hours ago", sold: 45 },
  { id: 3, product: "Caesar Salad", category: "Food-to-Go", discount: 35, originalPrice: 5.99, newPrice: 3.89, applied: "1 day ago", sold: 34 },
];

export default function SmartStoreDiscounts() {
  const expiringItems = smartStoreInventory.filter(item => item.status === 'expiring-soon');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discount Management</h1>
          <p className="text-muted-foreground mt-1">Optimize pricing to reduce waste and increase sales</p>
        </div>
        <Button>
          Apply Bulk Discounts
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">+24%</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,845</div>
            <p className="text-xs text-muted-foreground mt-1">From discounted items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Prevented</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">89 kg</div>
            <p className="text-xs text-muted-foreground mt-1">Through discounting</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Discounts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Discounts</CardTitle>
          <CardDescription>Currently applied discount campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Original Price</TableHead>
                  <TableHead className="text-right">New Price</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Units Sold</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeDiscounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell className="font-medium">{discount.product}</TableCell>
                    <TableCell>{discount.category}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{discount.discount}%</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground line-through">
                      ${discount.originalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-accent">
                      ${discount.newPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>{discount.applied}</TableCell>
                    <TableCell className="text-right">{discount.sold}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">Modify</Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Discounts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recommended Discounts</CardTitle>
              <CardDescription>AI-suggested items for discounting</CardDescription>
            </div>
            <Button variant="outline">Apply All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Suggested Discount</TableHead>
                  <TableHead className="text-right">New Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringItems.slice(0, 5).map((item) => {
                  const suggestedDiscount = 25;
                  const newPrice = item.price * (1 - suggestedDiscount / 100);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Expiring Soon</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{suggestedDiscount}%</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-accent">
                        ${newPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Apply Discount</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
