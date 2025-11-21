import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, Calendar, Package, DollarSign } from "lucide-react";

const lowSalabilityItems = [
  { id: 1, name: "Kombucha", category: "Beverages", quantity: 67, daysInStock: 14, salesVelocity: "2.1/day", potentialLoss: 267.33 },
  { id: 2, name: "Tempeh", category: "Specialty", quantity: 34, daysInStock: 12, salesVelocity: "1.8/day", potentialLoss: 152.32 },
  { id: 3, name: "Plant-Based Meat", category: "Specialty", quantity: 23, daysInStock: 10, salesVelocity: "1.5/day", potentialLoss: 160.77 },
  { id: 4, name: "Tofu", category: "Specialty", quantity: 45, daysInStock: 9, salesVelocity: "3.2/day", potentialLoss: 179.55 },
  { id: 5, name: "Vegan Chilled Meals", category: "Chilled Ready Meals", quantity: 28, daysInStock: 8, salesVelocity: "2.8/day", potentialLoss: 223.72 },
];

export default function SmartStoreLowSalability() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Low Salability Analysis</h1>
          <p className="text-muted-foreground mt-1">Identify and manage slow-moving inventory</p>
        </div>
        <Button>Generate Action Plan</Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Salability Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Days in Stock</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.6</div>
            <p className="text-xs text-muted-foreground mt-1">Above optimal threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">197</div>
            <p className="text-xs text-muted-foreground mt-1">Slow-moving units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Loss</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">$983.69</div>
            <p className="text-xs text-muted-foreground mt-1">If items expire</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
          <CardDescription>Low salability items by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: "Specialty", count: 18, percentage: 40 },
              { category: "Beverages", count: 12, percentage: 27 },
              { category: "Chilled Ready Meals", count: 8, percentage: 18 },
              { category: "Fresh Produce", count: 7, percentage: 15 },
            ].map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-sm text-muted-foreground">{cat.count} items</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Salability Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Low Salability Items</CardTitle>
          <CardDescription>Detailed analysis of slow-moving products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Days in Stock</TableHead>
                  <TableHead className="text-right">Sales Velocity</TableHead>
                  <TableHead className="text-right">Potential Loss</TableHead>
                  <TableHead>Recommended Action</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowSalabilityItems.map((item) => {
                  const recommendedAction = item.daysInStock > 12 
                    ? "Aggressive Discount" 
                    : item.daysInStock > 8 
                    ? "Promotional Campaign" 
                    : "Monitor Closely";
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.daysInStock > 10 ? "destructive" : "secondary"}>
                          {item.daysInStock} days
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.salesVelocity}
                      </TableCell>
                      <TableCell className="text-right text-destructive font-medium">
                        ${item.potentialLoss.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{recommendedAction}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline">Promote</Button>
                          <Button size="sm">Discount</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>AI-suggested strategies to improve salability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="p-2 rounded-full bg-blue-500/10">
                <TrendingDown className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Create Bundle Deals</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Combine low salability items with popular products to increase movement
                </p>
                <Button size="sm" className="mt-2">Create Bundle</Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="p-2 rounded-full bg-purple-500/10">
                <Package className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Reduce Order Quantities</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Adjust future orders for specialty items based on actual demand
                </p>
                <Button size="sm" className="mt-2" variant="outline">Adjust Orders</Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="p-2 rounded-full bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Launch Targeted Campaign</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create promotional campaigns focused on health-conscious customers
                </p>
                <Button size="sm" className="mt-2" variant="outline">Start Campaign</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
